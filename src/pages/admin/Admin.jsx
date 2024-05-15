import Nav from './nav/Nav';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Main from './Main'

function Admin({ children }) {
    const [openNav, setOpenNav] = useState(false);

    useEffect(() => {
        document.title = 'Dashboard';
    }, []);

    return (
        <Box
            sx={{
                minHeight: 1,
                display: 'flex',
                flexDirection: { xs: 'column', lg: 'row' },
            }}
        >
            <Nav openNav={openNav} onCloseNav={() => setOpenNav(false)} />

            <Main>{children}</Main>
        </Box>
    );
}

export default Admin;