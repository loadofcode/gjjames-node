function searchFilters() {
  let newHash;
  const baseUrl =
    process.env.NODE_ENV === "production"
      ? `https://gjjames.co.uk`
      : `http://localhost`;
  const pathName = window.location.pathname;

  const checkboxes = document.querySelectorAll(".filters--checkbox");
  const clearFilterbutton = document.querySelector(".btn-filter");
  const navLink = document.querySelectorAll(".nav__link");
  const tagLink = document.querySelectorAll(".tag__link");
  const footerLink = document.querySelectorAll(".footer__link");

  const hash = JSON.parse(sessionStorage.getItem("filterItems")) || [];
  const checkboxValues =
    JSON.parse(sessionStorage.getItem("checkboxValues")) || [];

  function loadCheckBoxes() {
    checkboxValues.forEach(key => {
      joinHashItems();
      document.querySelector(`input[id='${key.id}']`).checked = true;
    });
  }

  function clearCheckBoxes() {
    clearFilterbutton.addEventListener("click", function() {
      sessionStorage.clear();
      window.location = `${baseUrl}${pathName}`;
    });
    function linkListener(parentLink) {
      parentLink.forEach(link => {
        link.addEventListener("click", function() {
          sessionStorage.clear();
        });
      });
    }
    linkListener(navLink);
    linkListener(tagLink);
    linkListener(footerLink);
  }

  function joinHashItems() {
    if (hash !== []) {
      sessionStorage.setItem("filterItems", JSON.stringify(hash));
      newHash = hash.join("&");
    }
    sessionStorage.setItem("checkboxValues", JSON.stringify(checkboxValues));
  }

  checkboxes.forEach(checkbox => {
    checkbox.addEventListener("change", function() {
      if (this.checked) {
        const newString = `tags[]=${checkbox.value}`;
        hash.push(newString);

        const obj = {
          id: this.id,
          checked: this.checked
        };
        if (checkboxValues.indexOf(obj) == -1) checkboxValues.push(obj);

        joinHashItems();
      } else {
        const index = hash.indexOf(`tags[]=${checkbox.value}`);
        const objIndex = checkboxValues.findIndex(
          check => check.id === checkbox.value
        );
        if (index > -1) {
          hash.splice(index, 1);
          checkboxValues.splice(objIndex, 1);
          joinHashItems();
        }
      }

      const newUrl =
        hash && hash.length
          ? `${baseUrl}${pathName}?${newHash}`
          : `${baseUrl}${pathName}`;

      window.location = newUrl;

      if (window.location.search === "") console.log("empty search");
    });
  });

  loadCheckBoxes();
  clearCheckBoxes();
}

export default searchFilters;
