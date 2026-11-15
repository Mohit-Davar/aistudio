FROM oven/bun:1.4.2-alpine AS deps
WORKDIR /app

# layer caching: lockfile and manifests change less frequently
COPY package.json bun.lock ./
COPY server/package.json server/
COPY client/package.json client/
COPY shared/package.json shared/
COPY Vera/package.json Vera/

RUN bun install --frozen-lockfile

FROM oven/bun:1.4.2-alpine
WORKDIR /app

ENV NODE_ENV=production

COPY --from=deps /app ./

# shared dependencies change less frequently than server code
COPY shared/ ./shared/
COPY server/ ./server/

WORKDIR /app/server
USER bun
EXPOSE 3000

STOPSIGNAL SIGTERM
CMD ["bun", "src/index.ts"]
