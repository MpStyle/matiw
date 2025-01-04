import {FunctionComponent} from "react";
import {DialogContent, FormControl, InputLabel, MenuItem, Select, Stack} from "@mui/material";
import Typography from "@mui/material/Typography";
import {useDispatch, useSelector} from "react-redux";
import {AppState} from "../../core/entities/AppState.ts";
import {setDateTimeFormat} from "../slices/SettingsSlice.ts";
import {MDialog} from "../../core/components/MDialog.tsx";

export interface SettingsDialogProps {
    open: boolean;
    onClose: () => void;
}

export const SettingsDialog: FunctionComponent<SettingsDialogProps> = ({open, onClose}) => {
    const settings = useSelector((appState: AppState) => appState.settings);
    const dispatch = useDispatch();

    return <MDialog open={open}
                    onClose={onClose}
                    fullWidth
                    maxWidth="sm"
                    title="Settings">
        <DialogContent dividers>
            <Stack spacing={3} sx={{mt: 0}}>
                <Typography variant="h6"><b>Date time format</b></Typography>
                <FormControl fullWidth>
                    <InputLabel id="date-time-format-select-label">Date time format</InputLabel>
                    <Select
                        labelId="date-time-format-select-label"
                        id="date-time-format-select"
                        value={settings.dateTimeFormat}
                        label="Date time format"
                        onChange={e => dispatch(setDateTimeFormat(e.target.value))}>
                        <MenuItem value="DD/MM/YYYY HH:mm">DD/MM/YYYY HH:mm</MenuItem>
                        <MenuItem value="MM/DD/YYYY HH:mm">MM/DD/YYYY HH:mm</MenuItem>
                        <MenuItem value="YYYY/MM/DD HH:mm">YYYY/MM/DD HH:mm</MenuItem>
                    </Select>
                </FormControl>
            </Stack>
        </DialogContent>
    </MDialog>
}