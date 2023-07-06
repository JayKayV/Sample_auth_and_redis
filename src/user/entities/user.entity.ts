import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Exclude } from 'class-transformer'

const bcrypt = require('bcrypt');
const saltRounds = 10;

export type UserDocument = HydratedDocument<User>;

function hashPassword(v){
  return bcrypt.hashSync(v, saltRounds);
}

@Schema()
export class User {
  @Prop({ required: true})
  id: string;

  @Prop({ required: true})
  username: string;

  @Prop({ required: true, set: hashPassword, get: (v) => v})
  @Exclude()
  password: string;

  @Prop({ required: true})
  fullname: string;

  @Prop({
    default: Date.now
  })
  DateOfBirth: Date;

  @Prop()
  gender: string;

  @Prop()
  @Exclude()
  role: string;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
