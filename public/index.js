import "./lib/js/maplibre-gl.js";
import { registerGeocoderRouterComponent } from "./components/geocoder-router/geocoder-router.js";
import { registerLayerTreeComponent } from "./components/layer-tree/layer-tree.js";
import { registerMapLibreComponent } from "./components/map-libre/map-libre.js";

const app = async () => {
  registerMapLibreComponent();
  registerLayerTreeComponent();
  registerGeocoderRouterComponent();
};

document.addEventListener("DOMContentLoaded", app);
