import './chatContent.scss'
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/authContext';
import { SocketContext } from '../../context/socketContext';
import useAxiosPrivate from '../../api/axiosPrivate';
import InfiniteScroll from "react-infinite-scroll-component";
import Loading from '../loading/Loading';
import ContentMess from '../message/ContentMess';
import InputCustom from '../inputCustom/InputCustom';
import VideocamIcon from '@mui/icons-material/Videocam';

function ChatContent({ currentRoom }) {
    const { currentUser } = useContext(AuthContext);
    const { socketio } = useContext(SocketContext);
    const axiosPrivate = useAxiosPrivate();
    const [pageNum, setPageNum] = useState(1)
    const [dataMess, setDataMess] = useState([])
    const [friendRoom, setFriendRoom] = useState({})
    const [hasNextPage, setHasNextPage] = useState(false);
    const [sucessData, setSucessData] = useState(0);
    const [roomChange, setRoomChange] = useState(false);

    useEffect(() => {
        if (!currentRoom) return;

        setDataMess([])
        setSucessData(0)
        setPageNum(1)
        setRoomChange(true)
    }, [currentRoom]);

    useEffect(() => {
        if (!currentRoom) return;

        let page = pageNum;
        if (roomChange) page = 1;

        const abortController = new AbortController();

        axiosPrivate.post(('/chat-management/room'), {
            "room_id": `${currentRoom}`,
            "page": page,
        }, {
            signal: abortController.signal,
        })
            .then((response) => {
                const data = response.data;
                setDataMess(prev => [...prev, ...data.data.datas]);
                setFriendRoom(data.data.friend)
                setHasNextPage(pageNum <= data.data.maxPage - 1);
                setSucessData(1);
                setRoomChange(false);
            })
            .catch((error) => {

            });

        return () => {
            abortController.abort();
        };
    }, [axiosPrivate, pageNum, currentRoom]);

    useEffect(() => {
        if (!currentRoom) return;

        const joinRoomNotifi = (room) => {
            if (room !== "") {
                socketio.emit("join_room", room);
            }
        };

        joinRoomNotifi({ 'room': `${currentRoom}` })

        const handleNotification = (data) => {
            setDataMess(prevData => [data, ...prevData]);
        };
        socketio.on("receive_message", handleNotification);

        return () => {
            socketio.off("receive_message", handleNotification);
        };
    }, [currentRoom])

    const handelSendMessage = (inputValue) => {
        if (inputValue.trim() === '') return;
        socketio.emit("send_message", {
            "sender": `${currentUser.id}`,
            "room_id": `${currentRoom}`,
            "text": inputValue.trim()
        })
    }

    const handelCall = () => {
        window.open(`call/${currentRoom}`, '_blank');
    }

    return (
        <div className="chat-content">
            <div className='header'>
                <div className='left-content'>
                    {sucessData === 0 && <Loading />}
                    <div className='image'>
                        {sucessData === 1 && <img src={"http://127.0.0.1:5000/user-management/user/avatar/" + friendRoom.avatar} alt="" />}
                    </div>
                    {sucessData === 1 && <span className='name-room'>{friendRoom.username}</span>}
                </div>
                <div className='right-content'>
                    {/* <RemoveIcon className='icon' onClick={handelHidenPopupMess} />
                    <CloseIcon onClick={handelClosePopupuMess} className='icon' /> */}
                    <VideocamIcon className='icon' onClick={handelCall} />

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
