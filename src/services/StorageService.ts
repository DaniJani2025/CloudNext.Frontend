class StorageService {
  static setAccessToken(token: string) {
    localStorage.setItem("token", token);
  }

  static getAccessToken(): string | null {
    return localStorage.getItem("token");
  }

  static clearAccessToken(): void {
    localStorage.removeItem("token");
  }

  static setCurrentUser(userId: string) {
    localStorage.setItem("currentUser", userId);
  }

  static getCurrentUser(): string | null {
    return localStorage.getItem("currentUser");
  }

  static setUserDisplayName(displayName: string) {
    localStorage.setItem("displayName", displayName);
  }

  static getUserDisplayName(): string | null {
    return localStorage.getItem("displayName");
  }

  static setEmail(email: string) {
    localStorage.setItem("email", email);
  }

  static getEmail(): string | null {
    return localStorage.getItem("email");
  }

  static setLoginStatus(status: boolean) {
    localStorage.setItem("isLoggedIn", status.toString());
  }

  static isLoggedIn(): boolean {
    return localStorage.getItem("isLoggedIn") === "true";
  }

  static setTokenExpiry(expiry: string) {
    localStorage.setItem("expiresAt", expiry);
  }

  static getTokenExpiry(): string | null {
    return localStorage.getItem("expiresAt");
  }

  static setUserFolder(parentFolderId: string) {
    return localStorage.setItem("parentFolderId", parentFolderId);
  }

  static getUserFolder(): string | null {
    return localStorage.getItem("parentFolderId");
  }

  static removeUserDetails() {
    localStorage.clear();
  }
}

export default StorageService;
