import { createElement, changeNav, moveTo } from '../util';
import settings from '../data/game-settings';
import GameMenu from './GameMenu';
import _, { size } from 'lodash';

const getRows = (boardSize, width) => {
    const rows = [];
    for (let i = 0; i < boardSize; i++) {
        rows.push({
            n: i / width + 1,
            start: i,
            end: i + width - 1
        });
        i = i + width - 1;
    }
    return rows;
};

const getAdjacent = ({ tile, width, board }) => {
    const rows = board.filter(
        row =>
            (tile - width >= row.start && tile - width <= row.end) ||
            (tile >= row.start && tile <= row.end) ||
            (tile + width >= row.start && tile + width <= row.end)
    );

    tile = tile - rows.find(row => tile >= row.start && tile <= row.end).start;

    return _.reduce(
        rows,
        (obj, row) => {
            const result = [];
            for (let i = -1; i <= 1; i++) {
                const next = row.start + tile + i;

                if (next !== tile && next >= row.start && next <= row.end)
                    result.push(next);
            }
            return [...obj, ...result];
        },
        []
    );
};

const Game = ({ difficulty }) => {
    const { size, mines } = settings.difficulty[difficulty];
    const boardSize = size.w * size.h;
    const tileSize = 2;

    const mineIds = [];

    let i = 0;
    while (mineIds.length < mines) {
        if (i === 100) break;
        const newPosition = Math.floor(Math.random() * boardSize);
        if (!mineIds.includes(newPosition)) mineIds.push(newPosition);
        mineIds.sort((a, b) => a - b);
        i++;
    }

    const rows = getRows(boardSize, size.w);
    const board = _.reduce(
        _.range(0, boardSize),
        (obj, value) => {
            const currentTile = parseInt(value);
            const targeted = getAdjacent({
                tile: currentTile,
                board: rows,
                width: size.w
            });
            const adjacentMines = targeted.filter(adj => mineIds.includes(adj))
                .length;

            obj[value] = {
                element: createElement({
                    id: `tile-${value}`,
                    classes: ['tile'],
                    dataStatus: settings.status.HIDDEN
                }),
                adjacentTiles: targeted,
                adjacentMines,
                isMine: mineIds.includes(value)
            };

            return obj;
        },
        {}
    );

    const baseNav = [
        {
            html: '&laquo; Return to Menu',
            onClick: () => moveTo({ target: GameMenu })
        },
        { text: `${difficulty} (${size.w}x${size.h})` }
    ];

    const revealTile = ({
        element,
        adjacentMines,
        adjacentTiles,
        isMine,
        key
    }) => {
        /*
         * 1. Stop if tile is already revealed
         * 2. reveal tile
         *   a. win if last non mine tile
         *   b. loose if hit mine
         * 3. print number if has mine next to it
         * 4. reveal all adjacent that have no numbers
         */
        const status = element.dataset.status;
        const boardElement = document.querySelector('.board');
        if (
            status != settings.status.HIDDEN ||
            boardElement.classList.contains('loss') ||
            boardElement.classList.contains('won')
        )
            return;

        if (isMine) {
            element.dataset.status = settings.status.MINE;
            changeNav([
                ...baseNav,
                { html: `<span class="message loss">You loose!</span>` }
            ]);
            boardElement.classList.add('loss');
            return;
        } else element.dataset.status = settings.status.REVEALED;

        if (
            document.querySelectorAll(
                `.tile[data-status="${settings.status.HIDDEN}"]`
            ).length === mines
        ) {
            changeNav([
                ...baseNav,
                { html: `<span class="message won">You won!</span>` }
            ]);
            boardElement.classList.add('won');
            return;
        }
        if (adjacentMines > 0) {
            element.innerText = adjacentMines;
            return;
        }

        _.forEach(adjacentTiles, value => {
            revealTile({ ...board[value], key: value });
        });
    };

    changeNav([
        ...baseNav,
        { html: `<span id="mines-left">${mines}</span> mines left` }
    ]);

    return createElement({
        classes: ['board'],
        style: {
            width: `${size.w * tileSize}em`
        },
        children: _.map(
            board,
            (
                { element, adjacentMines, adjacentTiles, isMine, ...value },
                key
            ) => {
                element.addEventListener(
                    'click',
                    revealTile.bind(null, {
                        element,
                        adjacentMines,
                        adjacentTiles,
                        isMine,
                        key
                    })
                );
                element.addEventListener('contextmenu', e => {
                    e.preventDefault();
                    const status = element.dataset.status;

                    if (
                        status != settings.status.HIDDEN &&
                        status != settings.status.MARKED
                    )
                        return;

                    if (status === settings.status.MARKED)
                        element.dataset.status = settings.status.HIDDEN;
                    else element.dataset.status = settings.status.MARKED;

                    document.querySelector('#mines-left').innerText = `${
                        mines -
                        document.querySelectorAll(
                            `.tile[data-status="${settings.status.MARKED}"]`
                        ).length
                    }`;
                });
                return element;
            }
        )
    });
};

export default Game;
