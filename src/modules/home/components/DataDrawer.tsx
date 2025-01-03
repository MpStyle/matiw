import {CSSProperties, FunctionComponent} from "react";
import {Avatar, Box, Drawer, ListItem, ListItemAvatar, ListItemButton, ListItemText} from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import AutoSizer from "react-virtualized-auto-sizer";
import {VariableSizeList} from "react-window";
import {DataItem} from "../entities/DataItem.tsx";
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import moment from "moment/moment";
import {Constants} from "../../core/entities/Constants.ts";

export const drawerWidth = 280;

export interface DataDrawerProps {
    jsonData: DataItem[];
    onLocationClick: (coordinate?: string) => void;
}

export const DataDrawer: FunctionComponent<DataDrawerProps> = ({jsonData, onLocationClick}) => {
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

        <Box sx={{height: `calc(100% - 64px)`}}>
            <ReactWindowList jsonData={jsonData} onLocationClick={onLocationClick}/>
        </Box>
    </Drawer>;
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

const Row: FunctionComponent<{ data: RowData, index: number, style: CSSProperties; }> = ({data, index, style}) => {
    const itemData = data.jsonData[index];

    return <Box style={style}>
        <ListItem disablePadding>
            <ListItemButton onClick={() => data.onLocationClick(itemData.visit?.topCandidate?.placeLocation)}>
                <ListItemAvatar>
                    <Avatar>
                        <FmdGoodIcon/>
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={moment(new Date(itemData.startTime)).format(Constants.DateFormat)}
                              secondary={itemData.visit?.topCandidate?.placeLocation.replace("geo:", '')}/>
            </ListItemButton>
        </ListItem>
    </Box>;
};