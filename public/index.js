import "./lib/external/maplibre-gl/maplibre-gl.js";

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
  hash: "map",
  maplibreLogo: false,
  dragRotate: false,
  touchZoomRotate: false,
  attributionControl: false,
});

// attributionControl start
let attributionControl;
let isCompact = null;

function updateAttributionControl() {
  const shouldBeCompact = window.innerWidth <= 640;

  if (shouldBeCompact !== isCompact) {
    if (attributionControl) {
      map.removeControl(attributionControl);
    }

    attributionControl = new maplibregl.AttributionControl({
      compact: shouldBeCompact,
    });

    map.addControl(attributionControl, "bottom-right");

    isCompact = shouldBeCompact;
  }
}

updateAttributionControl();

window.addEventListener("resize", updateAttributionControl);
// attributionControl end

map.addControl(new maplibregl.ScaleControl());
