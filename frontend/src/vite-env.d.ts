/// <reference types="vite/client" />

/** Évite TS2307 si les types `vite/client` ne sont pas résolus sur CI (ex. sans devDependencies). */
declare module "*.css";

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
