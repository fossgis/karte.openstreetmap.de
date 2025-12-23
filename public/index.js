import "./lib/external/maplibre-gl/maplibre-gl.js";
import "./lib/external/maplibre-gl-geocoder/maplibre-gl-geocoder.min.js";

import { BasemapSwitcher } from "./lib/internal/BasemapSwitcher.js";
import { createSearchControl } from "./lib/internal/search.js";

const basemapConfig = {
  de: {
    displayName: "deutscher Stil",
    tiles: ["https://tile.openstreetmap.de/{z}/{x}/{y}.png"],
    attribution: "Kartendaten © OpenStreetMap Mitwirkende",
    thumbnail: "osmde.png",
  },
  standard: {
    displayName: "Standard",
    tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
    attribution: "Kartendaten © OpenStreetMap Mitwirkende",
    thumbnail: "osmorg.png",
  },
  cyclosm: {
    displayName: "CyclOSM",
    tiles: ["https://c.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png"],
    attribution: `Kartendaten © OpenStreetMap Mitwirkende. Stil von <a href="https://www.cyclosm.org" target="_blank">CyclOSM</a> gehostet von <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>`,
    thumbnail: "cycle.png",
  },
};

const boundsGermany = [
  [5, 47],
  [16, 56],
];

const map = new maplibregl.Map({
  container: "map",
  bounds: boundsGermany,
  hash: "map",
  maplibreLogo: false,
  dragRotate: false,
  touchZoomRotate: false,
  attributionControl: true,
  maxZoom: 19,
  locale: {
    "AttributionControl.ToggleAttribution": "Quellenangabe ein-/ausblenden",
    "GeolocateControl.FindMyLocation": "Meinen Standort finden",
    "GeolocateControl.LocationNotAvailable": "Standort nicht verfügbar",
    "NavigationControl.ZoomIn": "Hineinzoomen",
    "NavigationControl.ZoomOut": "Herauszoomen",
  },
});

// set basemaps
Object.entries(basemapConfig).forEach(([id, config]) => {
  const { tiles, attribution } = config;
  map.addSource(id, {
    type: "raster",
    tileSize: 256,
    attribution,
    tiles,
  });
  map.addLayer({ id, source: id, type: "raster" });
});
map.addControl(createSearchControl(maplibregl));

map.addControl(new maplibregl.NavigationControl({ showCompass: false }));

map.addControl(new maplibregl.ScaleControl(), "bottom-right");

map.addControl(new maplibregl.GeolocateControl());

const basemapSwitcher = new BasemapSwitcher(basemapConfig);
map.addControl(basemapSwitcher);
