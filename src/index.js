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

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <DarkModeContextProvider>
            <SocketContextProvider>
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
            </SocketContextProvider>
        </DarkModeContextProvider>
    </React.StrictMode>,
);
