import "./navbar.scss";
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Link } from "react-router-dom";
import { useContext, useState, useCallback } from "react";
import { DarkModeContext } from "../../context/darkModeContext";
import { AuthContext } from "../../context/authContext";
import useAxiosPrivate from "../../api/axiosPrivate";
import { toast } from 'react-toastify';
import Loading from "../../components/loading/Loading";
import ChatList from "../chatList/chatList";
import { ChatContext } from "../../context/chatContext";
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';
import { debounce } from 'lodash';

const Navbar = (props) => {
  const axiosPrivate = useAxiosPrivate();
  const { toggle, darkMode } = useContext(DarkModeContext);
  const [inputSearch, setInputSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resultSearch, setResultSearch] = useState([]);
  const { currentUser, setTokenAndUser } = useContext(AuthContext);
  const { isRefecth, setIsRefecth } = props;
  const [showPopupChatList, setShowPopupChatList] = useState(false);
  const { setRoomCurrent } = useContext(ChatContext);

  const handleRefecth = () => {
    setIsRefecth(!isRefecth);
  }

  const handelInput = (e) => {
    setIsLoading(true);
    const input = e.target.value
    setInputSearch(input);
    if (input && input.trim() !== '') debounceSearch(input);
    else handelResetSearch()
  }

  const handelResetSearch = () => {
    setInputSearch('')
    setResultSearch([])
    setIsLoading(false)
  }

  const handelSearch = (e) => {
    if (e.keyCode === 13) {
      handelResetSearch();
    }
  }

  const debounceSearch = useCallback(debounce((nextValue) => fetchUser(nextValue), 300), [])// eslint-disable-line react-hooks/exhaustive-deps

  const fetchUser = debounce((input) => {
    axiosPrivate.get(`/user-management/user/find/${input}`)
      .then(res => {
        setResultSearch(res.data.data)
      })
      .catch(err => {
        toast.error("Lỗi không tìm được", {
          position: "top-right"
        });
      });

    setIsLoading(false)
  }, 1000)

  const handelLogout = () => {
    setTokenAndUser(null, null)
  }

  const handelShowPopupChatList = () => {
    setShowPopupChatList(!showPopupChatList)
  }

  const handelSelectRoomChat = (data) => {
    setShowPopupChatList(false)
    setRoomCurrent(data?._id?.room_id?.$oid)
  }

  const handelOpenChatPage = (e) => {
    window.open('/chat', '_blank');
  }

  return (
    <div className="navbar">
      <div className="left">
        <Link to="/" style={{ textDecoration: "none" }} onClick={handleRefecth}>
          <span>FACEBOOK</span>
        </Link>
        <Link to="/" onClick={handleRefecth} className="icon-home">
          <HomeOutlinedIcon />
        </Link>
        {darkMode ? (
          <WbSunnyOutlinedIcon onClick={toggle} />
        ) : (
          <DarkModeOutlinedIcon onClick={toggle} />
        )}
        <div className="search">
          {resultSearch.length > 0 && <ArrowBackIcon className="cur-point" onClick={handelResetSearch} />}
          <SearchOutlinedIcon />
          <input type="text" placeholder="Nhập tên người bạn muốn tìm..." value={inputSearch} onChange={handelInput} onKeyDown={handelSearch} />

          {(resultSearch.length > 0 || isLoading) && (
            <div className="list-user" onClick={handelResetSearch}>
              {isLoading && <Loading />}
              {
                resultSearch.map(user =>
                  <Link to={`profile/${user.id}`} className="item" key={user.id}>
                    <div className="avatar">
                      <img src={"http://localhost:5000/user-management/user/avatar/" + user.avatar} alt="" />
                    </div>
                    <div className="right-item-search">
                      <span>{user.username}<span>{user.nickname && ` (${user.nickname})`}</span></span>
                      {user.isFriend === 1 && (<span className="check-friend">Bạn bè</span>)}
                    </div>
                  </Link>
                )
              }
            </div>
          )}
        </div>
      </div>
      <div className="right">
        <div className="icon-chat">
          <ChatBubbleOutlineIcon style={{ cursor: 'pointer' }} onClick={handelShowPopupChatList} />
          {showPopupChatList && (
            <div className="content-chat-list">
              <header>
                <span>Đoạn chat</span>
                <ZoomOutMapIcon style={{ cursor: 'pointer' }} onClick={handelOpenChatPage} />
              </header>
              <ChatList handleSelectRoomChat={handelSelectRoomChat} />
            </div>
          )}
        </div>
        <NotificationsOutlinedIcon />
        <Link to={`/profile/${currentUser.id}`} className="user">
          <img
            src={"http://localhost:5000/user-management/user/avatar/" + currentUser.avatar}
            alt=""
          />
          <span>{currentUser.username}</span>
        </Link>
        <ExitToAppIcon onClick={handelLogout} className="icon-exit" />
      </div>
    </div>
  );
};

export default Navbar;
