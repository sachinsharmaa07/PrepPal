import { ApiResponse } from '@preppal/types';

export const success = <T>(data: T): ApiResponse<T> => {
  return {
    success: true,
    data,
  };
};

export const error = (code: string, message: string): ApiResponse<any> => {
  return {
    success: false,
    error: {
      code,
      message,
    },
  };
};
