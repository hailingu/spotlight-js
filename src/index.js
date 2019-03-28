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
example3.addConstraintInPort('model');
example3.addOutPort();
example3.drag();
example3.displayText('example3');

let example4 = new ExampleGroup(graph);
example4.init();
example4.addInPort();
example4.addOutPort();
example4.addConstraintOutPort('data');
example4.drag();
example4.displayText('example4');

let arrow = new Arrow(graph);

console.log(graph);
console.log(example2);
console.log(example3);
console.log(example4);

window.oncontextmenu = function(e){
    e.preventDefault();
    let menu=document.querySelector("#menu");
    menu.style.left = e.clientX+'px';
    menu.style.top = e.clientY+'px';
    menu.style.width = '125px';
    document.querySelector('#menu').style.height = '25px';
}

window.onclick = function(e){
    document.querySelector('#menu').style.height=0;
}