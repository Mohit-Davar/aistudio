import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import {
  oauthProviderAuthServerMetadata,
  oauthProviderOpenIdConfigMetadata,
} from "@better-auth/oauth-provider";

import { auth } from "@/lib/auth";
import { env } from "@/lib/env";
import { errorHandler } from "@/middleware/error-handler";

import { analyticsRouter } from "@/routes/analytics.routes";
import { dashboardsRouter } from "@/routes/dashboards.routes";
import { devicesRouter } from "@/routes/devices.routes";
import { integrationsRouter } from "@/routes/integrations.routes";
import { locationsRouter } from "@/routes/locations.routes";
import { telemetryRouter } from "@/routes/telemetry.routes";
import { templatesRouter } from "@/routes/templates.routes";

const API_PREFIX = "/api/v2";

const OAUTH_CORS_PATHS = [
  `${API_PREFIX}/auth/oauth2/token`,
  `${API_PREFIX}/auth/oauth2/register`,
  `${API_PREFIX}/auth/oauth2/revoke`,
  `${API_PREFIX}/auth/jwks`,
  "/.well-known",
  `${API_PREFIX}/auth/.well-known`,
];

const OAUTH_PATHS = [
  `${API_PREFIX}/auth/oauth2`,
  `${API_PREFIX}/auth/admin/oauth2`,
  `${API_PREFIX}/auth/.well-known`,
  "/.well-known/oauth-authorization-server",
  "/.well-known/openid-configuration",
];

export const app = express();

// Configure trust proxy specifically for local loopback & standard reverse proxies (prevents express-rate-limit warning)
app.set("trust proxy", "loopback, linklocal, uniquelocal");

// Application configuration
app.disable("x-powered-by");

// CORS
if (env.AI_INTEGRATIONS.enabled) {
  app.use(OAUTH_CORS_PATHS, cors({ origin: true, credentials: false }));
}

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// OAuth authorization server
if (env.AI_INTEGRATIONS.enabled) {
  app.get(
    "/.well-known/oauth-authorization-server/api/v2/auth",
    toNodeHandler(oauthProviderAuthServerMetadata(auth)),
  );

  app.get(
    "/.well-known/openid-configuration/api/v2/auth",
    toNodeHandler(oauthProviderOpenIdConfigMetadata(auth)),
  );
} else {
  app.use(OAUTH_PATHS, (_req, res) => {
    res.status(404).json({ error: "Not found" });
  });
}

// Authentication
app.all(`${API_PREFIX}/auth/*splat`, (req, res) => {
  const forwarded = req.headers["x-forwarded-for"];
  const clientIp =
    typeof forwarded === "string"
      ? forwarded.split(",")[0]?.trim() || "127.0.0.1"
      : req.socket.remoteAddress || "127.0.0.1";

  req.headers["x-forwarded-for"] = clientIp;
  req.headers["x-real-ip"] = clientIp;

  return toNodeHandler(auth)(req, res);
});

// API v2
const apiV2Router = express.Router();

apiV2Router.use(express.json({ limit: "256kb" }));

// Resource routes
apiV2Router.use(locationsRouter);
apiV2Router.use(templatesRouter);
apiV2Router.use(devicesRouter);
apiV2Router.use(dashboardsRouter);
apiV2Router.use(analyticsRouter);
apiV2Router.use(telemetryRouter);
apiV2Router.use(integrationsRouter);

app.use(API_PREFIX, apiV2Router);

// Not found
app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Error handling
app.use(errorHandler);
