FROM node:20-slim AS builder
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9.12.0 --activate

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY apps/api/package.json ./apps/api/
COPY packages/db/package.json ./packages/db/
COPY packages/shared/package.json ./packages/shared/

RUN pnpm install --frozen-lockfile

COPY tsconfig.base.json ./
COPY apps/api ./apps/api
COPY packages/db ./packages/db
COPY packages/shared ./packages/shared

RUN pnpm --filter @aria/shared build
RUN pnpm --filter @aria/db build
RUN pnpm --filter @aria/api build

RUN pnpm --filter @aria/api --prod deploy /deploy

# --- Runtime ---
FROM node:20-slim
WORKDIR /app

COPY --from=builder /deploy ./

EXPOSE 3001
ENV NODE_ENV=production
CMD ["node", "dist/server.js"]
