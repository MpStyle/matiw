import {FunctionComponent} from "react";
import {Dialog, DialogProps, DialogTitle, IconButton} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export interface MDialogProps extends DialogProps {
    title: string;
}

export const MDialog: FunctionComponent<MDialogProps> = props => {
    return <Dialog {...props}>
        <DialogTitle sx={{
            textAlign: "center",
            fontSize: "1em",
            fontWeight: "bold"
        }}>
            {props.title}
        </DialogTitle>

        <IconButton
            aria-label="close"
            onClick={e => {
                if (props.onClose) {
                    props.onClose(e, 'escapeKeyDown')
                }
            }}
            sx={(theme) => ({
                position: 'absolute',
                right: 8,
                top: 8,
                color: theme.palette.grey[500],
            })}
        >
            <CloseIcon/>
        </IconButton>

        {props.children}
    </Dialog>;
};