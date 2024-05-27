import { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import Avatar from '@mui/material/Avatar';
import { alpha } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import ListItemButton from '@mui/material/ListItemButton';
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";

import Scrollbar from '../../../components/scrollbar';
import { useResponsive } from '../../../hooks/use-responsive';
import { useLocation } from 'react-router-dom';
import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../context/authContext';
import { LINK_API_AVATAR } from '../../../api/const';
// import { NAV } from './config-layout';
// import navConfig from './config-navigation';

// ----------------------------------------------------------------------

export default function Nav({ openNav, onCloseNav }) {
    const pathname = useLocation();
    const { currentUser } = useContext(AuthContext)
    const NAV = {
        WIDTH: 280,
    };
    const navConfig = [
        {
            title: 'Thống kê',
            path: '/dashboard',
            icon: '',
        },
        {
            title: 'Tài khoản',
            path: '/dashboard/user',
            icon: '',
        },
        // {
        //     title: 'Bài viết',
        //     path: '/dashboard/post',
        //     icon: '',
        // },
    ]
    const upLg = useResponsive('up', 'lg');

    useEffect(() => {
        if (openNav) {
            onCloseNav();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    const renderAccount = (
        <Box
            sx={{
                my: 3,
                mx: 2.5,
                py: 2,
                px: 2.5,
                display: 'flex',
                borderRadius: 1.5,
                alignItems: 'center',
                bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
            }}
        >
            <Avatar src={`${LINK_API_AVATAR}${currentUser.avatar}`} alt="photoURL" />

            <Box sx={{ ml: 2 }}>
                <Typography variant="subtitle2">{currentUser.username}</Typography>

                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {'Admin'}
                </Typography>
            </Box>
        </Box>
    );

    const renderMenu = (
        <Stack component="nav" spacing={0.5} sx={{ px: 2 }}>
            {navConfig.map((item) => (
                <NavItem key={item.title} item={item} />
            ))}
        </Stack>
    );

    const renderContent = (
        <Scrollbar
            sx={{
                height: 1,
                '& .simplebar-content': {
                    height: 1,
                    display: 'flex',
                    flexDirection: 'column',
                },
            }}
        >
            <Link to={'/'} style={{ marginLeft: 20, marginTop: 30, color: '#000', display: 'flex', alignItems: 'center', textDecoration: 'none', columnGap: 5 }}><HomeOutlinedIcon />Trang chủ</Link>

            {renderAccount}

            {renderMenu}

            <Box sx={{ flexGrow: 1 }} />

        </Scrollbar>
    );

    return (
        <Box
            sx={{
                flexShrink: { lg: 0 },
                width: { lg: NAV.WIDTH },
            }}
        >
            {upLg ? (
                <Box
                    sx={{
                        height: 1,
                        position: 'fixed',
                        width: NAV.WIDTH,
                        borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
                    }}
                >
                    {renderContent}
                </Box>
            ) : (
                <Drawer
                    open={openNav}
                    onClose={onCloseNav}
                    PaperProps={{
                        sx: {
                            width: NAV.WIDTH,
                        },
                    }}
                >
                    {renderContent}
                </Drawer>
            )}
        </Box>
    );
}

Nav.propTypes = {
    openNav: PropTypes.bool,
    onCloseNav: PropTypes.func,
};

// ----------------------------------------------------------------------

function NavItem({ item }) {
    // const pathname = useLocation();

    // const active = item.path === pathname;
    const RouterLink = forwardRef(({ href, ...other }, ref) => <Link ref={ref} to={href} {...other} />);

    return (
        <ListItemButton
            component={RouterLink}
            href={item.path}
            sx={{
                minHeight: 44,
                borderRadius: 0.75,
                typography: 'body2',
                color: 'text.secondary',
                textTransform: 'capitalize',
                fontWeight: 'fontWeightMedium',
                // ...(true && {
                //     color: 'primary.main',
                //     fontWeight: 'fontWeightSemiBold',
                //     bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                //     '&:hover': {
                //         bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16),
                //     },
                // }),
            }}
        >
            <Box component="span" sx={{ width: 24, height: 24, mr: 2 }}>
                {item.icon}
            </Box>

            <Box component="span">{item.title} </Box>
        </ListItemButton>
    );
}

NavItem.propTypes = {
    item: PropTypes.object,
};
