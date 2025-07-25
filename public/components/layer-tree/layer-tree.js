/**
 * Usage:
 * This only works with osmde-map-libre Webcomponent
 * <osmde-layer-tree baselayers='[
 *   { "name": "maplibre demotiles", "type": "vector", "url": "https://demotiles.maplibre.org/style.json" },
 *   { "name": "osm raster", "type": "raster", "url": "https://tile.openstreetmap.org/{z}/{x}/{y}.png" },
 *   { "name": "satellit", "type": "raster", "url": "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" },
 *   { "name": "osm vector", "type": "vector", "url": "https://pnorman.github.io/tilekiln-shortbread-demo/colorful.json" }
 *   ]'>
 * </osmde-layer-tree>
 */
class LayerTreeComponent extends HTMLElement {
  connectedCallback() {
    setTimeout(() => {
      const mapLibreElement = document.querySelector("osmde-map-libre");
      if (!mapLibreElement?.map) {
        console.error("MapLibre map instance not found");
        return;
      }

      let baselayers = [];
      const baselayersAttr = this.getAttribute("baselayers");
      if (baselayersAttr) {
        try {
          baselayers = JSON.parse(baselayersAttr);
        } catch (error) {
          console.error("Invalid JSON in baselayers attribute", error);
        }
      }

      if (!baselayers.length) {
        console.warn("No baselayers provided.");
        return;
      }

      const layerTree = {
        onAdd(map) {
          this._map = map;

          this._container = document.createElement("div");
          this._container.className =
            "maplibregl-ctrl maplibregl-ctrl-group layer-tree-container";

          const heading = document.createElement("h2");
          heading.className = "visually-hidden";
          heading.innerText = "Layer Tree";
          this._container.appendChild(heading);

          const ul = document.createElement("ul");
          ul.className = "layer-tree-list";

          baselayers.forEach((layer) => {
            const li = document.createElement("li");
            const spanButton = document.createElement("span");

            spanButton.setAttribute("role", "button");
            spanButton.setAttribute("tabindex", "0");
            spanButton.setAttribute("aria-label", `Map style: ${layer.name}`);
            spanButton.className = "layer-tree-button";
            spanButton.innerText = layer.name;

            spanButton.addEventListener("click", () => {
              if (layer.type === "vector") {
                this._map.setStyle(layer.url);
              }
              if (layer.type === "raster") {
                this._map.setStyle({ version: 8, sources: {}, layers: [] });
                this._map.addSource(layer.name, {
                  type: "raster",
                  tiles: [layer.url],
                });
                this._map.addLayer({
                  id: layer.name,
                  source: layer.name,
                  type: "raster",
                });
              }
            });

            spanButton.addEventListener("keydown", (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                spanButton.click();
              }
            });

            li.appendChild(spanButton);
            ul.appendChild(li);
          });

          this._container.appendChild(ul);

          return this._container;
        },
        onRemove() {
          this._container.parentNode.removeChild(this._container);
          this._map = undefined;
        },
      };

      mapLibreElement.map.addControl(layerTree, "top-right");
    }, 0);
  }
}

export const registerLayerTreeComponent = () => {
  customElements.define("osmde-layer-tree", LayerTreeComponent);
};
