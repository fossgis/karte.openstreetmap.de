import "./lib/external/maplibre-gl/maplibre-gl.js";
import { registerLayerTreeComponent } from "./components/layer-tree/layer-tree.js";
import { registerMapLibreComponent } from "./components/map-libre/map-libre.js";

const app = async () => {
  registerMapLibreComponent();
  registerLayerTreeComponent();
};

document.addEventListener("DOMContentLoaded", app);
