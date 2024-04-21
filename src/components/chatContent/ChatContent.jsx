import './chatContent.scss'
import { useContext, useEffect, useState } from 'react';
import { MessageContext } from '../../context/messageContext'
import { AuthContext } from '../../context/authContext';
import useAxiosPrivate from '../../api/axiosPrivate';
import InfiniteScroll from "react-infinite-scroll-component";
import Loading from '../loading/Loading';
import ContentMess from '../message/ContentMess';
import InputCustom from '../inputCustom/InputCustom';
import socket from '../../helps/socket';

function ChatContent() {
    const { currentUser } = useContext(AuthContext);
    const { currentRoom, setCurrentRoom } = useContext(MessageContext);
    const axiosPrivate = useAxiosPrivate();
    const [pageNum, setPageNum] = useState(1)
    const [dataMess, setDataMess] = useState([])
    const [friendRoom, setFriendRoom] = useState({})
    const [hasNextPage, setHasNextPage] = useState(false);
    const [sucessData, setSucessData] = useState(0);

    useEffect(() => {
        if (!currentRoom) return;

        const abortController = new AbortController();

        axiosPrivate.post(('/chat-management/room'), {
            "room_id": `${currentRoom}`,
            "page": pageNum
        }, {
            signal: abortController.signal,
        })
            .then((response) => {
                const data = response.data;
                setDataMess(prev => [...prev, ...data.data.datas]);
                setFriendRoom(data.data.friend)
                setHasNextPage(pageNum <= data.data.maxPage - 1);
                setSucessData(1)
            })
            .catch((error) => {

            });

        return () => {
            abortController.abort();
        };
    }, [axiosPrivate, pageNum, currentRoom]);

    useEffect(() => {
        setDataMess([])
    }, [currentRoom]);

    useEffect(() => {
        if (!currentRoom) return;

        const joinRoomNotifi = (room) => {
            if (room !== "") {
                socket.emit("join_room", room);
            }
        };

        joinRoomNotifi({ 'room': `${currentRoom}` })

        const handleNotification = (data) => {
            setDataMess(prevData => [data, ...prevData]);
        };
        socket.on("receive_message", handleNotification);

        return () => {
            socket.off("receive_message", handleNotification);
        };
    }, [currentRoom])

    const handelSendMessage = (inputValue) => {
        if (inputValue.trim() === '') return;
        socket.emit("send_message", {
            "sender": `${currentUser.id}`,
            "room_id": `${currentRoom}`,
            "text": inputValue.trim()
        })
    }

    return (
        <div className="chat-content">
            <div className='header'>
                <div className='left-content'>
                    <div className='image'>
                        {sucessData === 1 && <img src={"http://127.0.0.1:5000/user-management/user/avatar/" + friendRoom.avatar} alt="" />}
                    </div>
                    {sucessData === 1 && <span className='name-room'>{friendRoom.username}</span>}
                </div>
                <div className='right-content'>
                    {/* <RemoveIcon className='icon' onClick={handelHidenPopupMess} />
                    <CloseIcon onClick={handelClosePopupuMess} className='icon' /> */}
                </div>
            </div>

            <InfiniteScroll
                dataLength={dataMess.length}
                inverse={true}
                next={() => setPageNum(pageNum + 1)}
                hasMore={hasNextPage}
                loader={<Loading />}
                className="content"
                height={(window.innerHeight * 2 / 3) - 30}
            >
                <ContentMess dataMess={dataMess} friendRoom={friendRoom} currentUser={currentUser} />
            </InfiniteScroll>
            <InputCustom maxRow={3} handelSendMessage={handelSendMessage} />
        </div>
    );
}

export default ChatContent;
