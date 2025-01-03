import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import TuneIcon from '@mui/icons-material/Tune';
import React, {Fragment, FunctionComponent, useState} from "react";
import {UploadFile} from "@mui/icons-material";
import {Badge, Box, IconButton, styled, useTheme} from "@mui/material";
import FilterDialog from "../../filters/components/FilterDialog.tsx";
import {useDispatch, useSelector} from "react-redux";
import {AppState} from "../../core/entities/AppState.ts";
import {storeData} from "../slices/HomeSlice.ts";
import {DataItem} from "../entities/DataItem.tsx";
import {SettingsDialog} from "../../settings/components/SettingsDialog.tsx";
import SettingsIcon from '@mui/icons-material/Settings';
import {Logo} from "../../filters/components/Logo.tsx";

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

export const AppBar: FunctionComponent = () => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const [openFilters, setOpenFilters] = useState(false);
    const [openSettings, setSettingsOpen] = useState(false);
    const filters = useSelector((appState: AppState) => (appState.filters));
    const jsonData = useSelector((appState: AppState) => appState.home.data);
    const filterCount = Object.values(filters).filter(value => value).length;
    const jsonLoaded = jsonData.length > 0;

    const handleFiltersOpen = () => setOpenFilters(true);
    const handleFiltersClose = () => setOpenFilters(false);

    const handleSettingsOpen = () => setSettingsOpen(true);
    const handleSettingsClose = () => setSettingsOpen(false);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target?.result as string;
                const json = JSON.parse(content) as DataItem[];
                dispatch(storeData(json.filter(item => !!item.visit?.topCandidate?.placeLocation)));
            };
            reader.readAsText(file);
        }
    };

    return <Fragment>
        <MuiAppBar position="fixed"
                   elevation={2}
                   sx={{
                       backgroundColor: '#fff',
                       color: theme.palette.text.primary,
                       zIndex: theme.zIndex.drawer + 1
                   }}>
            <Toolbar>
                <Logo sx={{display: {xs: 'none', md: 'flex'}, mr: 1}}/>
                <Typography
                    variant="h6"
                    component="div"
                    sx={{
                        fontWeight: 'bold',
                        fontStretch: 'ultra-expanded',
                        fontWidth: 'ultra-expanded',
                        flexGrow: 1,
                        letterSpacing: 1.5,
                        background: "-webkit-linear-gradient(#45cbff, #be31fe)",
                        "-webkit-background-clip": "text",
                        "-webkit-text-fill-color": "transparent",
                    }}>
                    Matiw
                </Typography>

                <Box component="div" sx={{flexGrow: 1}}>
                    <IconButton component="label"
                                title="Upload Google Maps Timeline JSON"
                                role={undefined}
                                tabIndex={-1}>
                        <UploadFile/>
                        <VisuallyHiddenInput
                            type="file"
                            accept=".json"
                            onChange={handleFileUpload}
                        />
                    </IconButton>

                    {jsonLoaded && (
                        <Badge badgeContent={filterCount} color="primary">
                            <IconButton onClick={handleFiltersOpen} title="Filters">
                                <TuneIcon/>
                            </IconButton>
                        </Badge>
                    )}
                </Box>

                <IconButton onClick={handleSettingsOpen} title="Settings">
                    <SettingsIcon/>
                </IconButton>
            </Toolbar>
        </MuiAppBar>

        <FilterDialog
            open={openFilters}
            onClose={handleFiltersClose}
        />

        <SettingsDialog
            open={openSettings}
            onClose={handleSettingsClose}
        />
    </Fragment>;
}
