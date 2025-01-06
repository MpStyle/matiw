import {CSSProperties, Fragment, FunctionComponent, useState} from "react";
import {Badge, Box, Drawer, IconButton, Stack} from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import AutoSizer from "react-virtualized-auto-sizer";
import {VariableSizeList} from "react-window";
import {DataItem} from "../entities/DataItem.ts";
import SortIcon from '@mui/icons-material/Sort';
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import {LocationOverview} from "../../core/components/LocationOverview.tsx";
import TuneIcon from "@mui/icons-material/Tune";
import {useSelector} from "react-redux";
import {AppState} from "../../core/entities/AppState.ts";
import FiltersDialog from "../../filters/components/FiltersDialog.tsx";

export const drawerWidth = 300;

export interface DataDrawerProps {
    jsonData: DataItem[];
    onLocationClick: (coordinate?: string) => void;
}

export const DataDrawer: FunctionComponent<DataDrawerProps> = ({jsonData, onLocationClick}) => {
    const [ascendingSort, setAscendingSort] = useState(true);
    const [openFilters, setOpenFilters] = useState(false);
    const filters = useSelector((appState: AppState) => (appState.filters));
    const filterCount = Object.values(filters).filter(value => value).length;

    const handleFiltersOpen = () => setOpenFilters(true);
    const handleFiltersClose = () => setOpenFilters(false);

    return <Fragment>
        <Drawer
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                },
                zIndex: 9
            }}
            variant="permanent"
            anchor="right">
            <Toolbar/>

            <Stack direction="row" sx={{height: '65px', alignItems: 'center', p: 2}}>
                <Typography sx={{flex: 1}} variant="subtitle2">
                    {jsonData.length} {jsonData.length === 1 ? 'location' : 'locations'}
                </Typography>

                <IconButton aria-label="toggle sort by date"
                            title={"Toggle sort by date"}
                            size={"small"}
                            sx={{transform: ascendingSort ? "scale(1, -1)" : null}}
                            onClick={() => setAscendingSort(!ascendingSort)}>
                    <SortIcon/>
                </IconButton>

                <Badge badgeContent={filterCount} color="primary">
                    <IconButton onClick={handleFiltersOpen} title="Filters" size="small">
                        <TuneIcon/>
                    </IconButton>
                </Badge>
            </Stack>

            <Divider/>

            <Box sx={{height: `calc(100% - 64px - 65px)`}}>
                <ReactWindowList jsonData={ascendingSort ? jsonData : [...jsonData].reverse()}
                                 onLocationClick={onLocationClick}/>
            </Box>
        </Drawer>

        <FiltersDialog
            open={openFilters}
            onClose={handleFiltersClose}
        />
    </Fragment>;
}

const rowHeight = 85;

interface ReactWindowListProps {
    jsonData: DataItem[];
    onLocationClick: (coordinate?: string) => void;
}

const ReactWindowList: FunctionComponent<ReactWindowListProps> = ({jsonData, onLocationClick}) => {
    return <AutoSizer>
        {({height, width}) => (
            <VariableSizeList
                className="List"
                height={height}
                itemKey={index => `${jsonData[index].startTime}-${jsonData[index].visit?.topCandidate?.placeLocation}`}
                itemCount={jsonData.length}
                itemSize={() => rowHeight}
                itemData={{jsonData, onLocationClick}}
                width={width}>
                {Row}
            </VariableSizeList>
        )}
    </AutoSizer>;
};

interface RowData {
    jsonData: DataItem[];
    onLocationClick: (coordinate?: string) => void;
}

const ITEM_HEIGHT = 48;

const Row: FunctionComponent<{ data: RowData, index: number, style: CSSProperties; }> = ({data, index, style}) => {
    const itemData = data.jsonData[index];
    return <LocationOverview itemData={itemData}
                             style={style}
                             onLocationClick={data.onLocationClick}
                             itemHeight={ITEM_HEIGHT}/>;
};