import {
  Controller,
  Headers,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { MinioService } from './minio.service';

@Controller('files')
export class FilesController {
  constructor(
    private readonly configService: ConfigService,
    private readonly minioService: MinioService,
  ) {}

  @Public()
  @Post('file')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Headers('x-forwarded-proto') forwardedProto: string,
    @Headers('host') forwardedHost: string,
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const fileName = await this.minioService.uploadFile(file);
    const fileUrl = this.minioService.getFileUrl(fileName);

    return { url: fileUrl };
  }
}
