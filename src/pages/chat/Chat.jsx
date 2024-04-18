import './chat.scss'
import SearchIcon from '@mui/icons-material/Search';
import useAxiosPrivate from '../../api/axiosPrivate';
import { AuthContext } from '../../context/authContext';
import { useState, useEffect, useContext } from 'react';

function Chat() {
  const { currentUser } = useContext(AuthContext);
  const axiosPrivate = useAxiosPrivate();
  const [dataListRoom, setDataListRoom] = useState([]);

  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller
    axiosPrivate.get(('/chat-management/chat-list'), { signal })
      .then((response) => {
        setDataListRoom(JSON.parse(response.data?.data))
      })
      .catch((error) => {
        if (signal.aborted) return
      })

    return () => controller.abort()
  }, [axiosPrivate]);

  const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
  return (
    <div className='body-chat'>
      <div className='chat-container'>
        <div className="chatList">
          <header>
            <div className='image'>
              <img src={"http://localhost:5000/user-management/user/avatar/Anh_chup_man_hinh_2021-11-19_193332_1_1712820998.png"} alt="" />
            </div>
            <span>Nguyễn Ngọc Đức</span>
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
          {
            dataListRoom.map((data, index) => {
              const friend = data._id.username_friend.user_id === currentUser.id ? data._id.username_key : data._id.username_friend
              return (
                <div
                  className="item"
                  key={index}
                  // onClick={() => handleSelect(chat)}
                  style={{
                    // backgroundColor: '#5183fe',
                    backgroundColor: 'tranparent',
                  }}
                >
                  <img src={"http://localhost:5000/user-management/user/avatar/" + friend.avatar} alt="" />
                  <div className="texts">
                    <span>
                      {/* {chat.user.blocked.includes(currentUser.id) */}
                      {/* ? "User" */}
                      {/* : chat.user.username} */}
                      {friend.username}
                    </span>
                    {/* <p>{chat.lastMessage}</p> */}
                    {data.last_mess.sender !== 0 &&
                      <div className='description'>
                        <p className='sender'>{data.last_mess?.sender === friend.user_id ? friend.username : 'Bạn'}:</p>
                        <p className='text' >{data.last_mess?.text}</p>
                      </div>
                    }
                  </div>
                </div>
              )
            })
          }
        </div>
        <div className='mess-container' style={{ flex: 3 }}></div>
      </div>

    </div>
  );
}

export default Chat;