import { ApiProperty } from '@nestjs/swagger';
// const Expose=require('class-transformer')
// import {Expose} from 'class-transformer';

export class FileInfoVm {

    @ApiProperty()
    // @Expose()
    length: number;

    @ApiProperty()
    // @Expose()
    chunkSize: number;

    @ApiProperty()
    // @Expose()
    filename: string;    

    @ApiProperty()
    // @Expose()
    contentType: string;
}