import "./lib/external/maplibre-gl/maplibre-gl.js";

const style = {
  version: 8,
  sources: {
    "osm-german-style": {
      type: "raster",
      tiles: ["https://tile.openstreetmap.de/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution: "Kartendaten © OpenStreetMap Mitwirkende",
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
  attributionControl: true,
  locale: {
    "AttributionControl.ToggleAttribution": "Quellenangabe ein-/ausblenden",
    "GeolocateControl.FindMyLocation": "Meinen Standort finden",
    "GeolocateControl.LocationNotAvailable": "Standort nicht verfügbar",
    "NavigationControl.ZoomIn": "Hineinzoomen",
    "NavigationControl.ZoomOut": "Herauszoomen",
  },
});

map.addControl(new maplibregl.NavigationControl({ showCompass: false }));

map.addControl(new maplibregl.ScaleControl());

map.addControl(new maplibregl.GeolocateControl());

// set Url for adding OSM Note
const setUrl = () => {
  const center = map.getCenter();
  console.log(center);
  const longitude = center.lng;
  const latitude = center.lat;
  const zoom = map.getZoom();
  const link = document.getElementById("leave-note");
  link.href = `https://www.openstreetmap.org/note/new#map=${zoom}/${latitude}/${longitude}`;
};

// set url initially, before map has moved
setUrl();

// update link when map moves
map.on("moveend", setUrl);
