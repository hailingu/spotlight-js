import {Shape, SubShape} from './shape.js';
import SpotlightType from './spotlight_type.js';
import {InPort, OutPort} from './port.js';
import * as d3 from 'd3';

export class Group extends Shape {
    constructor(graph) {
        super(null);
        this.graph = graph;
        this.markup = 'g';
        this.type = SpotlightType.GROUP;
    }
}

export class ExampleGroup extends Group {
    constructor(graph) {
        super(graph);
        this.body = new SubShape(this);
        this.textBody = new SubShape(this);
        this.text = new SubShape(this.textBody);
        this.inPorts = {};
        this.outPorts = {};
    }

    init() {
        if (this.graph == null) {
            return false;
        }

        if (this.id == null) {
            return false;
        }

        this.body.markup = 'rect';
        this.textBody.markup = 'text';
        this.text.markup = 'tspan';

        this.graph.append(this);
        this.body.init();
        this.textBody.init();
        this.text.init();

        this.graph.registElement(this.body);
        this.graph.registElement(this.textBody);
        this.graph.registElement(this.text);

        this.attr('class', 'ExampleGroup');
        this.attr('id', this.id);
        this.body.attr('class', 'DefaultRect');
        this.textBody.attr('class', 'DefaultTextBody');
        this.text.attr('class', 'DefaultTextSpan')
    }

    addInPort() {
        let port = new InPort(this);
        port.init();
        port.attr('class', 'DefaultInPort');
        this.graph.registElement(port);
    }

    addOutPort() {
        let port = new OutPort(this);
        port.init();
        port.attr('class', 'DefaultOutPort');
        this.graph.registElement(port);
    }
}