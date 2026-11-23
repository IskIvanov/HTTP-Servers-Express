import { MigrationConfig } from "drizzle-orm/migrator";

type DBConfig = {
    migrationConfig: MigrationConfig;
    url: string;
};

type APIConfig = {
    fileServerHits: number;
    db: DBConfig;
    platform: string;
};

process.loadEnvFile();
// @todo: Switching environments does not work when restarting the server.
function envOrThrow(key: string) {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Environment variable ${key} is not set`);
    }
    return value;
}

export const config: APIConfig = {
    fileServerHits: 0,
    db: {
        migrationConfig: {
            migrationsFolder: "./src/db/migrations",
        },
        url: envOrThrow("DB_URL"),
    },
    platform: envOrThrow("PLATFORM"),
};
