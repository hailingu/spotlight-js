# spotlight-js

This is a javascript file which can create and manipulate the svg object. The file is based on d3.js.

You can creat object like this:


## Compile

	npm install --save-dev @babel/core babel-loader d3.js webpack webpack-cli style-loader
	npm run build

## import js to your html

	<script src="dist/spotlight.js"></script>

### step 1. create graph object:

	let graph = new Graph('svg'); // the 'svg' means markup in the html

### step 2. create an svg object with a out port:

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

### end
you can drag and connect these two svg object.
