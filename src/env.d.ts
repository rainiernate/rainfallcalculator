/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_NOAA_API_TOKEN: string
  readonly VITE_APP_TITLE: string
  readonly VITE_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
