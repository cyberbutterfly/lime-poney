import * as React from 'react';
import {Observable, Subscription} from 'rxjs/Rx';
import * as _ from 'lodash';
import * as Plotly from 'plotly.js';

export const COLORS = Plotly.d3.scale.category20();

export interface DataPoint {
    x: any;
    y: any;
}

export interface Datasource {
    name: string;
    metrics$: Observable<DataPoint>;
}

export interface HighFrequencyGraphProps {
    datasources: Datasource[];
    showHistory?: boolean;
    className?: string;
    showGrid?: boolean;
    darkBackground?: boolean;
    thresholds?: number[];
}

export interface HighFrequencyGraphState {
    width: number;
    height: number;
    datasources: Datasource[];
}

export class HighFrequencyGraph extends React.Component<HighFrequencyGraphProps, HighFrequencyGraphState> {
    private container: HTMLDivElement;
    private composite: CanvasRenderingContext2D;
    private compositeHistorical: CanvasRenderingContext2D;

    private canvases: {[key: string]: CanvasRenderingContext2D};
    private workings: {[key: string]: CanvasRenderingContext2D};
    private historicals: {[key: string]: CanvasRenderingContext2D};
    private counts: {[key: string]: number};
    private historicalImages: {[key: string]: ImageBitmap};

    private metrics: {[key: string]: DataPoint[]};
    private oldMetrics: {[key: string]: DataPoint[]};

    private metricSubscriptions: {[key: string]: Subscription};

    private isScrolling: boolean;

    public constructor(props: HighFrequencyGraphProps) {
        super(props);
        this.state = {
            width: 0,
            height: 0,
            datasources: []
        };

        this.metricSubscriptions = {};
        this.canvases = {};
        this.workings = {};
        this.historicals = {};
        this.counts = {};
        this.historicalImages = {};
        this.metrics = {};
        this.oldMetrics = {};
        this.isScrolling = true;

        this.toggleScroll = this.toggleScroll.bind(this);
        this.getDataSourceCanvases = this.getDataSourceCanvases.bind(this);
    }

    public componentDidMount() {
        const containerDimensions = this.container.getBoundingClientRect();
        this.setState({
            width: containerDimensions.width,
            height: containerDimensions.height
        });
    }

    public componentWillUnmount() {
        if (this.metricSubscriptions) {
            _.forEach(
                this.metricSubscriptions,
                (subscription: Subscription) => subscription.unsubscribe()
            );
        }
    }

    public componentWillUpdate() {
/*
        const containerDimensions = this.container.getBoundingClientRect();
        if (this.state.width !== containerDimensions.width || this.state.height !== containerDimensions.height) {
            this.setState({
                width: containerDimensions.width,
                height: containerDimensions.height + 7
            });
        }
*/
    }

