import * as _ from 'lodash';
import * as Plotly from 'plotly.js';
import * as React from 'react';
import {Button} from '../button';
import {Icon} from '../icon/Icon';
import {View} from 'react-native';

export interface PlotlyGraphProps {
    className?: string;
    data: Plotly.Data[];
    layout?: Partial<Plotly.Layout>;
    config?: Partial<Plotly.Config>;
    graphName?: string;
    uniqueValue?: any;
    areControlsHidden?: boolean;
}

export interface PlotlyGraphState {
    layout: Partial<Plotly.Layout>;
}

export class PlotlyGraph extends React.PureComponent<PlotlyGraphProps, PlotlyGraphState> {
    private element: HTMLDivElement;

    public constructor(props: PlotlyGraphProps) {
        super(props);
        this.state = {
            layout: _.cloneDeep(props.layout)
        };

        this.resizeGraph = this.resizeGraph.bind(this);
        this.zoomIn = this.zoomIn.bind(this);
        this.zoomOut = this.zoomOut.bind(this);
        this.restoreZoom = this.restoreZoom.bind(this);
        this.download = this.download.bind(this);
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

    public componentWillReceiveProps(newProps: PlotlyGraphProps) {
        if (!_.isEqual(newProps.layout, this.state.layout)) {
            this.setState({
                layout: newProps.layout,
            });
        }
        if (newProps.uniqueValue !== this.props.uniqueValue) {
            setTimeout(this.resizeGraph, 10);
        }
    }

    public render() {
        return (
            <div
                className={'PlotlyGraphWrapper'}
                style={{flex: 1, display: 'flex', alignItems: 'center', maxWidth: '100%'}}
            >
                {
                    !this.props.areControlsHidden && (
                        <div className={'PlotlyGraphControls'} style={{paddingLeft: '1rem'}}>
                            <View style={{marginBottom: 1}}>
                                <Button title={<Icon name={'search-plus'}/> as any} onPress={this.zoomIn}/>
                            </View>
                            <View style={{marginBottom: 1}}>
                                <Button title={<Icon name={'search-minus'}/> as any} onPress={this.zoomOut}/>
                            </View>
                            <View style={{marginBottom: 1}}>
                                <Button title={'1:1'} onPress={this.restoreZoom}/>
                            </View>
                            <View style={{marginBottom: 1}}>
                                <Button title={<Icon name={'download'}/> as any} onPress={this.download}/>
                            </View>
                        </div>
                    )
                }
                <div
                    className={'PlotlyGraph ' + (this.props.className || '')}
                    ref={(me: HTMLDivElement) => this.element = me}
                />
            </div>
        );
    }

    private refreshGraph() {
        const {width, height} = this.getDimensions();
        this.drawGraph(width + 'px', height + 'px');
    }

    private getDimensions() {
        const parentBoundingClientRect = this.element.parentElement.getBoundingClientRect();
        const width = Math.floor(parentBoundingClientRect.width - 8);
        const height = Math.floor(parentBoundingClientRect.height - 8);
        return {width, height};
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
            this.state.layout,
            _.assign({}, this.props.config, {displayModeBar: false})
        );
    }

    private resizeGraph() {
        this.drawGraph();
        this.forceUpdate();
    }

    private zoomIn() {
        const {layout} = this.state;
        const newXRange = this.getZoomedInRange(layout.xaxis.range);
        const newYRange = this.getZoomedInRange(layout.yaxis.range);
        const newLayout = _.clone(layout);
        newLayout.xaxis.range = newXRange;
        newLayout.yaxis.range = newYRange;

        this.setState({
            layout: newLayout,
        });
    }

    private zoomOut() {
        const {layout} = this.state;
        const newXRange = this.getZoomedOutRange(layout.xaxis.range);
        const newYRange = this.getZoomedOutRange(layout.yaxis.range);
        const newLayout = _.clone(layout);
        newLayout.xaxis.range = newXRange;
        newLayout.yaxis.range = newYRange;

        this.setState({
            layout: newLayout,
        });
    }

    private restoreZoom() {
        this.setState({
            layout: _.cloneDeep(this.props.layout)
        });
    }

    private download() {
        const {width, height} = this.getDimensions();
        Plotly.downloadImage(
            this.element,
            {
                format: 'svg',
                filename: this.props.graphName || 'graph',
                width: width,
                height: height
            }
        );
    }

    private getZoomedInRange(oldRange: any): [number, number] {
        const midX = this.getMiddleOf(+oldRange[0], +oldRange[1]);
        return [this.getMiddleOf(+oldRange[0], midX), this.getMiddleOf(midX, +oldRange[1])];
    }

    private getZoomedOutRange(oldRange: any): [number, number] {
        const padding = (oldRange[1] - oldRange[0]) / 2;
        return [oldRange[0] - padding, oldRange[1] + padding];
    }

    private getMiddleOf(lowerBound: number, upperBound: number) {
        return lowerBound + ((upperBound - lowerBound) / 2);
    }
}
