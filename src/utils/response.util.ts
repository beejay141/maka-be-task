import { GENERIC_ERROR_MESSAGE } from './constants';

export const ErrorResponse = (
  message?: string,
  errors?: unknown[]
): Record<string, unknown> => {
  return {
    message: message ?? GENERIC_ERROR_MESSAGE,
    ...(errors && { errors }),
  };
};
