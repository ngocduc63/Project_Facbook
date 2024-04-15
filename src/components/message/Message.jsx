import '../message/message.scss'
import { useEffect, useState, useContext, useCallback } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import useAxiosPrivate from '../../api/axiosPrivate';
import { AuthContext } from '../../context/authContext';
import { ChatContext } from '../../context/chatContext';
import InfiniteScroll from "react-infinite-scroll-component";
import Loading from '../loading/Loading';
import SendIcon from '@mui/icons-material/Send';
import RemoveIcon from '@mui/icons-material/Remove';
import socket from '../../helps/socket';
import ContentMess from './ContentMess';

function MessagePopup({ isShowPopupMess = false }) {
    const maxRows = 5;
    const axiosPrivate = useAxiosPrivate();
    const { currentUser } = useContext(AuthContext);
    const { roomCurrent, setRoomCurrent, setDataHidden } = useContext(ChatContext);
    const [dataMess, setDataMess] = useState([])
    const [friendRoom, setFriendRoom] = useState({})
    const [hasNextPage, setHasNextPage] = useState(false);
    const [pageNum, setPageNum] = useState(1)
    const [inputValue, setInputValue] = useState('');
    const [textareaHeight, setTextareaHeight] = useState(22);
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

    const handelSendMessage = () => {
        if (inputValue.trim() === '') return;
        socket.emit("send_message", {
            "sender": `${currentUser.id}`,
            "room_id": `${roomCurrent}`,
            "text": inputValue.trim()
        })
        setInputValue('')
        setTextareaHeight(22)
    }

    const handleKeyDown = (event) => {
        if (event.keyCode === 13 && event.shiftKey) {
            event.preventDefault();
            setInputValue(inputValue + '\n');
            const newHeight = textareaHeight + 16;
            if (newHeight <= maxRows * 16) {
                setTextareaHeight(newHeight);
            }
        } else if (event.keyCode === 13) {
            event.preventDefault();
            handelSendMessage();
        }
    };

    const handleChange = (event) => {
        const { value } = event.target;
        setInputValue(value);
        const rows = value.split('\n').length;
        const newHeight = rows * 16;
        if (newHeight <= maxRows * 16) {
            setTextareaHeight(newHeight);
        }

    };

    // const Content = memo(({ dataMess, friendRoom }) => {
    //     if (sucessData !== 1) return;

    //     const loadMess = (data) => {
    //         if (data.includes('\n')) {
    //             const lines = data.split('\n');
    //             return (
    //                 lines.map((line, index) => (
    //                     <p key={index}>{line}</p>
    //                 ))
    //             );
    //         } else {
    //             return <p>{data}</p>
    //         }
    //     }

    //     const content_user = (data) => {
    //         return (
    //             <>
    //                 {
    //                     data.map((data) => {
    //                         return <div key={data.created_at}>{loadMess(data.text)}</div>
    //                     })
    //                 }
    //             </>
    //         )
    //     }

    //     const content_friend = (data) => {
    //         return (
    //             <>
    //                 <div className='image'>
    //                     <img src={"http://127.0.0.1:5000/user-management/user/avatar/" + friendRoom.avatar} alt="" />
    //                 </div>
    //                 <div className='friend-chat'>
    //                     {
    //                         data.map((data) => {
    //                             return <div key={data.created_at}>{loadMess(data.text)}</div>
    //                         })
    //                     }
    //                 </div>
    //             </>
    //         )
    //     }

    //     let content_mess = [];
    //     let data_chat = [];
    //     let next_sender = 1;
    //     let key = 0;

    //     dataMess.forEach((data, index) => {
    //         next_sender = dataMess[index + 1]?.sender;
    //         if (next_sender !== data.sender || index + 1 === dataMess.length) {
    //             data_chat.push(data)
    //             if (+data.sender === currentUser.id) {
    //                 content_mess.push(<div key={key} className='content-user'>{content_user(data_chat.reverse(), key)}</div>)
    //                 key++;
    //             } else {
    //                 content_mess.push(<div key={key} className='content-friend'>{content_friend(data_chat.reverse(), key)}</div>)
    //                 key++;
    //             }
    //             data_chat = [];
    //         }
    //         else {
    //             data_chat.push(data)

    //         }
    //     })

    //     return content_mess;
    // })

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
                loader={<Loading />}
                className="content"
                height={320}
            >
                <ContentMess dataMess={dataMess} friendRoom={friendRoom} currentUser={currentUser} />
            </InfiniteScroll>
            <div className='input-mess'>
                <textarea
                    value={inputValue}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder='Aa'
                    style={{
                        height: `${textareaHeight}px`,
                        overflowY: (textareaHeight >= maxRows * 16) ? 'scroll' : 'hidden',
                        resize: 'none'
                    }}
                />
                <SendIcon className='send-icon' onClick={handelSendMessage} />
            </div>
        </div>
    );
}

export default MessagePopup;
