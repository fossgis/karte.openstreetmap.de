const { expect } = window.chai;
const { getByText, within, waitFor, fireEvent } = window.TestingLibraryDom;

let rootContainer;
let iframe;

beforeEach(async () => {
  rootContainer = document.createElement("div");
  document.body.appendChild(rootContainer);

  iframe = document.createElement("iframe");
  iframe.src = "http://127.0.0.1:8000/?tests=1";
  iframe.style.width = "1920px";
  iframe.style.height = "1080px";
  rootContainer.appendChild(iframe);

  await new Promise((resolve) => {
    iframe.onload = () => resolve();
  });
});

afterEach(() => {
  document.body.removeChild(rootContainer);
  rootContainer = null;
  iframe = null;
});

function getIframeDocument() {
  return iframe.contentDocument || iframe.contentWindow.document;
}

export {
  rootContainer,
  iframe,
  getIframeDocument,
  expect,
  getByText,
  within,
  waitFor,
  fireEvent,
};
