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
  attributionControl: {
    compact: false,
  },
});

map.addControl(new maplibregl.ScaleControl({}));

// geolocate start
const geolocate = new maplibregl.GeolocateControl({});

map.addControl(geolocate, "top-left");

geolocate.on("error", (e) => {
  const msg = "Die Standortermittlung ist deaktiviert oder nicht möglich.";
  showNotice(msg);
  console.error("Geolocation error:", e);
});

map.on("load", () => {
  const geolocateBtn = document.querySelector(".maplibregl-ctrl-geolocate");
  if (geolocateBtn) {
    geolocateBtn.title = "Standort anzeigen";

    let circleVisible = false;

    geolocateBtn.addEventListener("click", () => {
      circleVisible = !circleVisible;

      if (circleVisible) {
        geolocateBtn.title = "Standort ausblenden";
      } else {
        geolocateBtn.title = "Standort anzeigen";
      }

      const accuracyCircle = document.querySelector(
        ".maplibregl-user-location-accuracy-circle",
      );
      if (accuracyCircle) {
        accuracyCircle.style.visibility = circleVisible ? "visible" : "hidden";
      }
      const locationDot = document.querySelector(
        ".maplibregl-user-location-dot",
      );
      if (locationDot) {
        locationDot.style.visibility = circleVisible ? "visible" : "hidden";
      }
    });
  }
});
// geolocate end

// notice start
function showNotice(text) {
  const oldNotice = document.getElementById("notice");
  if (oldNotice) oldNotice.remove();

  const notice = document.createElement("div");
  notice.id = "notice";
  notice.setAttribute("role", "alert");

  notice.innerHTML = `
    <div class="notice-content">
      <p>${text}</p>
      <button id="dismiss" aria-label="Hinweis schließen">OK</button>
    </div>
  `;

  document.body.appendChild(notice);

  document.getElementById("dismiss").focus();
  document.getElementById("dismiss").addEventListener("click", () => {
    notice.remove();
  });
}
// notice end
