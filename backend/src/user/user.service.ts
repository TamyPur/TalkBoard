import { ConflictException, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, ObjectId } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import * as jwt from 'jsonwebtoken';
import { FilesService } from 'src/files/files.service';


@Injectable()
export class UserService {
  constructor(private jwtService: JwtService, @InjectModel(User.name) private userModel: Model<User>,
    private readonly filesService: FilesService) { }

  async getAll(): Promise<User[]> {
    return await this.userModel.find({ active: true }).exec()
  }

  async getCurrentUser(auth: string): Promise<User> {
    const token = this.extractToken(auth);
    if (!token) {
      return null;
    }
    const u = await this.decode(token);
    return await this.getUser(u.username, u.password);
  }

  async getUserById(id: string): Promise<User> {
    return await this.userModel.findOne({ _id: id }).exec();
  }

  async getUser(_name: string, _password: string): Promise<User | undefined> {
    return await this.userModel.findOne({ name: _name, password: _password })
  }

  async getSystemAdmin(): Promise<User | undefined> {
    return await this.userModel.findById('655d05edadc33ff8ba915a26');
  }

  async signUp(user: User): Promise<any> {
    const u1 = await this.userModel.findOne({ password: user.password })
    if (!(u1 == undefined)){
      throw new ConflictException('User with this password already exists');
    }
    else {
      const u2 = await this.userModel.findOne({ email: user.email })
      if (u2 == undefined) {
        const newUser = await new this.userModel(user);
        newUser.save();
        return this.signIn(user);
      }

      if ((await u2).name == user.name) {
        if ((await u2).password == user.password)
          throw new ConflictException('User already exists');
      }
      throw new ConflictException('User with this email already exists');
    }
  }

  async signIn(user: User): Promise<any> {
    const u = await this.userModel.findOne({ name: user.name, password: user.password })
    if (u == undefined || !u.active || u.password == "needDeletePass") {
      throw new UnauthorizedException();
    }
    if (u.needDeletePassword) {
      const newUser = new this.userModel(u)
      newUser.tempPassword = u.password;
      newUser.password = "needDeletePass";
      newUser.needDeletePassword = false;
      Object.assign(u, newUser);
      const updatedUser = await u.save();
    }
    const u1 = await this.userModel.findById(u._id)
    let payload = { username: u1.name, password: u1.password, roles: ['user'] };
    if (u._id.equals((await this.getSystemAdmin())._id)) {
      payload = { username: u1.name, password: u1.password, roles: ['system_admin', 'admin', 'user'] };
    }
    const secretKey = 'talk board key';
    const token = jwt.sign(payload, secretKey);
    return token;
  }

  async update(id: ObjectId, user: User, auth: string, image: Express.Multer.File): Promise<User> {
    const currentUser = await this.getCurrentUser(auth);
    const u = await this.userModel.findById(id).exec()
    if (!(u._id.equals((currentUser)._id) || u._id.equals((await this.getSystemAdmin())._id)))
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    if (!u) {
      throw new Error(`User with id ${id} not found`);
    }
    try {
      user.profilePicture = await this.filesService.upload(image);
    } catch {
      user.profilePicture = u.profilePicture

    }
    try {
      Object.assign(u, user);
      const updatedUser = await u.save();
      return this.signIn(u)
    }
    catch (err) {
      throw new Error(err)
    }
  }

  async delete(id: ObjectId): Promise<User> {
    const u = await this.userModel.findById(id).exec()
    const user = new this.userModel(u)
    user.active = false
    Object.assign(u, user);
    const updatedUser = await u.save();
    return updatedUser;
  }

  async getUserByEmail(_email: string): Promise<User | undefined> {
    return await this.userModel.findOne({ email: _email })
  }

  async decode(token: string): Promise<any> {

    try {
      const decoded = this.jwtService.verify(token, { secret: 'talk board key' });
      return decoded;
    } catch (err) {
      throw new Error('Invalid token');
    }
  }

  extractToken(authHeader: string) {
    if (!authHeader) {
      return null;
    }
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return null;
    }
    return parts[1];
  }

  async forgetPassword(_user: User) {
    const randomPass = Math.random().toString(36).slice(-9);
    const u = await this.userModel.findOne({ name: _user.name, email: _user.email })
    if (!u)
      throw new Error(`Incorrect user information`);
    const user = new this.userModel(u)
    user.password = randomPass;
    user.needDeletePassword = true;
    Object.assign(u, user);
    const updatedUser = await u.save();
    return updatedUser;
  }
}
