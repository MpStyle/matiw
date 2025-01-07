import {createRoot} from 'react-dom/client'
import './index.css'
import {Home} from "./modules/home/components/Home.tsx";
import {Provider} from "react-redux";
import {persistor, store} from "./modules/core/AppStore.ts";
import {CssBaseline} from "@mui/material";
import {StrictMode} from "react";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterMoment} from "@mui/x-date-pickers/AdapterMoment";
import {PersistGate} from 'redux-persist/integration/react'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <LocalizationProvider dateAdapter={AdapterMoment}>
                    <CssBaseline/>
                    <Home/>
                </LocalizationProvider>
            </PersistGate>
        </Provider>
    </StrictMode>,
)
