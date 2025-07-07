# CloudRun メモリ使用量削減ガイド

## 問題の概要
- 現在のメモリ使用量: 1040MiB（制限: 1024MiB）
- 原因: 2,306個のMDXファイル + 大きなビルド成果物

## 即効性のある解決策

### 1. CloudRunのメモリ制限を増やす（一時的な解決）
```bash
gcloud run deploy [SERVICE_NAME] --memory 2Gi --region asia-northeast1
```

### 2. ビルドサイズを削減する

#### package.jsonに追加
```json
{
  "scripts": {
    "build:prod": "NODE_ENV=production next build && npm run postbuild:prod",
    "postbuild:prod": "node scripts/clean-build.mjs"
  }
}
```

#### scripts/clean-build.mjs を作成
```javascript
import { rm } from 'fs/promises';
import { join } from 'path';

// ビルド後に不要なファイルを削除
const cleanBuild = async () => {
  const toDelete = [
    '.next/cache',
    '.next/server/chunks/babel-packages',
    '.next/server/amphtml-validator',
    '.open-next/cache',
  ];

  for (const path of toDelete) {
    try {
      await rm(join(process.cwd(), path), { recursive: true, force: true });
      console.log(`Cleaned: ${path}`);
    } catch (error) {
      console.log(`Skipped: ${path}`);
    }
  }
};

cleanBuild();
```

### 3. コンテンツの最適化

#### 大量のMDXファイルを管理する
1. 古い記事をアーカイブフォルダに移動
2. ISR（Incremental Static Regeneration）を有効化
3. 動的インポートを使用

#### app/blog/[...slug]/page.tsx を修正
```typescript
export const dynamicParams = true;
export const revalidate = 3600; // 1時間ごとに再生成
```

### 4. 画像の最適化
```bash
# 大きな画像を圧縮
npm install -D sharp-cli
npx sharp-cli resize 1920 --quality 85 --format webp public/static/images/**/*.{jpg,png}
```

### 5. 依存関係の削減
```bash
# 不要な依存関係を確認
npm ls --depth=0
npx depcheck

# 開発依存関係を本番から除外
npm prune --production
```

## 長期的な解決策

1. **静的サイトジェネレーター（SSG）への移行を検討**
   - CloudFlare Pagesに直接デプロイ
   - Cloud Runを使わない

2. **コンテンツ管理システム（CMS）の導入**
   - MDXファイルをHeadless CMSに移行
   - ビルド時の処理を削減

3. **マイクロサービス化**
   - ブログ記事のレンダリングを別サービスに分離
   - APIゲートウェイを使用

## 推奨される即時アクション

1. まず、CloudRunのメモリを2GBに増やす
2. 不要なビルドファイルを削除するスクリプトを実行
3. 画像を最適化
4. 古い記事（例：1年以上前）をアーカイブ

これらの対策で、メモリ使用量を約30-40%削減できるはずです。