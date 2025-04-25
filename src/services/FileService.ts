import ApiService from './ApiService';

class FileService extends ApiService {
  constructor() {
    super('file');
  }

  download(userId: unknown, fileIds: unknown) {
    const payload = {
      userId,
      fileIds,
    };
    return this.postBlob('download', payload);
  }

  getAll(userId: string, folderId?: string) {
    let url = `GetAll?userId=${userId}`;
    if (folderId) {
      url += `&folderId=${folderId}`;
    }
    return this.get(url);
  }
}

export default new FileService();
