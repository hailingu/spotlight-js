import Graph from './graph.js';
import {ExampleGroup} from './group.js';
import './css/spotlight.css';
import * as d3 from 'd3';

let graph = new Graph('svg');
let example = new ExampleGroup(graph);
example.init();
example.addInPort();
example.addOutPort();
example.drag();
console.log(graph);
console.log(example);