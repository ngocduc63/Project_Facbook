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
import { NotificationContextProvider } from './context/notificationContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <DarkModeContextProvider>
            <SocketContextProvider>
                <HomeContextProvider>
                    <AuthContextProvider>
                        <RefecthInviteContextProvider>
                            <ChatContextProvider>
                                <NotifiPostContextProvider>
                                    <MessageContextProvider>
                                        <NotificationContextProvider>
                                            <App />
                                        </NotificationContextProvider>
                                    </MessageContextProvider>
                                </NotifiPostContextProvider>
                            </ChatContextProvider>
                        </RefecthInviteContextProvider>
                    </AuthContextProvider>
                </HomeContextProvider>
            </SocketContextProvider>
        </DarkModeContextProvider>
    </React.StrictMode>,
);
