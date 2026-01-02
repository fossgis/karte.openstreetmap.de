/**
 * Close dropdown menus when clicked outside of it
 */
const closeDropdown = (event) => {
  const { target } = event;

  const dropDownMenus = document.querySelectorAll(".dropdown");

  dropDownMenus.forEach((dropdown) => {
    // return if clicked on dropdonw itself
    if (dropdown.contains(target)) {
      return;
    }

    // find hidden checkbox that controls visibility and uncheck if needed
    const hiddenCheckbox = dropdown.getElementsByTagName("input")[0];
    if (hiddenCheckbox) hiddenCheckbox.checked = false;
  });
};

// activate listener
document.addEventListener("click", closeDropdown);
