import { expect, getByText, getIframeDocument, iframe } from "./setup-tests.js";

describe("map default controls", () => {
  it("scale", () => {
    const doc = getIframeDocument();
    const scale = getByText(doc.body, /km/i);
    expect(scale).to.exist;
  });

  it("attribution'", () => {
    const doc = getIframeDocument();
    const attribution = getByText(doc.body, /Kartendaten von OpenStreetMap/i);
    expect(attribution).to.exist;
  });

  it("has correct bounds", () => {
    const map = iframe.contentWindow.__map__;
    const bounds = map.getBounds();

    expect(bounds.getSouth()).to.be.closeTo(47, 0.001);
    expect(bounds.getNorth()).to.be.closeTo(56, 0.001);
    expect(bounds.getWest()).to.be.closeTo(-2.406, 0.001);
    expect(bounds.getEast()).to.be.closeTo(23.406, 0.001);
  });

  it("has correct center and zoom", () => {
    const map = iframe.contentWindow.__map__;
    const center = map.getCenter();
    const zoom = map.getZoom();

    expect(center.lat).to.be.within(47, 56);
    expect(center.lng).to.be.within(5, 16);

    expect(zoom).to.be.a("number");
    expect(zoom).to.be.closeTo(5.708, 0.001);
  });
});
