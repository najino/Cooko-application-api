import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Logger,
  Get,
  Query,
  Delete,
  Param,
  UnprocessableEntityException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { UploaderService } from './uploader.service';
import {
  ApiUploadFile,
  ApiDeleteFile,
  ApiGetPublicUrl,
  ApiUploaderTags,
} from './swagger/uploader.swagger';

@ApiUploaderTags()
@Controller('upload')
export class UploaderController {
  private readonly logger = new Logger(UploaderController.name);

  constructor(private readonly uploaderService: UploaderService) {}

  @ApiUploadFile()
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
      },
      fileFilter: (req, file, cb) => {
        // Allow images and documents
        const allowedMimes = ['image/jpeg', 'image/png'];

        if (allowedMimes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new UnprocessableEntityException('File type not allowed'), false);
        }
      },
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Query('type') type?: 'category',
  ) {
    try {
      this.logger.log(
        `📤 Upload request received for file: ${file?.originalname}`,
      );

      if (!file) {
        throw new BadRequestException('No file provided');
      }

      const publicUrl = await this.uploaderService.uploadFile(file, type);

      return {
        success: true,
        message: 'File uploaded successfully',
        data: {
          originalName: file.originalname,
          fileName: file.filename,
          size: file.size,
          mimetype: file.mimetype,
          publicUrl,
        },
      };
    } catch (error) {
      this.logger.error('❌ Upload failed:', error);
      throw error;
    }
  }
}
