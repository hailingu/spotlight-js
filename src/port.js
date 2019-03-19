import SpotlightType from "./spotlight_type.js";
import Utils from './utils.js'
import { Path } from "./path.js";
import * as d3 from 'd3';

export class Port {
    static get IN() {
        return 'in';
    }

    static get OUT() {
        return 'out';
    }

    static get CONSTRAINT_IN() {
        return 'constraint_in';
    }

    static get CONSTRAINT_OUT() {
        return 'constraint_out';
    }

    constructor(group) {
        this.group = group;
        this.type = SpotlightType.PORT;
        this.portType = null;
        this.d3Inst = null;
        this.markup = null;
        this.markup = 'ellipse';
        this.id = Utils.randomID();
        this.path = null;
        this.connected = false;
    }

    init() {
        if (this.group == null) {
            return false;
        }

        this.d3Inst = this.group.append(this);
        this.attr('id', this.id);
        this.connect();
        return true;
    }

    connect() { }

    getConnectPoint() { }

    node() {
        return this.d3Inst.node();
    }

    on(event, func) {
        this.d3Inst.on(event, func);
    }

    allowConnected() {
        return this.connected === false;
    }

    attr(key, value) {
        return this.d3Inst.attr(key, value);
    }

    style(key, value) {
        return this.d3Inst.style(key, value);
    }
}

export class InPort extends Port {
    constructor(group) {
        super(group);
        this.portType = Port.IN;
    }

    connect() {
        let inPort = this;
        this.d3Inst.on('mousedown', function() {
            d3.event.stopPropagation();
            let graph = inPort.group.graph;
            let endPoint = inPort.getConnectPoint();
            let keep = true;
            let path = new Path(graph, Utils.defautlLineGenerator);
            path.init();

            graph.on('mousemove', function () {
                d3.event.stopPropagation();
                if (keep) {
                    let startPoint = d3.mouse(this);
                    path.updateConnectPoint(startPoint, endPoint);
                }
            });
    
            graph.on('mouseup', function () {
                d3.event.stopPropagation();
                let mousePos = d3.mouse(this);
                let elem = Utils.elementsAt(mousePos[0], mousePos[1], graph);
                let outPort = Utils.getOutPortFromPoint(elem, graph);
                if (outPort != null && outPort.allowConnected()) {
                    Utils.connectTwoPort(inPort, outPort, path);
                } else {
                    if (path != null) {
                        path.remove();
                    }
                }
    
                keep = null;
                path = null;
            });
        });
    }

    getConnectPoint() {
        let portCoord = this.node().getBoundingClientRect();
        portCoord.x = (portCoord.left + portCoord.right) / 2;
        portCoord.y = this.group.body.node().getBoundingClientRect().y;
        let temp = Utils.coordinateTransform(this.group.graph, portCoord);
        return [temp.x, temp.y];
    }
}

export class OutPort extends Port {
    constructor(group) {
        super(group);
        this.portType = Port.OUT;
    }

    connect() {
        let outPort = this;
        this.d3Inst.on('mousedown', function() {
            d3.event.stopPropagation();
            let graph = outPort.group.graph;
            let startPoint = outPort.getConnectPoint();
            let keep = true;
            let path = new Path(graph, Utils.defautlLineGenerator);
            path.init();

            graph.on('mousemove', function () {
                d3.event.stopPropagation();
                if (keep) {
                    let endPoint = d3.mouse(this);
                    path.updateConnectPoint(startPoint, endPoint);
                }
            });
    
            graph.on('mouseup', function () {
                d3.event.stopPropagation();
                let mousePos = d3.mouse(this);
                let elem = Utils.elementsAt(mousePos[0], mousePos[1], graph);
                let inPort = Utils.getInPortFromPoint(elem, graph);
                if (inPort != null && inPort.allowConnected()) {
                    Utils.connectTwoPort(inPort, outPort, path);
                } else {
                    if (path != null) {
                        path.remove();
                    }
                }
    
                keep = null;
                path = null;
            });
        });
    }

    getConnectPoint() {
        let portCoord = this.node().getBoundingClientRect();
        portCoord.x = (portCoord.left + portCoord.right) / 2;
        portCoord.y = portCoord.bottom;
        let temp = Utils.coordinateTransform(this.group.graph, portCoord);
        return [temp.x, temp.y];
    }
}

export class ConstraintInPort extends InPort {
    constructor(group) {
        super(group);
        this.portType = Port.CONSTRAINT_IN;
    }

    connect() {
    }
}

export class ConstraintOutPort extends OutPort {
    constructor(group) {
        super(group);
        this.portType = Port.CONSTRAINT_OUT;
    }

    connect() {
    }
}