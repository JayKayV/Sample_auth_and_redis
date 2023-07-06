import { ApiProperty } from "@nestjs/swagger";
import { Allow, IsNotEmpty, IsNumber, IsString, Matches } from "class-validator";

export class LoginDto {
    @ApiProperty()
    @IsNotEmpty({message: "Username can't be empty"})
    @IsString({ message: "Username must be string type" })
    @Matches(new RegExp("^\\w{4,24}$"), 
    {message: "Username doesn't match requirement"})
    username: string;

    @ApiProperty()
    @IsNotEmpty({message: "Password can't be empty"})
    @IsString({ message: "Password must be string type" })
    @Matches(new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$"), 
    {message: "Password doesn't match requirement"})
    password: string;
}