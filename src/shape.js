import SpotlightType from './spotlight_type.js';
import Utils from './utils.js';
import * as d3 from 'd3';

export class Shape {
    constructor(graph) {
        this.graph = graph;
        this.type = SpotlightType.SHAPE;
        this.d3Inst = null;
        this.id = Utils.randomID();
        this.markup = null;
    }

    init() {
        if (this.graph == null) {
            return false;
        }
        
        this.d3Inst = this.graph.append(this);
        this.attr('id', this.id);
    }

    remove() {
        this.d3Inst.remove();
        this.graph.deRegistElement(this);
    }

    attr(key, value) {
        return this.d3Inst.attr(key, value);
    }

    style(key, value) {
        return this.d3Inst.style(key, value);
    }

    drag() {
        let mousePos = null;
        let current = this.d3Inst;
        let drag = d3.drag().on('start', function () {
            mousePos = d3.mouse(this);
        })
    
        drag.on('drag', function () {
            let x = d3.event.x;
            let y = d3.event.y;
            current.attr("transform", "translate(" + (x - mousePos[0]) + "," + (y - mousePos[1]) + ")");
    
        }).on('end', function () {
            mousePos = null;
        });

        this.d3Inst.call(drag);
    }

    setJsonAttr(jsonAttr) {
        for (let k in jsonAttr) {
            this.attr(k, jsonAttr[k]);
        }
    }

    node() {
        return this.d3Inst.node();
    }

    append(subElement) {
        if (!Utils.legaledElement(subElement)) {
            return false;
        }
        subElement.d3Inst = this.d3Inst.append(subElement.markup);
        return subElement.d3Inst;
    }
}

export class Rect extends Shape {
    constructor(graph) {
        super(graph);
        this.markup = 'rect';
    }
}

export class Ellipse extends Shape {
    constructor(graph) {
        super(graph);
        this.markup = 'ellipse';
    }
}

export class SubShape extends Shape {
    constructor(containerShape, markup) {
        super(null);
        this.markup = markup;
        this.containerShape = containerShape;
    }

    init () {
        if (this.containerShape == null) {
            return false;
        }

        this.d3Inst = this.containerShape.append(this);
        this.attr('id', this.id);
    }
}