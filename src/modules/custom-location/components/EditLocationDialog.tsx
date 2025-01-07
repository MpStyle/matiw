import {FunctionComponent, useState} from "react";
import {MDialog} from "../../core/components/MDialog.tsx";
import {
    Box,
    Button,
    DialogActions,
    DialogContent,
    Icon,
    IconButton,
    InputAdornment,
    Stack,
    TextField,
    useTheme
} from "@mui/material";
import {SketchPicker} from 'react-color'
import {getMIconName, MDefaultIconColor, MDefaultIconName, MGroupedIcons, MIconGroups} from "../../core/book/MIcon.ts";
import Typography from "@mui/material/Typography";
import {StringUtils} from "../../core/book/StringUtils.ts";
import {useDispatch, useSelector} from "react-redux";
import {addCustomLocation, deleteCustomLocation} from "../slices/CustomLocationSlice.ts";
import {CustomLocation} from "../entities/CustomLocation.ts";
import {AppState} from "../../core/entities/AppState.ts";

interface EditLocationDialogProps {
    placeLocation: string | undefined;
    open: boolean;
    onClose: () => void;
}

/**
 * Icons:
 * - https://fonts.google.com/icons?selected=Material+Symbols+Sharp:close:FILL@0;wght@400;GRAD@0;opsz@24&icon.size=24&icon.color=%23e8eaed&icon.query=cancel&icon.style=Sharp
 * - https://github.com/google/material-design-icons/blob/master/font/MaterialIcons-Regular.codepoints
 * @param props
 * @constructor
 */
export const EditLocationDialog: FunctionComponent<EditLocationDialogProps> = props => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const customLocations = useSelector((appState: AppState) => appState.customLocations);
    const defaultCustomLocation = props.placeLocation && props.placeLocation in customLocations.data ? customLocations.data[props.placeLocation] : null;
    const [customLocation, setCustomLocation] = useState<CustomLocation | null>(defaultCustomLocation);
    const onClose = () => {
        props.onClose();
        setCustomLocation(defaultCustomLocation);
    }

    return <MDialog title="Edit location"
                    open={props.open}
                    onClose={onClose}
                    maxWidth="md">
        <Box sx={{p: 2}}>
            <TextField label="Location name"
                       variant="outlined"
                       fullWidth
                       onChange={e => setCustomLocation({
                           ...customLocation,
                           name: e.target.value
                       })}
                       slotProps={{
                           input: {
                               startAdornment: customLocation?.iconName ?
                                   <InputAdornment position="start">
                                       <Icon sx={{color: (customLocation ?? {iconColor: MDefaultIconColor}).iconColor}}>
                                           {(customLocation ?? {iconName: MDefaultIconName}).iconName}
                                       </Icon>
                                   </InputAdornment>
                                   : null,
                           },
                       }}/>
        </Box>
        <DialogContent dividers>
            <Stack spacing={2}>
                <Stack direction="row" spacing={2}>
                    <Box>
                        {MIconGroups.map((group) => {
                            return <Stack spacing={1} key={`icon-group-${group}`}>
                                <Typography sx={{fontWeight: 'bold'}}>{StringUtils.capitalize(group) + "s"}</Typography>
                                <Box>
                                    {Object.keys(MGroupedIcons[group]).map(iconName => {
                                        return <Box component="span" sx={{m: 1, display: "inline-block"}} key={`icon-key-${iconName}`}>
                                            <IconButton
                                                sx={{
                                                    backgroundColor: customLocation?.iconName === iconName ? theme.palette.grey[200] : 'none'
                                                }}
                                                onClick={() => {
                                                    setCustomLocation({
                                                        ...(customLocation ?? {iconColor: MDefaultIconColor}),
                                                        iconName
                                                    })
                                                }}>
                                                <Icon title={getMIconName(iconName, true)}>{iconName}</Icon>
                                            </IconButton>
                                        </Box>
                                    })}
                                </Box>
                            </Stack>
                        })}
                    </Box>
                    <Box>
                        <SketchPicker
                            width={'350px'}
                            color={customLocation?.iconColor}
                            onChangeComplete={e => {
                                setCustomLocation({
                                    ...(customLocation ?? {iconName: MDefaultIconName}),
                                    iconColor: e.hex
                                })
                            }}/>
                    </Box>
                </Stack>
            </Stack>
        </DialogContent>

        <DialogActions>
            <Button variant="outlined" onClick={() => {
                if (props.placeLocation) {
                    dispatch(deleteCustomLocation({placeLocation: props.placeLocation}));
                }
                props.onClose();
            }}>
                Reset
            </Button>

            <div style={{flex: 1}}/>

            <Button variant="outlined" onClick={() => {
                props.onClose();
            }}>
                Cancel
            </Button>
            <Button variant="contained" onClick={() => {
                if (customLocation && props.placeLocation) {
                    dispatch(addCustomLocation({
                        placeLocation: props.placeLocation,
                        customLocation
                    }));
                }
                props.onClose();
            }}>
                Save
            </Button>
        </DialogActions>
    </MDialog>
}