    public render() {
        return (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                }}
                ref={(me: HTMLDivElement) => this.container = me}
                className={'high-frequency-graph ' + (this.props.className || '')}
            >
                <canvas
                    width={this.state.width || 10}
                    height={(this.state.height * .9) || 10}
                    ref={(me: HTMLCanvasElement) => me && (this.composite = me.getContext('2d'))}
                    onClick={this.toggleScroll}
                />
                {
                    this.props.showHistory ? (
                        <canvas
                            width={this.state.width || 10}
                            height={(this.state.height * .1) || 10}
                            ref={(me: HTMLCanvasElement) => me && (this.compositeHistorical = me.getContext('2d'))}
                        />
                    ) : ''
                }
                {_.map(
                    this.props.datasources,
                    this.getDataSourceCanvases
                )}
            </div>);
    }

    private toggleScroll() {
        this.isScrolling = !this.isScrolling;
    }

    private getDataSourceCanvases(datasource: Datasource, index: number): JSX.Element[] {
        let count = this.counts[datasource.name] || (this.counts[datasource.name] = 1);
        const color = COLORS(index);
        const metricName = datasource.name + '-metric';
        const fillerName = datasource.name + '-filler';
        if (this.metricSubscriptions[metricName]) {
            this.metricSubscriptions[metricName].unsubscribe();
        }
        if (this.metricSubscriptions[fillerName]) {
            this.metricSubscriptions[fillerName].unsubscribe();
        }
        this.metrics[datasource.name] = [];
        this.oldMetrics[datasource.name] = [];
        this.metricSubscriptions[metricName] = datasource.metrics$.subscribe((dataPoint: DataPoint) => {
            this.metrics[datasource.name].push(dataPoint);
            if (this.props.showHistory) {
                this.drawHistorical(datasource, color);
            }
            this.refreshComposite(this.drawLive(datasource, dataPoint, this.counts[datasource.name]++, color));
        });
        this.metricSubscriptions[fillerName] = Observable.interval(1000 / 120).subscribe(() => {
            this.metrics[datasource.name].push({x: new Date(), y: 0});
            this.counts[datasource.name]++;
            count = this.counts[datasource.name];
            if (this.props.showHistory) {
                this.drawHistorical(datasource, color);
            }
            const maxX = this.canvases[datasource.name].canvas.width - 2;
            if (count >= maxX && this.isScrolling) {
                this.scroll(datasource);
            }
            this.refreshComposite(Math.min(count, maxX));
            if (this.metrics[datasource.name].length > (this.canvases[datasource.name].canvas.width * 2)) {
                this.aggregateMetrics(datasource.name);
            }
        });

        return [
            (
                <canvas
                    width={this.state.width}
                    height={this.state.height}
                    ref={(me: HTMLCanvasElement) => me && (this.canvases[datasource.name] = me.getContext('2d'))}
                    style={{display: 'none'}}
                />
            ),
            (
                <canvas
                    width={this.state.width}
                    height={this.state.height}
                    ref={(me: HTMLCanvasElement) => me && (this.workings[datasource.name] = me.getContext('2d'))}
                    style={{display: 'none'}}
                />
            ),
            (
                <canvas
                    width={this.state.width}
                    height={this.state.height * .1}
                    ref={(me: HTMLCanvasElement) => me && (this.historicals[datasource.name] = me.getContext('2d'))}
                    style={{display: 'none'}}
                />
            )
        ];
    }

    private aggregateMetrics(name: string) {
        const oldMetrics = this.oldMetrics[name];
        const metrics = this.metrics[name];
        let metric: DataPoint = metrics.shift();
        while (metric) {
            if (oldMetrics.length === 0 || _.last(oldMetrics).y !== 0 || metric.y !== 0) {
                oldMetrics.push(metric);
            } else {
                break;
            }
            metric = metrics.shift();
        }
    }

    private drawHistorical(datasource: Datasource, color: string) {
        const historical = this.historicals[datasource.name];
        const metrics = _.concat(this.oldMetrics[datasource.name], this.metrics[datasource.name]);
        historical.canvas.width = metrics.length;
        this.clearContext(historical);
        _.forEach(metrics, (dataPoint: DataPoint, index: number) => {
            const middleY = historical.canvas.height / 2;
            const value = (dataPoint.y * middleY * -1);

            if (this.historicalImages[datasource.name]) {
                historical.drawImage(this.historicalImages[datasource.name], 0, 0);
                delete this.historicalImages[datasource.name];
            }

            historical.save();
            historical.translate(index, middleY);
            historical.beginPath();
            historical.strokeStyle = color;
            historical.moveTo(0, 0);
            historical.lineTo(0, value);
            historical.stroke();
            historical.restore();
        });
    }

    private drawLive(datasource: Datasource, dataPoint: DataPoint, count: number, color: string) {
        const canvas = this.canvases[datasource.name];
        const maxX = canvas.canvas.width - 2;
        const middleY = canvas.canvas.height / 2;
        const value = (dataPoint.y * middleY * -1);
        const x = Math.min(count - 1, maxX);
        canvas.save();
        canvas.translate(0, middleY);
        canvas.beginPath();
        canvas.strokeStyle = color;
        canvas.moveTo(x, 0);
        canvas.lineTo(x, value);
        canvas.stroke();
        canvas.restore();
        if (count >= maxX && this.isScrolling) {
            this.scroll(datasource);
        }
        return x;
    }

    private scroll(datasource: Datasource) {
        const canvas = this.canvases[datasource.name];
        const working = this.workings[datasource.name];
        this.scrollCanvas(canvas, working);
    }

    private scrollCanvas(canvas: CanvasRenderingContext2D, working: CanvasRenderingContext2D) {
        canvas.save();
        working.drawImage(canvas.canvas, 0, 0);
        canvas.translate(-1, 0);
        canvas.clearRect(0, 0, canvas.canvas.width, canvas.canvas.height);
        canvas.drawImage(working.canvas, 0, 0);
        working.clearRect(0, 0, canvas.canvas.width, canvas.canvas.height);
        canvas.restore();
    }

    private refreshComposite(x: number) {
        this.clearContext(this.composite);
        this.composite.save();
        this.composite.beginPath();
        this.composite.strokeStyle = this.props.darkBackground ? '#efefef' : '#444';
        this.composite.moveTo(0, this.state.height / 2);
        this.composite.lineTo(this.state.width, this.state.height / 2);
        this.composite.stroke();
        if (this.props.thresholds) {
            this.drawThresholds();
        }
        this.composite.clearRect(x, 0, 4, this.composite.canvas.height);
        _.forEach(this.canvases, (canvas: CanvasRenderingContext2D) => this.composite.drawImage(canvas.canvas, 0, 0));
        this.composite.restore();

        if (this.props.showHistory) {
            this.clearContext(this.compositeHistorical);
            let textY = 10;
            _.forEach(this.historicals, (canvas: CanvasRenderingContext2D, name: string) => {
                const count = _.filter(this.metrics[name], 'y').length + _.filter(this.oldMetrics[name], 'y').length;
                this.composite.fillText(name + ': ' + (count), 10, textY);
                textY += 10;
                const width = Math.max(
                    this.metrics[name].length + this.oldMetrics[name].length,
                    this.compositeHistorical.canvas.width * 2
                );
                this.compositeHistorical.drawImage(canvas.canvas,
                    0, 0, width, canvas.canvas.height,
                    0, 0, this.compositeHistorical.canvas.width, this.compositeHistorical.canvas.height
                );
            });
        }
    }

    private drawThresholds() {
        this.composite.beginPath();
        _.forEach(this.props.thresholds, (threshold: number) => {
            const value = (threshold * (this.state.height / 2) * -1) + (this.state.height / 2);
            this.composite.strokeStyle = this.props.darkBackground ? '#6e6e6e' : '#444';
            this.composite.moveTo(0, value);
            this.composite.lineTo(this.state.width, value);
        });
        this.composite.stroke();
    }

    private clearContext(context: CanvasRenderingContext2D) {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    }
}
