import "../sass/style.scss";

import { $, $$ } from "./modules/bling";
import typeAhead from "./modules/typeAhead";
import typeAheadHome from "./modules/typeAheadHome";
import productEnquire from "./modules/productModal";
import searchFilters from "./modules/filtersSearch";

typeAhead($(".search"));
typeAheadHome($(".search__hero"));
productEnquire();
searchFilters();
