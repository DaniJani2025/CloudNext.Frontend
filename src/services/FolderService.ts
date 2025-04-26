import ApiService from './ApiService';

class FolderService extends ApiService {
  constructor() {
    super('folder');
  }

  async upload(userId: string, parentFolderId: string | null, zipFile: Blob) {
    return this.uploadFolder('/upload', userId, parentFolderId, zipFile);
  }

  getStructure(userId: string) {
    const url = `structure?userId=${userId}`
    return this.get(url);
  }

  getAll(userId: string, folderId?: string) {
    let url = `GetAll?userId=${userId}`;
    if (folderId) {
      url += `&folderId=${folderId}`;
    }
    return this.get(url);
  }
}

export default new FolderService();
