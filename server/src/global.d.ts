declare global {
    namespace NodeJS {
        interface ProcessEnv {
            SESSION_SECRET: string;
            DB_HOST: string;
            DB_USER: string;
            DB_PASSWORD: string;
            DB_DATABASE: string;
            HOST: string;
            PORT: string;
            VITE_DEV_PORT: string;
            NODE_ENV?: "production" | "development" | undefined;
        }
    }
}

declare module "express-session" {
    interface SessionData {
        user: string;
    }
}

export { }