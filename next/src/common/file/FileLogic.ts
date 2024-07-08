import FileService from "./FileService";
import axios, { AxiosProgressEvent } from "axios";
import imageCompression from 'browser-image-compression';

export default class FileLogic {
  private fileService: FileService;

  constructor() {
    this.fileService = new FileService();
  }

  async upload(file: File, compress: boolean, onProgress?: (progressEvent: AxiosProgressEvent) => void) {
    try {
      let fileToUpload = file;

      if (compress && this.isMediaFile(file)) {
        fileToUpload = await this.compressFile(file);
      }

      return await this.fileService.upload(fileToUpload, onProgress);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 413) {
          throw new Error('File is too large');
        }
      }
      console.error(error);
      throw new Error('Failed to upload file');
    }
  }

  private isMediaFile(file: File): boolean {
    const mediaTypes = ['image', 'video', 'audio'];
    return mediaTypes.some(type => file.type.startsWith(type));
  }

  private async compressFile(file: File): Promise<File> {
    if (file.type.startsWith('image')) {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true
      };
      return await imageCompression(file, options);
    }
    // Add video/audio compression logic here if needed
    return file;
  }
}