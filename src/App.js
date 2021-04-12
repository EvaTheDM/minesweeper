import './scss/app.scss';
import _ from 'lodash';
import { createElement } from './util';

import Heading from './components/Heading';
import Navigation from './components/Navigation';
import GameMenu from './components/GameMenu';

const App = () => {
    const element = createElement({
        tag: 'div',
        classes: ['main'],
        children: [
            Heading({ title: 'Minesweeper' }),
            Navigation(),
            createElement({ id: 'content', children: [GameMenu()] })
        ]
    });

    return element;
};

document.getElementById('root').appendChild(App());
