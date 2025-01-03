import {FunctionComponent, useEffect, useState} from "react";
import Map from 'ol/Map';
import View from 'ol/View';
import {Tile as TileLayer} from 'ol/layer';
import {OSM, Vector as VectorSource} from 'ol/source';
import {Point} from 'ol/geom';
import {Feature} from 'ol';
import {fromLonLat} from 'ol/proj';
import {DataItem} from "../entities/DataItem.tsx";
import {boundingExtent} from 'ol/extent';
import {Box, Card, CardContent} from '@mui/material';
import {AppState} from "../../core/entities/AppState.ts";
import {useSelector} from "react-redux";
import {AppBar} from "./AppBar.tsx";
import VectorLayer from "ol/layer/Vector";
import {Icon, Style} from "ol/style";
import Typography from "@mui/material/Typography";
import moment from "moment";
import {DataDrawer, drawerWidth} from "./DataDrawer.tsx";
import Toolbar from "@mui/material/Toolbar";

interface CardState {
    visible: boolean;
    top?: number;
    left?: number;
    start?: string;
    placeLocation?: string;
}

export const Home: FunctionComponent = () => {
    const jsonData = useSelector((appState: AppState) => appState.home.data);
    const filters = useSelector((appState: AppState) => (appState.home.filters));
    const [cardState, setCardState] = useState<CardState>({
        visible: false
    });

    useEffect(() => {
        const vectorSource = new VectorSource();
        const map = new Map({
            target: "map",
            layers: [
                new TileLayer({
                    source: new OSM(),
                }),
            ],
            view: new View({
                center: fromLonLat([11.958714, 45.398949]),
                zoom: 13,
            }),
        });

        const newFeatures = jsonData
            .filter((item: DataItem) => {
                const date = new Date(item.startTime);
                const startDate = filters.startDate ? new Date(filters.startDate) : null;
                const endDate = filters.endDate ? new Date(filters.endDate) : null;
                const year = filters.year ? parseInt(filters.year) : null;
                const month = filters.month ? parseInt(filters.month) : null;
                const day = filters.day ? parseInt(filters.day) : null;
                return (!startDate || date >= startDate) &&
                    (!endDate || date <= endDate) &&
                    (!year || date.getFullYear() === year) &&
                    (!month || date.getMonth() + 1 === month) &&
                    (!day || date.getDate() === day);
            })
            .map((item: DataItem, index: number) => {
                const location = item.visit?.topCandidate?.placeLocation;
                if (location) {
                    const match = location.match(/geo:(-?\d+\.\d+),(-?\d+\.\d+)/);
                    if (match) {
                        const [, lat, lng] = match;
                        const feature = new Feature({
                            geometry: new Point(fromLonLat([parseFloat(lng), parseFloat(lat)])),
                        });

                        const iconStyle = new Style({
                            image: new Icon({
                                anchor: [0.5, 46],
                                width: 30,
                                height: 30,
                                anchorXUnits: 'fraction',
                                anchorYUnits: 'pixels',
                                src: 'placeholder.webp',
                            }),
                        });

                        feature.setId(index);
                        feature.setStyle(iconStyle);

                        return feature;
                    }
                }
                return null;
            })
            .filter((feature) => feature !== null);

        vectorSource.clear();

        if (newFeatures.length > 0) {
            vectorSource.addFeatures(newFeatures);

            map.addLayer(new VectorLayer({
                source: vectorSource,
            }));

            const extent = boundingExtent(newFeatures.map(feature => feature.getGeometry()!.getCoordinates()!));
            map.getView().fit(extent, {padding: [50, 50, 50, 50]});

            map.on('pointermove', function (evt) {
                if (evt.dragging) {
                    setCardState({
                        visible: false,
                    })
                }

                const selectedFeature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
                    return feature;
                });

                if (selectedFeature) {
                    const index = selectedFeature.getId() ? selectedFeature.getId() as number : 0;
                    const selectedData = jsonData[index];
                    setCardState({
                        visible: true,
                        top: evt.pixel[1],
                        left: evt.pixel[0],
                        start: selectedData.startTime,
                        placeLocation: selectedData.visit?.topCandidate?.placeLocation,
                    })
                } else {
                    setCardState({
                        visible: false,
                    })
                }
            });
        }

        return () => {
            map.setTarget(undefined);
        };
    }, [jsonData, filters]);

    return <Box sx={{height: '100%'}}>
        <AppBar/>

        {cardState.visible && <Card variant="outlined" sx={{
            top: cardState.top,
            left: cardState.left,
            position: 'absolute',
            zIndex: 1,
        }}>
            <CardContent>
                <Typography variant="h5" component="div">
                    {moment(cardState.start).format('YYYY-MM-DD HH:mm')}
                </Typography>
                <Typography sx={{color: 'text.secondary'}}>
                    <b>Place</b>: {cardState.placeLocation?.replace("geo:", '')}
                </Typography>
            </CardContent>
        </Card>}

        <Box component="main"
             sx={{width: `calc(100% - ${!!jsonData.length ? drawerWidth : 0}px)`, height: 'calc(100% - 64px)'}}>
            <Toolbar/>
            <Box id="map" sx={{width: "100%", height: "100%"}}/>
        </Box>

        {!!jsonData.length && <DataDrawer/>}
    </Box>;
};