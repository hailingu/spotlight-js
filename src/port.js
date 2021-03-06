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
        this.markup = 'circle';
        this.id = Utils.randomID();
        this.path = [];
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

    allowConnected(port) {
    }

    attr(key, value) {
        return this.d3Inst.attr(key, value);
    }

    style(key, value) {
        return this.d3Inst.style(key, value);
    }

    hide() {
        this.style('stroke-opacity', 0);
        this.style('fill-opacity', 0);
    }

    show() {
        this.style('stroke-opacity', 1);
        this.style('fill-opacity', 1);
    }

    update() {}
}

export class InPort extends Port {
    constructor(group) {
        super(group);
        this.portType = Port.IN;
    }

    connect() {
        let inPort = this;
        this.d3Inst.on('mousedown', function () {
            d3.event.stopPropagation();
            let graph = inPort.group.graph;
            let endPoint = inPort.getConnectPoint();
            let keep = true;
            let path = new Path(graph, Utils.defautlLineGenerator);
            path.init();
            path.addMarkerEnd();
            inPort.hide();

            graph.on('mousemove', function () {
                d3.event.stopPropagation();
                if (keep) {
                    let startPoint = d3.mouse(this);
                    path.updateConnectPoint(startPoint, endPoint);
                }
            });

            graph.on('mouseup', function () {
                d3.event.stopPropagation();
                let mousePos = {
                    x: d3.event.x,
                    y: d3.event.y
                };

                let elems = Utils.elementsAt(mousePos.x, mousePos.y);
                let outPort = Utils.getOutPortFromPoint(elems, graph);
                if (outPort != null && outPort.allowConnected(inPort) && inPort.allowConnected(outPort)) {
                    Utils.connectTwoPort(inPort, outPort, path);
                    outPort.update();
                    graph.on('mouseup', function (){});
                } else {
                    if (path != null) {
                        path.remove();
                    }

                    inPort.show();
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

    allowConnected(port) {
        return this.connected == false && port.portType === Port.OUT;
    }
}

export class OutPort extends Port {
    constructor(group) {
        super(group);
        this.portType = Port.OUT;
    }

    connect() {
        let outPort = this;
        this.d3Inst.on('mousedown', function () {
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
                let mousePos = {
                    x: d3.event.x,
                    y: d3.event.y
                };

                let elems = Utils.elementsAt(mousePos.x, mousePos.y);
                let inPort = Utils.getInPortFromPoint(elems, graph);

                if (inPort != null && inPort.allowConnected(outPort) && outPort.allowConnected(inPort)) {
                    Utils.connectTwoPort(inPort, outPort, path);
                    path.addMarkerEnd();
                    inPort.hide();
                    outPort.update();
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

    update() {
        this.style('r', '5');
        this.style('fill', '#808080');
        this.__updateOutPortConnection();
    }

    __updateOutPortConnection() {
        for (let j in this.path) {
            this.path[j].update();
        }
    }

    allowConnected(port) {
        return port.portType === Port.IN;
    }
}

export class ConstraintInPort extends InPort {
    constructor(group, constraint) {
        super(group);
        this.portType = Port.CONSTRAINT_IN;
        this.constraint = constraint;
    }

    connect() {
        let inPort = this;
        this.d3Inst.on('mousedown', function() {
            d3.event.stopPropagation();
            let group = inPort.group;
            let graph = group.graph;
            graph.highlightWithConstraint(group, inPort);
            let endPoint = inPort.getConnectPoint();
            let keep = true;
            let path = new Path(graph, Utils.defautlLineGenerator);
            path.init();
            path.addMarkerEnd();
            inPort.hide();

            graph.on('mousemove', function () {
                d3.event.stopPropagation();
                if (keep) {
                    let startPoint = d3.mouse(this);
                    path.updateConnectPoint(startPoint, endPoint);
                }
            });

            graph.on('mouseup', function () {
                d3.event.stopPropagation();
                let mousePos = {
                    x: d3.event.x,
                    y: d3.event.y
                };

                let elems = Utils.elementsAt(mousePos.x, mousePos.y);
                let outPort = Utils.getOutPortFromPoint(elems, graph);
                if (outPort != null && outPort.allowConnected(inPort) && inPort.allowConnected(outPort)) {
                    Utils.connectTwoPort(inPort, outPort, path);
                    outPort.update();
                    graph.on('mouseup', function (){});
                } else {
                    if (path != null) {
                        path.remove();
                    }


                    inPort.show();
                }
                graph.unHighlightWithConstraint();
                keep = null;
                path = null;
            });
        });
    }

    allowConnected(port) {
        return this.connected == false && port.portType == Port.CONSTRAINT_OUT && this.constraint === port.constraint;
    }

    allow() {
        this.style('r', '5');
        this.style('fill', 'green');
    }

    forbid() {
        this.style('r', '5');
        this.style('fill', 'red');
    }

    origin() {
        this.style('r', '7');
        this.style('fill', '#FFFFFF');
    }
}

export class ConstraintOutPort extends OutPort {
    constructor(group, constraint) {
        super(group);
        this.portType = Port.CONSTRAINT_OUT;
        this.constraint = constraint;
    }

    connect() {
        let outPort = this;
        this.d3Inst.on('mousedown', function() {
            d3.event.stopPropagation();
            let group = outPort.group;
            let graph = group.graph;
            graph.highlightWithConstraint(group, outPort);
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
                let mousePos = {
                    x: d3.event.x,
                    y: d3.event.y
                };

                let elems = Utils.elementsAt(mousePos.x, mousePos.y);
                let inPort = Utils.getInPortFromPoint(elems, graph);
                if (inPort != null && outPort.allowConnected(inPort) && inPort.allowConnected(outPort)) {
                    Utils.connectTwoPort(inPort, outPort, path);
                    path.addMarkerEnd();
                    outPort.update();
                    inPort.hide();
                } else {
                    if (path != null) {
                        path.remove();
                    }

                    if (inPort != null) {
                        inPort.show();
                    }
                    
                }
                graph.unHighlightWithConstraint();
                keep = null;
                path = null;
            });
        });
    }

    allowConnected(port) {
        return port.portType == Port.CONSTRAINT_IN && this.constraint === port.constraint;
    }

    allow() {
        this.style('r', '5');
        this.style('fill', 'green');
    }

    forbid() {
        this.style('r', '5');
        this.style('fill', 'red');
    }

    origin() {
        this.style('r', '7');
        this.style('fill', '#FFFFFF');
    }
}