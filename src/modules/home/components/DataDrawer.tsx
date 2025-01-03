import React, {CSSProperties, FunctionComponent} from "react";
import {useSelector} from "react-redux";
import {AppState} from "../../core/entities/AppState.ts";
import {Avatar, Box, Drawer, ListItem, ListItemAvatar, ListItemText, useTheme} from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import AutoSizer from "react-virtualized-auto-sizer";
import {VariableSizeList} from "react-window";
import {DataItem} from "../entities/DataItem.tsx";
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import moment from "moment/moment";

export const drawerWidth = 240;

export const DataDrawer: FunctionComponent = () => {
    const jsonData = useSelector((appState: AppState) => appState.home.data);

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
            <ReactWindowList jsonData={jsonData}/>
        </Box>
    </Drawer>;
}

const rowHeight = 85;

const Row: FunctionComponent<{ data: DataItem[], index: number, style: CSSProperties; }> = ({data, index, style}) => {
    const theme = useTheme();
    const itemData = data[index];

    return <Box style={style}>
        <ListItem>
            <ListItemAvatar>
                <Avatar>
                    <FmdGoodIcon/>
                </Avatar>
            </ListItemAvatar>
            <ListItemText primary={moment(new Date(itemData.startTime)).format('YYYY-MM-DD HH:mm')}
                          secondary={itemData.visit?.topCandidate?.placeLocation.replace("geo:", '')}/>
        </ListItem>

        {/*<Box sx={{*/}
        {/*    p: 1,*/}
        {/*    '&:hover': {*/}
        {/*        backgroundColor: theme.palette.action.hover*/}
        {/*    }*/}
        {/*}}>*/}
        {/*    <Typography variant="body1" component="div">*/}
        {/*        {moment(new Date(itemData.startTime)).format('YYYY-MM-DD HH:mm')}*/}
        {/*    </Typography>*/}
        {/*    <Typography variant="subtitle1" sx={{color: 'text.secondary'}}>*/}
        {/*        <b>Place</b>: {itemData.visit?.topCandidate?.placeLocation.replace("geo:", '')}*/}
        {/*    </Typography>*/}
        {/*</Box>*/}
    </Box>;
};

const ReactWindowList: FunctionComponent<{ jsonData: DataItem[] }> = ({jsonData}) => {
    return <AutoSizer>
        {({height, width}) => (
            <VariableSizeList
                className="List"
                height={height}
                itemKey={index => `${jsonData[index].startTime}-${jsonData[index].visit?.topCandidate?.placeLocation}`}
                itemCount={jsonData.length}
                itemSize={() => rowHeight}
                itemData={jsonData}
                width={width}>
                {Row}
            </VariableSizeList>
        )}
    </AutoSizer>;
};