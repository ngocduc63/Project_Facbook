import './search.scss';
import { useLocation, } from "react-router-dom";
import { useEffect, useState } from 'react';
import Loading from '../loading/Loading';
import useAxiosPrivate from '../../api/axiosPrivate';
import InfiniteScroll from 'react-infinite-scroll-component';
import { LINK_API_AVATAR } from '../../api/const';

function Search() {
    const location = useLocation();
    const axiosPrivate = useAxiosPrivate();
    const username = location.pathname.split("/")[2];
    const [dataUser, setDataUser] = useState([]);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [pageNum, setPageNum] = useState(1);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setDataUser([]);
        setIsLoading(true);
    }, [username]);

    useEffect(() => {
        const controller = new AbortController();
        const { signal } = controller;

        axiosPrivate.post((`/user-management/user/search`), { 'page': pageNum, 'username': username }, { signal })
            .then((response) => {
                const data = response.data;
                setDataUser((prev) => [...prev, ...data?.data?.datas]);
                setHasNextPage(pageNum <= data?.data?.maxPage - 1);
                setIsLoading(false);
            })
            .catch((error) => {
                setIsLoading(false);
                if (signal.aborted) return;
            });

        return () => controller.abort();

    }, [username, pageNum, axiosPrivate]);

    const handelRedirectToProfile = (user) => {
        window.location.href = `/profile/${user.id}`;
    }

    const content = dataUser.map(user => {
        return (
            <div className="item" key={user.id} onClick={() => handelRedirectToProfile(user)}>
                <div className="avatar">
                    <img src={LINK_API_AVATAR + user.avatar} alt="" />
                </div>
                <div className="right-item-search">
                    <span>{user.username}<span>{user.nickname && ` (${user.nickname})`}</span></span>
                    {user.isFriend === 1 && (<span className="check-friend">Bạn bè</span>)}
                </div>
            </div>
        )
    })

    return (
        <>
            {isLoading && <Loading />}
            <InfiniteScroll
                dataLength={dataUser.length}
                next={() => setPageNum(pageNum + 1)}
                hasMore={hasNextPage}
                loader={<Loading />}
                className="search-page"
            >
                {content}
            </InfiniteScroll>
        </>
    );
}

export default Search;