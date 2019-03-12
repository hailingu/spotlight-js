# spotlight-js

This is javascript lib which can create and manipulate the svg object. The lib based on d3.js

You can creat object like this:

### step 1. create graph object:

let graph = new Graph('svg'); // the 'svg' means markup in the html

### step 2. create an svg object with a out port:

let obj1 = new SpotlightBasicTextContainer(graph, 'obj1', 'obj1');
obj1.initView();
obj1.addOutPort();

let obj2 = new SpotlightBasicTextContainer(graph, 'obj2', 'obj2');
obj2.initView();
obj2.addOutPort();
obj2.addInPort();

### end
you can drag and connect these two svg object.
