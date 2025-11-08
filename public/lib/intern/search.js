const defaultLanguage = "de";
const countDisplayedResults = 7;
const photonBaseUrl = "https://photon.komoot.io/api/";

/**
 * Convert Photon response to text string
 */
const displayTextFromPhoton = (properties) => {
  const {
    name,
    street,
    housenumber,
    postcode,
    city,
    district,
    state,
    country,
    locality,
  } = properties;

  // combine street and housenumber with whitespace
  const streetHousenumber = [street, housenumber].filter(Boolean).join(" ");

  const addressParts = [
    name,
    locality,
    streetHousenumber,
    district,
    postcode,
    city,
    state,
    country,
  ];

  // remove empty parts and concatenate rest with comma
  return addressParts.filter(Boolean).join(", ");
};

/**
 * Helper function to request Photon API
 */
const requestPhoton = async (searchParams) => {

  const { q, lang, limit, lat, lon } = searchParams;
  const url = new URL(photonBaseUrl);

  const params = url.searchParams;  

  params.append("q", q);
  params.append("lang", lang);
  params.append("limit", limit);

  const validLatLon = !!lat && !!lon;
  if (validLatLon) {
    params.append("lat", lat);
    params.append("lon", lon);
  }  

  return fetch(url).then((response) => response.json());
};

/**
 * Convert Photon response to required format
 */
const processPhotonResponse = (geojson) => {
  // convert Photon features to Carmen features
  const resultFeatures = geojson.features.map((photonFeature) => {
    const center = photonFeature.geometry.coordinates;

    const properties = photonFeature.properties;
    const displayText = displayTextFromPhoton(properties);
    const extent = properties.extent;

    return {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: center,
      },
      properties: properties, // TODO: needed ?

      // TODO: check what text is really needed
      place_name: displayText,
      text: displayText,

      place_type: ["place"],
      bbox: extent,
    };
  });

  return {
    type: "FeatureCollection",
    features: resultFeatures,
  };
};

/**
 * Callback when user interacts with search input
 */
const forwardGeocode = (config) => {
  const { query, proximity } = config;

  const [longitude, latitude] = proximity || [];

  const photonParams = {
    q: query,
    lang: defaultLanguage,
    limit: countDisplayedResults,
    lon: longitude,
    lat: latitude,
  };
  
  return requestPhoton(photonParams).then(processPhotonResponse);
};

export function createSearchControl(mapInstance) {
  const geocoderApi = {
    forwardGeocode: forwardGeocode,
  };

  const options = {
    maplibregl: mapInstance,

    // needed for autocomplete
    showResultsWhileTyping: true,

    // this must be set to false to avoid unwanted behaviour
    // see: https://github.com/maplibre/maplibre-gl-geocoder/issues/287
    showResultMarkers: false,
  };
  return new MaplibreGeocoder(geocoderApi, options);
}
