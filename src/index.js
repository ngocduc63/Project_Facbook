import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthContextProvider } from './context/authContext';
import { DarkModeContextProvider } from './context/darkModeContext';
import { RefecthInviteContextProvider } from './context/refecthInvite';
import { NotifiPostContextProvider } from './context/notifiPostContext';
import { ChatContextProvider } from './context/chatContext';
import { MessageContextProvider } from './context/messageContext';
import { SocketContextProvider } from './context/socketContext';
import { HomeContextProvider } from './context/homeContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <DarkModeContextProvider>
            <SocketContextProvider>
                <HomeContextProvider>
                    <AuthContextProvider>
                        <RefecthInviteContextProvider>
                            <NotifiPostContextProvider>
                                <ChatContextProvider>
                                    <MessageContextProvider>
                                        <App />
                                    </MessageContextProvider>
                                </ChatContextProvider>
                            </NotifiPostContextProvider>
                        </RefecthInviteContextProvider>
                    </AuthContextProvider>
                </HomeContextProvider>
            </SocketContextProvider>
        </DarkModeContextProvider>
    </React.StrictMode>,
);
