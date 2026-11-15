FROM oven/bun:1.4.2-alpine AS deps
WORKDIR /app

COPY package.json bun.lock ./
COPY server/package.json server/
COPY client/package.json client/
COPY shared/package.json shared/
COPY Vera/package.json Vera/

RUN bun install --frozen-lockfile

FROM oven/bun:1.4.2-alpine AS build
WORKDIR /app

COPY --from=deps /app ./
COPY shared/ ./shared/
COPY client/ ./client/

# inlined into client bundle at build time
ARG BUN_PUBLIC_API_URL
RUN test -n "$BUN_PUBLIC_API_URL" \
  || (echo "ERROR: BUN_PUBLIC_API_URL build arg is required" && exit 1)
ENV BUN_PUBLIC_API_URL=$BUN_PUBLIC_API_URL

WORKDIR /app/client
RUN bun run build.ts && rm -f dist/*.map

FROM caddy:2.10-alpine

COPY infra/caddy/Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/client/dist /srv

EXPOSE 80 443
