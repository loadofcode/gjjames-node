import '../sass/style.scss';

import { $, $$ } from './modules/bling';
// import autocomplete from './modules/autocompete';
import typeAhead from './modules/typeAhead';
import typeAheadHome from './modules/typeAheadHome';
import './modules/productModal';
import './external/fontawesome-all';

typeAhead( $('.search') );
typeAheadHome( $('.search__hero') );