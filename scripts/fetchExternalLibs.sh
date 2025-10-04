#!/usr/bin/env bash
set -e

mkdir -p ./public/lib/external/maplibre-gl
curl -L https://unpkg.com/maplibre-gl@5.6.1/dist/maplibre-gl.js -o ./public/lib/external/maplibre-gl/maplibre-gl.js
curl -L https://unpkg.com/maplibre-gl@5.6.1/dist/maplibre-gl.css -o ./public/lib/external/maplibre-gl/maplibre-gl.css

mkdir -p ./public/lib/external/maplibre-gl-geocoder
curl -L https://unpkg.com/@maplibre/maplibre-gl-geocoder@1.5.0/dist/maplibre-gl-geocoder.min.js -o ./public/lib/external/maplibre-gl-geocoder/maplibre-gl-geocoder.min.js
curl -L https://unpkg.com/@maplibre/maplibre-gl-geocoder@1.5.0/dist/maplibre-gl-geocoder.css -o ./public/lib/external/maplibre-gl-geocoder/maplibre-gl-geocoder.css
