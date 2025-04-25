import ApiService from './ApiService';

class FolderService extends ApiService {
  constructor() {
    super('folder');
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
