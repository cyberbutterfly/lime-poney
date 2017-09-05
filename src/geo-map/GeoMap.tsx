import * as L from 'leaflet';
import * as _ from 'lodash';
import * as React from 'react';
import {CSSProperties} from 'react';
import {Map, Marker, TileLayer} from 'react-leaflet';

import './GeoMap.scss';


declare let require: any;
(function workaroundLeafletNamingIssue() {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
        iconUrl: require('leaflet/dist/images/marker-icon.png'),
        shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
    });
})();

export interface GeoPosition {
    lat: number;
    lng: number;
}

export interface GeoMarker {
    position: GeoPosition;
    draggable?: boolean;
}

export interface MapProps {
    center: {lat: number, lng: number};
    zoom?: number;
    markers?: GeoMarker[];
    style?: CSSProperties;
}

export interface MapState {
}

export class GeoMap extends React.Component<MapProps, MapState> {
    private static copyright = '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors';

    private container: HTMLElement;
    private map: Map;

    public constructor(props: MapProps) {
        super(props);
        this.state = {};
    }

    public componentDidMount() {
        this.container.addEventListener('touchmove', (event: Event) => {
            event.stopPropagation();
        });
        this.container.addEventListener('mousemove', (event: Event) => {
            event.stopPropagation();
        });
    }

    public render() {
        return (
            <div
                className='geo-map'
                ref={(me: HTMLElement) => this.container = me}
                style={this.props.style || {}}
            >
                <Map
                    className='.leaflet-container'
                    center={this.props.center}
                    zoom={this.props.zoom || 15}
                    preferCanvas={true}
                    ref={(me: Map) => this.map = me}
                >
                    <TileLayer
                        attribution={GeoMap.copyright}
                        url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                        crossOrigin={true}
                    />
                    {
                        _.map(
                            this.props.markers,
                            (marker: GeoMarker, index: number) => (
                                <Marker
                                    key={'marker-' + index}
                                    position={marker.position}
                                    draggable={marker.draggable}
                                />
                            )
                        )
                    }
                </Map>
            </div>
        );
    }
}
