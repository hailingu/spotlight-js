import {Shape, SubShape} from './shape.js';
import SpotlightType from './spotlight_type.js';
import {Port, InPort, OutPort} from './port.js';
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
        this.__registPort(port);
    }

    addOutPort() {
        let port = new OutPort(this);
        port.init();
        port.attr('class', 'DefaultOutPort');
        this.__registPort(port);
    }

    drag() {
        let mousePos = null;
        let current = this;
        let drag = d3.drag().on('start', function () {
            mousePos = d3.mouse(this);
        })
    
        drag.on('drag', function () {
            let x = d3.event.x;
            let y = d3.event.y;
            current.attr("transform", "translate(" + (x - mousePos[0]) + "," + (y - mousePos[1]) + ")");

            for (let i in current.inPorts) {
                let path = current.inPorts[i].path;
                if (path != null) {
                    path.update();
                }
            }

            for (let i in current.outPorts) {
                let path = current.outPorts[i].path;
                if (path != null) {
                    path.update();
                }
            }
    
        }).on('end', function () {
            mousePos = null;
        });

        this.d3Inst.call(drag);
    }

    __registPort(port) {
        if (port.portType === Port.IN || port.portType === Port.CONSTRAINT_IN) {
            this.inPorts[port.id] = port;
        } else if (port.portType === Port.OUT || port.portType === Port.CONSTRAINT_OUT) {
            this.outPorts[port.id] = port;
        }
        this.graph.registElement(port);
    }

    __deRegistPort(port) {
        if (port.portType === Port.IN) {
            delete this.inPorts[port.id];
        } else if (port.portType === Port.OUT) {
            delete this.outPorts[port.id];
        }
        this.graph.deRegistElement(port);
    }
}