'use strict'

class SpotlightType {
    static get SHAPE() {
        return 'shape';
    }

    static get CONTAINER() {
        return 'container';
    }

    static get PATH() {
        return 'path';
    }

    static get PORT() {
        return 'port';
    }

    static get GRAPH() {
        return 'graph';
    }

    static get GROUP() {
        return 'group'
    }
}

class Container {
    constructor(container) {
        this.container = container;
        this.d3Inst = null;
        this.context = {
            shape: {},
            port: {}
        }
        this.type = SpotlightType.CONTAINER;
        this.markup = null;
        this.id = null;
    }

    registElement(element) {
        if (element.type === SpotlightType.SHAPE) {
            this.context.shape[element.id] = element;
        } else if (element.type === SpotlightType.PORT) {
            this.context.port[element.id] = element;
        }
        if (this.container != null) {
            this.container.registElement(element);
        }
    }

    deRegistElement(element) {

        if (element.type === SpotlightType.SHAPE) {
            delete this.context.shape[element.id];
        } else if (element.type === SpotlightType.PORT) {
            delete this.context.port[element.id];
        }

        if (this.container != null) {
            this.container.deRegistElement(element);
        }
    }

    append(element) {
        if (this.d3Inst != null) {
            element.d3Inst = this.d3Inst.append(element.markup);
            return element.d3Inst;
        }
        return null;
    }

    remove() {
        this.container.deRegistElement(this);
        for (let k in this.context.shape) {
            this.context.shape[k].remove();
        }

        for (let k in this.context.port) {
            this.context.port[k].remove();
        }

        this.d3Inst.remove();
    }

    attr(key, value) {
        this.d3Inst.attr(key, value);
    }

    setJsonAttr(json) {
        for (let k in json) {
            this.attr(k, json[k]);
        }
    }

    on(event, func) {
        this.d3Inst.on(event, func);
    }

    drag() {
        let mousePosition = null;
        let currentSelect = this.d3Inst;
        let drag = d3.drag().on('start', function () {
            mousePosition = d3.mouse(this);
        })

        drag.on('drag', function () {
            let x = d3.event.x;
            let y = d3.event.y;
            currentSelect.attr("transform", "translate(" + (x - mousePosition[0]) + "," + (y - mousePosition[1]) + ")");

        }).on('end', function () {
            mousePosition = null;
        });

        this.d3Inst.call(drag);
    }
}

class Graph extends Container {
    constructor(id) {
        super(null);
        this.container = null;
        this.id = id;
        this.d3Inst = d3.select(id);
        this.context = {
            shape: {},
            path: {},
            port: {},
            group: {},
        };
        this.className = null;
        this.markup = 'svg';
        this.type = SpotlightType.GRAPH;
        new Arrow(this);
    }

    setClassName(className) {
        this.className = className;
        return this;
    }

    elementExist(id) {
        return this.context.shape.hasOwnProperty(id) ||
            this.context.path.hasOwnProperty(id) ||
            this.context.port.hasOwnProperty(id) ||
            this.context.group.hasOwnProperty(id);
    }

    registElement(element) {
        if (element.id === undefined || !this.__allowRegist(element)) {
            return false;
        }

        if (element.type === SpotlightType.SHAPE) {
            this.context.shape[element.id] = element;
            return true;
        } else if (element.type === SpotlightType.PORT) {
            this.context.port[element.id] = element;
            return true;
        } else if (element.type === SpotlightType.GROUP) {
            this.context.group[element.id] = element;
            return true;
        } else if (element.type === SpotlightType.PATH) {
            this.context.path[element.id] = element;
            return true;
        }

        return false;
    }

    deRegistElement(element) {
        if (element.id === undefined || !this.__allowDeRegist(element)) {
            return false;
        }

        if (element.type === SpotlightType.GROUP) {
            delete this.context.group[element.id];
            return true;
        } else if (element.type === SpotlightType.SHAPE) {
            delete this.context.shape[element.id];
            return true;
        } else if (element.type === SpotlightType.PORT) {
            delete this.context.port[element.id];
            return true;
        } else if (element.type === SpotlightType.PATH) {
            delete this.context.path[element.id];
            return true;
        }

        return false;
    }

    __allowRegist(element) {
        return !this.elementExist(element.id);
    }

    __allowDeRegist(element) {
        return this.elementExist(element.id);
    }

    getElementByID(id) {
        let element = null;
        if (id === undefined && !this.elementExist(id)) {
            return element;
        }

        element = this.context.shape[id];
        if (element != null) return element;

        element = this.context.port[id];
        if (element != null) return element;

        element = this.context.path[id];
        if (element != null) return element;

        element = this.context.group[id];
        if (element != null) return element;
    }
}

