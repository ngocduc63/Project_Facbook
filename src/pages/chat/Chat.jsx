import './chat.scss'
import SearchIcon from '@mui/icons-material/Search';
import { AuthContext } from '../../context/authContext';
import { useState, useEffect, useContext } from 'react';
import { MessageContext } from '../../context/messageContext';
import ChatContent from '../../components/chatContent/ChatContent';
import Notification from '../notification/Notification';
import ChatList from '../../components/chatList/chatList';
import { LINK_API_AVATAR } from '../../api/const';
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { HomeContext } from '../../context/homeContext';

function Chat() {
  const { currentUser } = useContext(AuthContext);
  const { setIsShowChatPage } = useContext(HomeContext);
  const { currentRoom, setCurrentRoom } = useContext(MessageContext);

  useEffect(() => {
    document.title = 'Messenger';
  }, []);

  const handleSelectRoomChat = (data) => {
    setCurrentRoom(data?._id?.room_id?.$oid);
  }

  const hadelHidenChatPage = () => {
    setIsShowChatPage(false)
  }

  return (
    <>
      <div className='body-chat'>
        <div className='chat-container'>
          <div className="chatList">
            <header>
              <div className='left-content'>
                <div className='image'>
                  <img src={LINK_API_AVATAR + currentUser.avatar} alt="" />
                </div>
                <span>{currentUser.username}</span>
              </div>
              <div className='right-content' onClick={hadelHidenChatPage}>
                <HomeOutlinedIcon />
              </div>
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
            <ChatList handleSelectRoomChat={handleSelectRoomChat} isChatPage />
          </div>
          <div className='mess-container' style={{ flex: 3 }}>
            <ChatContent currentRoom={currentRoom} />
          </div>
        </div>
      </div>
    </>

  );
}

export default Chat;