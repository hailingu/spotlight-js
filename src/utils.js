import * as d3 from 'd3';
import { Port } from './port.js';
import SpotlightType from './spotlight_type.js';
import Path from './path.js';

let coordinateTransform = function (graph, coord) {
    let CTM = graph.node().getScreenCTM();
    return {
        x: (coord.x - CTM.e) / CTM.a,
        y: (coord.y - CTM.f) / CTM.d
    }
}

let defautlLineGenerator = d3.line().x(function (d) {
    return d[0];
}).y(function (d) {
    return d[1];
}).curve(d3.curveBasis);

let elementsAt = function (x, y) {
    return document.elementsFromPoint(x, y);
}

let getOutPortFromPoint = function (elem, graph) {
    let element = null;
    for (let i in elem) {
        element = graph.getElementByID(elem[i].id);
        if (element != null &&
            element.type === SpotlightType.PORT &&
            (element.portType === Port.OUT || element.portType === Port.CONSTRAINT_OUT)) {
            break;
        }
    }

    return element;
}

let getInPortFromPoint = function (elem, graph) {
    let element = null;
    for (let i in elem) {
        element = graph.getElementByID(elem[i].id);
        if (element != null && 
            element.type === SpotlightType.PORT && 
            (element.portType === Port.IN || element.portType === Port.CONSTRAINT_IN)) {
            break;
        }
    }
    return element;
}

let connectLineGeneratorHelp = function (startPoint, endPoint) {
    if (endPoint.length != 2) return [startPoint, startPoint, startPoint, startPoint];
    let middlePoint1 = [startPoint[0], (startPoint[1] + endPoint[1]) / 2];
    let middlePoint2 = [endPoint[0], (startPoint[1] + endPoint[1]) / 2];
    return [startPoint, middlePoint1, middlePoint2, endPoint];
}

let connectTwoPort = function (inPort, outPort, path) {
    inPort.path = path;
    outPort.path = path;
    path.inPort = inPort;
    path.outPort = outPort;
    inPort.connected = true;
    outPort.connected = true;

    path.update();
    return true;
}

let legaledElement = function(element) {
    return element != null && element.id != null && (
        element.type === SpotlightType.SHAPE ||
        element.type === SpotlightType.PATH ||
        element.type === SpotlightType.PORT ||
        element.type === SpotlightType.GROUP);
}

let randomID = function() {
    return (Math.random()*10000000).toString(16).substr(0,4)+'-'+(new Date()).getTime()+'-'+Math.random().toString().substr(2,5);
}

const Utils = Object.assign(
    {},
    {
        coordinateTransform,
        getOutPortFromPoint,
        connectTwoPort,
        defautlLineGenerator,
        connectLineGeneratorHelp,
        elementsAt,
        legaledElement,
        randomID,
        getInPortFromPoint
    }
)

export default Utils;