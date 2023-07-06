import { ApiProperty } from "@nestjs/swagger";

export class BadRequestDto {
    @ApiProperty()
    readonly message: string[];

    @ApiProperty()
    readonly error: string;

    @ApiProperty()
    readonly statusCode: number;
    //readonly 
}