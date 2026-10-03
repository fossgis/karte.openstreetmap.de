#!/usr/bin/env bash
set -euo pipefail

DIRECTORY_EXTERNAL_LIBRARIES=./public/lib/external

download_asset(){
    local LIBRARY_SLUG="${1}"
    # remove leading @-character if existing
    local LIBRARY_NAME="${LIBRARY_SLUG#@}"

    local VERSION="${2}"
    local ASSET_NAME="${3}"
    local OUTPUT_DIR=${DIRECTORY_EXTERNAL_LIBRARIES}/${LIBRARY_NAME}/

    mkdir --parents ${OUTPUT_DIR}

    local URL=https://unpkg.com/${LIBRARY_SLUG}@${VERSION}/dist/${ASSET_NAME}

    curl \
      --fail \
      --location ${URL} \
      --remote-name \
      --output-dir ${OUTPUT_DIR}
}

for asset in \
    "maplibre-gl.mjs" "maplibre-gl-shared.mjs" "maplibre-gl-worker.mjs" "maplibre-gl.css"
do
    download_asset maplibre-gl 6.4.1 ${asset}
done

for asset in "maplibre-gl-geocoder.js" "maplibre-gl-geocoder.css"
do
    download_asset @maplibre/maplibre-gl-geocoder 1.9.4 ${asset}
done

