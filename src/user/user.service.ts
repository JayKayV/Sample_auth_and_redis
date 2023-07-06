import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
//import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@Inject('USER_MODEL') private userModel : Model<User>) {}

  create(createUserDto: CreateUserDto) : Promise<User> {
    const newUser = new this.userModel(createUserDto);
    return newUser.save();
  }

  findAll() {
    return this.userModel.find().exec();
  }

  async findOne(_id: string) {
    return new User(await this.userModel.findOne({id : _id}).lean());
  }

  findByUsername(_username: string) {
    return this.userModel.findOne({username: _username}).exec();
  }

  update(_id: string, updateUserDto: UpdateUserDto) {
    return this.userModel.findOneAndUpdate(
      {id: _id}, 
      {$set: updateUserDto, $inc: { __v: 1}});
  }

  remove(_id: string) {
    return this.userModel.deleteOne({id: _id});
  }
}
