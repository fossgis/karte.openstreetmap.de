/**
 * Usage:
 *  <osmde-map-libre map-style="https://pnorman.github.io/tilekiln-shortbread-demo/colorful.json" zoom="5"
 *      center="10,51" controls='[
 *      { "type": "NavigationControl", "options": {}, "position": "top-right" },
 *      { "type": "ScaleControl", "options": { "maxWidth": "100", "unit": "metric"}, "position": "bottom-left" },
 *      { "type": "FullscreenControl", "options": {}, "position": "top-left" },
 *      { "type": "GeolocateControl", "options": {}, "position": "top-left" },
 *      { "type": "AttributionControl", "options": {}, "position": "bottom-right" }
 *      ]'>
 *  </osmde-map-libre>
 */

// Helper function: parses a comma-separated string of numbers into an array of floats.
// E.g., "1.0,2.5" -> [1.0, 2.5]
const parseFloats = (value) => value.split(",").map(parseFloat);

const kebabCase = (str) =>
  str.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

const camelCase = (str) => str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());

const properties = {
  mapStyle: { option: "style" },
  zoom: { parseAttr: parseFloat },
  center: { parseAttr: parseFloats },
  pitch: { parseAttr: parseFloat },
  bearing: { parseAttr: parseFloat },
  maxBounds: { parseAttr: parseFloats },
  bounds: { setter: "fitBounds", parseAttr: parseFloats },
};

class MapLibreComponent extends HTMLElement {
  static observedAttributes = [
    ...Object.keys(properties).map(kebabCase),
    "controls",
  ];

  #properties = {};

  #controls = [];

  constructor() {
    super();

    for (let [name, { option, setter, getter }] of Object.entries(properties)) {
      option ??= name;
      setter ??= `set${option[0].toUpperCase()}${option.slice(1)}`;
      getter ??= `get${option[0].toUpperCase()}${option.slice(1)}`;

      Object.defineProperty(this, name, {
        get: function () {
          if (this.map && typeof this.map[getter] === "function") {
            return this.map[getter]();
          }
          return this.#properties[option];
        },
        set: function (value) {
          if (this.map && typeof this.map[setter] === "function") {
            this.map[setter](value);
          }
          this.#properties[option] = value;
        },
      });
    }
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

    if (properties[option]?.parseAttr) {
      this[option] = properties[option].parseAttr(newValue);
    } else {
      this[option] = newValue;
    }
  }

  async connectedCallback() {
    try {
      const container = document.createElement("div");
      container.classList.add("map");
      this.appendChild(container);

      this.map = new maplibregl.Map({
        ...this.#properties,
        hash: container,
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
      console.error("Fehler beim Initialisieren der MapLibre-Komponente:", e);
    }
  }
}

export const registerMapLibreComponent = () => {
  customElements.define("osmde-map-libre", MapLibreComponent);
};
