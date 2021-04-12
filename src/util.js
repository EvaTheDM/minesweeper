import _ from 'lodash';

const createElement = ({
    parent = null,
    tag = 'div',
    id,
    classes = [],
    children = [],
    text,
    html,
    style,
    ...rest
} = {}) => {
    const element = document.createElement(tag);

    if (id) element.setAttribute('id', id);

    if (text) element.innerText = text;
    if (html) element.innerHTML = html;

    _.forEach(classes, value => element.classList.add(value));

    if (style) _.forEach(style, (value, key) => (element.style[key] = value));

    _.forEach(children, child => element.appendChild(child));

    _.forEach(rest, (value, key) => {
        // key: dataDifficulty
        let type = key.replace(/^(?:on|data)(.+)/g, '$1'); // Difficulty
        const attr = key.replace(/^(on|data)(.+)/g, '$1'); // data

        type = type.charAt(0).toLowerCase() + type.slice(1); // difficulty

        switch (attr) {
            case 'data':
                element.dataset[type] = value;
                return;

            case 'on':
                element.addEventListener(type, value);
                element.classList.add(type);
                return;

            default:
                break;
        }
    });

    return element;
};

const createList = ({ children = [], ...rest } = {}) =>
    createElement({
        tag: 'ul',
        children: _.map(children, data =>
            createElement({ tag: 'li', ...data })
        ),
        ...rest
    });

const moveTo = ({ target = () => {}, ...data } = {}) => {
    document.querySelector('nav ul').innerHTML = '';

    const newElement = target(data);
    document.getElementById('content').replaceChildren(newElement);
};

const changeNav = (children = []) => {
    const nav = document.querySelector('nav ul');
    nav.innerHTML = '';

    _.forEach(children, child =>
        nav.appendChild(createElement({ tag: 'li', ...child }))
    );
};

export { createElement, createList, moveTo, changeNav };
