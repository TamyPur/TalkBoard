import { Post, Get, Param, Res, Controller, UseInterceptors, UseGuards, UploadedFiles, HttpException, HttpStatus, UploadedFile, Body } from '@nestjs/common';
import { ApiCreatedResponse, ApiConsumes, ApiBody, ApiBadRequestResponse, ApiTags } from '@nestjs/swagger';
// import { ApiException } from '../shared/api-exception.model';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { FileResponseVm } from '../file-response-vm.model'
import { Customer } from 'src/schemas/customers.scheme';
import { CustomerService } from 'src/customer/customer.service';


@Controller('/files')
@ApiTags('Files')
export class FilesController {

    constructor(private filesService: FilesService) { }

    @Post('')
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @UseInterceptors(FileInterceptor('file'))
    upload(@UploadedFile() file: Express.Multer.File) {
        return this.filesService.upload(file)
    }


    @Get('info/:id')
    // @ApiBadRequestResponse({ type: ApiException })
    async getFileInfo(@Param('id') id: string): Promise<FileResponseVm> {
        const file = await this.filesService.findInfo(id)
        const filestream = await this.filesService.readStream(id)
        if (!filestream) {
            throw new HttpException('An error occurred while retrieving file info', HttpStatus.EXPECTATION_FAILED)
        }
        return {
            message: 'File has been detected',
            file: file
        }
    }

    @Get(':id')
    // @ApiBadRequestResponse({ type: ApiException })
    async getFile(@Param('id') id: string, @Res() res) {
        const file = await this.filesService.findInfo(id)
        const filestream = await this.filesService.readStream(id)
        if (!filestream) {
            throw new HttpException('An error occurred while retrieving file', HttpStatus.EXPECTATION_FAILED)
        }
        res.header('Content-Type', file.contentType);
        return filestream.pipe(res)
    }

    @Get('download/:id')
    // @ApiBadRequestResponse({ type: ApiException })
    async downloadFile(@Param('id') id: string, @Res() res) {
        const file = await this.filesService.findInfo(id)
        const filestream = await this.filesService.readStream(id)
        if (!filestream) {
            throw new HttpException('An error occurred while retrieving file', HttpStatus.EXPECTATION_FAILED)
        }
        res.header('Content-Type', file.contentType);
        res.header('Content-Disposition', 'attachment; filename=' + file.filename);
        return filestream.pipe(res)
    }

    @Get('delete/:id')
    // @ApiBadRequestResponse({ type: ApiException })
    @ApiCreatedResponse({ type: FileResponseVm })
    async deleteFile(@Param('id') id: string): Promise<FileResponseVm> {
        const file = await this.filesService.findInfo(id)
        const filestream = await this.filesService.deleteFile(id)
        if (!filestream) {
            throw new HttpException('An error occurred during file deletion', HttpStatus.EXPECTATION_FAILED)
        }
        return {
            message: 'File has been deleted',
            file: file
        }
    }
}