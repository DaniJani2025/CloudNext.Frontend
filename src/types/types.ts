export type Guid = string;

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
  
export interface RefreshSubscriber {
  resolve: (token: string) => void;
  reject: (error: any) => void;
}

export interface TokenResponse {
  success: boolean;
  result?: {
    token: string;
    expiresAt: string;
  };
  errorMessage?: string;
}

export interface TokenResult {
  token: string;
  expiresAt: string;
}