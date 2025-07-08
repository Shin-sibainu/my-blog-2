// open-next.config.ts
import { defineCloudflareConfig } from '@opennextjs/cloudflare'

export default defineCloudflareConfig({
  // R2キャッシュを無効化してローカルキャッシュを使用
  incrementalCache: undefined,
})
