/**
 * Updates clickable links in HTML with current map location
 *
 * @param mapLibreMap The maplibre map
 */
const setupLinkUpdate = (mapLibreMap) => {
  const LINK_TEMPLATE_KEY = "data-link-template";

  // find links that shall be updated
  const linkElements = document.querySelectorAll(`a[${LINK_TEMPLATE_KEY}]`);

  // loop through links and update them
  const updateLinks = () => {
    linkElements.forEach((linkElement) => {
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

export { setupLinkUpdate };