class Shape extends Container {
    constructor(container, markup, id) {
        super(container);
        this.markup = markup;
        this.type = SpotlightType.SHAPE;
        this.id = id;
    }
}

class Group extends Container {
    constructor(container, id) {
        super(container);
        this.markup = 'g';
        this.type = SpotlightType.Group;
        this.id = id;
    }
}

class SpotlightPortType {
    static get IN() {
        return 'in';
    }

    static get OUT() {
        return 'out';
    }
}

class Port {

    static get IN_PORT_ATTR (){
        return {
            class: 'SpotlightInPort',
            'stroke': '#BCBCBC',
            'fill': '#FFFFFF',
            cx: 140,
            cy: 0,
            ry: 7
        }
    }

    static get OUT_PORT_ATTR () {
        return {
            class: 'SpotlightOutPort',
            'stroke': '#BCBCBC',
            'fill': '#FFFFFF',
            cx: 140.5,
            cy: 51,
            ry: 7
        }
    }

    constructor(container) {
        this.container = container;
        this.d3Inst = null;
        this.connected = false;
        this.path = null;
        this.type = SpotlightType.PORT;
        this.portType = null;
        this.markup = 'ellipse';
        this.id = null;
        this.container.append(this);
    }

    setPortType(portType) {
        this.portType = portType;
    }

    setID(id) {
        this.id = id;
    }

    allowConnected(path) {
        if (path.inPort === null && path.outPort == null) {
            return false;
        }

        if (path.inPort === null && this.portType === SpotlightPortType.IN) {
            return false;
        }

        if (path.outPort === null && this.portType === SpotlightPortType.OUT) {
            return false;
        }

        return true;
    }

    remove() {
        this.deRegister();
        this.d3Inst.remove();

        if (this.path != null) {
            this.path.remove();
        }
    }

    register() {
        this.container.registElement(this);
    }

    deRegister() {
        this.container.deRegistElement(this);
    }

    attr(key, value) {
        this.d3Inst.attr(key, value);
    }

    setJsonAttr(json) {
        for (let k in json) {
            this.attr(k, json[k]);
        }
    }

    style(key, value) {
        this.d3Inst.style(key, value);
    }

    connect() {
        let port = this;
        this.d3Inst.on('mousedown', function () {
            d3.event.stopPropagation();
            d3.event.preventDefault();
            if (port.portType === SpotlightPortType.OUT) {
                drawFromOutToIN();
            } else {
                drawFromInToOut();
            }
        });

        let lineGenerator = d3.line().x(function (d) {
            return d[0];
        }).y(function (d) {
            return d[1];
        }).curve(d3.curveBasis);

        function drawFromOutToIN() {
            let graph = port.container.container;
            let startPoint = getOutPortConnectionPoint(graph, port);
            let keep = true;
            let path = new Path(graph, lineGenerator);
            graph.on('mousemove', function () {
                d3.event.stopPropagation();
                if (keep) {
                    let endPoint = d3.mouse(this);
                    path.update(startPoint, endPoint);
                }
            });

            graph.on('mouseup', function () {
                d3.event.stopPropagation();
                let mouse = d3.mouse(this);
                let elem = elementsAt(mouse[0], mouse[1], graph);
                let inPort = null;
                inPort = getPortFromPoint(elem, graph);
                if (inPort != null) {
                    connectTwoPort(inPort, port, path);
                    path.attr('marker-end', 'url(#arrow)');
                    inPort.hide();
                    port.updateShape();
                } else {
                    if (path != null) {
                        path.remove();
                    }
                }
                keep = false;
                path = null;
            });
        }
    }

    style(key, value) {
        this.d3Inst.style(key, value);
    }

    hide() {
        this.style('stroke-opacity', 0);
        this.style('fill-opacity', 0);
    }

    show() {
        this.style('stroke-opacity', 1);
        this.style('fill-opacity', 1);
    }

    updateShape() {
		if (this.connected) {
			this.style('ry', '5');
			this.style('fill', '#808080');
		} else {
			this.style('ry', '7');
			this.style('fill', '#FFFFFF');
		}
		this.__updateOutPortConnection();
    }
    
    __updateOutPortConnection() {
        if (this.path != null) {
            this.path.updateConnectPoint();
        }
	}
}

class Path {

    static get DEFAUTL_PATH_ATTR() {
        return {
            stroke: '#808080',
            'stroke-width': '1px',
            fill: 'none',
            class: 'path'
        };
    }

    constructor(graph, lineGenerator) {
        this.graph = graph;
        this.markup = 'path';
        this.css = null;
        this.d3Inst = null;
        this.inPort = null;
        this.outPort = null;
        this.lineGenerator = lineGenerator;
        this.type = SpotlightType.PATH;
        this.graph.append(this);
        this.id = 'path_' + Object.keys(this.graph.context.path).length;
        this.graph.registElement(this);
        this.setJsonAttr(Path.DEFAUTL_PATH_ATTR);
    }

