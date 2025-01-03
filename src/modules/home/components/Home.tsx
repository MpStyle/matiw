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
import {Avatar, Box, Card, ListItem, ListItemAvatar, ListItemText} from '@mui/material';
import {AppState} from "../../core/entities/AppState.ts";
import {useSelector} from "react-redux";
import {AppBar} from "./AppBar.tsx";
import VectorLayer from "ol/layer/Vector";
import {Icon, Style} from "ol/style";
import moment from "moment";
import {DataDrawer, drawerWidth} from "./DataDrawer.tsx";
import Toolbar from "@mui/material/Toolbar";
import FmdGoodIcon from "@mui/icons-material/FmdGood";

interface CardState {
    visible: boolean;
    top?: number;
    left?: number;
    start?: string;
    placeLocation?: string;
}

export const Home: FunctionComponent = () => {
    const jsonData = useSelector((appState: AppState) => appState.home.data);
    const dateTimeFormat = useSelector((appState: AppState) => appState.settings.dateTimeFormat);
    const [filteredData, setFilteredData] = useState<DataItem[]>([]);
    const [map, setMap]= useState<Map | null>(null);
    const filters = useSelector((appState: AppState) => (appState.filters));
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

        setMap(map);

        const fd = jsonData
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
            });

        setFilteredData(fd);

        const newFeatures = fd
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
            <ListItem>
                <ListItemAvatar>
                    <Avatar>
                        <FmdGoodIcon/>
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={moment(cardState.start).format(dateTimeFormat)}
                              secondary={cardState.placeLocation?.replace("geo:", '')}/>
            </ListItem>
        </Card>}

        <Box component="main"
             sx={{width: `calc(100% - ${jsonData.length ? drawerWidth : 0}px)`, height: 'calc(100% - 64px)'}}>
            <Toolbar/>
            <Box id="map" sx={{width: "100%", height: "100%"}}/>
        </Box>

        {!!filteredData.length && <DataDrawer jsonData={filteredData} onLocationClick={coordinate=>{
            if (map && coordinate) {
                const match = coordinate.match(/geo:(-?\d+\.\d+),(-?\d+\.\d+)/);
                if (match) {
                    const [, lat, lng] = match;
                    map.getView().animate({
                        center: fromLonLat([parseFloat(lng), parseFloat(lat)]),
                        zoom: 18,
                    });
                }
            }
        }}/>}
    </Box>;
};