// src/shared/services/genericService.js
import { getCookie } from '../utils/session';
import { rGet, rPost, rPut, rDelete } from './apiService';

export class BaseService {

  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  #getAuthToken = () => {
    return getCookie('authToken');
  };

  getAll = async (partialUrl='') => {
    const jwt = this.#getAuthToken();
    return await rGet(`${this.baseUrl}${partialUrl}`, jwt);
  };

  getById = async (id, partialUrl='') => {
    const jwt = this.#getAuthToken();
    return await rGet(`${this.baseUrl}${partialUrl}/${id}`, jwt);
  };

  add = async (data, partialUrl='') => {
    const jwt = this.#getAuthToken();
    return await rPost(`${this.baseUrl}${partialUrl}`, data, jwt);
  };

  update = async (id, data, partialUrl='') => {
    const jwt = this.#getAuthToken();
    return await rPut(`${this.baseUrl}${partialUrl}/${id}`, data, jwt);
  };

  delete = async (id, partialUrl='') => {
    const jwt = this.#getAuthToken();
    return await rDelete(`${this.baseUrl}${partialUrl}/${id}`, jwt);
  };
  
}