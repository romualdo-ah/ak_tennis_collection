import {
  Controller,
  Get,
  Res,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { ShoesService } from './shoes.service';
import { CreateShoeDto } from './dto/create-shoe.dto';
import { UpdateShoeDto } from './dto/update-shoe.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Response } from 'express';

const MIME_TYPE_IMAGE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/gif': 'gif',
  'image/webp': 'webp',
  'image/bmp': 'bmp',
  'image/x-icon': 'ico',
  'image/svg+xml': 'svg',
  'image/tiff': 'tiff',
  'image/x-tiff': 'tiff',
  'image/x-xbitmap': 'xbm',
  'image/x-xpixmap': 'xpm',
  'image/x-xwindowdump': 'xwd',
  'image/x-portable-pixmap': 'ppm',
  'image/x-portable-bitmap': 'pbm',
  'image/x-portable-graymap': 'pgm',
  'image/x-portable-anymap': 'pnm',
};

@Controller('shoes')
export class ShoesController {
  constructor(private readonly shoesService: ShoesService) {}

  @Post()
  create(@Body() createShoeDto: CreateShoeDto) {
    return this.shoesService.create(createShoeDto).catch((err) => {
      throw new HttpException(
        {
          message: err.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    });
  }

  @Get()
  findAll() {
    return this.shoesService.findAll();
  }

  @Get(':sku')
  findOne(@Param('sku') sku: string) {
    return this.shoesService.findOne(sku);
  }

  @Patch(':sku')
  update(@Param('sku') sku: string, @Body() updateShoeDto: UpdateShoeDto) {
    return this.shoesService.update(sku, updateShoeDto);
  }

  @Delete(':sku')
  remove(@Param('sku') sku: string) {
    return this.shoesService.remove(sku);
  }

  @Delete('delete_all')
  deleteAll() {
    return this.shoesService.removeAll();
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          //create a newFileName replacing spaces with _
          const FileExtension = file.mimetype.split('/')[1];
          console.log(file);
          const newFileName = `${file.originalname.split(' ').join('_')}`;

          cb(null, newFileName);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!MIME_TYPE_IMAGE_MAP[file.mimetype]) {
          return cb(null, false);
        }
        cb(null, true);
      },
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('O arquivo deve ser uma imagem.');
    } else {
      const response = {
        filePath: `http://localhost:2357/shoes/pictures/${file.originalname}`,
      };
      return response;
    }
  }

  @Get('pictures/:filename')
  async getPicture(@Param('filename') filename, @Res() res: Response) {
    res.sendFile(filename, { root: './uploads' });
  }
}