    remove() {
        this.deRegister();
        this.d3Inst.remove();
    }

    register() {
        this.graph.registElement(this);
    }

    deRegister() {
        this.graph.deRegistElement(this);
    }

    attr(key, value) {
        this.d3Inst.attr(key, value);
    }

    setJsonAttr(json) {
        for (let k in json) {
            this.attr(k, json[k]);
        }
    }

    updateConnectPoint() {
        let startPoint = getOutPortConnectionPoint(this.graph, this.outPort);
        let endPoint = getInPortConnectionPoint(this.graph, this.inPort);
        this.attr('d', this.lineGenerator(connectLineGeneratorHelp(startPoint, endPoint)));
    }

    update(startPoint, endPoint) {
        this.attr('d', this.lineGenerator(connectLineGeneratorHelp(startPoint, endPoint)));
    }

    updateEndPoint(endPoint) {
        let startPoint = getOutPortConnectionPoint(this.graph, this.outPort);
        this.attr('d', this.lineGenerator(connectLineGeneratorHelp(startPoint, endPoint)));
    }

    updateStartPoint(startPoint) {
        let endPoint = getInPortConnectionPoint(this.graph, this.inPort);
        this.attr('d', this.lineGenerator(connectLineGeneratorHelp(startPoint, endPoint)));
    }
}

class Arrow {
    static get ARROWATTR() {
        return {
            id: 'arrow',
            markerUnits: 'strokeWidth',
            markerWidth: 14,
            markerHeight: 14,
            viewBox: '0 0 14 14',
            refX: 2,
            refY: 7,
            orient: 'auto',
            fill: '#808080',
        }
    }

    constructor(graph) {
        this.graph = graph;
        this.id = 'arrow';
        this.d3Inst = this.graph.d3Inst.append('defs').append('marker');
        this.setJsonAttr(Arrow.ARROWATTR);
        this.d3Inst.append('path').attr('d', 'M2,2 L8,7 L2,12 L2,2');
    }

    attr(key, value) {
        this.d3Inst.attr(key, value);
    }

    setJsonAttr(json) {
        for (let k in json) {
            this.attr(k, json[k]);
        }
    }
}

class SpotlightBasicTextContainer extends Group {
    constructor(container, text, id) {
        super(container);
        this.id = id;
        this.d3Inst = null;
        this.inPorts = {};
        this.outPorts = {};
        this.type = SpotlightType.GROUP;
        this.displayText = text;
        this.body = null;
        this.textBody = null;
        this.text = null;
    }

    composeGroup() {
        if (this.container === null || this.id === null) {
            return;
        }

        this.container.registElement(this);
        this.body = new Shape(this, 'rect', this.id + "_body");
        this.textBody = new Shape(this, 'text', this.id + "_text");
        this.registElement(this.body);
        this.registElement(this.textBody);
        this.text = new Shape(this.textBody, 'tspan', this.textBody.id + "_tspan");
        this.textBody.registElement(this.text);
        return true;
    }

    initView() {
        let composed = this.composeGroup();
        if (!composed) return false;
        this.container.append(this);
        this.attr('class', 'SpotlightBasicTextContainer');
        this.attr('file-rule', 'evenodd');
        this.attr('id', this.id);
        this.append(this.body);

        let bodyAttr = {
            width: 281,
            height: 51,
            transform: 'translate(1,1)',
            class: 'SpotlightBasicTextContainerBody'
        }
        this.body.setJsonAttr(bodyAttr);
        this.append(this.textBody);
        this.textBody.attr('class', 'SpotlightBasicTextContainerText');

        this.textBody.append(this.text);
        this.text.d3Inst.text(this.displayText);
        let textAttr = {
            x: 84,
            y: 31,
            class: 'SpotlightBasicTextContainerTextTspan'
        }
        this.text.setJsonAttr(textAttr);
        this.drag();
    }

    addInPort() {
        let port = new Port(this);
        port.setPortType(SpotlightPortType.IN);
        port.setID(this.id + "_IN_" + Object.keys(this.inPorts).length);
        port.attr('id', port.id);
        port.setJsonAttr(Port.IN_PORT_ATTR);
        port.connect();
        this.registElement(port);
        this.__registPort(port);
        this.__updatePort();
    }

    addOutPort() {
        let port = new Port(this);
        port.setPortType(SpotlightPortType.OUT);
        port.setID(this.id + "_OUT_" + Object.keys(this.outPorts).length);
        port.attr('id', port.id);
        port.setJsonAttr(Port.OUT_PORT_ATTR);
        port.connect();
        this.registElement(port);
        this.__registPort(port);
        this.__updatePort();
    }

