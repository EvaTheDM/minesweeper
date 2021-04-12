import { createElement, createList } from '../util';

const Navigation = () =>
    createElement({
        tag: 'nav',
        children: [createList({ classes: ['blue'] })]
    });

export default Navigation;
