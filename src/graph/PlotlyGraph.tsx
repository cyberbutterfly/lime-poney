import * as _ from 'lodash';
import * as Plotly from 'plotly.js';
import * as React from 'react';

export interface PlotlyGraphProps {
    className?: string;
    data: Plotly.Data[];
    layout?: Partial<Plotly.Layout>;
    config?: Partial<Plotly.Config>;
}

export interface PlotlyGraphState {}

export class PlotlyGraph extends React.PureComponent<PlotlyGraphProps, PlotlyGraphState> {
    private element: HTMLDivElement;

    public constructor(props: PlotlyGraphProps) {
        super(props);
        this.state = {
            data: props.data
        };

        this.resizeGraph = this.resizeGraph.bind(this);
    }

    public componentDidMount() {
        this.refreshGraph();
        window.addEventListener('resize', this.resizeGraph);
    }

    public componentWillUnmount() {
        window.removeEventListener('resize', this.resizeGraph);
    }

    public componentDidUpdate() {
        this.refreshGraph();
    }

    public render() {
        return (
            <div
                className={'PlotlyGraph ' + (this.props.className || '')}
                ref={(me: HTMLDivElement) => this.element = me}
            />
        );
    }

    private refreshGraph() {
        const parentBoundingClientRect = this.element.parentElement.getBoundingClientRect();
        const width = Math.floor(parentBoundingClientRect.width - 8) + 'px';
        const height = Math.floor(parentBoundingClientRect.height - 8) + 'px';
        this.drawGraph(width, height);
    }

    private drawGraph(width: string = '10px', height: string = '10px') {
        const graph = Plotly.d3.select(this.element)
            .style({
                'width': width,
                'height': height,
                'margin-left': '8px',
                'background-color': 'transparent'
            });
        const node = graph.node();

        Plotly.newPlot(
            node,
            this.props.data,
            this.props.layout,
            this.props.config
        );
    }

    private resizeGraph() {
        this.drawGraph();
        this.forceUpdate();
    }
}
