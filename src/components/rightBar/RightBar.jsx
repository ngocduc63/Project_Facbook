import "./rightBar.scss";
import useAxiosPrivate from "../../api/axiosPrivate";
import { useEffect, useState, memo, useContext } from "react";
import { toast } from "react-toastify"
import { Link } from "react-router-dom";
import { RefecthInviteContext } from "../../context/refecthInvite"
import { ChatContext } from '../../context/chatContext'
import CloseIcon from '@mui/icons-material/Close';
import PopupFriend from "../popupFriend/PopupFriend";
import { LINK_API_AVATAR } from "../../api/const";
import { SocketContext } from "../../context/socketContext";

const RightBar = () => {
  const axiosPrivate = useAxiosPrivate();
  const [listInvite, setListInvite] = useState([])
  const { isRefecthInvite } = useContext(RefecthInviteContext)
  const { dataHiden, setDataHidden, setRoomCurrent } = useContext(ChatContext);
  const [isShowPopupFriend, setIsShowPopupFriend] = useState(false);
  const { usersOnline } = useContext(SocketContext)
  const [listUsersOnline, setlistUsersOnline] = useState(usersOnline)

  useEffect(() => {
    if (isShowPopupFriend) return;

    const controller = new AbortController();
    const { signal } = controller;

    const fetchInviteList = async () => {
      try {
        const response = await axiosPrivate.get(`/friend-management/invite-friend/1`, { signal });
        setListInvite(response.data.data.datas);
      } catch (error) {
        if (signal.aborted) return;
        if (error.response.status === 402) return;
        toast.error("Lỗi không tải được danh sách bạn bè", {
          position: "top-right"
        });
      }
    };

    fetchInviteList();

    return () => controller.abort();
  }, [axiosPrivate, isRefecthInvite, isShowPopupFriend]);

  useEffect(() => {
    setlistUsersOnline(usersOnline)
  }, [usersOnline])

  const deleteListInvite = (friend_id) => {
    let newList = listInvite.filter(item => item.friend_id !== friend_id);

    setListInvite(newList)
  }

  const handleAcceptFriend = (e, friend_id) => {
    e.preventDefault();
    axiosPrivate.put(('/friend-management/accept/' + friend_id))
      .then((response) => {
        toast.success("Xác nhận lời mời thành công", {
          position: "top-right"
        })
        deleteListInvite(friend_id)
      })
      .catch((error) => {
        toast.error("Xác nhận lời mời thất bại", {
          position: "top-right"
        })
      })
  }

  const handleCancelFriend = (e, friend_id) => {
    e.preventDefault();
    axiosPrivate.delete(('/friend-management/unfriend/' + friend_id))
      .then((response) => {
        toast.success("Hủy lời mời thành công", {
          position: "top-right"
        })
        deleteListInvite(friend_id)
      })
      .catch((error) => {
        toast.error("Hủy lời mời thất bại", {
          position: "top-right"
        })
      })
  }




  const IconMess = ({ data, index }) => {
    const handleCloseDataPopupMess = (e) => {
      e.preventDefault()
      setDataHidden(prev => prev.filter(item => data.room !== item.room))
    }

    const handleShowPopupMess = () => {
      setRoomCurrent(data.room)
    }

    return (
      <div className="main">
        <div className="icon-close" onClick={handleCloseDataPopupMess}><CloseIcon className="icon-close" /></div>
        <div className="image" onClick={handleShowPopupMess}>
          <img src={LINK_API_AVATAR + data.friend.avatar} alt="" />
        </div>
      </div>
    )
  }

  const handleOpenPopupAddFriend = () => {
    setIsShowPopupFriend(true)
  }

  return (
    <>
      {isShowPopupFriend && <PopupFriend setIsShowPopupFriend={setIsShowPopupFriend} isPopupFriend={false} />}
      <div className="rightBar">
        <div className="container">
          <div className="item">
            <header style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span onClick={handleOpenPopupAddFriend} style={{ cursor: 'pointer' }}>Danh sách lời mời</span>
              <span onClick={handleOpenPopupAddFriend} style={{ cursor: 'pointer', textDecoration: 'underLine' }}>Xem tất cả</span>
            </header>
            {listInvite.map(user =>
            (
              <Link to={"/profile/" + user.friend_id} className="user" key={user.friend_id}>
                <div className="userInfo">
                  <img
                    src={LINK_API_AVATAR + user.avatar}
                    alt=""
                  />
                </div>
                <div className="info">
                  <span>{user.name}</span>

                  <div className="buttons">
                    <button onClick={(e) => handleAcceptFriend(e, user.friend_id)}>Xác nhận</button>
                    <button onClick={(e) => handleCancelFriend(e, user.friend_id)}>Hủy</button>
                  </div>
                </div>
              </Link>
            )
            )}
          </div>

          {/* online friend */}
          <div className="item">
            <span>Danh sách người dùng đang online</span>
            {listUsersOnline?.map(user =>
              <Link to={"/profile/" + user.id} key={user.id} style={{ textDecoration: "none" }}>
                <div className="user">
                  <div className="userInfo">
                    <img
                      src={LINK_API_AVATAR + user.avatar}
                      alt=""
                    />
                    <div className="online" />
                    <span>{user.username}</span>
                  </div>
                </div>
              </Link>
            )}
          </div>
        </div>
        <div className="mess-hiden">
          <div className="content">
            {dataHiden.map((data, index) => (
              <IconMess data={data} key={index} />
            )
            )}
          </div>
        </div>
      </div >
    </>
  );
};

export default memo(RightBar);
