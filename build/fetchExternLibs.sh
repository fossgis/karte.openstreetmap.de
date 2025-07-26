#!/usr/bin/env bash
set -e

mkdir -p ../public/lib/extern/maplibre-gl
curl -L https://unpkg.com/maplibre-gl@5.6.1/dist/maplibre-gl.js -o ../public/lib/extern/maplibre-gl/maplibre-gl.js
curl -L https://unpkg.com/maplibre-gl@5.6.1/dist/maplibre-gl.css -o ../public/lib/extern/maplibre-gl/maplibre-gl.css
