import { Controller, Post, Req, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Request } from 'express';
import { UPLOAD_PATHS } from './upload.constants';

@Controller('upload')
export class UploadController {
  @Post('logo')
  @UseInterceptors(FileInterceptor('file', { // Ensure 'file' matches frontend form key
    storage: diskStorage({
      destination: UPLOAD_PATHS.LOGO,
      filename: (_req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + extname(file.originalname));
      },
    }),
    fileFilter: (_req, file, callback) => {
      console.log("📌 Entered fileFilter");
      if (!file.mimetype.startsWith('image/')) {
        console.log("❌ Invalid file type:", file.mimetype);
        return callback(new BadRequestException('Only image files are allowed!'), false);
      }
      console.log("✅ File type is valid:", file.mimetype);
      callback(null, true);
    },
  }))
  uploadFile(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    console.log('📌 UploadController: uploadFile route hit');

    console.log("📌 Request Headers:", req.headers);
    console.log("📌 Content-Type:", req.headers['content-type']); 
    if (!file) {
      console.log("❌ No file received! Check if request is 'multipart/form-data' and key is 'file'");
      console.log("❌ No file received!");
      throw new BadRequestException('File upload failed');
    }

    console.log("✅ File received:", file.originalname);
    console.log("✅ Saved at:", file.path);

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    return {
      message: 'Logo uploaded successfully!',
      fileUrl: `${baseUrl}/uploads/logos/${file.filename}`, // Full URL
    };
  }
}