/**
 * Usage:
 *  <osmde-map-libre map-style="https://pnorman.github.io/tilekiln-shortbread-demo/colorful.json" zoom="5"
 *      center="10,51" bounds="5, 47,16, 56" controls='[
 *      { "type": "NavigationControl", "options": {}, "position": "top-right" },
 *      { "type": "ScaleControl", "options": { "maxWidth": "100", "unit": "metric"}, "position": "bottom-left" },
 *      { "type": "FullscreenControl", "options": {}, "position": "top-left" },
 *      { "type": "GeolocateControl", "options": {}, "position": "top-left" },
 *      { "type": "AttributionControl", "options": {}, "position": "bottom-right" }
 *      ]'>
 *  </osmde-map-libre>
 * 
 * map-style='{"version":8,"sources":{"osm-german-style":{"type":"raster","tiles":["https://tile.openstreetmap.de/{z}/{x}/{y}.png"],"tileSize":256,"attribution":"Kartendaten von OpenStreetMap"}},"layers":[{"id":"osm-german-style-layer","type":"raster","source":"osm-german-style","minzoom":0,"maxzoom":22}]}'
 zoom="5"
 */

// https://vector.openstreetmap.org/demo/shortbread/colorful.json

// Helper function: parses a comma-separated string of numbers into an array of floats.
// E.g., "1.0,2.5" -> [1.0, 2.5]
const parseFloats = (value) => value.split(",").map(parseFloat);

const kebabCase = (str) =>
  str.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

const camelCase = (str) => str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());

const properties = {
  mapStyle: {
    option: "style",
    default: "https://pnorman.github.io/tilekiln-shortbread-demo/colorful.json",
  },
  zoom: { parseAttr: parseFloat, default: "5" },
  center: { parseAttr: parseFloats, default: "7,50" },
  pitch: { parseAttr: parseFloat, default: 0 },
  bearing: { parseAttr: parseFloat, default: 0 },
  maxBounds: { parseAttr: parseFloats, default: null },
  bounds: {
    setter: "fitBounds",
    parseAttr: parseFloats,
    default: null,
  },
};

class MapLibreComponent extends HTMLElement {
  static observedAttributes = [
    ...Object.keys(properties).map(kebabCase),
    "controls",
  ];

  #properties = {};

  #controls = [
    { type: "NavigationControl", options: {}, position: "top-right" },
    {
      type: "ScaleControl",
      options: { maxWidth: "100", unit: "metric" },
      position: "bottom-left",
    },
    { type: "FullscreenControl", options: {}, position: "top-left" },
    { type: "GeolocateControl", options: {}, position: "top-left" },
    { type: "AttributionControl", options: {compact: false}, position: "bottom-right" },
  ];

  // Getter und Setter für mapStyle (style)
  get mapStyle() {
    if (this.map && typeof this.map.getStyle === "function") {
      return this.map.getStyle();
    }
    return this.#properties.style;
  }

  set mapStyle(value) {
    if (this.map && typeof this.map.setStyle === "function") {
      this.map.setStyle(value);
    }
    this.#properties.style = value;
  }

  get zoom() {
    if (this.map && typeof this.map.getZoom === "function") {
      return this.map.getZoom();
    }
    return this.#properties.zoom;
  }

  set zoom(value) {
    if (this.map && typeof this.map.setZoom === "function") {
      this.map.setZoom(value);
    }
    this.#properties.zoom = value;
  }

  get center() {
    if (this.map && typeof this.map.getCenter === "function") {
      return this.map.getCenter();
    }
    return this.#properties.center;
  }

  set center(value) {
    if (this.map && typeof this.map.setCenter === "function") {
      this.map.setCenter(value);
    }
    this.#properties.center = value;
  }

  get pitch() {
    if (this.map && typeof this.map.getPitch === "function") {
      return this.map.getPitch();
    }
    return this.#properties.pitch;
  }

  set pitch(value) {
    if (this.map && typeof this.map.setPitch === "function") {
      this.map.setPitch(value);
    }
    this.#properties.pitch = value;
  }

  get bearing() {
    if (this.map && typeof this.map.getBearing === "function") {
      return this.map.getBearing();
    }
    return this.#properties.bearing;
  }

  set bearing(value) {
    if (this.map && typeof this.map.setBearing === "function") {
      this.map.setBearing(value);
    }
    this.#properties.bearing = value;
  }

  get maxBounds() {
    if (this.map && typeof this.map.getMaxBounds === "function") {
      return this.map.getMaxBounds();
    }
    return this.#properties.maxBounds;
  }

  set maxBounds(value) {
    if (this.map && typeof this.map.setMaxBounds === "function") {
      this.map.setMaxBounds(value);
    }
    this.#properties.maxBounds = value;
  }

  get bounds() {
    return this.#properties.bounds;
  }

  set bounds(value) {
    if (this.map && typeof this.map.fitBounds === "function") {
      this.map.fitBounds(value);
    }
    this.#properties.bounds = value;
  }

  attributeChangedCallback(name, _oldValue, newValue) {
    const option = camelCase(name);

    if (option === "controls") {
      try {
        this.#controls = JSON.parse(newValue);
      } catch (_e) {
        console.warn("Invalid controls JSON:", newValue);
      }
      return;
    }

    const prop = properties[option];
    if (!prop) return;

    let parsed = newValue;

    if (
      prop.parseAttr &&
      !(
        option === "mapStyle" &&
        typeof newValue === "string" &&
        !newValue.trim().startsWith("{")
      )
    ) {
      parsed = prop.parseAttr(newValue);
    }

    this[option] = parsed;
  }

  async connectedCallback() {
    for (const [name, prop] of Object.entries(properties)) {
      const attrName = kebabCase(name);

      if (
        !this.hasAttribute(attrName) &&
        prop.default !== undefined &&
        prop.default !== null
      ) {
        const defaultValue =
          prop.parseAttr &&
          !(
            name === "mapStyle" &&
            typeof prop.default === "string" &&
            !prop.default.trim().startsWith("{")
          )
            ? prop.parseAttr(prop.default)
            : prop.default;

        this[name] = defaultValue;
      }
    }

    try {
      const container = document.createElement("div");
      container.classList.add("map");
      this.appendChild(container);

      this.map = new maplibregl.Map({
        ...this.#properties,
        hash: container,
        attributionControl: false,
        container,
      });

      this.map.dragRotate.disable();
      this.map.touchZoomRotate.disableRotation();

      for (const { type, options, position } of this.#controls) {
        let control = type;
        if (
          typeof type === "string" &&
          type.endsWith("Control") &&
          type in maplibregl
        ) {
          control = new maplibregl[type](options);
        }
        if (control) this.map.addControl(control, position);
      }
    } catch (e) {
      console.error("Error:", e);
    }
  }
}

export const registerMapLibreComponent = () => {
  customElements.define("osmde-map-libre", MapLibreComponent);
};
