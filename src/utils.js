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

let getInPortFromPoint = function (elem, graph) {
    let element = null;
    for (let i in elem) {
        element = graph.getElementByID(elem[i].id);
        if (element != null &&
            element.type === SpotlightType.PORT &&
            (element.portType === SpotlightPortType.IN || element.portType === SpotlightPortType.CONSTRAINT_IN)) {
            break;
        }
    }

    return element;
}

let getOutPortFromPoint = function (elem, graph) {
    let element = null;
    for (let i in elem) {
        element = graph.getElementByID(elem[i].id);
        if (element != null &&
            element.type === SpotlightType.PORT &&
            (element.portType === SpotlightPortType.OUT || element.portType === SpotlightPortType.CONSTRAINT_OUT)) {
            break;
        }
    }

    return element;
}

let connectTwoPort = function (inPort, outPort, path) {
    if (inPort.path != null && outPort.path != null) {
        return;
    }

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

let sleep = function (ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let move2Point = function (svg, x, y) {
    svg.attr('transform', 'translate(' + x + ',' + y + ')');
}

let getGroupFromPoint = function (elem, graph) {
    let element = null;
    let id = null;
    for (let i in elem) {
        id = getBubbleFirstShapeID(elem[i]);
        if (id != null) {
            break;
        }
    }

    return graph.getElementByID(id);
}

let getBubbleFirstShapeID = function (elem) {
    if (elem == null) {
        return null;
    }

    if (elem.id == null || elem.id === '') {
        return getBubbleFirstShapeID(elem.parentNode);
    }

    return elem.id;
}

const utils = Object.assign(
    {},
    {
        getOutPortConnectionPoint,
        getInPortConnectionPoint,
        coordinateTransform,
        connectLineGeneratorHelp,
        elementsAt,
        getInPortFromPoint,
        getOutPortFromPoint,
        connectTwoPort,
        sleep,
        move2Point,
        getGroupFromPoint,
        getBubbleFirstShapeID,
    }
)

export default utils;