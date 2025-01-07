import {FunctionComponent, useEffect, useState} from "react";
import Map from 'ol/Map';
import View from 'ol/View';
import {Tile as TileLayer} from 'ol/layer';
import {OSM, Vector as VectorSource} from 'ol/source';
import {Point} from 'ol/geom';
import {Feature} from 'ol';
import {fromLonLat} from 'ol/proj';
import {DataItem} from "../entities/DataItem.ts";
import {boundingExtent} from 'ol/extent';
import {Box} from '@mui/material';
import {AppState} from "../../core/entities/AppState.ts";
import {useSelector} from "react-redux";
import {AppBar} from "./AppBar.tsx";
import VectorLayer from "ol/layer/Vector";
import {Fill, Icon, Style, Text} from "ol/style";
import {DataDrawer, drawerWidth} from "./DataDrawer.tsx";
import Toolbar from "@mui/material/Toolbar";
import {LocationOverview} from "../../core/components/LocationOverview.tsx";
import {MDefaultIconColor, MIcons} from "../../core/book/MIcon.ts";

interface CardState {
    // visible: boolean;
    top?: number;
    left?: number;
    itemData?: DataItem;
}

export const Home: FunctionComponent = () => {
    const jsonData = useSelector((appState: AppState) => appState.home.data);
    const [filteredData, setFilteredData] = useState<DataItem[]>([]);
    const [map, setMap] = useState<Map | null>(null);
    const filters = useSelector((appState: AppState) => (appState.filters));
    const [cardState, setCardState] = useState<CardState>({});
    const customLocations = useSelector((appState: AppState) => appState.customLocations);

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

                        const customLocation = location && location in customLocations.data ? customLocations.data[location] : null;

                        const iconStyle = new Style({
                            image: !customLocation ? new Icon({
                                anchor: [0.5, 46],
                                width: 30,
                                height: 30,
                                anchorXUnits: 'fraction',
                                anchorYUnits: 'pixels',
                                src: 'logo-256x256.png',
                            }) : undefined,
                            text: customLocation && customLocation.iconName ? new Text({
                                text: MIcons[customLocation.iconName],
                                font: 'normal 30px "Material Icons"',
                                textBaseline: "bottom",
                                fill: new Fill({
                                    color: customLocation.iconColor ?? MDefaultIconColor,
                                })
                            }) : undefined
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

            map.on('click', function (evt) {
                const clickedFeature = map.forEachFeatureAtPixel(evt.pixel, feature => feature);

                if (clickedFeature) {
                    const index = clickedFeature.getId() ? clickedFeature.getId() as number : 0;
                    const selectedData = jsonData[index];
                    setCardState({
                        top: evt.pixel[1],
                        left: evt.pixel[0],
                        itemData: selectedData,
                    })
                } else {
                    setCardState({
                        itemData: undefined,
                    })
                }
            });

            map.on("pointermove", function (evt) {
                const hit = map.forEachFeatureAtPixel(evt.pixel, () => true);

                if (hit) {
                    map.getTargetElement().style.cursor = 'pointer';
                } else {
                    map.getTargetElement().style.cursor = '';
                }
            });
        }

        return () => {
            map.setTarget(undefined);
        };
    }, [jsonData, filters, customLocations]);

    return <Box sx={{height: '100%'}}>
        <AppBar/>

        {!!cardState.itemData && <LocationOverview itemData={cardState.itemData}
                                                   style={{
                                                       top: cardState.top,
                                                       left: cardState.left,
                                                       position: 'absolute',
                                                       zIndex: 1,
                                                       backgroundColor: '#fff'
                                                   }}
                                                   itemHeight={48}/>}

        <Box component="main"
             sx={{width: `calc(100% - ${jsonData.length ? drawerWidth : 0}px)`, height: 'calc(100% - 64px)'}}>
            <Toolbar/>
            <Box id="map" sx={{width: "100%", height: "100%"}}/>
        </Box>

        {!!filteredData.length && <DataDrawer jsonData={filteredData} onLocationClick={coordinate => {
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