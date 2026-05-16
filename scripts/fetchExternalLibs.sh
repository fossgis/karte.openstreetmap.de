#!/usr/bin/env bash
set -euo pipefail

MAPLIBRE_GL_JS_VERSION=5.24.0
MAPLIBRE_GEOCODER_VERSION=1.5.0

DIRECTORY_EXTERNAL_LIBRARIES=./public/lib/external/

mkdir -p ${DIRECTORY_EXTERNAL_LIBRARIES}/maplibre-gl/

curl -L https://unpkg.com/maplibre-gl@${MAPLIBRE_GL_JS_VERSION}/dist/maplibre-gl.js -o ${DIRECTORY_EXTERNAL_LIBRARIES}/maplibre-gl/maplibre-gl.js
curl -L https://unpkg.com/maplibre-gl@${MAPLIBRE_GL_JS_VERSION}/dist/maplibre-gl.css -o ${DIRECTORY_EXTERNAL_LIBRARIES}/maplibre-gl/maplibre-gl.css

mkdir -p ${DIRECTORY_EXTERNAL_LIBRARIES}/maplibre-gl-geocoder/

curl -L https://unpkg.com/@maplibre/maplibre-gl-geocoder@${MAPLIBRE_GEOCODER_VERSION}/dist/maplibre-gl-geocoder.min.js -o ${DIRECTORY_EXTERNAL_LIBRARIES}/maplibre-gl-geocoder/maplibre-gl-geocoder.min.js
curl -L https://unpkg.com/@maplibre/maplibre-gl-geocoder@${MAPLIBRE_GEOCODER_VERSION}/dist/maplibre-gl-geocoder.css -o ${DIRECTORY_EXTERNAL_LIBRARIES}/maplibre-gl-geocoder/maplibre-gl-geocoder.css
