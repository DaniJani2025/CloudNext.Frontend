import ApiService from './ApiService';

class FolderService extends ApiService {
  constructor() {
    super('folder');
  }

  async download(userId: string, folderId: string) {
    const payload = {
      userId,
      folderId,
    };

    return this.postBlob('/download', payload);
  }

  async upload(userId: string, parentFolderId: string | null, zipFile: Blob) {
    return this.uploadFolder('/upload', userId, parentFolderId, zipFile);
  }

  async createFolder(userId: string, folderName: string, parentFolderId: string | null) {
    const payload: any = {
      folderName,
      userId,
    };

    if (parentFolderId) {
      payload.parentFolderId = parentFolderId;
    }

    return this.post('/create-folder', payload);
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