    __updatePort() {
        let split = Object.keys(this.inPorts).length;
        let pos = this.body.d3Inst.attr('width') / (split + 1);
        let i = 1;
        for (let key in this.inPorts) {
            this.inPorts[key].style('cx', pos * i);
            i = i + 1;
        }

        split = Object.keys(this.outPorts).length;
        pos = this.body.d3Inst.attr('width') / (split + 1);
        i = 1;
        for (let key in this.outPorts) {
            this.outPorts[key].style('cx', pos * i);
            i = i + 1;
        }
    }

    __registPort(port) {
        if (port.portType === SpotlightPortType.IN) {
            this.inPorts[port.id] = port;
        } else if (port.portType === SpotlightPortType.OUT) {
            this.outPorts[port.id] = port;
        }
    }

    __deRegistPort(port) {
        if (port.portType === SpotlightPortType.IN) {
            delete this.inPorts[port.id];
        } else if (port.portType === SpotlightPortType.OUT) {
            delete this.outPorts[port.id];
        }
    }

    drag() {
        let mousePosition = null;
        let current = this;
        let drag = d3.drag().on('start', function () {
            mousePosition = d3.mouse(this);
        })

        drag.on('drag', function () {
            let x = d3.event.x;
            let y = d3.event.y;
            current.attr("transform", "translate(" + (x - mousePosition[0]) + "," + (y - mousePosition[1]) + ")");

            for (let i in current.inPorts) {
                let path = current.inPorts[i].path;
                if (path != null) {
                    path.updateConnectPoint();
                }
            }

            for (let i in current.outPorts) {
                let path = current.outPorts[i].path;
                if (path != null) {
                    path.updateConnectPoint();
                }
            }

        }).on('end', function () {
            mousePosition = null;
        });

        this.d3Inst.call(drag);
    }
}

let getOutPortConnectionPoint = function (container, port) {
    port = port.d3Inst;
    if (port.empty()) return null;
    let portCoord = port.node().getBoundingClientRect();
    portCoord.x = (portCoord.left + portCoord.right) / 2;
    portCoord.y = portCoord.bottom;
    portCoord = coordinateTransform(container, portCoord);
    return [portCoord.x, portCoord.y];
}

let getInPortConnectionPoint = function (container, port) {
    let c = port.container;
    port = port.d3Inst;
    if (port.empty()) return null;
    let portCoord = port.node().getBoundingClientRect();
    portCoord.x = (portCoord.left + portCoord.right) / 2;
    portCoord.y = c.body.d3Inst.node().getBoundingClientRect().y;
    portCoord = coordinateTransform(container, portCoord);
    return [portCoord.x, portCoord.y];
}

let coordinateTransform = function (container, coord) {
    let CTM = container.d3Inst.node().getScreenCTM();
    return {
        x: (coord.x - CTM.e) / CTM.a,
        y: (coord.y - CTM.f) / CTM.d
    }
}

let connectLineGeneratorHelp = function (startPoint, endPoint) {
    if (endPoint.length != 2) return [startPoint, startPoint, startPoint, startPoint];
    let middlePoint1 = [startPoint[0], (startPoint[1] + endPoint[1]) / 2];
    let middlePoint2 = [endPoint[0], (startPoint[1] + endPoint[1]) / 2];
    return [startPoint, middlePoint1, middlePoint2, endPoint];
}

let elementsAt = function (x, y, container) {
    let elements = [];
    x = x + parseInt(container.d3Inst.style('left'));
    y = y + parseInt(container.d3Inst.style('top'));
    let current = document.elementFromPoint(x, y);
    while (current && current.nearestViewportElement) {
        elements.push(current);
        current.style.display = "none";
        current = document.elementFromPoint(x, y);
    }
    elements.forEach(function (elm) {
        elm.style.display = '';
    });
    return elements;
}

let getPortFromPoint = function (elem, graph) {
    let element = null;
    for (let i in elem) {
        element = graph.getElementByID(elem[i].id);
        if (element != null && element.type === SpotlightType.PORT && element.portType === SpotlightPortType.IN) {
            break;
        }
    }

    return element;
}

let connectTwoPort = function (inPort, outPort, path) {
    inPort.path = path;
    outPort.path = path;
    path.inPort = inPort;
    path.outPort = outPort;
    inPort.connected = true;
    outPort.connected = true;

    let container = path.graph;
    let startPoint = getOutPortConnectionPoint(container, outPort);
    let endPoint = getInPortConnectionPoint(container, inPort);
    path.attr('d', path.lineGenerator(connectLineGeneratorHelp(startPoint, endPoint)));
    
}

