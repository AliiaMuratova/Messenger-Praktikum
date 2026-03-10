export class ApiError extends Error {
  status: number;
  reason: string;

  constructor(status: number, reason: string) {
    super(reason);
    Object.setPrototypeOf(this, ApiError.prototype);
    this.name = 'ApiError';
    this.status = status;
    this.reason = reason;
  }
}

export class UnauthorizedError extends ApiError {
  constructor(reason = 'Необходима авторизация') {
    super(401, reason);
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends ApiError {
  constructor(reason = 'Нет доступа') {
    super(403, reason);
    Object.setPrototypeOf(this, ForbiddenError.prototype);
    this.name = 'ForbiddenError';
  }
}

export class NotFoundError extends ApiError {
  constructor(reason = 'Не найдено') {
    super(404, reason);
    Object.setPrototypeOf(this, NotFoundError.prototype);
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends ApiError {
  constructor(reason = 'Ошибка валидации') {
    super(400, reason);
    Object.setPrototypeOf(this, ValidationError.prototype);
    this.name = 'ValidationError';
  }
}

export class ConflictError extends ApiError {
  constructor(reason = 'Конфликт данных') {
    super(409, reason);
    Object.setPrototypeOf(this, ConflictError.prototype);
    this.name = 'ConflictError';
  }
}

export class ServerError extends ApiError {
  constructor(status = 500, reason = 'Внутренняя ошибка сервера') {
    super(status, reason);
    Object.setPrototypeOf(this, ServerError.prototype);
    this.name = 'ServerError';
  }
}

export class NetworkError extends ApiError {
  constructor(message = 'Ошибка сети. Проверьте подключение к интернету') {
    super(0, message);
    Object.setPrototypeOf(this, NetworkError.prototype);
    this.name = 'NetworkError';
  }
}

export class TimeoutError extends ApiError {
  constructor(message = 'Превышено время ожидания ответа от сервера') {
    super(0, message);
    Object.setPrototypeOf(this, TimeoutError.prototype);
    this.name = 'TimeoutError';
  }
}

export function createApiError(status: number, reason: string): ApiError {
  switch (status) {
  case 400:
    return new ValidationError(reason);
  case 401:
    return new UnauthorizedError(reason);
  case 403:
    return new ForbiddenError(reason);
  case 404:
    return new NotFoundError(reason);
  case 409:
    return new ConflictError(reason);
  default:
    return status >= 500
      ? new ServerError(status, reason)
      : new ApiError(status, reason);
  }
}

