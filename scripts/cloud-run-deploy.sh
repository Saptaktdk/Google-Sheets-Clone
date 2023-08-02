#!/bin/bash

GCLOUD_DOCKER_REGISTRY_HOSTNAME=us-central1-docker.pkg.dev
GCLOUD_DOCKER_REPO_NAME=my-docker-repo
SERVICE_IMAGE_NAME=google-sheets
GCLOUD_PROJECT_SERVICE_ACCOUNT_ID=cloud-run-deploy@first-project-394615.iam.gserviceaccount.com
GCLOUD_PROJECT_ID=first-project-394615
GCLOUD_TMP_JSON_PATH="../credentials/cloud-run.json"
TAG_NAME=1.0.8
SERVICE_NAME=google-sheets
SERVICE_ACCOUNT="661903042002-compute@developer.gserviceaccount.com"

#? Run gcloud auth
gcloud info --run-diagnostics
gcloud auth activate-service-account $GCLOUD_PROJECT_SERVICE_ACCOUNT_ID --key-file $GCLOUD_TMP_JSON_PATH
gcloud config set project $GCLOUD_PROJECT_ID

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