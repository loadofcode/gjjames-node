function searchFilters() {
  let newHash;
  const baseUrl = `https://gjjames.co.uk`
  const pathName = window.location.pathname;

  const checkboxes = document.querySelectorAll(".filters--checkbox");
  const clearFilterbutton = document.querySelector(".btn-clear--filter");
  const clearFilterbuttonMobile = document.querySelector(
    ".btn-clear-mobile--filters"
  );
  const mobileFilterModal = document.getElementById("mobileFilter");
  const navLink = document.querySelectorAll(".nav__link");
  const tagLink = document.querySelectorAll(".tag__link");
  const footerLink = document.querySelectorAll(".footer__link");
  const refineButton = document.querySelector(".btn__refine");

  const hash = JSON.parse(sessionStorage.getItem("filterItems")) || [];
  const checkboxValues =
    JSON.parse(sessionStorage.getItem("checkboxValues")) || [];

  function loadCheckBoxes() {
    checkboxValues.forEach(key => {
      joinHashItems();
      const checkedBoxes = document.querySelectorAll(`input[name='${key.id}']`);
      checkedBoxes.forEach(box => {
        box.checked = true;
      });
    });
  }

  function clearCheckBoxes() {
    if (clearFilterbutton) {
      clearFilterbutton.addEventListener("click", function() {
        sessionStorage.clear();
        window.location = `${baseUrl}${pathName}`;
      });
    }
    if (clearFilterbuttonMobile) {
      clearFilterbuttonMobile.addEventListener("click", function() {
        sessionStorage.clear();
        window.location = `${baseUrl}${pathName}`;
      });
    }

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

  function openMobileFilter() {
    if (refineButton) {
      refineButton.addEventListener("click", function() {
        mobileFilterModal.classList.add("open");
      });
      // if (hash !== []) clearFilterbuttonMobile.style.display = "inline";
    }
  }
  function closeMobileFilter() {
    const filterCloseButton = document.querySelector(".btn--modal__close");
    if(filterCloseButton) {

      filterCloseButton.addEventListener("click", function() {
        mobileFilterModal.classList.remove("open");
      });
    }
  }

  function stickyFiltersBox() {
    const filterBox = document.querySelector(".filters--list");
    const scroll = window.pageYOffset;
    const headerOffsetTop = filterBox && filterBox.length && filterBox.offsetTop;

    if (filterBox === null) return;

    if (window.location.pathname === "/stock1234/products"  ) {
      window.addEventListener("scroll", function() {
        if (filterBox !== null && headerOffsetTop && scroll >= headerOffsetTop) {
          filterBox.style.cssText = "position: sticky; top: 10px";
        } else {
          filterBox.style.cssText = "position: relative; top: 0px";
        }
      });
    }
  }

  function joinHashItems() {
    if (hash !== []) {
      const pagination = document.querySelector(".pagination");
      if (document.querySelector(".pagination"))
        pagination.style.display = "none";
      sessionStorage.setItem("filterItems", JSON.stringify(hash));
      newHash = hash.join("&");
      if( clearFilterbutton || clearFilterbuttonMobile) {

        clearFilterbutton.style.display = "inline";
        clearFilterbuttonMobile.style.display = "inline";
      }
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
  stickyFiltersBox();
  openMobileFilter();
  closeMobileFilter();
}

export default searchFilters;
