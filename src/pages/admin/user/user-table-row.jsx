import { useState } from 'react';
import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import Label from '../../../components/label';
import Iconify from '../../../components/iconify';
import { LINK_API_AVATAR } from '../../../api/const';

// ----------------------------------------------------------------------

export default function UserTableRow({
  selected,
  avatarUrl,
  username,
  email,
  gender,
  role,
  status,
  handleClick,
  handleBlockUser,
  handleUnblockUser,
}) {
  const [open, setOpen] = useState(null);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>

        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2} style={{ marginLeft: 20 }}>
            <Avatar alt={username} src={`${LINK_API_AVATAR}${avatarUrl}`} />
          </Stack>
        </TableCell>

        <TableCell>{username}</TableCell>

        <TableCell>{email}</TableCell>

        <TableCell>{gender === 1 ? 'Nam' : 'Nữ'}</TableCell>

        <TableCell>
          <Label color={(role === 1 && 'info') || 'warning'}>{role === 1 ? 'Admin' : 'User'}</Label>
        </TableCell>

        {/* <TableCell align="center">{isVerified ? 'Yes' : 'No'}</TableCell> */}

        <TableCell>
          <Label color={(status === 1 && 'error') || 'success'}>{status === 1 ? 'Blocked' : 'Active'}</Label>
        </TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      // PaperProps={{
      //   sx: { width: 140 },
      // }}
      >
        {status === 1 && <MenuItem onClick={() => { handleCloseMenu(); handleUnblockUser(); }}>
          <Iconify icon="mdi:plus" sx={{ mr: 2 }} />
          Unblock
        </MenuItem>}

        {status === 0 &&
          <MenuItem onClick={() => { handleCloseMenu(); handleBlockUser(); }} sx={{ color: 'error.main' }}>
            <Iconify icon="cil:ban" sx={{ mr: 2 }} />
            Block
          </MenuItem>
        }
      </Popover>
    </>
  );
}

UserTableRow.propTypes = {
  avatarUrl: PropTypes.string,
  username: PropTypes.string,
  email: PropTypes.string,
  gender: PropTypes.any,
  role: PropTypes.any,
  status: PropTypes.any,
  selected: PropTypes.any,
  handleClick: PropTypes.func,
  handleBlockUser: PropTypes.func,
  handleUnblockUser: PropTypes.func,

};
