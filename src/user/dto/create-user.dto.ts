import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsNotEmpty, IsString, Matches } from "class-validator";

export class CreateUserDto {
    @ApiProperty()
    @IsNotEmpty({message: "Id can't be empty"})
    @IsString({ message: "Id must be string type" })
    readonly id: string;

    @ApiProperty()
    @IsNotEmpty({message: "Username can't be empty"})
    @IsString({ message: "Username must be string type" })
    @Matches(new RegExp("^\\w{4,24}$"), 
    {message: "Username doesn't match requirement"})
    readonly username: string;

    @ApiProperty()
    @IsNotEmpty({message: "Password can't be empty"})
    @IsString({message: "Incorrect type for password"})
    @Matches(new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$"), 
    {message: "Password doesn't match requirement"})
    readonly password: string;

    @ApiProperty()
    @IsNotEmpty({message: "Fullname can't be empty"})
    @IsString({message: "Incorrect type for fullname"})
    readonly fullname: string;

    @ApiProperty()
    @IsNotEmpty({message: "Gender can't be empty"})
    @IsString({message: "Incorrect type for gender"})
    readonly gender: string;

    @ApiProperty()
    @IsNotEmpty({message: "Role can't be empty"})
    @IsString({message: "Incorrect type for role"})
    @IsIn(['admin', 'user'], {message: "Incorrect value for role"})
    readonly role: string;
}
