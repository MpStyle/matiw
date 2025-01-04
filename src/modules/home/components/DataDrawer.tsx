import {CSSProperties, FunctionComponent, useState} from "react";
import {
    Avatar,
    Box,
    Drawer,
    IconButton,
    ListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    Stack
} from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import AutoSizer from "react-virtualized-auto-sizer";
import {VariableSizeList} from "react-window";
import {DataItem} from "../entities/DataItem.tsx";
import moment from "moment/moment";
import {useSelector} from "react-redux";
import {AppState} from "../../core/entities/AppState.ts";
import {Logo} from "../../filters/components/Logo.tsx";
import SortIcon from '@mui/icons-material/Sort';
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

export const drawerWidth = 280;

export interface DataDrawerProps {
    jsonData: DataItem[];
    onLocationClick: (coordinate?: string) => void;
}

export const DataDrawer: FunctionComponent<DataDrawerProps> = ({jsonData, onLocationClick}) => {
    const [ascendingSort, setAscendingSort] = useState(true);

    return <Drawer
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

        <Stack direction="row" sx={{height: '40px', alignItems: 'center', p: 1}}>
            <Typography sx={{flex: 1}} variant="subtitle2">
                {jsonData.length} {jsonData.length === 1 ? 'location' : 'locations'}
            </Typography>
            <IconButton aria-label="toggle sort by date"
                        title={"Toggle sort by date"}
                        size={"small"}
                        onClick={() => setAscendingSort(!ascendingSort)}>
                <SortIcon/>
            </IconButton>
        </Stack>

        <Divider/>

        <Box sx={{height: `calc(100% - 64px - 40px)`}}>
            <ReactWindowList jsonData={ascendingSort ? jsonData : [...jsonData].reverse()}
                             onLocationClick={onLocationClick}/>
        </Box>
    </Drawer>;
}

const rowHeight = 85;

interface ReactWindowListProps {
    jsonData: DataItem[];
    onLocationClick: (coordinate?: string) => void;
}

const ReactWindowList: FunctionComponent<ReactWindowListProps> = ({jsonData, onLocationClick}) => {
    console.log(JSON.stringify(jsonData));

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

const Row: FunctionComponent<{ data: RowData, index: number, style: CSSProperties; }> = ({data, index, style}) => {
    const dateTimeFormat = useSelector((appState: AppState) => appState.settings.dateTimeFormat);
    const itemData = data.jsonData[index];

    return <Box style={style}>
        <ListItem disablePadding>
            <ListItemButton onClick={() => data.onLocationClick(itemData.visit?.topCandidate?.placeLocation)}>
                <ListItemAvatar>
                    <Avatar sx={{backgroundColor: 'rgba(0,0,0,0)'}}>
                        <Logo sx={{width: 48, height: 48}}/>
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={moment(new Date(itemData.startTime)).format(dateTimeFormat)}
                              secondary={itemData.visit?.topCandidate?.placeLocation.replace("geo:", '')}/>
            </ListItemButton>
        </ListItem>
    </Box>;
};