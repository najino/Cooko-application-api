import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import * as Minio from 'minio';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

@Injectable()
export class UploaderService {
  private readonly logger = new Logger(UploaderService.name);
  private readonly minioClient: Minio.Client;
  private readonly bucketName =
    process.env.MINIO_BUCKET_NAME || 'cooko-uploads';

  private directoryMap = {
    category: 'categories',
  };

  constructor() {
    this.minioClient = new Minio.Client({
      endPoint: process.env.MINIO_ENDPOINT || 'localhost',
      port: parseInt(process.env.MINIO_PORT || '9000'),
      useSSL: process.env.MINIO_USE_SSL === 'true',
      accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
      secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
    });

    this.initializeBucket();
  }

  private async initializeBucket() {
    try {
      const bucketExists = await this.minioClient.bucketExists(this.bucketName);
      if (!bucketExists) {
        await this.minioClient.makeBucket(this.bucketName, 'us-east-1');
        this.logger.log(`✅ Created bucket: ${this.bucketName}`);
      } else {
        this.logger.log(`✅ Bucket already exists: ${this.bucketName}`);
      }
    } catch (error) {
      this.logger.error('❌ Failed to initialize bucket:', error);
      throw error;
    }
  }

  async uploadFile(
    file: Express.Multer.File,
    type: string = 'category',
  ): Promise<string> {
    try {
      if (!file) {
        throw new BadRequestException('No file provided');
      }

      // Generate unique filename
      const fileExtension = path.extname(file.originalname);
      const fileName = `${uuidv4()}${fileExtension}`;
      const objectName = `${this.directoryMap[type]}/${fileName}`;

      this.logger.log(
        `📤 Uploading file: ${file.originalname} as ${objectName}`,
      );

      // Upload to MinIO
      const result = await this.minioClient.putObject(
        this.bucketName,
        objectName,
        file.buffer,
        file.size,
        {
          'Content-Type': file.mimetype,
          'Original-Name': file.originalname,
        },
      );

      this.logger.log(`✅ File uploaded successfully: ${objectName}`);

      // Return the public URL
      const publicUrl = await this.getPublicUrl(objectName);
      return publicUrl;
    } catch (error) {
      this.logger.error('❌ Failed to upload file:', error);
      throw new BadRequestException(`Failed to upload file: ${error.message}`);
    }
  }

  async deleteFile(objectName: string): Promise<void> {
    try {
      await this.minioClient.removeObject(this.bucketName, objectName);
      this.logger.log(`🗑️ File deleted: ${objectName}`);
    } catch (error) {
      this.logger.error('❌ Failed to delete file:', error);
      throw new BadRequestException(`Failed to delete file: ${error.message}`);
    }
  }

  async getPublicUrl(objectName: string): Promise<string> {
    try {
      // Generate direct public URL for public bucket
      const protocol = process.env.MINIO_USE_SSL === 'true' ? 'https' : 'http';
      const port = process.env.MINIO_PORT || '9000';
      const endpoint = process.env.MINIO_ENDPOINT || 'localhost';

      const publicUrl = `${protocol}://${endpoint}:${port}/${this.bucketName}/${objectName}`;
      return publicUrl;
    } catch (error) {
      this.logger.error('❌ Failed to generate public URL:', error);
      throw new BadRequestException(
        `Failed to generate public URL: ${error.message}`,
      );
    }
  }
}
