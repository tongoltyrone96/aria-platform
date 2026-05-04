export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    public details?: unknown,
  ) {
    super(code);
    this.name = 'ApiError';
  }
}

export const Errors = {
  validation: (msg?: string) => new ApiError(400, 'ERR_VALIDATION', msg),
  authRequired: () => new ApiError(401, 'ERR_AUTH_REQUIRED'),
  authExpired: () => new ApiError(401, 'ERR_AUTH_EXPIRED'),
  licenseRevoked: () => new ApiError(403, 'ERR_LICENSE_REVOKED'),
  licenseExpired: () => new ApiError(403, 'ERR_LICENSE_EXPIRED'),
  notFound: (msg?: string) => new ApiError(404, 'ERR_NOT_FOUND', msg),
  deviceLimit: (active: number) => new ApiError(409, 'ERR_DEVICE_LIMIT', { activeDevices: active }),
  usageExceeded: (retryAfter?: string) => new ApiError(429, 'ERR_USAGE_EXCEEDED', { retryAfter }),
  rateLimited: () => new ApiError(429, 'ERR_RATE_LIMITED'),
  internal: (msg?: string) => new ApiError(500, 'ERR_INTERNAL', msg),
  upstreamDeepseek: (msg?: string) => new ApiError(502, 'ERR_UPSTREAM_DEEPSEEK', msg),
};
