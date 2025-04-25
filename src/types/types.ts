export interface UserFile {
    name: string;
    fileId: string;
    originalName: string;
    contentType: string;
    base64Thumbnail?: string;
  }
  
  export interface UserFolder {
    folderId: string;
    name: string;
    subFolders: UserFolder[];
  }