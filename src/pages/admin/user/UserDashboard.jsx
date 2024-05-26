import { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';

import Scrollbar from '../../../components/scrollbar/scrollbar';

// import TableNoData from './table-no-data';
import UserTableRow from './user-table-row';
import UserTableHead from './user-table-head';
// import TableEmptyRows from './table-empty-rows';
import UserTableToolbar from './user-table-toolbar';
// import { emptyRows, applyFilter, getComparator } from './utils';

import Loading from '../../../components/loading/Loading';
import useAxiosPrivate from "../../../api/axiosPrivate"
import { toast } from 'react-toastify';

function UserDashboard() {
    const [users, setUsers] = useState([])

    const axiosPrivate = useAxiosPrivate();

    const [page, setPage] = useState(1);

    const [isLoading, setIsLoading] = useState(true);

    const [refesh, setRefresh] = useState(false);

    const [order, setOrder] = useState('asc');

    const [selected, setSelected] = useState([]);

    const [orderBy, setOrderBy] = useState('name');

    const [filterName, setFilterName] = useState('');

    useEffect(() => {
        setIsLoading(true)
        const controller = new AbortController()
        const { signal } = controller

        axiosPrivate.get(`/admin/get-all-user/${page}`, { signal })
            .then((response) => {
                setUsers(response.data.data.datas)
                setIsLoading(false);
            })
            .catch(() => {
                if (signal.aborted) return
            })

        return () => controller.abort()
    }, [axiosPrivate, page, refesh]);

    const handleSort = (event, id) => {
        const isAsc = orderBy === id && order === 'asc';
        if (id !== '') {
            setOrder(isAsc ? 'desc' : 'asc');
            setOrderBy(id);
        }
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = users.map((n) => n.id);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1)
            );
        }
        setSelected(newSelected);
    };

    // const handleChangePage = (event, newPage) => {
    //     setPage(newPage);
    // };

    const handleFilterByName = (event) => {
        setPage(0);
        setFilterName(event.target.value);
    };

    const handleBlockUser = (event, user_id) => {
        axiosPrivate.put(`/admin/block-user/${user_id}`)
            .then(() => {
                toast.success('Block success',
                    {
                        position: 'top-right'
                    }
                )

                setRefresh(!refesh);
            })
            .catch(() => {
                toast.error('Error block',
                    {
                        position: 'top-right'
                    }
                )
            })
    }

    const handleUnblockUser = (event, user_id) => {
        axiosPrivate.put(`/admin/unblock-user/${user_id}`)
            .then(() => {
                toast.success('Unblock success',
                    {
                        position: 'top-right'
                    }
                )

                setRefresh(!refesh);
            })
            .catch(() => {
                toast.error('Error block',
                    {
                        position: 'top-right'
                    }
                )
            })
    }

    // const dataFiltered = applyFilter({
    //     inputData: users,
    //     comparator: getComparator(order, orderBy),
    //     filterName,
    // });

    // const notFound = !dataFiltered.length && !!filterName;

    return (
        <Container >
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography variant="h4">Quản lí tài khoản</Typography>
            </Stack>

            <Card>
                <UserTableToolbar
                    numSelected={selected.length}
                    filterName={filterName}
                    onFilterName={handleFilterByName}
                />

                <Scrollbar>
                    <TableContainer sx={{ overflow: 'unset' }}>
                        <Table sx={{ minWidth: 800 }}>
                            <UserTableHead
                                order={order}
                                orderBy={orderBy}
                                rowCount={users.length}
                                numSelected={selected.length}
                                onRequestSort={handleSort}
                                onSelectAllClick={handleSelectAllClick}
                                headLabel={[
                                    { id: 'avatar', label: 'Avatar' },
                                    { id: 'username', label: 'Username' },
                                    { id: 'email', label: 'Email' },
                                    { id: 'gender', label: 'Gender' },
                                    { id: 'role', label: 'Role' },
                                    { id: 'is_block', label: 'Status' },
                                    { id: '' },
                                ]}
                            />
                            <TableBody>
                                {!isLoading && users.map((row) => (
                                    <UserTableRow
                                        key={row.id}
                                        avatarUrl={row.avatar}
                                        username={row.username}
                                        email={row.email}
                                        gender={row.gender}
                                        role={row.role}
                                        status={row.is_block}
                                        selected={selected.indexOf(row.id) !== -1}
                                        handleClick={(event) => handleClick(event, row.id)}
                                        handleBlockUser={(event) => handleBlockUser(event, row.id)}
                                        handleUnblockUser={(event) => handleUnblockUser(event, row.id)}
                                    />
                                ))}

                                {/* <TableEmptyRows
                                    height={77}
                                    emptyRows={emptyRows(page, 10, users.length)}
                                /> */}

                                {/* {notFound && <TableNoData query={filterName} />} */}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Scrollbar>

                {/* <TablePagination
                    page={page}
                    component="div"
                    count={users.length}
                    rowsPerPage={10}
                    onPageChange={handleChangePage}
                    labelRowsPerPage={false}
                    rowsPerPageOptions={[]}
                /> */}
            </Card>
        </Container>
    );
}

export default UserDashboard;
