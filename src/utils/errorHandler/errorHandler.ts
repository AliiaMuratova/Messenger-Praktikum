import { Router } from '@/core/Router';
import {
  ApiError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
  ConflictError,
  ServerError,
  NetworkError,
  TimeoutError,
} from '@/api/http/errors';

type ErrorContext = string;

interface ErrorHandlerOptions {
  context?: ErrorContext;
  redirectOnUnauthorized?: boolean;
  onUnauthorized?: () => void;
  onValidationError?: (reason: string) => void;
  onNotFound?: (reason: string) => void;
  onConflict?: (reason: string) => void;
  onNetworkError?: (message: string) => void;
  onServerError?: (status: number, reason: string) => void;
}

export function handleError(error: unknown, options: ErrorHandlerOptions = {}): void {
  const {
    context = '',
    redirectOnUnauthorized = true,
    onUnauthorized,
    onValidationError,
    onNotFound,
    onConflict,
    onNetworkError,
    onServerError,
  } = options;

  const contextPrefix = context ? ` ${context}:` : ':';

  if (error instanceof UnauthorizedError) {
    console.error(`[Авторизация]${contextPrefix} ${error.reason}`);
    if (onUnauthorized) {
      onUnauthorized();
    } else if (redirectOnUnauthorized) {
      Router.getInstance().go('/');
    }
    return;
  }

  if (error instanceof ForbiddenError) {
    console.error(`[Доступ запрещён]${contextPrefix} ${error.reason}`);
    return;
  }

  if (error instanceof NotFoundError) {
    console.error(`[Не найдено]${contextPrefix} ${error.reason}`);
    onNotFound?.(error.reason);
    return;
  }

  if (error instanceof ValidationError) {
    if (error.reason ==='User already in system') {
      Router.getInstance().go('/messenger');
      return;
    }
    console.error(`[Валидация]${contextPrefix} ${error.reason}`);
    onValidationError?.(error.reason);
    return;
  }

  if (error instanceof ConflictError) {
    console.error(`[Конфликт данных]${contextPrefix} ${error.reason}`);
    onConflict?.(error.reason);
    return;
  }

  if (error instanceof NetworkError) {
    console.error(`[Сеть]${contextPrefix} ${error.message}`);
    onNetworkError?.(error.message);
    return;
  }

  if (error instanceof TimeoutError) {
    console.error(`[Таймаут]${contextPrefix} ${error.message}`);
    return;
  }

  if (error instanceof ServerError) {
    console.error(`[Сервер]${contextPrefix} Ошибка ${error.status}: ${error.reason}`);
    if (onServerError) {
      onServerError(error.status, error.reason);
    } else {
      Router.getInstance().go('/500');
    }
    return;
  }

  if (error instanceof ApiError) {
    console.error(`[API]${contextPrefix} ${error.reason} (${error.status})`);
    return;
  }

  if (error instanceof Error) {
    console.error(`[Ошибка]${contextPrefix} ${error.message}`);
    return;
  }

  console.error(`[Неизвестная ошибка]${contextPrefix}`, error);
}

export function createContextualError(context: string, message: string): Error {
  return new Error(`[${context}] ${message}`);
}

export {
  ApiError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
  ConflictError,
  ServerError,
  NetworkError,
  TimeoutError,
};

