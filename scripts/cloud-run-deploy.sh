#!/bin/bash

GCLOUD_TMP_JSON_PATH="/tmp/gcloud-api-key.json"

GCR_IMAGE_REPO_URL=$GCLOUD_DOCKER_REGISTRY_HOSTNAME/$GCLOUD_PROJECT_ID/$GCLOUD_DOCKER_REPO_NAME
GCR_IMAGE_NAME=$GCR_IMAGE_REPO_URL/$SERVICE_IMAGE_NAME
GCR_IMAGE_NAME_WITH_TAG=$GCR_IMAGE_NAME:$TAG_NAME

#? List all docker images
gcloud_list_image(){
    gcloud container images list --repository=$GCR_IMAGE_REPO_URL | grep $SERVICE_IMAGE_NAME
}

#? Push image to cloud run
gcloud_deploy_cloud_run(){
    gcloud run deploy $SERVICE_NAME  --region us-central1 --image $GCR_IMAGE_NAME_WITH_TAG --allow-unauthenticated --service-account $SERVICE_ACCOUNT
}

gcloud_list_image
gcloud_deploy_cloud_run