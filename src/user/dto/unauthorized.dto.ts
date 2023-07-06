import { ApiProperty } from "@nestjs/swagger";

export class UnauthorizedReponseDto {
    @ApiProperty()
    readonly message: string;

    @ApiProperty()
    readonly statusCode: number;
}