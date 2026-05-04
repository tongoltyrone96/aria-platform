import pino from 'pino';

const devTransport =
  process.env['NODE_ENV'] !== 'production'
    ? { transport: { target: 'pino-pretty', options: { colorize: true } } }
    : {};

export const logger = pino({
  level: process.env['LOG_LEVEL'] ?? 'info',
  ...devTransport,
});
