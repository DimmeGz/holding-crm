import axios, { type AxiosResponse } from 'axios';
import { http } from '@/api/http';

export type ApiError = {
  statusCode: number;
  message: string;
};

type NestErrorBody = {
  statusCode?: number;
  message?: string | string[];
};

export function parseApiError(error: unknown): string {
  if (axios.isAxiosError<NestErrorBody>(error)) {
    const message = error.response?.data?.message;

    if (Array.isArray(message)) {
      return message.join(', ');
    }

    if (typeof message === 'string') {
      return message;
    }

    if (error.message) {
      return error.message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred';
}

export function toApiError(error: unknown): ApiError {
  if (axios.isAxiosError<NestErrorBody>(error)) {
    return {
      statusCode: error.response?.status ?? 0,
      message: parseApiError(error),
    };
  }

  return {
    statusCode: 0,
    message: parseApiError(error),
  };
}

async function request<T>(
  fn: () => Promise<AxiosResponse<T>>,
): Promise<T> {
  try {
    const response = await fn();
    return response.data;
  } catch (error: unknown) {
    throw toApiError(error);
  }
}

export const apiClient = {
  get<T>(url: string): Promise<T> {
    return request(() => http.get<T>(url));
  },

  post<T>(url: string, body?: unknown): Promise<T> {
    return request(() => http.post<T>(url, body));
  },

  patch<T>(url: string, body?: unknown): Promise<T> {
    return request(() => http.patch<T>(url, body));
  },

  del<T>(url: string): Promise<T> {
    return request(() => http.delete<T>(url));
  },
};
