import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { EnvKey, getOptionalEnv } from '@/config/env.config';
import { HttpClientErrorMessage, HttpClientTimeout } from '@/constants/enums';
import { ApiBasePath } from '@/constants/routes';

const axiosInstance = axios.create({
  baseURL: getOptionalEnv(EnvKey.API_BASE_URL) ?? ApiBasePath.DEFAULT,
  timeout: HttpClientTimeout.DEFAULT,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
      if (config.headers) {
        delete config.headers['Content-Type'];
      }
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) =>
    Promise.reject({
      message: resolveAxiosErrorMessage(error),
      status: error.response?.status,
      data: error.response?.data,
      originalError: error,
    }),
);

function resolveAxiosErrorMessage(error: AxiosError): string {
  if (error.response?.data) {
    const data = error.response.data as { message?: string; error?: string };
    return data.message || data.error || HttpClientErrorMessage.DEFAULT;
  }

  return error.message || HttpClientErrorMessage.UNEXPECTED;
}

export default axiosInstance;

export const api = {
  get: <T>(url: string, config?: Parameters<typeof axiosInstance.get>[1]) =>
    axiosInstance.get<T>(url, config).then((res) => res.data),

  post: <T>(url: string, data?: unknown, config?: Parameters<typeof axiosInstance.post>[2]) =>
    axiosInstance.post<T>(url, data, config).then((res) => res.data),

  put: <T>(url: string, data?: unknown, config?: Parameters<typeof axiosInstance.put>[2]) =>
    axiosInstance.put<T>(url, data, config).then((res) => res.data),

  patch: <T>(url: string, data?: unknown, config?: Parameters<typeof axiosInstance.patch>[2]) =>
    axiosInstance.patch<T>(url, data, config).then((res) => res.data),

  delete: <T>(url: string, config?: Parameters<typeof axiosInstance.delete>[1]) =>
    axiosInstance.delete<T>(url, config).then((res) => res.data),
};
