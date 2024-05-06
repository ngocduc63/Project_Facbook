import Login from './pages/login/Login';
import Register from './pages/register/Register';
import { createBrowserRouter, RouterProvider, Outlet, Navigate } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import LeftBar from './components/leftBar/LeftBar';
import RightBar from './components/rightBar/RightBar';
import Home from './pages/home/Home';
import Profile from './pages/profile/Profile';
import './style.scss';
import { useContext, useState } from 'react';
import { DarkModeContext } from './context/darkModeContext';
import { AuthContext } from './context/authContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Notification from './pages/notification/Notification';
import MessagePopup from './components/message/Message';
import React, { memo } from 'react';
import Chat from './pages/chat/Chat';
import Search from './components/search/Search';
import Call from './pages/call/Call';

function App() {
    const { currentUser } = useContext(AuthContext);

    const { darkMode } = useContext(DarkModeContext);

    const [isRefecth, setIsRefecth] = useState(false);

    const queryClient = new QueryClient();

    const Layout = memo(() => {
        return (
            <QueryClientProvider client={queryClient}>
                <div className={`theme-${darkMode ? 'dark' : 'light'}`}>
                    <Navbar isRefecth={isRefecth} setIsRefecth={setIsRefecth} />
                    <div style={{ display: 'flex' }}>
                        <LeftBar />
                        <div style={{ display: 'flex', flex: 7, backgroundColor: '#f6f3f3', justifyContent: 'center' }}>
                            <Outlet />
                        </div>
                        <RightBar />
                        <MessagePopup />
                    </div>
                    {currentUser && <Notification />}
                </div>
            </QueryClientProvider>
        );
    });

    const ProtectedRoute = ({ children }) => {
        if (!currentUser) {
            return <Navigate to="/login" />;
        }

        return children;
    };

    const RedirectRoute = ({ children }) => {
        if (currentUser) {
            return <Navigate to="/" />;
        }

        return children;
    };

    const router = createBrowserRouter([
        {
            path: '/',
            element: (
                <ProtectedRoute>
                    <Layout />
                </ProtectedRoute>
            ),
            children: [
                {
                    path: '/',
                    element: <Home isRefecth={isRefecth} />,
                },
                {
                    path: '/profile/:id',
                    element: <Profile />,
                },
                {
                    path: '/search/:username',
                    element: <Search />,
                },
            ],
        },
        {
            path: '/login',
            element: (
                <RedirectRoute>
                    <Login />
                </RedirectRoute>
            ),
        },
        {
            path: '/register',
            element: (
                <RedirectRoute>
                    <Register />
                </RedirectRoute>
            ),
        },
        {
            path: '/chat',
            element: (
                <ProtectedRoute>
                    <Chat />
                </ProtectedRoute>
            ),
        },
        {
            path: '/call/:roomId',
            element: (
                <ProtectedRoute>
                    <Call />
                </ProtectedRoute>
            ),
        },
    ]);

    return (
        <>
            <ToastContainer autoClose={3000} />
            <RouterProvider router={router} />
        </>
    );
}

export default App;
