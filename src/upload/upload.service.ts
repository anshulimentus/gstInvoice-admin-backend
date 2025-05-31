import { Injectable } from '@nestjs/common';
import { UPLOAD_PATHS } from './upload.constants';

@Injectable()
export class UploadService {
  getUploadPath(type: string): string {
    if (type === 'logo') return UPLOAD_PATHS.LOGO;
    throw new Error('Invalid upload type');
  }
}
