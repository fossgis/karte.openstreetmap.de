/**
 * A MapLibre control for switching basemaps
 */
export class BasemapSwitcher {
  constructor(basemapConfig) {
    this._basemapConfig = basemapConfig;
    this._LAYER_PARAM_NAME = "layer";
  }

  onAdd(map) {
    this._map = map;

    // initial basemap settings
    const existingLayerIds = Object.keys(this._basemapConfig);
    const firstLayerIdInConfig = existingLayerIds[0];
    this._initialLayerId =
      this._getValidLayerIdFromUrl() || firstLayerIdInConfig;
    this._visibleId = this._initialLayerId;

    // setup html elements
    this._container = this._createTopLevelContainer();
    const basemapOptionsContainer = this._createBasemapOptionsContainer();
    const controlButton = this._createControlButton(basemapOptionsContainer);

    // append in correct order
    this._container.append(basemapOptionsContainer, controlButton);

    return this._container;
  }

  _createTopLevelContainer = () => {
    const div = document.createElement("div");
    div.classList.add("maplibregl-ctrl", "basemap-switcher-container");
    return div;
  };

  /**
   * Creates the container that holds all basemap preview images
   */
  _createBasemapOptionsContainer = () => {
    const basemapOptions = document.createElement("div");
    basemapOptions.classList.add("basemap-options-container", "hidden");

    // create clickable basemaps images
    Object.entries(this._basemapConfig).forEach(([layerId, config]) => {
      const option = this._createBasemapOption(layerId, config, basemapOptions);
      basemapOptions.appendChild(option);
    });

    // hide basemap cards, when user clicks anywhere
    document.addEventListener("pointerdown", () => {
      basemapOptions.classList.add("hidden");
    });

    // prevent hiding when user clicks on card again
    basemapOptions.addEventListener("pointerdown", (event) => {
      event.stopPropagation();
    });

    return basemapOptions;
  };

  /**
   * Creates the button that toggles the visibility of the basemap options
   */
  _createControlButton = (basemapOptions) => {
    const outerButtonDiv = document.createElement("div");

    const innerButtonDiv = document.createElement("div");
    innerButtonDiv.classList.add("maplibregl-ctrl-group");

    const btn = document.createElement("button");
    btn.type = "button";
    btn.title = "Hintergrundkarte wechseln";
    btn.addEventListener("click", (event) => {
      event.stopPropagation();
      basemapOptions.classList.toggle("hidden");
    });

    const btnContent = document.createElement("span");
    btnContent.classList.add("maplibregl-ctrl-icon", "basemap-switcher-icon");

    outerButtonDiv.appendChild(innerButtonDiv);
    innerButtonDiv.appendChild(btn);
    btn.appendChild(btnContent);

    return outerButtonDiv;
  };

  /**
   * Creates the element holding the clickable preview image of a basemap
   */
  _createBasemapOption = (layerId, config, basemapOptions) => {
    const { displayName, thumbnail } = config;

    const isVisible = layerId === this._initialLayerId;
    this._setLayerVisibility(layerId, isVisible);

    const previewImage = document.createElement("img");
    previewImage.src = `/img/basemap_thumbnails/${thumbnail}`;
    previewImage.width = "80";
    previewImage.height = "80";
    previewImage.alt = displayName;
    previewImage.classList.add("basemap-preview-image");

    // highlight image of active layer
    if (this._initialLayerId === layerId) {
      previewImage.classList.add("basemap-preview-image-selected");
    }

    // set id of basemap to image to find it later on
    previewImage.dataset.id = layerId;

    previewImage.addEventListener("click", (event) => {
      this._onBasemapOptionClick(event, basemapOptions);
    });

    const label = document.createElement("span");
    label.classList.add("basemap-label");
    label.innerHTML = displayName;

    const basemapImageContainer = document.createElement("div");
    basemapImageContainer.classList.add("basemap-image-container");

    basemapImageContainer.appendChild(previewImage);
    basemapImageContainer.appendChild(label);

    return basemapImageContainer;
  };

  /**
   * Displays selected basemap option
   */
  _onBasemapOptionClick = (event, basemapOptions) => {
    const { target: clickedImage } = event;
    const selectedLayerId = clickedImage.dataset.id;

    const visibleLayerSelected = selectedLayerId === this._visibleId;
    if (visibleLayerSelected) {
      // return, because user selected already visible basemap
      return;
    }

    const previousImage = basemapOptions.querySelector(
      `[data-id="${this._visibleId}"]`,
    );
    previousImage.classList.remove("basemap-preview-image-selected");

    clickedImage.classList.add("basemap-preview-image-selected");

    this._setLayerVisibility(selectedLayerId, true);
    this._setLayerVisibility(this._visibleId, false);

    this._setLayerIdInUrl(selectedLayerId);

    this._visibleId = selectedLayerId;
  };

  _setLayerVisibility(layerId, visible) {
    const value = visible ? "visible" : "none";
    this._map.setLayoutProperty(layerId, "visibility", value);
  }

  /**
   * Returns layer id provided in URL if it is present in the basemap config
   */
  _getValidLayerIdFromUrl() {
    const { hash } = window.location;

    // remove '#' at first character
    const queryString = hash.substring(1);

    const params = new URLSearchParams(queryString);

    const foundLayerId = params.get(this._LAYER_PARAM_NAME);

    // check if found layer id is present in basemap config
    const existingLayerIds = Object.keys(this._basemapConfig);

    if (existingLayerIds.includes(foundLayerId)) {
      return foundLayerId;
    }
  }

  /**
   * Updates layer id in URL
   */
  _setLayerIdInUrl(layerId) {
    const { hash } = window.location;

    // remove '#' at first character
    const queryString = hash.substring(1);

    const params = new URLSearchParams(queryString);
    params.set(this._LAYER_PARAM_NAME, layerId);

    let updatedHash = `#${params.toString()}`;
    // make encoded slashes "/" human readable again
    updatedHash = updatedHash.replaceAll("%2F", "/");

    window.location.hash = updatedHash;
  }

  onRemove() {
    this._container.parentNode.removeChild(this._container);
    this._map = undefined;

    // NOTE: here we could clean up listeners and variables, but this is currently not needed
  }
}
