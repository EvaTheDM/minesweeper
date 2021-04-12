import _ from 'lodash';
import { createList, moveTo } from '../util';
import settings from '../data/game-settings';
import Game from './Game';

const GameMenu = () =>
    createList({
        classes: ['menu'],
        children: _.map(settings.difficulty, ({ size, mines }, title) => {
            return {
                classes: ['menu--item'],
                html: `<span class="title">${title}</span> (${size.w}x${size.h} | ${mines} mines)`,
                dataDifficulty: title,
                onClick: () => moveTo({ target: Game, difficulty: title })
            };
        })
    });

export default GameMenu;
