import '../sass/style.scss';

import { $, $$ } from './modules/bling';
import typeAhead from './modules/typeAhead';
import typeAheadHome from './modules/typeAheadHome';
// import './modules/productModal';

typeAhead( $('.search') );
typeAheadHome( $('.search__hero') );