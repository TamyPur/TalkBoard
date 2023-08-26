import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import * as jwt from 'jsonwebtoken';


@Injectable()
export class UserService {
  constructor(private jwtService: JwtService, @InjectModel(User.name) private userModel: Model<User>) { }

  async getCurrentUser(auth: string): Promise<User> {
    const token = this.extractToken(auth);
    if (!token) {
      return null;
    }
    const u = await this.decode(token);
    return await this.getUser(u.username, u.email);
  }

  async getAll(): Promise<User[]> {
    return await this.userModel.find().exec()
  }

  async getUserById(_id: number) {
    return await this.userModel.findOne({ _id: _id }).exec();
  }

  async getUser(_name: string, _email: string): Promise<User | undefined> {
    return await this.userModel.findOne({ name: _name, email: _email })
  }

  async getUserByEmail( _email: string): Promise<User | undefined> {
    return await this.userModel.findOne({ email: _email })
  }

  async signUp(user: User): Promise<any> {
    const u =await this.getUserByEmail(user.email)
    if (u==undefined) {
      const newUser = await new this.userModel(user);
      newUser.save();
      return this.signIn(user);
    }
    console.log(u);
    
    if ((await u).name == user.name)
      throw new ConflictException('User already exists');
    throw new ConflictException('User with this email already exists');
  }

  async signIn(user: User): Promise<any> {
    const u = await this.getUser(user.name, user.email);
    if (u == undefined) {
      throw new UnauthorizedException();
    }
    const payload = { username: user.name, email: user.email, isAdmin: false };
    const secretKey = 'talk board key';
    const token = jwt.sign(payload, secretKey);
    return token;
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

}
