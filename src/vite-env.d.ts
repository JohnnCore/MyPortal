/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** API base URL */
  readonly VITE_APP_API_URL: string;
  /** Deployment environment (development | staging | production) */
  readonly VITE_APP_DEPLOY_ENV: 'development' | 'staging' | 'production';
  /** Enable debug mode to show error stack traces */
  readonly VITE_APP_DEBUG_MODE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
