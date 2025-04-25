import axios from 'axios';
import StorageService from './StorageService';

const API_BASE_URL = 'http://localhost:5074/api';

export default class ApiService {
  constructor(controllerName) {
    this.controller = controllerName;

    this.api = axios.create({
      baseURL: `${API_BASE_URL}/${controllerName}`,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.api.interceptors.request.use((config) => {
      const token = StorageService.getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  async get(endpoint = '', config = {}) {
    const response = await this.api.get(endpoint, config);
    return response.data;
  }

  async post(endpoint = '', data = {}, config = {}) {
    const response = await this.api.post(endpoint, data, config);
    return response.data;
  }

  async put(endpoint = '', data = {}, config = {}) {
    const response = await this.api.put(endpoint, data, config);
    return response.data;
  }

  async delete(endpoint = '', config = {}) {
    const response = await this.api.delete(endpoint, config);
    return response.data;
  }

  async postBlob(endpoint = '', data = {}, config = {}) {
    const response = await this.api.post(endpoint, data, {
      ...config,
      responseType: 'blob',
    });
    return response.data;
  }
}
