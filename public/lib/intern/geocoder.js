export function createGeocoderControl(map) {
  const geocoderApi = {
    forwardGeocode: async (config) => {
      const features = [];
      const params = new URLSearchParams({
        q: config.query,
        format: "geojson",
        "accept-language": config.language,
      });
      try {
        const request = `https://nominatim.openstreetmap.org/search?${params.toString()}`;
        const response = await fetch(request);
        const geojson = await response.json();
        for (const feature of geojson.features) {
          const center = [
            feature.geometry.coordinates[0],
            feature.geometry.coordinates[1],
          ];
          const point = {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: center,
            },
            place_name: feature.properties.display_name,
            properties: feature.properties,
            text: feature.properties.display_name,
            place_type: ["place"],
            center,
          };
          features.push(point);
        }
      } catch (e) {
        console.error(`Failed to forwardGeocode with error: ${e}`);
      }

      return { features };
    },
  };

  const geocoder = new MaplibreGeocoder(geocoderApi, {
    maplibregl,
    language: "de",
    showResultMarkers: false,
  });

  geocoder._map = map;

  return geocoder;
}
