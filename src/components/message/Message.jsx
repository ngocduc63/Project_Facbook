import '../message/message.scss'
import { useEffect, useState, useContext } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import useAxiosPrivate from '../../api/axiosPrivate';
import { AuthContext } from '../../context/authContext';
import { ChatContext } from '../../context/chatContext';
import InfiniteScroll from "react-infinite-scroll-component";
import Loading from '../loading/Loading';
import RemoveIcon from '@mui/icons-material/Remove';
import socket from '../../helps/socket';
import ContentMess from './ContentMess';
import InputCustom from '../inputCustom/InputCustom';

function MessagePopup({ isShowPopupMess = false }) {
    const axiosPrivate = useAxiosPrivate();
    const { currentUser } = useContext(AuthContext);
    const { roomCurrent, setRoomCurrent, setDataHidden } = useContext(ChatContext);
    const [dataMess, setDataMess] = useState([])
    const [friendRoom, setFriendRoom] = useState({})
    const [hasNextPage, setHasNextPage] = useState(false);
    const [pageNum, setPageNum] = useState(1)
    const [sucessData, setSucessData] = useState(0);
    const [showPopupMess, setShowPopupMess] = useState(isShowPopupMess);

    useEffect(() => {
        if (roomCurrent) {
            setShowPopupMess(true)
            setSucessData(0)
            setPageNum(1)
            setDataMess([]);
        }
    }, [roomCurrent]);


    useEffect(() => {
        if (!roomCurrent) return;

        const abortController = new AbortController();

        axiosPrivate.post(('/chat-management/room'), {
            "room_id": `${roomCurrent}`,
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
                setShowPopupMess(false);
            });

        return () => {
            abortController.abort();
        };
    }, [axiosPrivate, pageNum, roomCurrent]);


    useEffect(() => {
        if (!roomCurrent) return;

        const joinRoomNotifi = (room) => {
            if (room !== "") {
                socket.emit("join_room", room);
            }
        };

        joinRoomNotifi({ 'room': `${roomCurrent}` })

        const handleNotification = (data) => {
            setDataMess(prevData => [data, ...prevData]);
        };
        socket.on("receive_message", handleNotification);

        return () => {
            socket.off("receive_message", handleNotification);
        };
    }, [sucessData, roomCurrent])

    const handelSendMessage = (inputValue) => {
        if (inputValue.trim() === '') return;
        socket.emit("send_message", {
            "sender": `${currentUser.id}`,
            "room_id": `${roomCurrent}`,
            "text": inputValue.trim()
        })
    }


    const handelClosePopupuMess = () => {
        setRoomCurrent('')
        setShowPopupMess(false)
    }

    const handelHidenPopupMess = () => {
        setDataHidden(prev => {
            const existingItemIndex = prev.findIndex(item => item.room === roomCurrent);
            if (existingItemIndex !== -1) {
                const existingItem = prev[existingItemIndex];
                const updatedPrev = prev.filter((_, index) => index !== existingItemIndex);
                return [...updatedPrev, existingItem];
            } else {
                return [...prev, { 'room': roomCurrent, 'friend': friendRoom }];
            }
        });
        setRoomCurrent('')
        setShowPopupMess(false)
    }

    return (
        showPopupMess && <div className="message-popup">
            <div className='header'>
                <div className='left-content'>
                    {sucessData === 0 && <Loading size={30} />}
                    <div className='image'>
                        {sucessData === 1 && <img src={"http://127.0.0.1:5000/user-management/user/avatar/" + friendRoom.avatar} alt="" />}
                    </div>
                    {sucessData === 1 && <span className='name-room'>{friendRoom.username}</span>}
                </div>
                <div className='right-content'>
                    <RemoveIcon className='icon' onClick={handelHidenPopupMess} />
                    <CloseIcon onClick={handelClosePopupuMess} className='icon' />
                </div>
            </div>
            <InfiniteScroll
                dataLength={dataMess.length}
                inverse={true}
                next={() => setPageNum(pageNum + 1)}
                hasMore={hasNextPage}
                loader={<Loading size={30} />}
                className="content"
                height={320}
            >
                <ContentMess dataMess={dataMess} friendRoom={friendRoom} currentUser={currentUser} />
            </InfiniteScroll>
            <InputCustom handelSendMessage={handelSendMessage} />
        </div>
    );
}

export default MessagePopup;
