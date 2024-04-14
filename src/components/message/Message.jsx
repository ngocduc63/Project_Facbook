import { useEffect, useState, useContext, useCallback } from 'react';
import '../message/message.scss'
import useAxiosPrivate from '../../api/axiosPrivate';
import { AuthContext } from '../../context/authContext'
import InfiniteScroll from "react-infinite-scroll-component";
import Loading from '../loading/Loading';
import SendIcon from '@mui/icons-material/Send';
import socket from '../../helps/socket';

function MessagePopup() {
    const maxRows = 5;
    const axiosPrivate = useAxiosPrivate();
    const { currentUser } = useContext(AuthContext);
    const [dataMess, setDataMess] = useState([])
    const [hasNextPage, setHasNextPage] = useState(false);
    const [pageNum, setPageNum] = useState(1)
    const [inputValue, setInputValue] = useState('');
    const [textareaHeight, setTextareaHeight] = useState(22);
    const [sucessData, setSucessData] = useState(0);

    useEffect(() => {
        const abortController = new AbortController();

        axiosPrivate.post(('/chat-management/room'), {
            "room_id": "661a203219a18a12031224c7",
            "page": pageNum
        }, {
            signal: abortController.signal,
        })
            .then((response) => {
                const data = response.data;
                setDataMess(prev => [...prev, ...data.data.datas]);
                setHasNextPage(pageNum <= data.data.maxPage - 1);
                setSucessData(1)
            })
            .catch((error) => {

            });

        return () => {
            abortController.abort();
        };
    }, [axiosPrivate, pageNum]);


    useEffect(() => {
        const joinRoomNotifi = (room) => {
            if (room !== "") {
                socket.emit("join_room", room);
            }
        };

        joinRoomNotifi({ 'room': '661a203219a18a12031224c7' })

        const handleNotification = (data) => {
            setDataMess(prevData => [data, ...prevData]);
        };
        socket.on("receive_message", handleNotification);

        return () => {
            socket.off("receive_message", handleNotification);
        };
    }, [sucessData])

    const handelSendMessage = () => {
        socket.emit("send_message", {
            "sender": `${currentUser.id}`,
            "room_id": "661a203219a18a12031224c7",
            "text": inputValue.trim()
        })
        setInputValue('')
    }

    const handleKeyDown = (event) => {
        if (event.keyCode === 13 && event.shiftKey) {
            setInputValue(inputValue + '\n');
            const newHeight = textareaHeight + 16;
            if (newHeight <= maxRows * 16) {
                setTextareaHeight(newHeight);
            }
            event.preventDefault();
        }
    };

    const handleChange = (event) => {
        const { value } = event.target;
        setInputValue(value);
        // Tính toán số dòng mới
        const rows = value.split('\n').length;
        const newHeight = rows * 16;
        if (newHeight <= maxRows * 16) {
            setTextareaHeight(newHeight);
        }

    };

    const content = useCallback(() => {
        if (sucessData !== 1 || dataMess.length <= 0) return <Loading />;
        const content_user = (data) => {
            return (
                <>
                    {
                        data.map((data) => {
                            return <span key={data.created_at}>{data.text}</span>
                        })
                    }
                </>
            )
        }

        const content_friend = (data) => {
            return (
                <>
                    <div className='image'>
                        <img src={"http://127.0.0.1:5000/user-management/user/avatar/Anh_chup_man_hinh_2021-11-19_193445_2_1712821061.png"} alt="" />
                    </div>
                    <div className='friend-chat'>
                        {
                            data.map((data) => {
                                return <span key={data.created_at}>{data.text}</span>
                            })
                        }
                    </div>
                </>
            )
        }

        let content_mess = [];
        let data_chat = [];
        let next_sender = 1;
        let key = 0;

        dataMess.forEach((data, index) => {
            next_sender = dataMess[index + 1]?.sender;
            if (next_sender !== data.sender || index + 1 === dataMess.length) {
                data_chat.push(data)
                if (+data.sender === currentUser.id) {
                    content_mess.push(<div key={key} className='content-user'>{content_user(data_chat.reverse(), key)}</div>)
                    key++;
                } else {
                    content_mess.push(<div key={key} className='content-friend'>{content_friend(data_chat.reverse(), key)}</div>)
                    key++;
                }
                data_chat = [];
            }
            else {
                data_chat.push(data)

            }
        })

        return content_mess;
    }, [dataMess, sucessData, currentUser])

    return (
        <div className="message-popup">
            <div className='header'>
                <div className='right-content'>
                    <div className='image'>
                        <img src={"http://127.0.0.1:5000/user-management/user/avatar/Anh_chup_man_hinh_2021-11-19_193445_2_1712821061.png"} alt="" />
                    </div>
                    <span className='name-room'>Nguyen ngoc duc</span>
                </div>
                <div className='left-content'>
                    <button>-</button>
                    <button>X</button>
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
                {content()}
            </InfiniteScroll>
            <div className='input-mess'>
                <textarea
                    value={inputValue}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
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
