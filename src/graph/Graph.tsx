import * as _ from 'lodash';
import * as Plotly from 'plotly.js';
import * as React from 'react';

export type GraphData = Plotly.Data[];

export interface GraphProps {
    data: GraphData;
    xLabel?: string;
    yLabel?: string;
    showGrid?: boolean;
    title?: string;
    thresholds?: number[];
    className?: string;
    darkBackground?: boolean;
    xRangeMode?: 'normal'|'tozero'|'nonnegative';
    yRangeMode?: 'normal'|'tozero'|'nonnegative';
}

export interface GraphState {
    data: Plotly.Data[];
}

export class Graph extends React.Component<GraphProps, GraphState> {
    private element: HTMLDivElement;

    public constructor(props: GraphProps) {
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

    public componentWillReceiveProps(nextProps: GraphProps) {
        this.setState({data: nextProps.data});
    }

    public shouldComponentUpdate(nextState: GraphState): boolean {
        return !_.isEqual(_.map(this.state.data, (data: any) => _.omit(data, ['uid'])), nextState.data);
    }

    public render() {
        return (
            <div
                className={'graph ' + (this.props.className || '')}
                ref={(me: HTMLDivElement) => this.element = me}
            />
        );
    }

    private refreshGraph() {
        const width = Math.floor(this.element.parentElement.getBoundingClientRect().width - 8) + 'px';
        const height = Math.floor(this.element.parentElement.getBoundingClientRect().height - 8) + 'px';
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

        (Plotly.newPlot as any)(node, this.state.data, {
            title: this.props.title || '',
            autosize: true,
            margin: {
                t: this.props.title ? 32 : 8,
                r: 16,
                b: 32,
                l: 48,
            },
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            font: {
                color: this.props.darkBackground ? '#efefef' : '#444'
            },
            xaxis: {
                showgrid: this.props.showGrid,
                showline: true,
                title: this.props.xLabel,
                color: this.props.darkBackground ? '#efefef' : '#444',
                gridcolor: this.props.darkBackground ? '#6e6e6e' : '#444',
                rangemode: this.props.xRangeMode || 'normal',
            },
            yaxis: {
                showgrid: this.props.showGrid,
                showline: true,
                title: this.props.yLabel,
                color: this.props.darkBackground ? '#efefef' : '#444',
                gridcolor: this.props.darkBackground ? '#6e6e6e' : '#444',
                rangemode: this.props.yRangeMode || 'normal',
            },
            shapes: this.getThresholdShapes()
        }, {
            displayModeBar: false,
            // staticPlot: true
        });
    }

    private getThresholdShapes() {
        return _.map(
            this.props.thresholds,
            (threshold: number) => (
                {
                    type: 'line',
                    xref: 'paper',
                    x0: 0,
                    y0: threshold,
                    x1: 1,
                    y1: threshold,
                    line: {
                        color: 'rgba(255, 255, 255, .5)',
                        width: 4,
                        dash: 'dot'
                    }
                }
            )
        );
    }

    private resizeGraph() {
        this.drawGraph();
        this.forceUpdate();
    }
}
