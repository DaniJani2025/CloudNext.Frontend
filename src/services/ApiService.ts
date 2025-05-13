import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import StorageService from './StorageService';
import { Guid, RefreshSubscriber, TokenResponse, TokenResult } from '../types/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

let isRefreshing = false;
let refreshSubscribers: RefreshSubscriber[] = [];

const processQueue = (error: any, token: string | null = null) => {
  refreshSubscribers.forEach((callback) => {
    if (error) {
      callback.reject(error);
    } else {
      callback.resolve(token!);
    }
  });
  refreshSubscribers = [];
};

export default class ApiService {
  private api: AxiosInstance;
  private controller: string;

  constructor(controllerName: string) {
    this.controller = controllerName;

    this.api = axios.create({
      baseURL: `${API_BASE_URL}/${controllerName}`,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    this.api.interceptors.request.use((config) => {
      const token = StorageService.getAccessToken();
      if (token) {
        config.headers = config.headers || {};
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

        if (!StorageService.isLoggedIn() || !StorageService.getAccessToken()) {
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
              resolve: (token: string) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                resolve(axios(originalRequest));
              },
              reject: (err: any) => {
                reject(err);
              }
            });
          });
        }

        isRefreshing = true;

        try {
          console.log('Attempting to refresh token');

          const response: AxiosResponse<TokenResponse> = await axios.post(
            `${API_BASE_URL}/Users/refresh-token`,
            {},
            { withCredentials: true }
          );

          console.log('Refresh response received');

          if (response.data.success && response.data.result) {
            const response = await axios.post<{ success: boolean; result: TokenResult; errorMessage?: string }>(
              `${API_BASE_URL}/Users/refresh-token`, 
              {},
              { withCredentials: true }
            );

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
          
          window.location.href = '/login';
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }
    );
  }

  async get(endpoint = '', config: AxiosRequestConfig = {}) {
    try {
      const response = await this.api.get(endpoint, config);
      return response.data;
    } catch (error) {
      console.error(`GET ${endpoint} failed:`, error);
      throw error;
    }
  }

  async post(endpoint = '', data = {}, config: AxiosRequestConfig = {}) {
    try {
      const response = await this.api.post(endpoint, data, config);
      return response.data;
    } catch (error) {
      console.error(`POST ${endpoint} failed:`, error);
      throw error;
    }
  }

  async put(endpoint = '', data = {}, config: AxiosRequestConfig = {}) {
    try {
      const response = await this.api.put(endpoint, data, config);
      return response.data;
    } catch (error) {
      console.error(`PUT ${endpoint} failed:`, error);
      throw error;
    }
  }

  async delete(endpoint = '', config: AxiosRequestConfig = {}) {
    try {
      const response = await this.api.delete(endpoint, config);
      return response.data;
    } catch (error) {
      console.error(`DELETE ${endpoint} failed:`, error);
      throw error;
    }
  }

  async postBlob(endpoint = '', data = {}, config: AxiosRequestConfig = {}) {
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

  async uploadFolder(endpoint = '', userId: Guid, parentFolderId: Guid | null, zipFile: Blob) {
    const formData = new FormData();
    formData.append('UserId', userId.toString());
    if (parentFolderId) {
      formData.append('ParentFolderId', parentFolderId.toString());
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