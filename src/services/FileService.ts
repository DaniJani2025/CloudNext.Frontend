import ApiService from './ApiService';
import { Guid } from '../types/types';

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
}

export default new FileService();
