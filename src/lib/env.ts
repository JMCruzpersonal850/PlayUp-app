type EnvConfig = {
  databaseUrl: string;
  jwtSecret: string;
  googleMapsApiKey?: string;
  googleMapsMapId?: string;
  tursoAuthToken?: string;
  isProduction: boolean;
};

const DEV_JWT_FALLBACK = "playup-dev-secret-change-in-production";

function readEnv(): EnvConfig {
  const isProduction = process.env.NODE_ENV === "production";
  const databaseUrl = process.env.DATABASE_URL ?? "file:./dev.db";
  const jwtSecret = process.env.JWT_SECRET ?? DEV_JWT_FALLBACK;

  return {
    databaseUrl,
    jwtSecret,
    googleMapsApiKey:
      process.env.GOOGLE_MAPS_API_KEY ?? process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    googleMapsMapId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID,
    tursoAuthToken: process.env.TURSO_AUTH_TOKEN,
    isProduction,
  };
}

export function getEnv() {
  return readEnv();
}

export function assertProductionEnv() {
  const env = readEnv();
  const problems: string[] = [];

  if (env.isProduction && env.jwtSecret === DEV_JWT_FALLBACK) {
    problems.push("JWT_SECRET must be set to a long random value in production.");
  }

  if (env.isProduction && env.databaseUrl.startsWith("file:") && process.env.PLAYUP_ALLOW_SQLITE !== "true") {
    problems.push(
      "DATABASE_URL points to a local SQLite file. Use Turso (libsql://) or another hosted database for production.",
    );
  }

  if (env.isProduction && env.databaseUrl.includes("libsql") && !env.tursoAuthToken) {
    problems.push("TURSO_AUTH_TOKEN is required when using a Turso/libSQL database URL.");
  }

  if (problems.length > 0) {
    throw new Error(`Production environment misconfigured:\n- ${problems.join("\n- ")}`);
  }
}

export function getDatabaseKind(url = readEnv().databaseUrl) {
  if (url.startsWith("file:")) return "sqlite" as const;
  if (url.startsWith("libsql:") || url.startsWith("https://")) return "turso" as const;
  return "unknown" as const;
}

export function getPublicConfig() {
  const env = readEnv();
  return {
    hasGoogleMapsApiKey: Boolean(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY),
    hasGooglePlacesApiKey: Boolean(process.env.GOOGLE_MAPS_API_KEY),
    googleMapsMapId: env.googleMapsMapId ?? "DEMO_MAP_ID",
  };
}
