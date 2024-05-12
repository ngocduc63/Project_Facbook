import { ChatContext } from '../../context/chatContext'
import { useState, useEffect, useContext } from 'react';
import useAxiosPrivate from '../../api/axiosPrivate';
import { AuthContext } from '../../context/authContext';
import Loading from '../../components/loading/Loading';
import InfiniteScroll from "react-infinite-scroll-component";
import { MessageContext } from '../../context/messageContext';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { LINK_API_AVATAR } from '../../api/const';

function ChatList({ handleSelectRoomChat, isChatPage = false }) {
    const { currentUser } = useContext(AuthContext);
    const { currentRoom, setCurrentRoom } = useContext(MessageContext);
    const { listRoom, setListRoom } = useContext(ChatContext);
    const [pageNum, setPageNum] = useState(1)
    const [hasNextPage, setHasNextPage] = useState(false);
    const axiosPrivate = useAxiosPrivate();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!isChatPage) return;
        if (!isLoading) return;

        setCurrentRoom(listRoom[0]?._id?.room_id?.$oid);
    }, [isLoading, isChatPage])

    useEffect(() => {
        return () => setListRoom([]);
    }, [setListRoom]);

    useEffect(() => {
        const controller = new AbortController()
        const { signal } = controller

        axiosPrivate.get((`/chat-management/chat-list/${pageNum}`), { signal })
            .then((response) => {
                const data = JSON.parse(response.data?.data?.datas)
                setListRoom(prev => [...prev, ...data]);
                setHasNextPage(pageNum <= response.data.data.maxPage - 1);
                setIsLoading(true);
            })
            .catch((error) => {
                if (signal.aborted) return
            })

        return () => controller.abort()
    }, [axiosPrivate, setListRoom, pageNum]);

    const handelClickRoomChat = (data) => {
        // set watched chat room
        const roomCurrent = listRoom.find((room) => room._id?.room_id?.$oid === data._id?.room_id?.$oid);

        if (roomCurrent) {
            const index = listRoom.indexOf(roomCurrent);
            if (index > -1) {
                const listRoomNew = [...listRoom];
                listRoomNew[index].last_mess.watched = 1;
                setListRoom(listRoomNew);
            }
        }

        handleSelectRoomChat(data)
    }

    const content = listRoom.map((data, index) => {
        const friend = data.users.username_friend.user_id === currentUser.id ? data.users.username_key : data.users.username_friend;
        const watched = +data?.last_mess?.sender !== currentUser.id && data?.last_mess?.watched === 0;
        return (
            <div
                className="item"
                key={index}
                onClick={() => handelClickRoomChat(data)}
            >
                {currentRoom === data?._id?.room_id?.$oid && <div className='bg-focus'></div>}
                <div className='image'>
                    <img src={LINK_API_AVATAR + friend.avatar} alt="" />
                </div>
                <div className="texts">
                    <span style={{ fontWeight: watched && 700 }}>
                        {friend.username}
                    </span>
                    {/* <p>{chat.lastMessage}</p> */}
                    {data.last_mess.sender !== 0 &&
                        <div className='description' style={{ fontWeight: watched && 600 }}>
                            <p className='sender'>{+data.last_mess?.sender === friend.user_id ? friend.username : 'Bạn'}: {data.last_mess?.text}</p>
                        </div>
                    }
                </div>
                {watched &&
                    (
                        <div className='icon-watched'>
                            <FiberManualRecordIcon style={{ color: '#0084ff' }} />
                        </div>
                    )
                }
            </div>
        )
    })

    return (
        <>
            {!isLoading && <Loading size={25} />}
            <InfiniteScroll
                dataLength={listRoom.length}
                next={() => setPageNum(pageNum + 1)}
                hasMore={hasNextPage}
                loader={<Loading size={25} />}
                height={(window.innerHeight * 2 / 3)}
                className='list-room'
            >
                {content}
            </InfiniteScroll>
        </>
    );
}

export default ChatList;