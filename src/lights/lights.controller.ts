import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseInterceptors,
  HttpException,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import * as fs from 'fs';

import { LightsService } from './lights.service';
import { diskStorage } from 'multer';
import { LoadRoomTxtDto, SetLigthsParamsDTO } from './dto/request/loadtxt';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FormatResponseInterceptor } from 'src/common/interceptors/response.interceptor';

@ApiTags('Lights')
@Controller('lights')
export class LightsController {
  constructor(private readonly lightsService: LightsService) {}

  @UseInterceptors(FormatResponseInterceptor)
  @Get()
  findAll() {
    return this.lightsService.findAll();
  }

  @ApiBody({
    description: 'Data load a new room',
    type: LoadRoomTxtDto,
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, callback) => {
          const destination = path.join(__dirname, '../../rooms');
          fs.mkdirSync(destination, { recursive: true });
          callback(null, destination);
        },
        filename: (req, file, callback) => {
          const name = new Date().getTime();
          callback(null, `${name}_${file.originalname}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        const autFiles = new Set(['text/plain']);
        if (autFiles.has(file.mimetype)) {
          return callback(null, true);
        }
        callback(
          new HttpException('Solo se permiten documentos txt', 413),
          false,
        );
      },
    }),
  )
  @UseInterceptors(FormatResponseInterceptor)
  @Post('load-room')
  async loadTxt(
    @Body() CreateSignatureDto: LoadRoomTxtDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const data = await this.lightsService.loadTxt(file);
    return [data];
  }

  @UseInterceptors(FormatResponseInterceptor)
  @Get('setLigths/:fileName')
  async setLigths(@Param() params: SetLigthsParamsDTO) {
    return await this.lightsService.setLigths(params);
  }
}
