import SpotlightType from './spotlight_type';

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
    }

    remove() {
        this.d3Inst.remove();
    }

    attr(key, value) {
        return this.d3Inst.attr(key, value);
    }

    style(key, value) {
        return this.d3Inst.style(key, value);
    }

    drag() {
        let mousePosition = null;
        let current = this.d3Inst;
        let drag = d3.drag().on('start', function () {
            mousePosition = d3.mouse(this);
        })

        drag.on('drag', function () {
            let x = d3.event.x;
            let y = d3.event.y;
            current.attr("transform", "translate(" + (x - mousePosition[0]) + "," + (y - mousePosition[1]) + ")");

        }).on('end', function () {
            mousePosition = null;
        });

        this.d3Inst.call(drag);
    }

    setID(id) {
        this.id = id;
        return this;
    }
}

class Rect extends Shape {
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