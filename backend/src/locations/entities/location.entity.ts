import { ApiProperty } from "@nestjs/swagger";

export class Location {
  @ApiProperty()
  id: number;
  
  @ApiProperty()
  name: string;
}
