import Graph from './graph.js';
import {ExampleGroup} from './group.js';
import './css/spotlight.css';
import * as d3 from 'd3';
import { Arrow } from './arrow.js';

let graph = new Graph('svg');
let example = new ExampleGroup(graph);
example.init();
example.addOutPort();
example.drag();


let example2 = new ExampleGroup(graph);
example2.init();
example2.addInPort();
example2.addInPort();
example2.addOutPort();
example2.addOutPort();
example2.drag();

let arrow = new Arrow(graph);

console.log(graph);
console.log(example2);