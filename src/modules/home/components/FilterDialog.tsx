import React, {useEffect, useState} from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl, IconButton,
    InputLabel,
    MenuItem,
    Select,
    Stack
} from '@mui/material';
import {initialHomeState, setFilters as setAppFilters} from "../slices/HomeSlice.ts";
import {useDispatch, useSelector} from "react-redux";
import {AppState} from "../../core/entities/AppState.ts";
import {DataItem} from "../entities/DataItem.tsx";
import {DatePicker} from "@mui/x-date-pickers";
import moment from "moment";
import Typography from "@mui/material/Typography";
import CloseIcon from '@mui/icons-material/Close';
import Divider from '@mui/material/Divider';

interface FilterDialogProps {
    open: boolean;
    onClose: () => void;
}

const FilterDialog: React.FC<FilterDialogProps> = ({
                                                       open,
                                                       onClose,
                                                   }) => {
    const dispatch = useDispatch();
    const [maxDate, setMaxDate] = useState<string>('');
    const [minDate, setMinDate] = useState<string>('');
    const [years, setYears] = useState<string[]>([]);
    const [months, setMonths] = useState<string[]>([]);
    const [days, setDays] = useState<string[]>([]);
    const appFilters = useSelector((appState: AppState) => (appState.home.filters));
    const [filters, setFilters] = useState(appFilters);
    const jsonData = useSelector((appState: AppState) => appState.home.data);

    useEffect(() => {
        if (!jsonData.length) {
            return;
        }

        // Extract unique years, months, and days
        let minDate = new Date(jsonData[0].startTime);
        let maxDate = new Date(jsonData[0].startTime);
        const uniqueYears = new Set<string>();
        const uniqueMonths = new Set<string>();
        const uniqueDays = new Set<string>();

        jsonData.forEach((item: DataItem) => {
            const date = new Date(item.startTime);

            uniqueYears.add(date.getFullYear().toString());
            uniqueMonths.add((date.getMonth() + 1).toString());
            uniqueDays.add(date.getDate().toString());

            if (date < minDate) {
                minDate = date;
            }
            if (date > maxDate) {
                maxDate = date;
            }
        });

        setYears(Array.from(uniqueYears).sort());
        setMonths(Array.from(uniqueMonths).sort((a, b) => parseInt(a) - parseInt(b)));
        setDays(Array.from(uniqueDays).sort((a, b) => parseInt(a) - parseInt(b)));

        setMinDate(minDate.toString());
        setMaxDate(maxDate.toString());
    }, [jsonData]);

    return (
        <Dialog open={open}
                onClose={onClose}
                fullWidth
                maxWidth="md">
            <DialogTitle sx={{
                textAlign: "center",
                fontSize: "1em",
                fontWeight: "bold"
            }}>
                Filters
            </DialogTitle>

            <IconButton
                aria-label="close"
                onClick={onClose}
                sx={(theme) => ({
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: theme.palette.grey[500],
                })}
            >
                <CloseIcon />
            </IconButton>

            <DialogContent dividers>
                <Stack spacing={3} sx={{mt: 0}}>
                    <Typography variant="h6"><b>Date range</b></Typography>
                    <Stack direction="row" spacing={1} sx={{alignItems: "baseline"}}>
                        <DatePicker
                            slotProps={{textField: {fullWidth: true}}}
                            label="Start Date"
                            name="startDate"
                            value={filters.startDate === '' ? moment(minDate) : moment(filters.startDate)}
                            onChange={e => setFilters({...filters, startDate: e ? e.toDate().toString() : ''})}
                        />

                        <Box>-</Box>

                        <DatePicker
                            slotProps={{textField: {fullWidth: true}}}
                            label="End Date"
                            name="endDate"
                            value={filters.startDate === '' ? moment(maxDate) : moment(filters.endDate)}
                            onChange={e => setFilters({...filters, endDate: e ? e.toDate().toString() : ''})}
                        />
                    </Stack>

                    <Divider />

                    <Typography variant="h6"><b>Date</b></Typography>
                    <Stack direction="row" spacing={1} sx={{alignItems: "baseline"}}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-standard-label">Year</InputLabel>
                            <Select
                                label="Year"
                                name="year"
                                value={filters.year}
                                onChange={e => setFilters({...filters, year: e.target.value})}
                                fullWidth>
                                <MenuItem value={initialHomeState.filters.year}><em>&nbsp;</em></MenuItem>
                                {years.map(year => (
                                    <MenuItem key={year} value={year}>
                                        {year}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Box>/</Box>

                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-standard-label">Month</InputLabel>
                            <Select
                                label="Month"
                                name="month"
                                value={filters.month}
                                onChange={e => setFilters({...filters, month: e.target.value})}
                                fullWidth>
                                <MenuItem value={initialHomeState.filters.month}><em>&nbsp;</em></MenuItem>
                                {months.map(month => (
                                    <MenuItem key={month} value={month}>
                                        {month}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Box>/</Box>

                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-standard-label">Day</InputLabel>
                            <Select
                                label="Day"
                                name="day"
                                value={filters.day}
                                onChange={e => setFilters({...filters, day: e.target.value})}>
                                <MenuItem value={initialHomeState.filters.day}><em>&nbsp;</em></MenuItem>
                                {days.map(day => (
                                    <MenuItem key={day} value={day}>
                                        {day}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Stack>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" onClick={() => {
                    dispatch(setAppFilters(filters));

                    onClose();
                }}>
                    Search
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default FilterDialog;