import Graph from './graph.js';
import {Rect} from './shapes.js'

let graph = new Graph('svg');
let rec = new Rect(graph);
rec.setID('abc');
rec.init();
console.log(graph);