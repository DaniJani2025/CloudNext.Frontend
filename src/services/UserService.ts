import ApiService from './ApiService';

class UserService extends ApiService {
    constructor() {
        super('users');
      }

  login(data: { email: string; password: string }) {
    return this.post('login', data);
  }

  register(data: { email: string; password: string }) {
    return this.post('register', data);
  }

  async logout() {
    const token = localStorage.getItem("token");
    if (token) {
        await this.post('logout', {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
      }
    }

  requestPasswordReset( data: { email: string } ) {
    return this.post('request-password-reset', data);
  }

  resetPassword( data: { token: string; newPassword: string; recoveryKey: string  } ) {
    return this.patch('reset-password', data);
  }
}

export default new UserService();
