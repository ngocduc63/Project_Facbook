import { useState, useEffect, useCallback } from 'react';

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
import UserTableToolbar from './user-table-toolbar';

import Loading from '../../../components/loading/Loading';
import useAxiosPrivate from "../../../api/axiosPrivate"
import { toast } from 'react-toastify';
import { applyFilter, getComparator } from './utils';
import { debounce } from 'lodash';

function UserDashboard() {
    const [users, setUsers] = useState([])

    const axiosPrivate = useAxiosPrivate();

    const [page, setPage] = useState(1);

    const [hasNextPage, setHasNextPage] = useState(false);

    const [isLoading, setIsLoading] = useState(true);


    const [refesh, setRefresh] = useState(false);

    const [order, setOrder] = useState('asc');

    const [selected, setSelected] = useState([]);

    const [orderBy, setOrderBy] = useState('id');

    const filterName = '';

    const [inputSearch, setInputSearch] = useState('');

    const fetchSearchUser = debounce((input) => {
        setPage(1);
        fetchUsers(input, 1);
    }, 300);

    const debounceSearch = useCallback(debounce((nextValue) => fetchSearchUser(nextValue), 300), [])// eslint-disable-line react-hooks/exhaustive-deps

    const fetchUsers = useCallback((searchValue, pageNumber = 1) => {
        setIsLoading(true);
        const controller = new AbortController();
        const { signal } = controller;

        axiosPrivate.post(`/admin/get-all-user`, { 'page': pageNumber, 'username': searchValue }, { signal })
            .then((response) => {
                const data = response.data;
                setUsers(data.data.datas);
                setHasNextPage(pageNumber <= data.data.maxPage - 1);
                setIsLoading(false);
            })
            .catch(() => {
                setIsLoading(false);
                if (signal.aborted) return;
            });

        return () => controller.abort();
    }, [axiosPrivate]);


    useEffect(() => {
        fetchUsers(inputSearch, page);
    }, [page, inputSearch, fetchUsers, refesh]);


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
                toast.error('Error unblock',
                    {
                        position: 'top-right'
                    }
                )
            })
    }

    const dataFiltered = applyFilter({
        inputData: users,
        comparator: getComparator(order, orderBy),
        filterName,
    });

    const handleBackPage = () => {
        setPage(page - 1)
    }

    const handleNextPage = () => {
        setPage(page + 1)
    }

    const onFilterName = (e) => {
        setIsLoading(true)

        const input = e.target.value.trim();

        setInputSearch(input);
        debounceSearch(input);
    }

    const handleBlockUsers = () => {
        axiosPrivate.put(`/admin/block-users`, { 'list_id': selected })
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

    const handleUnblockUsers = () => {
        axiosPrivate.put(`/admin/unblock-users`, { 'list_id': selected })
            .then(() => {
                toast.success('Unblock success',
                    {
                        position: 'top-right'
                    }
                )

                setRefresh(!refesh);
            })
            .catch(() => {
                toast.error('Error unblock',
                    {
                        position: 'top-right'
                    }
                )
            })
    }

    return (
        <Container >
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography variant="h4">Quản lí tài khoản</Typography>
            </Stack>

            <Card>
                <UserTableToolbar
                    numSelected={selected.length}
                    onFilterName={onFilterName}
                    onCLickBlock={handleBlockUsers}
                    onCLickUnblock={handleUnblockUsers}
                />
                {isLoading && <Loading size={30} />}
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
                                {!isLoading && dataFiltered.map((row) => (
                                    <UserTableRow
                                        key={row.id}
                                        userId={row.id}
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

                                {/* {users.length <= 0 && <TableNoData query={filterName} />} */}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Scrollbar>

                <div style={{ padding: 8, display: 'flex', justifyContent: 'flex-end' }}>
                    <div style={{ display: 'flex', width: 100, justifyContent: 'space-around' }}>
                        {page > 1 && <span className='cur-point' onClick={handleBackPage}>{'<<'}</span>}
                        <span style={{ fontSize: 16, fontWeight: 600 }}>{`Trang: ${page}`}</span>
                        {hasNextPage && <span className='cur-point' onClick={handleNextPage}>{'>>'}</span>}
                    </div>
                </div>
            </Card>
        </Container>
    );
}

export default UserDashboard;
