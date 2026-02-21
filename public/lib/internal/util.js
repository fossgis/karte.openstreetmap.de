const getParams = () => {
  const { hash } = window.location;

  // remove '#' at first character
  const queryString = hash.substring(1);

  return new URLSearchParams(queryString);
};

const setUrlParam = (key, value) => {
  const params = getParams();
  params.set(key, value);

  let updatedHash = `#${params.toString()}`;
  // make encoded slashes "/" human readable again
  updatedHash = updatedHash.replaceAll("%2F", "/");

  window.location.hash = updatedHash;
};

const getUrlParam = (key) => {
  const params = getParams();
  return params.get(key);
};

export { setUrlParam, getUrlParam };
