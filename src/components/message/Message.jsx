import { useRef, useEffect, useState, useContext, useCallback } from 'react';
import '../message/message.scss'
import useAxiosPrivate from '../../api/axiosPrivate';
import { AuthContext } from '../../context/authContext'
import InfiniteScroll from "react-infinite-scroll-component";
import Loading from '../loading/Loading';

function MessagePopup() {
    const axiosPrivate = useAxiosPrivate();
    const { currentUser } = useContext(AuthContext);
    const [dataMess, setDataMess] = useState([])
    const [hasNextPage, setHasNextPage] = useState(false);
    const [pageNum, setPageNum] = useState(1)

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
            })
            .catch((error) => {

            });

        return () => {
            abortController.abort();
        };
    }, [axiosPrivate, pageNum]);

    const content = useCallback(() => {
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
                    content_mess.push(<div key={key} className='content-user'>{content_user(data_chat, key)}</div>)
                    key++;
                } else {
                    content_mess.push(<div key={key} className='content-friend'>{content_friend(data_chat, key)}</div>)
                    key++;
                }
                data_chat = [];
            }
            else {
                data_chat.push(data)

            }
        })

        return content_mess;

    }, [dataMess, currentUser])

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

        </div>
    );
}

export default MessagePopup;
