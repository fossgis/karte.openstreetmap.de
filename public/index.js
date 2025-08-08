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
  maplibreLogo: false,
  dragRotate: false,
  touchZoomRotate: false,
  attributionControl: {
    compact: false,
  },
});

map.addControl(new maplibregl.ScaleControl({}));

// geolocate start
const geolocate = new maplibregl.GeolocateControl({
  positionOptions: {
    enableHighAccuracy: true,
    timeout: 6000,
  },
  showUserLocation: false,
  showAccuracyCircle: false,
});

map.addControl(geolocate, "top-left");

geolocate.on("error", (e) => {
  console.error("Fehler bei Standortermittlung:", e);
});

map.on("load", () => {
  const geolocateBtn = document.querySelector(".maplibregl-ctrl-geolocate");
  if (geolocateBtn) {
    geolocateBtn.title = "Wo bin ich?";
  }
});

geolocate.on("geolocate", (e) => {
  const { latitude, longitude } = e.coords;
  const circleId = "temp-circle";

  const circleGeoJSON = createCircle([longitude, latitude], 20);

  if (map.getSource(circleId)) map.removeSource(circleId);
  map.addSource(circleId, {
    type: "geojson",
    data: circleGeoJSON,
  });

  if (map.getLayer(circleId)) map.removeLayer(circleId);
  map.addLayer({
    id: circleId,
    type: "fill",
    source: circleId,
    paint: {
      "fill-color": "#7ebc6f",
      "fill-opacity": 1.0,
    },
  });
  if (map.getLayer(`${circleId}_outline`))
    map.removeLayer(`${circleId}_outline`);
  map.addLayer({
    id: `${circleId}_outline`,
    type: "line",
    source: circleId,
    paint: {
      "line-color": "#ffffff",
      "line-width": 2.5,
    },
  });

  map.flyTo({ center: [longitude, latitude], zoom: 14 });

  setTimeout(() => {
    if (map.getLayer(circleId)) map.removeLayer(circleId);
    if (map.getLayer(`${circleId}_outline`))
      map.removeLayer(`${circleId}_outline`);
  }, 15000);
  setTimeout(() => {
    if (map.getSource(circleId)) map.removeSource(circleId);
  }, 20000);
});

function createCircle(center, radiusInMeters, points = 64) {
  const coords = [];
  const earth = 6371000; // Erdradius in m
  const lat = (center[1] * Math.PI) / 180;
  const lon = (center[0] * Math.PI) / 180;

  for (let i = 0; i <= points; i++) {
    const angle = (i / points) * 2 * Math.PI;
    const dx = radiusInMeters * Math.cos(angle);
    const dy = radiusInMeters * Math.sin(angle);

    const latOffset = dy / earth;
    const lonOffset = dx / (earth * Math.cos(lat));

    const pointLat = ((lat + latOffset) * 180) / Math.PI;
    const pointLon = ((lon + lonOffset) * 180) / Math.PI;

    coords.push([pointLon, pointLat]);
  }

  return {
    type: "Feature",
    geometry: {
      type: "Polygon",
      coordinates: [coords],
    },
  };
}
// geolocate end
