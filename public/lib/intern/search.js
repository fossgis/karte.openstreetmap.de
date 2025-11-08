const defaultLanguage = "de";
const countDispayedResults = 7;

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
 * Util to request Photon API
 */
const requestPhoton = async (searchParams) => {
  const { q, lang, limit, lat, lon } = searchParams;
  const url = new URL("https://photon.komoot.io/api/");

  const params = url.searchParams

  params.append("q", q);
  params.append("lang", lang);
  params.append("limit", limit);

  validLatLon = !!lat && !!lon
  if (validLatLon) {
    params.append("lat", lat);
    params.append("lon", lon);
  }

  return fetch(url).then((response) => response.json());
};

const forwardGeocode = (config) => {
  const { query, proximity } = config;

  const [longitude, latitude] = proximity || []

  const photonParams = {
    q: query,
    lang: defaultLanguage,
    limit: countDispayedResults,
    lon: longitude,
    lat: latitude,
  };

  return requestPhoton(photonParams).then((geojson) => {
    const features = geojson.features;

    const resultFeatures = features.map((feature) => {
      const center = feature.geometry.coordinates;

      const properties = feature.properties;
      const displayText = displayTextFromPhoton(properties);
      const extent = properties.extent;

      const resultFeature = {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: center,
        },
        properties: properties,

        // TODO: check what text is really needed
        place_name: displayText,
        text: displayText,

        place_type: ["place"],
        bbox: extent,
      };

      return resultFeature;
    });

    return {
      type: "FeatureCollection",
      features: resultFeatures,
    };
  });
};

export function geocoder(mapInstance) {
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
