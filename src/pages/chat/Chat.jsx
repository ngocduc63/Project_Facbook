import './chat.scss'
import SearchIcon from '@mui/icons-material/Search';
import useAxiosPrivate from '../../api/axiosPrivate';
import { AuthContext } from '../../context/authContext';
import { useState, useEffect, useContext } from 'react';
import { MessageContext } from '../../context/messageContext'
import { ChatContext } from '../../context/chatContext'
import ChatContent from '../../components/chatContent/ChatContent';
import Notification from '../notification/Notification';
import Loading from '../../components/loading/Loading';
import InfiniteScroll from "react-infinite-scroll-component";

function Chat() {
  const { currentUser } = useContext(AuthContext);
  const { currentRoom, setCurrentRoom } = useContext(MessageContext);
  const { listRoom, setListRoom } = useContext(ChatContext);
  const axiosPrivate = useAxiosPrivate();
  const [isLoading, setIsLoading] = useState(false);
  const [pageNum, setPageNum] = useState(1)
  const [hasNextPage, setHasNextPage] = useState(false);

  useEffect(() => {
    document.title = 'Message';

    return () => {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller

    axiosPrivate.get((`/chat-management/chat-list/${pageNum}`), { signal })
      .then((response) => {
        const data = JSON.parse(response.data?.data?.datas)
        setListRoom(data);
        setHasNextPage(pageNum <= response.data.data.maxPage - 1);
        setIsLoading(true);
      })
      .catch((error) => {
        if (signal.aborted) return
      })

    return () => controller.abort()
  }, [axiosPrivate, setListRoom, pageNum]);

  useEffect(() => {
    if (!isLoading) return;

    setCurrentRoom(listRoom[0]?._id?.room_id?.$oid);
  }, [isLoading])


  const handleSelect = (data) => {
    setCurrentRoom(data?._id?.room_id?.$oid);
  }

  const content = listRoom.map((data, index) => {
    const friend = data._id.username_friend.user_id === currentUser.id ? data._id.username_key : data._id.username_friend
    return (
      <div
        className="item"
        key={index}
        onClick={() => handleSelect(data)}
      >
        {currentRoom === data?._id?.room_id?.$oid && <div className='bg-focus'></div>}
        <div className='image'>
          <img src={"http://localhost:5000/user-management/user/avatar/" + friend.avatar} alt="" />
        </div>
        <div className="texts">
          <span>
            {friend.username}
          </span>
          {/* <p>{chat.lastMessage}</p> */}
          {data.last_mess.sender !== 0 &&
            <div className='description'>
              <p className='sender'>{+data.last_mess?.sender === friend.user_id ? friend.username : 'Bạn'}: {data.last_mess?.text}</p>

            </div>
          }
        </div>
      </div>
    )
  })

  return (
    <>
      <div className='body-chat'>
        <div className='chat-container'>
          <div className="chatList">
            <header>
              <div className='image'>
                <img src={"http://localhost:5000/user-management/user/avatar/" + currentUser.avatar} alt="" />
              </div>
              <span>{currentUser.username}</span>
            </header>
            <div className="search">
              <div className="searchBar">
                <SearchIcon />
                <input
                  type="text"
                  placeholder="Search"
                />
              </div>
            </div>
            {!isLoading && <Loading />}
            <InfiniteScroll
              dataLength={listRoom.length}
              next={() => setPageNum(pageNum + 1)}
              hasMore={hasNextPage}
              loader={<Loading />}
              height={(window.innerHeight * 2 / 3)}
              className='list-room'
            >
              {content}
            </InfiniteScroll>
          </div>
          <div className='mess-container' style={{ flex: 3 }}>
            <ChatContent currentRoom={currentRoom} />
          </div>
          <Notification />
        </div>
      </div>
    </>

  );
}

export default Chat;