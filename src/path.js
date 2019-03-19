import {Port, InPort, OutPort, ConstraintInPort, ConstraintOutPort} from './port.js'
import Utils from './utils.js';
import SpotlightType from './spotlight_type';

export class Path {
    constructor(graph, lineGenerator) {
        this.graph = graph;
        this.lineGenerator = lineGenerator;
        this.d3Inst = null;
        this.inPort = null;
        this.outPort = null;
        this.markup = 'path';
        this.type = SpotlightType.PATH;
        this.id = Utils.randomID();
    }

    init() {
        if (this.graph == null) {
            return false;
        }

        this.d3Inst = this.graph.append(this);
        this.attr('class', 'DefaultPath');
        return true;
    }

    remove() {
        this.d3Inst.remove();
        this.graph.deRegistElement(this);
    }

    attr(key, value) {
        this.d3Inst.attr(key, value);
    }

    setJsonAttr(jsonAttr) {
        for (let k in jsonAttr) {
            this.attr(k, jsonAttr[k]);
        }
    }

    updateConnectPoint(startPoint, endPoint) {
        this.attr('d', this.lineGenerator(Utils.connectLineGeneratorHelp(startPoint, endPoint)));
    }

    update() {
        let startPoint = outPort.getConnectPoint();
        let endPoint = inPort.getConnectPoint();
        this.updateConnectPoint(startPoint, endPoint);
    }
}