import { registerMapLibreComponent } from "../components/map-libre/map-libre.js";

const app = () => {
  registerMapLibreComponent();
  mocha.run();
};

document.addEventListener("DOMContentLoaded", app);
