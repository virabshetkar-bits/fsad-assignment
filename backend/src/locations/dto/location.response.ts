import { ApiProperty } from '@nestjs/swagger';

export class LocationResponse {
    @ApiProperty()
    id: number;
    
    @ApiProperty()
    name: string;
}
