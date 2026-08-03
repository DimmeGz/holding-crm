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

export function getErrorMessage(
  error: unknown,
  fallback = 'Unknown error',
): string {
  if (error && typeof error === 'object' && 'message' in error) {
    return String((error as { message: string }).message);
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
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

function parseContentDispositionFilename(
  header: string | undefined,
): string | null {
  if (!header) {
    return null;
  }
  const utfMatch = /filename\*=UTF-8''([^;]+)/i.exec(header);
  if (utfMatch?.[1]) {
    return decodeURIComponent(utfMatch[1]);
  }
  const plainMatch = /filename="?([^"]+)"?/i.exec(header);
  return plainMatch?.[1] ?? null;
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

  async getBlob(
    url: string,
  ): Promise<{ blob: Blob; filename: string | null }> {
    try {
      const response = await http.get<Blob>(url, { responseType: 'blob' });
      return {
        blob: response.data,
        filename: parseContentDispositionFilename(
          response.headers['content-disposition'] as string | undefined,
        ),
      };
    } catch (error: unknown) {
      throw toApiError(error);
    }
  },
};
