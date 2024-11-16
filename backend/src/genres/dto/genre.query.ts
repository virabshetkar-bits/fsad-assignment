import { ApiProperty } from "@nestjs/swagger";

export class GenreQuery {
    @ApiProperty({required: true, minLength: 3})
    query: string;
}