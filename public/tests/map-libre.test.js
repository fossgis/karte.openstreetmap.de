import { expect, waitFor } from "./imports-test.js";

describe("map with default values", () => {
  it("renders the map with default values", async () => {
    const mapel = document.createElement("osmde-map-libre");
    document.body.appendChild(mapel);

    expect(mapel).to.not.be.null;
    expect(mapel.getAttribute("mapStyle")).to.be.null;
    expect(mapel.getAttribute("zoom")).to.be.null;
    expect(mapel.getAttribute("center")).to.be.null;
    expect(mapel.getAttribute("pitch")).to.be.null;
    expect(mapel.getAttribute("bearing")).to.be.null;
    expect(mapel.getAttribute("mapBounds")).to.be.null;
    expect(mapel.getAttribute("bounds")).to.be.null;
    expect(mapel.getAttribute("controls")).to.be.null;
    //mapel.setAttribute("zoom", "6");

    await waitFor(() => {
      expect(mapel.map).to.not.be.undefined;
      const style = mapel.map.getStyle();
      expect(style).to.have.property("version");
      expect(style.layers).to.be.an("array");
      expect(style.name).to.equal("versatiles-colorful");
    });

    expect(document.querySelector(".maplibregl-control-container")).to.not.be
      .null;
    expect(document.querySelector(".maplibregl-ctrl-fullscreen")).to.not.be
      .null;
    expect(document.querySelector(".maplibregl-ctrl-geolocate")).to.not.be.null;
    expect(document.querySelector(".maplibregl-ctrl-zoom-in")).to.not.be.null;
    expect(document.querySelector(".maplibregl-ctrl-zoom-out")).to.not.be.null;
    expect(document.querySelector(".maplibregl-ctrl-compass")).to.not.be.null;
    expect(document.querySelector(".maplibregl-ctrl-scale")).to.not.be.null;
    expect(document.querySelector(".maplibregl-ctrl-attrib")).to.not.be.null;

    const map = mapel.map;
    expect(map).not.to.be.undefined;

    const bounds1 = map.getBounds();
    map.fitBounds(bounds1);
    const bounds2 = map.getBounds();
    expect(bounds2._ne.lng).to.be.closeTo(bounds1._ne.lng, 1e-6);
    expect(bounds2._ne.lat).to.be.closeTo(bounds1._ne.lat, 1e-6);
    expect(bounds2._sw.lng).to.be.closeTo(bounds1._sw.lng, 1e-6);
    expect(bounds2._sw.lat).to.be.closeTo(bounds1._sw.lat, 1e-6);

    const center = map.getCenter();
    expect(center.lng).to.be.closeTo(7.01, 0.01);
    expect(center.lat).to.be.closeTo(50.01, 0.01);

    expect(map.getBearing()).to.be.closeTo(0, 0.01);
    expect(map.getPitch()).to.be.closeTo(0, 0.01);

    const zoom = map.getZoom();
    expect(zoom).not.to.be.closeTo(5.02, 0.01);
    expect(zoom).to.be.closeTo(5.01, 0.01);
  });
});
