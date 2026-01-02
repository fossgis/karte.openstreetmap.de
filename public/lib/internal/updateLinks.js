/**
 * Updates links with current map location
 *
 * @param mapLibreMap The maplibre map
 */
const setupLinkUpdate = (mapLibreMap) => {
  // the key of the attribute storing the template of the link
  const TEMPLATE_KEY = "data-link-template";

  // find all "a" elements containing "data-link-template" attribute
  const linkElements = document.querySelectorAll(`a[${TEMPLATE_KEY}]`);

  // loop through links and update them
  const updateLinks = () => {
    linkElements.forEach((linkElement) => {
      // get rounded zoom
      const zoom = Math.round(mapLibreMap.getZoom());

      // get latitude and longitude with maximum 6 digits after comma
      const center = mapLibreMap.getCenter();
      const longitude = center.lng.toFixed(6);
      const latitude = center.lat.toFixed(6);

      // get link template stored as attribute
      const linkTemplate = linkElement.getAttribute(TEMPLATE_KEY);

      // replace template with zoom and center
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
