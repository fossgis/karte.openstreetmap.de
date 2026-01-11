import "./lib/external/maplibre-gl/maplibre-gl.js";
import "./lib/external/maplibre-gl-geocoder/maplibre-gl-geocoder.min.js";

import { BasemapSwitcher } from "./lib/internal/BasemapSwitcher.js";
import { createSearchControl } from "./lib/internal/search.js";
import { setupLinkUpdate } from "./lib/internal/updateLinks.js";

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
  oepnv: {
    displayName: "ÖPNV",
    tiles: [
      "https://tile.geofabrik.de/25ab8b065d8149bd90c1876384259ebf/{z}/{x}/{y}.png",
    ],
    attribution:
      "ÖPNV Kartenstil von memomaps.de CC-BY-SA, Kartendaten © OpenStreetMap Mitwirkende",
    thumbnail: "oepnv.png",
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
  // prevent users changing pitch with keyboard shortcuts
  maxPitch: 0,
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

// on desktop: prevent keyboard rotating using "shift" + arrow keys
map.keyboard.disableRotation();

// on mobile: prevent rotation and pitch, but leave zoom
map.touchZoomRotate.disableRotation();
map.touchPitch.disable();

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

setupLinkUpdate(map);
const basemapSwitcher = new BasemapSwitcher(basemapConfig);
map.addControl(basemapSwitcher);
