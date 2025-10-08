/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_APP_NAME?: string; // optional
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}