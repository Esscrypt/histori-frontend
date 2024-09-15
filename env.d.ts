// env.d.ts

namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_API_URL: string;  // Public environment variable
      JWT_SECRET: string;           // Server-side only environment variable
    }
  }
  