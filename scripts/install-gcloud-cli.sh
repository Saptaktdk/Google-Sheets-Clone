#!/bin/bash

SDK_VERSION=405.0.0
SDK_FILENAME=google-cloud-cli-${SDK_VERSION}-linux-x86_64.tar.gz
SDK_TMP_FILE="/tmp/google-cloud-cli.tar.gz"
SDK_EXTRACTED_PATH="/tmp/google-cloud-cli"
SDK_DIR_NAME="google-cloud-sdk"

#? Create the temporary directory
mkdir $SDK_EXTRACTED_PATH

#? Download Google Cloud SDK
curl -o $SDK_TMP_FILE https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/${SDK_FILENAME}

#? Extract the file
tar -xzvf $SDK_TMP_FILE -C $SDK_EXTRACTED_PATH

#? Install CLI
sh $SDK_EXTRACTED_PATH/$SDK_DIR_NAME/install.sh

#? Add to PATH
export PATH="$SDK_EXTRACTED_PATH/$SDK_DIR_NAME/completion.bash.inc:$PATH"
export PATH="$SDK_EXTRACTED_PATH/$SDK_DIR_NAME/path.bash.inc:$PATH"
source $SDK_EXTRACTED_PATH/$SDK_DIR_NAME/completion.bash.inc
source $SDK_EXTRACTED_PATH/$SDK_DIR_NAME/path.bash.inc