const defaultLanguage = "de";
const countDisplayedResults = 7;
const photonBaseUrl = "https://photon.komoot.io/";
const forwardGeocodeUrl = `${photonBaseUrl}/api`;

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
 * Request Photon forward geocode API
 */
const requestPhotonForwardGeocode = async (searchParams) => {
  const { q, lang, limit, lat, lon } = searchParams;
  const url = new URL(forwardGeocodeUrl);

  const params = url.searchParams;

  params.append("q", q);
  params.append("lang", lang);
  params.append("limit", limit);

  const validLatLon = !!lat && !!lon;
  if (validLatLon) {
    params.append("lat", lat);
    params.append("lon", lon);
  }

  return fetch(url);
};

/**
 * Convert Photon API response to Carmen GeoJSON for display
 */
const processPhotonResponse = (response) => {
  if (!response.ok) {
    throw new Error(
      `Photon request failed with status ${response.status}: ${response.statusText}`,
    );
  }
  return response.json().then((geojson) => {
    const { type, features } = geojson;

    // sanity check of received GeoJSON
    const responseValid =
      type === "FeatureCollection" && Array.isArray(features);
    if (responseValid === false) {
      throw new Error("Response from Photon is invalid:", geojson);
    }

    // convert Photon features to Carmen features
    const resultFeatures = features.map((photonFeature) => {
      const { geometry, properties } = photonFeature;
      const { extent, name } = properties;

      const displayText = displayTextFromPhoton(properties);

      return {
        type: "Feature",
        geometry: geometry,

        place_name: displayText, // text shown in search results
        text: name, // text shown in searchbar after selection

        place_type: ["place"],
        bbox: extent,
      };
    });

    return {
      type: "FeatureCollection",
      features: resultFeatures,
    };
  });
};

/**
 * Callback when user adds text to search input
 */
const forwardGeocode = (config) => {
  const { query, proximity, limit, language } = config;
  const [longitude, latitude] = proximity || [];

  const url = new URL(forwardGeocodeUrl);

  const params = url.searchParams;

  params.append("q", query);
  params.append("lang", language);
  params.append("limit", limit);

  const validLatLon = !!latitude && !!longitude;
  if (validLatLon) {
    params.append("lat", latitude);
    params.append("lon", longitude);
  }

  return fetch(url).then(processPhotonResponse);
};

export function createSearchControl(mapInstance) {
  const geocoderApi = {
    forwardGeocode: forwardGeocode,
  };

  const options = {
    maplibregl: mapInstance,
    limit: countDisplayedResults,
    language: defaultLanguage,
    collapsed: true,

    // needed for autocomplete
    showResultsWhileTyping: true,

    // this must be set to false to avoid unwanted behaviour
    // see: https://github.com/maplibre/maplibre-gl-geocoder/issues/287
    showResultMarkers: false,
  };
  return new MaplibreGeocoder(geocoderApi, options);
}
