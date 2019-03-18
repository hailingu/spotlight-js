import SpotlightType from './spotlight_type';
import d3 from './module_helper';

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

    append(element) {
        if (!this.__legaledElement(element)) {
            return null;
        }

        if (this.elementExist(element)) {
            return null;
        }

        this.d3Inst.append(element.markup);
        this.registElement(element);
    }
    
    elementExist(element) {
        if (!this.__legaledElement(element)) {
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

    __legaledElement(element) {
        return element != null && element.id != null && (
            element.type === SpotlightType.SHAPE ||
            element.type === SpotlightType.PATH ||
            element.type === SpotlightType.PORT ||
            element.type === SpotlightType.GROUP);
    }

    __allowRegist(element) {
        return !this.elementExist(element.id);
    }

    __allowDeRegist(element) {
        return this.elementExist(element.id);
    }
}