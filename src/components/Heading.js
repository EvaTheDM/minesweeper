import { createElement } from '../util';

const Heading = ({ title, tag = 'h1' } = {}) =>
    createElement({ tag, text: title });

export default Heading;
