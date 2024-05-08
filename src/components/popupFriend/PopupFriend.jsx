import InfiniteScroll from 'react-infinite-scroll-component';
import './popupFriend.scss';
import { useState, useEffect, useCallback } from 'react';
import Loading from "../loading/Loading";
import useAxiosPrivate from '../../api/axiosPrivate';
import { Link } from "react-router-dom";
import { toast } from "react-toastify"
import { debounce } from 'lodash';
import { LINK_API_AVATAR } from '../../api/const';

function PopupFriend({ setIsShowPopupFriend, isPopupFriend = true }) {
    const axiosPrivate = useAxiosPrivate();
    const [dataFriend, setDataFriend] = useState([]);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [pageNum, setPageNum] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [inputSearch, setInputSearch] = useState('');
    const [inputDebounce, setInputDebounce] = useState('');

    useEffect(() => {
        const controller = new AbortController();
        const { signal } = controller;

        if (inputDebounce) {
            const url = isPopupFriend ? '/friend-management/search-friend' : '/friend-management/search-invite';

            axiosPrivate.post((url), { 'username': inputDebounce, 'page': pageNum })
                .then(response => {
                    const data = response.data;
                    setDataFriend((prev) => [...prev, ...data.data.datas]);
                    setHasNextPage(pageNum <= data.data.maxPage - 1);
                    setIsLoading(false);
                })
                .catch(err => {
                    setIsLoading(false);
                    if (signal.aborted) return;

                    toast.error("Lỗi không tìm được", {
                        position: "top-right"
                    });
                });

        } else {
            const url = isPopupFriend ? '/friend-management/friend/' : '/friend-management/invite-friend/';

            axiosPrivate.get((`${url}${pageNum}`), { signal })
                .then((response) => {
                    const data = response.data;

                    setDataFriend((prev) => [...prev, ...data.data.datas]);
                    setHasNextPage(pageNum <= data.data.maxPage - 1);
                    setIsLoading(false);
                })
                .catch((error) => {
                    setIsLoading(false);
                    if (signal.aborted) return;
                });
        }
        return () => controller.abort();
    }, [pageNum, axiosPrivate, isPopupFriend, inputDebounce]);

    const deleteListInvite = (friend_id) => {
        let newList = dataFriend.filter(item => item.friend_id !== friend_id);

        setDataFriend(newList)
    }

    const handelAcceptFriend = (e, friend_id) => {
        e.preventDefault();
        axiosPrivate.put(('/friend-management/accept/' + friend_id))
            .then((response) => {
                toast.success("Xác nhận lời mời thành công", {
                    position: "top-right"
                })
                deleteListInvite(friend_id)
            })
            .catch((error) => {
                toast.error("Xác nhận lời mời thất bại", {
                    position: "top-right"
                })
            })
    }

    const handelCancelFriend = (e, friend_id) => {
        e.preventDefault();
        axiosPrivate.delete(('/friend-management/unfriend/' + friend_id))
            .then((response) => {
                toast.success("Hủy lời mời thành công", {
                    position: "top-right"
                })
                deleteListInvite(friend_id)
            })
            .catch((error) => {
                toast.error("Hủy lời mời thất bại", {
                    position: "top-right"
                })
            })
    }

    const handelClosePopup = () => {
        setIsShowPopupFriend(false)
    }
    const debounceSearch = useCallback(debounce((nextValue) => fetchUser(nextValue), 300), [])// eslint-disable-line react-hooks/exhaustive-deps

    const fetchUser = debounce((input) => {
        setInputDebounce(input);
        setDataFriend([]);
        setPageNum(1);
    }, 10)

    const handelInput = (e) => {
        setIsLoading(true);
        const input = e.target.value
        setInputSearch(input);
        debounceSearch(input.trim());
    }

    const content = dataFriend.map(user => {
        return (
            <div className='item'>
                <Link to={"/profile/" + user.friend_id} className="user" key={user.friend_id} onClick={handelClosePopup}>
                    <div className="userInfo">
                        <img
                            src={LINK_API_AVATAR + user.avatar}
                            alt=""
                        />
                    </div>
                    <div className="info">
                        <span>{user.name}</span>

                        <div className="buttons">
                            {!isPopupFriend && <button onClick={(e) => handelAcceptFriend(e, user.friend_id)}>Xác nhận</button>}
                            <button onClick={(e) => handelCancelFriend(e, user.friend_id)}>{isPopupFriend ? 'Hủy kết bạn' : 'Hủy'}</button>
                        </div>
                    </div>
                </Link>
            </div>
        )
    })

    return (
        <>
            <div className='popup-friend'>
                <div className='content'>
                    <header>
                        <h1>{isPopupFriend ? 'Danh sách bạn bè' : 'Danh sách lời mời'}</h1>
                        <button className="close" onClick={handelClosePopup}>
                            Đóng
                        </button>
                    </header>
                    <div className="search">
                        <input type="text" placeholder="Nhập tên người bạn muốn tìm..." value={inputSearch} onChange={handelInput} />
                    </div>
                    {isLoading && <Loading />}
                    {!isLoading && dataFriend.length <= 0 && <h3 style={{ textAlign: 'center' }}>{isPopupFriend ? 'Không có bạn bè' : 'Không có lời mời'}</h3>}
                    <InfiniteScroll
                        dataLength={dataFriend.length}
                        next={() => setPageNum(pageNum + 1)}
                        hasMore={hasNextPage}
                        loader={<Loading />}
                        className="main"
                        height={window.innerHeight * 3 / 4 - 100}
                    >
                        {content}
                    </InfiniteScroll>
                </div>
            </div>
        </>

    );
}

export default PopupFriend;