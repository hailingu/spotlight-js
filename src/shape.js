import SpotlightType from './spotlight_type';
import * as d3 from 'd3';

class Shape {
    constructor(graph) {
        this.graph = graph;
        this.type = SpotlightType.SHAPE;
        this.d3Inst = null;
        this.id = null;
        this.markup = null;
    }

    init() {
        if (this.graph === null) {
            return ;
        }
        
        this.d3Inst = this.graph.append(this);
        this.drag();
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

    setID(id) {
        this.id = id;
        return this;
    }

    setJsonAttr(jsonAttr) {
        for (let k in jsonAttr) {
            this.attr(k, jsonAttr[k]);
        }
    }
}

class Rect extends Shape {

    static get DEFAULT_ATTR () {
        return {
            width: 281,
            height: 51,
            transform: 'translate(1,1)',
            fill: 'red'
        };
    }

    constructor(graph) {
        super(graph);
        this.markup = 'rect';
    }
}

class Ellipse extends Shape {
    constructor(graph) {
        super(graph);
        this.markup = 'ellipse';
    }
}

export {Shape, Rect, Ellipse};