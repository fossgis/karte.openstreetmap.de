import { html } from "../../lib/js/html.js";

/**
 * Usage:
 * This only works with osmde-map-libre Webcomponent
 * <osmde-geocoder-router></osmde-geocoder-router>
 */
class GeocoderRouterComponent extends HTMLElement {
  connectedCallback() {
    setTimeout(() => {
      const mapLibreElement = document.querySelector("osmde-map-libre");
      if (!mapLibreElement?.map) {
        console.error("MapLibre map instance not found");
        return;
      }

      const geocoderRouter = {
        onAdd(_map) {
          // Container für das Control
          this._container = document.createElement("div");
          this._container.className =
            "maplibregl-ctrl maplibregl-ctrl-group geocoder-container"; // CSS-Klasse hinzugefügt

          // Barrierefreies Formular
          this._container.innerHTML = `
                        <form id="geocoderForm" aria-labelledby="geocoderLabel">
                            <label id="geocoderLabel" for="geocoderInput">
                                Ziel eingeben:
                            </label>
                            <input type="text" id="geocoderInput" name="geocoderInput"
                                   aria-required="true" />
                            <button type="submit"
                                    aria-label="Eingegebenen Text anzeigen">
                                Anzeigen
                            </button>
                        </form>
                        <div id="geocoderOutput" role="region" aria-live="polite"></div>
                    `;

          // Eventlistener für das Formular
          this._container
            .querySelector("#geocoderForm")
            .addEventListener("submit", (event) => {
              event.preventDefault();
              const value =
                this._container.querySelector("#geocoderInput").value;
              const output = this._container.querySelector("#geocoderOutput");
              output.textContent = html`Eingegebener Text: ${value}`;
            });

          return this._container;
        },
        onRemove() {
          this._container.parentNode.removeChild(this._container);
        },
      };

      mapLibreElement.map.addControl(geocoderRouter, "top-right");
    }, 0);
  }
}

export const registerGeocoderRouterComponent = () => {
  customElements.define("osmde-geocoder-router", GeocoderRouterComponent);
};
