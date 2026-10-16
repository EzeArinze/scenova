export type ErrorCode =
  | 'INTERNAL_ERROR'
  | 'CONFLICT'
  | 'VALIDATION_ERROR'
  | 'NOT_FOUND'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'INVALID_CALLBACK'

export interface ErrorResponse {
  success: false
  message: string
  code: ErrorCode
  statusCode: number
}

export class AppError extends Error {
  readonly statusCode: number
  readonly code: ErrorCode

  constructor(
    message: string,
    statusCode = 500,
    code: ErrorCode = 'INTERNAL_ERROR',
  ) {
    super(message)

    this.name = this.constructor.name
    this.statusCode = statusCode
    this.code = code
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Conflict occurred') {
    super(message, 409, 'CONFLICT')
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Validation failed') {
    super(message, 400, 'VALIDATION_ERROR')
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404, 'NOT_FOUND')
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401, 'UNAUTHORIZED')
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403, 'FORBIDDEN')
  }
}

export function handleError(error: unknown): ErrorResponse {
  // Known application errors
  if (error instanceof AppError) {
    return {
      success: false,
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
    }
  }

  // Native JS errors
  if (error instanceof Error) {
    console.error(error)

    return {
      success: false,
      message: error.message || 'Internal Server Error',
      code: 'INTERNAL_ERROR',
      statusCode: 500,
    }
  }

  // Completely unknown errors
  console.error('Unknown error:', error)

  return {
    success: false,
    message: 'Internal Server Error',
    code: 'INTERNAL_ERROR',
    statusCode: 500,
  }
}
