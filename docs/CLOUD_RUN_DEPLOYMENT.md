# Cloud Run デプロイメントガイド

## 前提条件

1. Google Cloud SDK がインストールされている
2. Google Cloud プロジェクトが作成済み
3. Cloud Run API が有効化されている
4. Docker が利用可能

## デプロイ手順

### 1. Google Cloud プロジェクトの設定

```bash
# プロジェクトを設定
gcloud config set project YOUR_PROJECT_ID

# 必要なAPIを有効化
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
```

### 2. 手動デプロイ

```bash
# Cloud Run用にビルド
npm run build:cloudrun

# Dockerイメージをビルド・デプロイ
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/nextjs-blog

# Cloud Runにデプロイ
gcloud run deploy nextjs-blog \
  --image gcr.io/YOUR_PROJECT_ID/nextjs-blog \
  --platform managed \
  --region asia-northeast1 \
  --allow-unauthenticated \
  --memory 2Gi \
  --cpu 2 \
  --max-instances 10 \
  --port 3000
```

### 3. スクリプトを使用したデプロイ

```bash
# デプロイスクリプトを実行
./scripts/deploy-cloudrun.sh YOUR_PROJECT_ID asia-northeast1 nextjs-blog
```

## 環境変数の設定

必要に応じて以下の環境変数を設定：

```bash
gcloud run services update nextjs-blog \
  --set-env-vars NODE_ENV=production \
  --set-env-vars NEXT_TELEMETRY_DISABLED=1 \
  --region asia-northeast1
```

## メモリ制限の調整

2,306個のMDXファイルを処理するため、メモリを2GBに設定しています。必要に応じて調整可能：

```bash
gcloud run services update nextjs-blog \
  --memory 4Gi \
  --region asia-northeast1
```

## トラブルシューティング

### メモリ不足エラー
- メモリ制限を2GB以上に設定
- MDXファイルの数を減らす
- 静的生成を制限する

### ビルドエラー
- Dockerfileの設定を確認
- 依存関係の問題を解決
- ビルドログを確認

### デプロイエラー
- 権限設定を確認
- リージョン設定を確認
- サービス名の重複を確認

## 費用の最適化

- 最小インスタンス数を0に設定（デフォルト）
- 最大インスタンス数を適切に制限
- 必要なCPUとメモリのみを割り当て

## 監視とログ

```bash
# ログの確認
gcloud logs read --service=nextjs-blog

# メトリクスの確認
gcloud run services describe nextjs-blog --region=asia-northeast1
```