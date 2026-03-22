import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    // ts-node --transpile-only avoids rootDir mismatch (seed.ts is outside src/)
    seed: "ts-node --transpile-only prisma/seed.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
