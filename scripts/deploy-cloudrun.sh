#!/bin/bash

# Cloud Run deployment script for Next.js blog
# Usage: ./scripts/deploy-cloudrun.sh [PROJECT_ID] [REGION] [SERVICE_NAME]

PROJECT_ID=${1:-"your-project-id"}
REGION=${2:-"asia-northeast1"}
SERVICE_NAME=${3:-"nextjs-blog"}

echo "Building and deploying to Cloud Run..."
echo "Project: $PROJECT_ID"
echo "Region: $REGION"
echo "Service: $SERVICE_NAME"

# Build and push Docker image
gcloud builds submit --tag gcr.io/$PROJECT_ID/$SERVICE_NAME

# Deploy to Cloud Run
gcloud run deploy $SERVICE_NAME \
  --image gcr.io/$PROJECT_ID/$SERVICE_NAME \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --memory 2Gi \
  --cpu 2 \
  --max-instances 10 \
  --port 3000 \
  --set-env-vars NODE_ENV=production

echo "Deployment completed!"
echo "Service URL: https://$SERVICE_NAME-$PROJECT_ID.a.run.app"