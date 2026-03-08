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
  const GLOBE_URL_KEY = "globe";
  const GLOBE_URL_VALID_VALUE = "1";

  // when website initially loads, set globe projection if set in permalink
  if (GLOBE_URL_VALID_VALUE === getUrlParam(GLOBE_URL_KEY)) {
    mapLibreMap.setProjection({ type: GLOBE_PROJECTION });
  }

  mapLibreMap.on("projectiontransition", (event) => {
    const { newProjection } = event;
    if (newProjection === GLOBE_PROJECTION) {
      setUrlParam(GLOBE_URL_KEY, GLOBE_URL_VALID_VALUE);
    } else {
      // no URL param when project is web mercator
      removeUrlParam(GLOBE_URL_KEY);
    }
  });
};

export { setupLinkUpdate, setGlobePermalinkUpdate };
