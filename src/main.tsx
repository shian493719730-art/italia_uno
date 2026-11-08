import {createRoot} from 'react-dom/client';
import Game from '../app/game';
import '../app/globals.css';
import '../app/handdrawn.css';
import '../app/mobile.css';
import '../app/welcome.css';
import '../app/postcard.css';
createRoot(document.getElementById('root')!).render(<Game/>);
