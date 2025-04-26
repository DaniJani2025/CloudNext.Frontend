import axios from 'axios';
import StorageService from './StorageService';
import { Guid } from '../types/types';

const API_BASE_URL = 'http://localhost:5074/api';
let isRefreshing = false;
let refreshSubscribers = [];

const processQueue = (error, token = null) => {
  refreshSubscribers.forEach(callback => {
    if (error) {
      callback.reject(error);
    } else {
      callback.resolve(token);
    }
  });
  
  refreshSubscribers = [];
};

export default class ApiService {
  constructor(controllerName) {
    this.controller = controllerName;

    this.api = axios.create({
      baseURL: `${API_BASE_URL}/${controllerName}`,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true
    });

    this.api.interceptors.request.use((config) => {
      const token = StorageService.getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (!error.response || error.response.status !== 401) {
          return Promise.reject(error);
        }
        
        const originalRequest = error.config;
        
        if (originalRequest._retry || originalRequest.url.includes('refresh-token')) {
          return Promise.reject(error);
        }
        
        const tokenExpiry = StorageService.getTokenExpiry();
        const isTokenExpired = tokenExpiry && new Date(tokenExpiry) <= new Date();
        
        if (!isTokenExpired) {
          return Promise.reject(error);
        }
        
        originalRequest._retry = true;
        
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            refreshSubscribers.push({
              resolve: (token) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                resolve(axios(originalRequest));
              },
              reject: (err) => {
                reject(err);
              }
            });
          });
        }
        
        isRefreshing = true;
        
        try {
          console.log('Attempting to refresh token');
          
          const response = await axios.post(
            `${API_BASE_URL}/Users/refresh-token`, 
            {},
            { withCredentials: true }
          );
          
          console.log('Refresh response received');
          
          if (response.data.success && response.data.result) {
            const { token, expiresAt } = response.data.result;
            
            StorageService.setAccessToken(token);
            StorageService.setTokenExpiry(expiresAt);
            
            originalRequest.headers.Authorization = `Bearer ${token}`;
            
            processQueue(null, token);
            
            return axios(originalRequest);
          } else {
            throw new Error(response.data.errorMessage || 'Token refresh failed');
          }
        } catch (refreshError) {
          console.error('Error refreshing token:', refreshError);
          
          processQueue(refreshError, null);
          
          StorageService.removeUserDetails();
          
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }
    );
  }

  async get(endpoint = '', config = {}) {
    try {
      const response = await this.api.get(endpoint, config);
      return response.data;
    } catch (error) {
      console.error(`GET ${endpoint} failed:`, error);
      throw error;
    }
  }

  async post(endpoint = '', data = {}, config = {}) {
    try {
      const response = await this.api.post(endpoint, data, config);
      return response.data;
    } catch (error) {
      console.error(`POST ${endpoint} failed:`, error);
      throw error;
    }
  }

  async put(endpoint = '', data = {}, config = {}) {
    try {
      const response = await this.api.put(endpoint, data, config);
      return response.data;
    } catch (error) {
      console.error(`PUT ${endpoint} failed:`, error);
      throw error;
    }
  }

  async delete(endpoint = '', config = {}) {
    try {
      const response = await this.api.delete(endpoint, config);
      return response.data;
    } catch (error) {
      console.error(`DELETE ${endpoint} failed:`, error);
      throw error;
    }
  }

  async postBlob(endpoint = '', data = {}, config = {}) {
    try {
      const response = await this.api.post(endpoint, data, {
        ...config,
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error(`POST BLOB ${endpoint} failed:`, error);
      throw error;
    }
  }

  async uploadFiles(endpoint = '', userId: Guid, files: File[], parentFolderId?: Guid) {
    let url = `${endpoint}?userId=${userId}`;
    if (parentFolderId) {
      url += `&parentFolderId=${parentFolderId}`;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));

    try {
      const response = await this.api.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error(`UPLOAD FILES ${endpoint} failed:`, error);
      throw error;
    }
  }

  async uploadFolder(endpoint = '', userId: string, parentFolderId: string | null, zipFile: Blob) {
    const formData = new FormData();
    formData.append('UserId', userId);
    if (parentFolderId) {
      formData.append('ParentFolderId', parentFolderId || '');
    }
    formData.append('ZipFile', zipFile);
  
    try {
      const response = await this.api.post(endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      console.error('Upload folder failed:', error);
      throw error;
    }
  }
}