import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthContextProvider } from './context/authContext';
import { DarkModeContextProvider } from './context/darkModeContext';
import { RefecthInviteContextProvider } from './context/refecthInvite';
import { NotifiPostContextProvider } from './context/notifiPostContext';
import { ChatContextProvider } from './context/chatContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <DarkModeContextProvider>
            <AuthContextProvider>
                <RefecthInviteContextProvider>
                    <NotifiPostContextProvider>
                        <ChatContextProvider>
                            <App />
                        </ChatContextProvider>
                    </NotifiPostContextProvider>
                </RefecthInviteContextProvider>
            </AuthContextProvider>
        </DarkModeContextProvider>
    </React.StrictMode>,
);
