import ApiService from './ApiService';
import { Guid } from '../types/types';
import { AxiosRequestConfig } from 'axios';

class FileService extends ApiService {
  constructor() {
    super('file');
  }

  async upload(files: File[], userId: Guid, parentFolderId?: Guid) {
    try {
      const response = await this.uploadFiles('upload', userId, files, parentFolderId);
      return response;
    } catch (error) {
      console.error('Error uploading files:', error);
      throw error;
    }
  }

  download(userId: Guid, fileIds: Guid) {
    const payload = {
      userId,
      fileIds,
    };
    return this.postBlob('download', payload);
  }

  getAll(userId: Guid, folderId?: Guid) {
    let url = `GetAll?userId=${userId}`;
    if (folderId) {
      url += `&folderId=${folderId}`;
    }
    return this.get(url);
  }

  async stream(fileId: Guid, userId: Guid, rangeHeader?: string) {
    const url = `stream/${fileId}?userId=${userId}`;
    const config: AxiosRequestConfig = {
      responseType: 'blob',
      headers: {}
    };
  
    if (rangeHeader) {
      config.headers!['Range'] = rangeHeader;
    }
  
    try {
      const response = await this.api.get(url, config);
      return response.data; // This will be a Blob
    } catch (error) {
      console.error(`STREAM ${url} failed:`, error);
      throw error;
    }
  }  
}

export default new FileService();
