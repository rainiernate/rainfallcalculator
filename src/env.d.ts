/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_NOAA_API_TOKEN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
