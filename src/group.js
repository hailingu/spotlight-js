import {Shape, SubShape} from './shape.js';
import SpotlightType from './spotlight_type.js';
import {Port, InPort, OutPort, ConstraintInPort, ConstraintOutPort} from './port.js';
import * as d3 from 'd3';

export class Group extends Shape {
    constructor(graph) {
        super(null);
        this.graph = graph;
        this.markup = 'g';
        this.type = SpotlightType.GROUP;
    }

    highlight() {
        this.body.highlight();
    }

    unHighlight() {
        this.body.unHighlight();
    }

    highlightWithContraint() {

    }

    unHighlightWigthConstraint() {

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
        this.text.attr('x', '84');
        this.text.attr('y', '31');

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
        this.__updatePort();
    }

    addOutPort() {
        let port = new OutPort(this);
        port.init();
        port.attr('class', 'DefaultOutPort');
        this.__registPort(port);
        this.__updatePort();
    }

    addConstraintInPort(constraint) {
        let port = new ConstraintInPort(this, constraint);
        port.init();
        port.attr('class', 'DefaultInPort');
        this.__registPort(port);
        this.__updatePort();
    }

    addConstraintOutPort(constraint) {
        let port = new ConstraintOutPort(this, constraint);
        port.init();
        port.attr('class', 'DefaultOutPort');
        this.__registPort(port);
        this.__updatePort();
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
    
    displayText(displayText) {
        this.text.d3Inst.text(displayText);
    }

    highlightWithContraint(port) {
        let highlightCnt = 0;
        if (port.portType === Port.CONSTRAINT_IN) {
            for (let key in this.outPorts) {
                let outPort = this.outPorts[key];
                if (outPort.portType === Port.CONSTRAINT_OUT) {
                    if (outPort.allowConnected(port)) {
                        outPort.allow();
                        highlightCnt = highlightCnt + 1;
                    } else {
                        outPort.forbid();
                    }
                }
            }
        } else if (port.portType === Port.CONSTRAINT_OUT) {
            for (let key in this.inPorts) {
                let inPort = this.inPorts[key];
                if (inPort.portType === Port.CONSTRAINT_IN) {
                    if (inPort.allowConnected(port)) {
                        highlightCnt = highlightCnt + 1;
                        inPort.allow();
                    } else {
                        inPort.forbid();
                    }
                }
            }
        }

        if (highlightCnt) {
            this.body.highlight();
        }
    }  

    unHighlightWigthConstraint() {
        this.body.unHighlight();
        for (let key in this.inPorts) {
            let inPort = this.inPorts[key];
            if (inPort.portType = Port.CONSTRAINT_IN) {
                inPort.origin();
            }
        }

        for (let key in this.outPorts) {
            let outPort = this.outPorts[key];
            if (outPort.portType = Port.CONSTRAINT_OUT) {
                outPort.origin();
            }
        }
    }

    __updatePort() {
        let split = Object.keys(this.inPorts).length;

        if (split <= 1) {
            return ;
        }

        let pos = parseInt(this.body.d3Inst.style('width')) / (split + 1);
        let i = 1;
        for (let key in this.inPorts) {
            this.inPorts[key].style('cx', pos * i);
            i = i + 1;
        }

        split = Object.keys(this.outPorts).length;

        if (split <= 1) {
            return ;
        }

        i = 1;
        for (let key in this.outPorts) {
            this.outPorts[key].style('cx', pos * i);
            i = i + 1;
        }
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