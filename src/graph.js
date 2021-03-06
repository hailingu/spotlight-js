import SpotlightType from './spotlight_type.js';
import Utils from './utils.js';
import * as d3 from 'd3';

export default class Graph {
    constructor(tag) {
        this.d3Inst = d3.select(tag);
        this.context = {
            shape: {},
            path: {},
            port: {},
            group: {}
        };
        this.markup = 'svg';
        this.type = SpotlightType.GRAPH;
    }

    on(event, func) {
        return this.d3Inst.on(event, func);
    }

    node() {
        return this.d3Inst.node();
    }

    style(key, value) {
        return this.d3Inst.style(key, value);
    }

    append(element) {
        if (!Utils.legaledElement(element)) {
            return null;
        }

        if (this.elementExist(element)) {
            return null;
        }

        this.registElement(element);
        element.d3Inst = this.d3Inst.append(element.markup);
        return element.d3Inst;
    }

    remove(element) {
        if (!Utils.legaledElement(element)) {
            return false;
        }

        if (!this.elementExist(element)) {
            return false;
        }

        element.remove();
    }

    hightlight(element) {
        for (let key in this.context.group) {
            if (element.id === key) {
                continue;
            }

            this.context.group[key].hightlight();
        }

        for (let key in this.context.shape) {
            if (element.id === key) {
                continue;
            }

            this.context.shape[key].hightlight();
        }
    }

    unHighlight() {
        for (let key in this.context.group) {
            this.context.group[key].unHighlight();
        }

        for (let key in this.context.shape) {
           let shape = this.context.shape[key];
           if (shape.graph == null) {
               continue;
           }
           shape.unHighlight();
        }
    }

    highlightWithConstraint(element, port) {
        for (let key in this.context.group) {
            if (element.id === key) {
                continue;
            }

            this.context.group[key].highlightWithConstraint(port);
        }
    }

    unHighlightWithConstraint() {
        for (let key in this.context.group) {
            this.context.group[key].unHighlightWithConstraint();
        }

        for (let key in this.context.shape) {
           let shape = this.context.shape[key];
           if (shape.graph == null) {
               continue;
           }
           shape.unHighlight();
        }
    }
    
    elementExist(element) {
        if (!Utils.legaledElement(element)) {
            return false;
        }

        return this.context.shape.hasOwnProperty(element.id) ||
            this.context.path.hasOwnProperty(element.id) ||
            this.context.port.hasOwnProperty(element.id) ||
            this.context.group.hasOwnProperty(element.id);
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

    exportGraph() {
        let exportJson = {};
        for (let key in this.context.group) {
            let job = {};
            let group = this.context.group[key];
            if (group.hasOwnProperty('name')) {
                job.name = group.name;
            }

            job.id = group.id;
            job.dependency = [];
            if (Object.keys(group.inPorts).length != 0) {
                for (let dependKey in group.inPorts) {
                    job.dependency.push(group.inPorts[dependKey].path.outPort.group.id);
                }
            }
            exportJson[job.id] = job;
        }
        return exportJson;
    }

    __allowRegist(element) {
        return !this.elementExist(element.id);
    }

    __allowDeRegist(element) {
        return this.elementExist(element.id);
    }
}
