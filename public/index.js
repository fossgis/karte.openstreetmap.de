import "./lib/external/maplibre-gl/maplibre-gl.js";
import "./lib/external/maplibre-gl-geocoder/maplibre-gl-geocoder.min.js";

import { createGeocoderControl } from "./lib/intern/osm-de-geocoder.js";

const style = {
  version: 8,
  sources: {
    "osm-german-style": {
      type: "raster",
      tiles: ["https://tile.openstreetmap.de/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution: "Kartendaten von OpenStreetMap",
    },
  },
  layers: [
    {
      id: "osm-german-style-layer",
      type: "raster",
      source: "osm-german-style",
      minzoom: 0,
      maxzoom: 22,
    },
  ],
};

const boundsGermany = [
  [5, 47],
  [16, 56],
];

const map = new maplibregl.Map({
  container: "map",
  bounds: boundsGermany,
  style: style,
  maxZoom: 20,
  minZoom: 0,
  hash: "map",
  maplibreLogo: false,
  dragRotate: false,
  touchZoomRotate: false,
  attributionControl: true,
  locale: {
    "AttributionControl.ToggleAttribution": "Urheberrecht ein-/ausblenden",
    "GeolocateControl.FindMyLocation": "Meinen Standort finden",
    "GeolocateControl.LocationNotAvailable": "Standort nicht verfügbar",
    "NavigationControl.ZoomIn": "Hineinzoomen",
    "NavigationControl.ZoomOut": "Herauszoomen",
  },
});

map.addControl(new maplibregl.NavigationControl({ showCompass: false }));

map.addControl(new maplibregl.ScaleControl());

map.addControl(new maplibregl.GeolocateControl());

createGeocoderControl().addTo("#geocoder-container");
