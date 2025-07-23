const { expect } = window.chai;
const { getByText, within, waitFor, fireEvent } = window.TestingLibraryDom;

let rootContainer;

beforeEach(() => {
  rootContainer = document.createElement("div");
  document.body.appendChild(rootContainer);
});

afterEach(() => {
  location.reload;
  document.body.removeChild(rootContainer);
  rootContainer = null;
});

function render(el) {
  rootContainer.appendChild(el);
}

export { rootContainer, expect, render, getByText, within, waitFor, fireEvent };
