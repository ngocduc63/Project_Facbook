import './notificationList.scss';
import { useState, useEffect, useContext } from 'react';
import useAxiosPrivate from '../../api/axiosPrivate';
import Loading from '../../components/loading/Loading';
import InfiniteScroll from "react-infinite-scroll-component";
import { LINK_API_AVATAR } from '../../api/const';
import { timeAgo } from '../../helps/timer'
import { Link, useNavigate } from 'react-router-dom';
import { HomeContext } from '../../context/homeContext';
import { NotificationContext } from '../../context/notificationContext';

function NotificationList({ handleSelectNotificationItem }) {
    const navigate = useNavigate();
    const { setCurrentPost, setIsShowPopupPost } = useContext(HomeContext)
    const { setCountNotification } = useContext(NotificationContext)
    const [pageNum, setPageNum] = useState(1);
    const [dataNotifications, setDataNotifications] = useState([])
    const [hasNextPage, setHasNextPage] = useState(false);
    const axiosPrivate = useAxiosPrivate();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController()
        const { signal } = controller

        axiosPrivate.get((`/notification-management/notifications/${pageNum}`), { signal })
            .then((response) => {
                const data = response.data?.data?.datas
                setDataNotifications(prev => [...prev, ...data]);
                setHasNextPage(pageNum <= response.data.data.maxPage - 1);
                setCountNotification(0)
                setIsLoading(false);
            })
            .catch((error) => {
                if (signal.aborted) return
            })

        return () => controller.abort()
    }, [axiosPrivate, setDataNotifications, pageNum, setCountNotification]);

    const handleSelect = (type, post_id) => {
        if (type === 3 || type === 4) {
            setCurrentPost(post_id);
            setIsShowPopupPost(true);
        }

        handleSelectNotificationItem()
    }

    const handleRedirectToProfile = (e, userId) => {
        e.preventDefault();
        navigate(`/profile/${userId}`)
    }

    const content = dataNotifications.map((data, index) => {
        const link = data.type === 1 || data.type === 2 ? `/profile/${data.user.id}` : data.type === 5 ? `/post/${data.data.post_share}` : `/post/${data.data.post_id}`

        return (
            <Link to={link} className='noti-item' key={index} onClick={(e) => handleSelect(data.type, data.data.post_id)}>
                <div className='image'>
                    <img src={LINK_API_AVATAR + data.user.avatar} alt="" />
                </div>
                <div className='content'>
                    {data.type === 1 &&
                        <span><span>{data.user.username}</span> đã gửi lời mời kết bạn</span>
                    }
                    {data.type === 2 &&
                        <span><span>{data.user.username}</span> đã chấp nhận kết bạn</span>
                    }
                    {data.type === 3 &&
                        <span><span onClick={(e) => handleRedirectToProfile(e, data.user.id)}>{data.user.username}</span> đã thích bài viết của bạn</span>
                    }
                    {data.type === 4 &&
                        <span><span onClick={(e) => handleRedirectToProfile(e, data.user.id)}>{data.user.username}</span> đã bình luận bài viết của bạn</span>
                    }
                    {data.type === 5 &&
                        <span><span onClick={(e) => handleRedirectToProfile(e, data.user.id)}>{data.user.username}</span> đã chia sẻ bài viết của bạn</span>
                    }
                    <div className='time'>{timeAgo(data.create_at)}</div>
                </div>
            </Link>
        )
    })

    return (
        <div className="notification-popup-container">
            <header><span>Thông báo</span></header>
            {isLoading && <Loading size={30} />}
            {!isLoading && dataNotifications.length <= 0 && <div className='none'><span>Không có thông báo</span></div>}
            <InfiniteScroll
                dataLength={dataNotifications.length}
                next={() => setPageNum(pageNum + 1)}
                hasMore={hasNextPage}
                loader={<Loading size={25} />}
                height={350}
                className='list-noti'
            >
                {content}
            </InfiniteScroll>
        </div>
    );
}

export default NotificationList;