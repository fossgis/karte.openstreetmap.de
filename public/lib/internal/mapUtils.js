import { getUrlParam, removeUrlParam, setUrlParam } from "./util.js";

/**
 * Updates clickable links
 *
 * Replaces placeholders "ZOOM", "LATITUDE", "LONGITUDE"
 * with their respective values of the current map extent
 *
 * @param mapLibreMap The maplibre map
 */
const setupLinkUpdate = (mapLibreMap) => {
  const LINK_TEMPLATE_KEY = "data-link-template";

  const linksToUpdate = document.querySelectorAll(`a[${LINK_TEMPLATE_KEY}]`);

  // loop through links and update them
  const updateLinks = () => {
    linksToUpdate.forEach((linkElement) => {
      // get current map state
      const zoom = Math.round(mapLibreMap.getZoom());
      const center = mapLibreMap.getCenter();
      const longitude = center.lng.toFixed(6);
      const latitude = center.lat.toFixed(6);

      // adjust link
      const linkTemplate = linkElement.getAttribute(LINK_TEMPLATE_KEY);
      const updatedLink = linkTemplate
        .replace("ZOOM", zoom)
        .replace("LATITUDE", latitude)
        .replace("LONGITUDE", longitude);

      linkElement.href = updatedLink;
    });
  };

  // update links initially
  updateLinks();

  // update links when map moves
  mapLibreMap.on("moveend", () => {
    updateLinks();
  });
};

/**
 * Updates the permalink when globe projection is activated.
 *
 * @param mapLibreMap The maplibre map
 */
const setGlobePermalinkUpdate = (mapLibreMap) => {
  const GLOBE_PROJECTION = "globe";
  const PROJECTION_URL_PARAM = "projection";

  // set map projection from permalink
  mapLibreMap.on("style.load", () => {
    const projection = getUrlParam(PROJECTION_URL_PARAM);
    if (projection === GLOBE_PROJECTION) {
      mapLibreMap.setProjection({
        type: projection,
      });
    }
  });

  // listen on projection change after map is loaded
  mapLibreMap.on("load", () => {
    mapLibreMap.on("projectiontransition", (event) => {
      const { newProjection } = event;
      if (newProjection === GLOBE_PROJECTION) {
        setUrlParam(PROJECTION_URL_PARAM, newProjection);
      } else {
        removeUrlParam(PROJECTION_URL_PARAM);
      }
    });
  });
};

export { setupLinkUpdate, setGlobePermalinkUpdate };
