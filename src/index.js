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
example.displayText('example1');


let example2 = new ExampleGroup(graph);
example2.init();
example2.addInPort();
example2.addConstraintOutPort('data');
example2.drag();
example2.displayText('example2');

let example3 = new ExampleGroup(graph);
example3.init();
example3.addConstraintInPort('data');
example3.addInPort();
example3.addOutPort();
example3.drag();
example3.displayText('example3');

let arrow = new Arrow(graph);

console.log(graph);
console.log(example2);
console.log(example3);