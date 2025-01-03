import {FunctionComponent} from "react";
import {useSelector} from "react-redux";
import {AppState} from "../../core/entities/AppState.ts";
import {Drawer, List} from "@mui/material";
import Toolbar from "@mui/material/Toolbar";

export const drawerWidth = 240;

export const DataDrawer: FunctionComponent = () => {
    const jsonData = useSelector((appState: AppState) => appState.home.data);

    if(jsonData.length === 0) {
        return null;
    }

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
        <Toolbar />
        <List>
            {/*{jsonData.map((item) => (*/}
            {/*    <ListItem key={item.startTime} disablePadding>*/}
            {/*        <ListItemButton>*/}
            {/*            <ListItemText primary={item.startTime} secondary={item.visit?.topCandidate?.placeLocation} />*/}
            {/*        </ListItemButton>*/}
            {/*    </ListItem>*/}
            {/*))}*/}
        </List>
    </Drawer>;
}