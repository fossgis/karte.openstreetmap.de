import "./lib/maplibre-gl/maplibre-gl.js";

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

new maplibregl.Map({
  container: "map",
  bounds: boundsGermany,
  style: style,
  maplibreLogo: false,
  dragRotate: false,
  touchZoomRotate: false,
  attributionControl: {
    compact: false,
  },
});
