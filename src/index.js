import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthContextProvider } from './context/authContext';
import { DarkModeContextProvider } from './context/darkModeContext';
import { RefecthInviteContextProvider } from './context/refecthInvite';
import { NotifiPostContextProvider } from './context/notifiPostContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <DarkModeContextProvider>
            <AuthContextProvider>
                <RefecthInviteContextProvider>
                    <NotifiPostContextProvider>
                        <App />
                    </NotifiPostContextProvider>
                </RefecthInviteContextProvider>
            </AuthContextProvider>
        </DarkModeContextProvider>
    </React.StrictMode>,
);
