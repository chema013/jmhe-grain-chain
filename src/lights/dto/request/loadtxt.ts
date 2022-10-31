import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoadRoomTxtDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Signature file',
  })
  file: string;
}

export class SetLigthsParamsDTO {
  @ApiProperty()
  @IsString()
  fileName: string;
}