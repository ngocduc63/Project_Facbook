import "./navbar.scss";
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DashboardIcon from '@mui/icons-material/Dashboard';
// import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
// import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Link } from "react-router-dom";
import { useContext, useState, useCallback } from "react";
// import { DarkModeContext } from "../../context/darkModeContext";
import { AuthContext } from "../../context/authContext";
import useAxiosPrivate from "../../api/axiosPrivate";
import { toast } from 'react-toastify';
import Loading from "../../components/loading/Loading";
import ChatList from "../chatList/chatList";
import { ChatContext } from "../../context/chatContext";
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';
import { debounce } from 'lodash';
import { useNavigate } from 'react-router-dom';
import useLogout from '../../api/logout'
import { LINK_API_AVATAR } from "../../api/const";
import { HomeContext } from "../../context/homeContext";
import NotificationList from "../notificationList/NotificationList";
import { NotificationContext } from "../../context/notificationContext";

const Navbar = () => {
  const logout = useLogout();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  // const { toggle, darkMode } = useContext(DarkModeContext);
  const { refetchHome, setIsShowChatPage } = useContext(HomeContext);
  const { countNotification } = useContext(NotificationContext);
  const [inputSearch, setInputSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resultSearch, setResultSearch] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const [showPopupChatList, setShowPopupChatList] = useState(false);
  const [showPopupNotification, setShowPopupNotification] = useState(false);
  const { setRoomCurrent } = useContext(ChatContext);

  const handleRefecth = () => {
    refetchHome();
  }

  const handleInput = (e) => {
    setIsLoading(true);
    const input = e.target.value
    setInputSearch(input);
    if (input && input.trim() !== '') debounceSearch(input);
    else handleResetSearch()
  }

  const handleResetSearch = () => {
    setInputSearch('')
    setResultSearch([])
    setIsLoading(false)
  }

  const handleSearch = () => {
    navigate(`search/${inputSearch}`)
    handleResetSearch();
  }

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      handleSearch()
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
  }, 300)

  const handleLogout = async () => {
    const isSuccess = await logout();

    if (isSuccess) {
      toast.success('Đăng xuất thành công', { position: 'top-right' })
    } else {
      toast.error('Đăng xuất thất bại', { position: 'top-right' })
    }
  }

  const handleShowPopupChatList = () => {
    setShowPopupChatList(!showPopupChatList)
    setShowPopupNotification(false)
  }

  const handleSelectRoomChat = (data) => {
    setShowPopupChatList(false)
    setRoomCurrent(data?._id?.room_id?.$oid)
  }

  const handleShowChatPage = () => {
    setIsShowChatPage(true)
  }

  const handleShowNotificationList = () => {
    setShowPopupChatList(false)
    setShowPopupNotification(!showPopupNotification)
  }

  const handleSelectNotificationItem = () => {
    setShowPopupNotification(false)
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
        {/* {darkMode ? (
          <WbSunnyOutlinedIcon onClick={toggle} />
        ) : (
          <DarkModeOutlinedIcon onClick={toggle} />
        )} */}
        <div className="search">
          {resultSearch.length > 0 && <ArrowBackIcon className="cur-point" onClick={handleResetSearch} />}
          <SearchOutlinedIcon onClick={handleSearch} />
          <input type="text" placeholder="Nhập tên người bạn muốn tìm..." value={inputSearch} onChange={handleInput} onKeyDown={handleKeyDown} />

          {(resultSearch.length > 0 || isLoading) && (
            <div className="list-user" onClick={handleResetSearch}>
              {isLoading && <Loading />}
              {
                resultSearch.map(user =>
                  <Link to={`profile/${user.id}`} className="item" key={user.id}>
                    <div className="avatar">
                      <img src={LINK_API_AVATAR + user.avatar} alt="" />
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
        {currentUser.role === 1 && <Link to={'/dashboard'}><DashboardIcon /></Link>}
        <div className="icon-chat">
          <ChatBubbleOutlineIcon className="cur-point" onClick={handleShowPopupChatList} />
          {showPopupChatList && (
            <div className="content-chat-list">
              <header>
                <span>Đoạn chat</span>
                <ZoomOutMapIcon className="cur-point" onClick={handleShowChatPage} />
              </header>
              <ChatList handleSelectRoomChat={handleSelectRoomChat} />
            </div>
          )}
        </div>
        <div className="icon-noti" onClick={handleShowNotificationList}>
          <NotificationsOutlinedIcon />
          {countNotification > 0 && <div className="number-notification"><span>{countNotification > 99 ? '99+' : countNotification}</span></div>}
        </div>
        {
          showPopupNotification && <NotificationList handleSelectNotificationItem={handleSelectNotificationItem} />
        }
        <Link to={`/profile/${currentUser.id}`} className="user">
          <img
            src={LINK_API_AVATAR + currentUser.avatar}
            alt=""
          />
          <span>{currentUser.username}</span>
        </Link>
        <ExitToAppIcon onClick={handleLogout} className="icon-exit" />
      </div>
    </div>
  );
};

export default Navbar;
