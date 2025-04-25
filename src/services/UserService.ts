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
}

export default new UserService();
