import Path from './path.js';

export class Arrow {

    static get DEFAULT_ARROW_ATTR() {
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
        this.attr('class', 'DefaultArrow');
        this.setJsonAttr(Arrow.DEFAULT_ARROW_ATTR);
        this.d3Inst.append('path').attr('d', 'M2,2 L8,7 L2,12 L2,2');
    }

    attr(key, value) {
        this.d3Inst.attr(key, value);
    }

    setJsonAttr(jsonAttr) {
        for (let k in jsonAttr) {
            this.attr(k, jsonAttr[k]);
        }
    }

}