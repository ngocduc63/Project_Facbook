import "./profile.scss";
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Posts from "../../components/posts/Posts";
import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "../../api/axiosPrivate";
import { useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import Update from "../../components/update/Update";
import UpdateImage from "../../components/update/UpdateImage";
import { useState, useEffect, memo } from "react";
import Loading from "../../components/loading/Loading";
import { convertToDate } from "../../helps/timer";
import { toast } from 'react-toastify';
import { ChatContext } from "../../context/chatContext";
import useLogout from '../../api/logout'
import { LINK_API_AVATAR, LINK_API_COVER } from "../../api/const";
import UpdatePassword from "../../components/update/UpdatePassword";

const Profile = ({ id }) => {
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openChangePassword, setOpenChangePassword] = useState(false);
  const [openUpdateImage, setOpenUpdateImage] = useState(0);
  const [openPopup, setOpenPopup] = useState(0);
  const { currentUser } = useContext(AuthContext);
  const [isRefetch, setIsRefetch] = useState(false);
  const [showPopupUnfriend, setShowPopupUnfriend] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const { setRoomCurrent } = useContext(ChatContext);
  const logout = useLogout();
  const location = useLocation();

  const userId = +location.pathname.split("/")[2] ? +location.pathname.split("/")[2] : id;

  const { isLoading, data, refetch, error } = useQuery(["user", userId], () =>
    axiosPrivate.get("/user-management/user/" + userId)
      .then((res) => {
        return res.data.data;
      })
  );

  useEffect(() => {
    document.title = data?.username ?? 'Facebook';
  }, [data]);

  useEffect(() => {
    refetch();
  }, [userId, isRefetch, refetch]);

  const handleLogout = async () => {
    const isSuccess = await logout();

    if (isSuccess) {
      toast.success('Đăng xuất thành công', { position: 'top-right' })
    } else {
      toast.error('Đăng xuất thất bại', { position: 'top-right' })
    }
  }

  const handleUpdateProfile = () => {
    setOpenUpdate(true)
  }

  const handleOpenPopupAvatar = () => {
    if (openPopup === 1) {
      handleClosePopups()
      return;
    }

    setOpenPopup(1)
  }

  const handleOpenPopupCover = () => {
    if (openPopup === 2) {
      handleClosePopups()
      return;
    }

    setOpenPopup(2)
  }

  const handleClosePopups = () => {
    setOpenPopup(0);
  };

  const handleAddFriend = () => {
    axiosPrivate.post(('friend-management/add-friend/' + userId))
      .then(() => {
        toast.success("Gửi lời mời thành công", {
          position: "top-right"
        })
        setIsRefetch(!isRefetch)
      })
      .catch(() => {
        toast.error("Gửi lời mời thất bại", {
          position: "top-right"
        })
      })
  }

  const handleAcceptFriend = () => {
    axiosPrivate.put(('/friend-management/accept/' + userId))
      .then(() => {
        toast.success("Xác nhận lời mời thành công", {
          position: "top-right"
        })
        setIsRefetch(!isRefetch)
      })
      .catch(() => {
        toast.error("Xác nhận lời mời thất bại", {
          position: "top-right"
        })
      })
  }

  const handleCancelFriend = () => {
    axiosPrivate.delete(('/friend-management/unfriend/' + userId))
      .then(() => {
        toast.success("Hủy kết bạn thành công", {
          position: "top-right"
        })
        setIsRefetch(!isRefetch)
      })
      .catch(() => {
        toast.error("Hủy lời mời thất bại", {
          position: "top-right"
        })
      })
  }

  const handleShowPopupMess = () => {
    axiosPrivate.get((`/friend-management/get-room/${userId}`))
      .then((response) => {
        setRoomCurrent(response?.data?.data?.room_id)
      })
  }

  const handleChangePassword = () => {
    setOpenChangePassword(true)
  }

  return (
    <div className="profile">
      {error ? <div style={{ fontWeight: 600, marginTop: 20 }}>Không tồn tại người dùng</div> :
        isLoading ? (
          <Loading />
        ) : (
          <>
            <div className="images">
              <div className="body-cover">
                <img src={LINK_API_COVER + data.cover_photo} alt="" className="cover" onClick={handleOpenPopupCover} />
                {openPopup === 2 && (
                  <div className="body-edit body-edit-cover">
                    {/* <div onClick={handleClosePopups}>Xem ảnh bìa</div> */}
                    {currentUser.id === data.id && <div onClick={() => setOpenUpdateImage(2)}>Chỉnh sửa ảnh bìa</div>}
                  </div>
                )}
              </div>

              <div className="body-avatar">
                <img src={LINK_API_AVATAR + data.avatar} alt="" className="profilePic" onClick={handleOpenPopupAvatar} />
                {openPopup === 1 && (
                  <div className="body-edit">
                    {/* <div onClick={handleClosePopups} >Xem ảnh đại diện</div> */}
                    {currentUser.id === data.id && <div onClick={() => setOpenUpdateImage(1)}>Chỉnh sửa ảnh đại điện</div>}
                  </div>
                )}
              </div>
            </div>
            <div className="profileContainer" onClick={handleClosePopups}>
              <div className="uInfo">
                <div className="center">
                  <span>{data.username} {data.nickname && <span>({data.nickname})</span>}</span>
                  {data.description && <span className="description">{data.description}</span>}
                  <div className="info">
                    <div className="item">
                      <span>Bạn bè: {data.num_friend}</span>
                    </div>
                    <div className="item">
                      <span>Ngày sinh:</span>
                      <span>{convertToDate(data.birth_date)}</span>
                    </div>
                  </div>
                  <div className="buttons">
                    {
                      currentUser.id === data.id && (
                        <>
                          <button className="item" onClick={handleUpdateProfile}>
                            Chỉnh sửa thông tin
                          </button>
                          <button className="item" onClick={handleChangePassword}>
                            Đổi mật khẩu
                          </button>
                          <button className="item button-exit" onClick={handleLogout} title="Đăng xuất">
                            <ExitToAppIcon />
                          </button>
                        </>
                      )
                    }
                    {
                      currentUser.id !== userId && (
                        <>
                          {
                            data.isFriend === 0 && (
                              <>
                                <button className="item" onClick={handleAddFriend}>
                                  Gửi kết bạn
                                </button>
                              </>
                            )
                          }
                          {
                            data.isFriend === 1 && (
                              <>
                                <button className="item" onClick={() => setShowPopupUnfriend(!showPopupUnfriend)}>
                                  Bạn bè
                                  {showPopupUnfriend ? (<ExpandLessIcon />) : (<ExpandMoreIcon />)}
                                </button>
                                {
                                  showPopupUnfriend && (
                                    <>
                                      <div className="popup-unfriend">
                                        <button className="item button-exit" onClick={handleCancelFriend}>
                                          Hủy kết bạn
                                        </button>
                                      </div>
                                    </>
                                  )
                                }
                                <button className="item button-mess" onClick={handleShowPopupMess}>
                                  <span>Nhắn tin</span>
                                  <ChatBubbleOutlineIcon />
                                </button>
                              </>
                            )
                          }
                          {
                            data.isFriend === 2 && (
                              <>
                                <button className="item button-exit" onClick={handleCancelFriend}>
                                  Hủy lời mời
                                </button>
                              </>
                            )
                          }
                          {
                            data.isFriend === 3 && (
                              <>
                                <button className="item" onClick={handleAcceptFriend}>
                                  Chấp nhận kết bạn
                                </button>
                              </>
                            )
                          }
                        </>
                      )
                    }
                  </div>
                </div>
              </div>
              <div style={{ width: '100%' }}><Posts userId={userId} /></div>
            </div>
          </>
        )}
      {openUpdate && <Update setOpenUpdate={setOpenUpdate} user={data} />}
      {openChangePassword && <UpdatePassword setOpenChangePassword={setOpenChangePassword} />}
      {openUpdateImage !== 0 && <UpdateImage setOpenUpdateImage={setOpenUpdateImage} user={data} isUpdateAvartar={openUpdateImage === 1 ? true : false} />}
    </div>
  );
};

export default memo(Profile);
