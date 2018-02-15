import '../sass/style.scss';

import { $, $$ } from './modules/bling';
// import autocomplete from './modules/autocompete';
import typeAhead from './modules/typeAhead';
import './external/fontawesome-all';

typeAhead( $('.search') );