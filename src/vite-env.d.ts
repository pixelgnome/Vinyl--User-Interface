/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DISCOGS_TOKEN?: string
  readonly VITE_DISCOGS_CONSUMER_KEY?: string
  readonly VITE_DISCOGS_CONSUMER_SECRET?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
