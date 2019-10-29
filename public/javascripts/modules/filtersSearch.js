function searchFilters() {
  const url =
    process.env.NODE_ENV === "production"
      ? `https://gjjames.co.uk`
      : `http://localhost`;
  const pathName = window.location.pathname;
  let hash = [];
  let newHash;
  const checkboxValues =
    JSON.parse(sessionStorage.getItem("checkboxValues")) || {};

  if (window.location.search === "") sessionStorage.clear();

  function joinHashItems() {
    if (hash !== "") {
      newHash = hash.join("&");
      sessionStorage.setItem("filterItems", newHash);
    }
    sessionStorage.setItem("checkboxValues", JSON.stringify(checkboxValues));
  }

  const checkboxes = document.querySelectorAll(".filters--checkbox");

  checkboxes.forEach(checkbox => {
    checkbox.addEventListener("change", function() {
      if (this.checked) {
        const newString = `tags[]=${checkbox.value}`;
        hash.push(newString);

        checkboxValues[this.id] = this.checked;
        joinHashItems();
      } else {
        const index = hash.indexOf(`tags[]=${checkbox.value}`);
        if (index > -1) {
          hash.splice(index, 1);
          delete checkboxValues[this.id];
          joinHashItems();
        }
      }

      console.log("filterItems", sessionStorage.filterItems);
      console.log("CheckBoxValues", sessionStorage.checkboxValues);

      // window.location = `${url}${pathName}?${sessionStorage.filterItems}`;
    });
  });
}

export default searchFilters;
