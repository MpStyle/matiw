import {FunctionComponent} from "react";
import FmdGoodIcon from "@mui/icons-material/FmdGood";
import {SvgIcon, Theme} from "@mui/material";
import {SxProps} from "@mui/system";

export interface LogoProps {
    sx?: SxProps<Theme>;
}

export const Logo: FunctionComponent<LogoProps> = props => {
    return <SvgIcon
        component="svg"
        viewBox="0 0 24 24"
        sx={{...(props.sx ?? {}), display: 'inline-block'}}>
        <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor: "#45cbff", stopOpacity: 1}}/>
                <stop offset="100%" style={{stopColor: "#be31fe", stopOpacity: 1}}/>
            </linearGradient>
        </defs>
        <FmdGoodIcon sx={{fill: "url(#gradient1)"}}/>
    </SvgIcon>;
}