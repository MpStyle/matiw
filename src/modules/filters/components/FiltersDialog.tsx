import React, {useEffect, useState} from 'react';
import {
    Box,
    Button,
    DialogActions,
    DialogContent,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Slider,
    SliderValueLabelProps,
    Stack,
    Tooltip
} from '@mui/material';
import {setFilters as setAppFilters} from "../../filters/slices/FiltersSlice.ts";
import {useDispatch, useSelector} from "react-redux";
import {AppState} from "../../core/entities/AppState.ts";
import {DataItem} from "../../home/entities/DataItem.ts";
import {DatePicker} from "@mui/x-date-pickers";
import moment from "moment";
import Typography from "@mui/material/Typography";
import Divider from '@mui/material/Divider';
import {initialFiltersState} from "../slices/FiltersSlice.ts";
import {MDialog} from "../../core/components/MDialog.tsx";

interface FilterDialogProps {
    open: boolean;
    onClose: () => void;
}

const FiltersDialog: React.FC<FilterDialogProps> = ({open, onClose,}) => {
    const dispatch = useDispatch();
    const jsonData = useSelector((appState: AppState) => appState.home.data);
    const settings = useSelector((appState: AppState) => appState.settings);
    const [maxDate, setMaxDate] = useState<string>('');
    const [minDate, setMinDate] = useState<string>('');
    const [years, setYears] = useState<string[]>([]);
    const [months, setMonths] = useState<string[]>([]);
    const [days, setDays] = useState<string[]>([]);
    const appFilters = useSelector((appState: AppState) => (appState.filters));
    const [filters, setFilters] = useState(appFilters);

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

    const startDate = filters.startDate === '' ? new Date(minDate) : filters.startDate;
    const endDate = filters.endDate === '' ? new Date(maxDate) : filters.endDate;

    return <MDialog open={open} onClose={onClose} fullWidth maxWidth="md" title="Filters">
        <DialogContent dividers>
            <Stack spacing={3} sx={{mt: 0}}>
                <Typography variant="h6"><b>Date range</b></Typography>

                <Slider
                    getAriaLabel={() => 'Date range'}
                    value={[new Date(startDate).getTime(), new Date(endDate).getTime()]}
                    onChange={(_, newValue) => {
                        const value = newValue as number[];
                        setFilters({
                            ...filters,
                            startDate: new Date(value[0]).toString(),
                            endDate: new Date(value[1]).toString()
                        });
                    }}
                    slots={{
                        valueLabel: ValueLabelComponent,
                    }}
                    min={new Date(minDate).getTime()}
                    max={new Date(maxDate).getTime()}
                    valueLabelDisplay="auto"
                    getAriaValueText={value => new Date(value).toString()}
                />

                <Stack direction="row" spacing={1} sx={{alignItems: "baseline"}}>
                    <DatePicker
                        slotProps={{
                            textField: {
                                fullWidth: true,
                                helperText: settings.dateFormat
                            }
                        }}
                        format={settings.dateFormat}
                        label="Start Date"
                        name="startDate"
                        value={moment(startDate)}
                        onChange={e => setFilters({...filters, startDate: e ? e.toDate().toString() : ''})}
                    />

                    <Box>-</Box>

                    <DatePicker
                        slotProps={{
                            textField: {
                                fullWidth: true,
                                helperText: settings.dateFormat
                            }
                        }}
                        format={settings.dateFormat}
                        label="End Date"
                        name="endDate"
                        value={moment(endDate)}
                        onChange={e => setFilters({...filters, endDate: e ? e.toDate().toString() : ''})}
                    />
                </Stack>

                <Divider/>

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
                            <MenuItem value={initialFiltersState.year}><em>&nbsp;</em></MenuItem>
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
                            <MenuItem value={initialFiltersState.month}><em>&nbsp;</em></MenuItem>
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
                            <MenuItem value={initialFiltersState.day}><em>&nbsp;</em></MenuItem>
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
    </MDialog>;
};

export default FiltersDialog;

const ValueLabelComponent = (props: SliderValueLabelProps) => {
    const dateTimeFormat = useSelector((appState: AppState) => appState.settings.dateTimeFormat);
    const {children, value} = props;

    if (!value) {
        return null;
    }

    return (
        <Tooltip enterTouchDelay={0} placement="top"
                 title={moment(parseInt(value.toString())).format(dateTimeFormat)}>
            {children}
        </Tooltip>
    );
}