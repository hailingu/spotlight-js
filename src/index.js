import Graph from './graph.js';
import {Rect} from './shape.js'

let graph = new Graph('svg');
let rect = new Rect(graph);
rect.setID('abc');
rect.init();
rect.setJsonAttr(Rect.DEFAULT_ATTR);
rect.drag();
console.log(graph);
console.log(rect);