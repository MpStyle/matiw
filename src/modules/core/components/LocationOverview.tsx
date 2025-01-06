import React, {CSSProperties, Fragment, FunctionComponent, useState} from "react";
import {useSelector} from "react-redux";
import {AppState} from "../entities/AppState.ts";
import {
    Avatar,
    Box,
    Icon,
    IconButton,
    ListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    Menu,
    MenuItem
} from "@mui/material";
import {Logo} from "../../filters/components/Logo.tsx";
import moment from "moment";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {EditLocationDialog} from "../../custom-location/components/EditLocationDialog.tsx";
import {DataItem} from "../../home/entities/DataItem.ts";
import {getMIconName, MDefaultIconColor} from "../book/MIcon.ts";

export interface LocationOverviewProps {
    itemData: DataItem;
    onLocationClick?: (coordinate?: string) => void;
    itemHeight: number;
    style?: CSSProperties | undefined;
}

export const LocationOverview: FunctionComponent<LocationOverviewProps> = ({
                                                                               itemData,
                                                                               onLocationClick,
                                                                               itemHeight,
                                                                               style
                                                                           }) => {
    const dateTimeFormat = useSelector((appState: AppState) => appState.settings.dateTimeFormat);
    const customLocations = useSelector((appState: AppState) => appState.customLocations);
    const placeLocation = itemData.visit?.topCandidate?.placeLocation;
    const customLocation = placeLocation && placeLocation in customLocations.data ? customLocations.data[placeLocation] : null;
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    let iconName: string | undefined = undefined;
    let iconColor: string | undefined = undefined;
    if (itemData.visit?.topCandidate.placeLocation && itemData.visit.topCandidate.placeLocation in customLocations.data) {
        iconName = customLocations.data[itemData.visit.topCandidate.placeLocation].iconName;
        iconColor = customLocations.data[itemData.visit.topCandidate.placeLocation].iconColor;
    }

    return <Fragment>
        <Box style={style}>
            <ListItem disablePadding>
                <ListItemButton onClick={() => {
                    if (onLocationClick) {
                        onLocationClick(placeLocation)
                    }
                }}>
                    <ListItemAvatar>
                        <Avatar sx={{backgroundColor: 'rgba(0,0,0,0)'}}>
                            {!!iconName &&
                                <Icon title={getMIconName(iconName, true)} sx={{color: iconColor ?? MDefaultIconColor}}>
                                    {iconName}
                                </Icon>}
                            {!iconName && <Logo sx={{width: 48, height: 48}}/>}
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={moment(new Date(itemData.startTime)).format(dateTimeFormat)}
                                  secondary={
                                      customLocation?.name ?? (placeLocation ?? '').replace("geo:", '')
                                  }
                                  title={(placeLocation ?? '').replace("geo:", '')}/>

                    <IconButton
                        aria-label="more"
                        id="long-button"
                        aria-controls={open ? 'long-menu' : undefined}
                        aria-expanded={open ? 'true' : undefined}
                        aria-haspopup="true"
                        onClick={e => {
                            e.stopPropagation();
                            handleClick(e);
                        }}
                    >
                        <MoreVertIcon/>
                    </IconButton>
                    <Menu
                        id="long-menu"
                        MenuListProps={{
                            'aria-labelledby': 'long-button',
                        }}
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        slotProps={{
                            paper: {
                                style: {
                                    maxHeight: itemHeight * 4.5,
                                    width: '20ch',
                                },
                            },
                        }}
                    >
                        <MenuItem onClick={e => {
                            e.stopPropagation();
                            handleClose();

                            if (placeLocation) {
                                setOpenEditDialog(true);
                            }
                        }}>
                            Edit location
                        </MenuItem>
                    </Menu>
                </ListItemButton>
            </ListItem>
        </Box>

        <EditLocationDialog placeLocation={placeLocation}
                            open={openEditDialog}
                            onClose={() => setOpenEditDialog(false)}/>
    </Fragment>;
}