import { Controller, Post, Get, Body, Param, NotFoundException, Res } from '@nestjs/common';
import { ImageService } from './image.service';
import { UploadImageDto } from './image.dto';
import { Response } from 'express';
import chalk from 'chalk';
import { ImageEntity } from './image.entity';

@Controller('images')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post('upload')
  async uploadImage(@Body() uploadImageDto: UploadImageDto) {
    console.log(chalk.green('Received upload request'));
    const savedImage = await this.imageService.uploadImage(uploadImageDto);
    console.log('Received DTO:', uploadImageDto); 
    
    return {
      message: 'Image uploaded successfully',
      imageId: savedImage.id,
      imageUrl: `/images/${savedImage.id}`,
    };
  }

  @Get(':id')
  async getImage(@Param('id') id: string, @Res() res: Response) {
    const image = await this.imageService.getImageById(id);

    if (!image) {
      throw new NotFoundException('Image not found');
    }

    // Set content type based on the stored mime type
    res.setHeader('Content-Type', image.mimeType);

    // Handle base64 data - check if it includes data URL prefix
    let base64Data = image.base64data;
    if (base64Data.includes(',')) {
      // Remove data URL prefix (e.g., "data:image/png;base64,")
      base64Data = base64Data.split(',')[1];
    }

    // Send the base64 data as binary
    const imageBuffer = Buffer.from(base64Data, 'base64');
    res.send(imageBuffer);
  }

  @Get(':id/base64')
  async getImageBase64(@Param('id') id: string) {
    const image = await this.imageService.getImageById(id);
    
    if (!image) {
      throw new NotFoundException('Image not found');
    }
    
    return {
      id: image.id,
      filename: image.filename,
      base64Data: image.base64data,
      mimeType: image.mimeType,
      uploadedAt: image.uploadedAt,
    };
  }
}
