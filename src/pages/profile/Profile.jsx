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
import { useState, useEffect } from "react";
import Loading from "../../components/loading/Loading";
import { convertToDate } from "../../helps/timer";
import { toast } from 'react-toastify'

const Profile = () => {
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openUpdateImage, setOpenUpdateImage] = useState(0);
  const [openPopup, setOpenPopup] = useState(0);
  const { currentUser, setTokenAndUser } = useContext(AuthContext);
  const [isRefetch, setIsRefetch] = useState(false);
  const [showPopupUnfriend, setShowPopupUnfriend] = useState(false);
  const axiosPrivate = useAxiosPrivate();

  const userId = parseInt(useLocation().pathname.split("/")[2]);

  const { isLoading, error, data, refetch } = useQuery(["user", userId], () =>
    axiosPrivate.get("/user-management/user/" + userId).then((res) => {
      return res.data.data;
    })
  );

  useEffect(() => {
    refetch();
  }, [userId, isRefetch, refetch]);

  const handelLogout = () => {
    setTokenAndUser(null, null)
  }

  const handelUpdateProfile = () => {
    setOpenUpdate(true)
  }

  const handelOpenPopupAvatar = () => {
    setOpenPopup(1)
  }

  const handelOpenPopupCover = () => {
    setOpenPopup(2)
  }

  const handleClosePopups = () => {
    setOpenPopup(0);
  };

  const handelAddFriend = () => {
    axiosPrivate.post(('friend-management/add-friend/' + userId))
      .then((response) => {
        toast.success("Gửi lời mời thành công", {
          position: "top-right"
        })
        setIsRefetch(!isRefetch)
      })
      .catch((error) => {
        toast.error("Gửi lời mời thất bại", {
          position: "top-right"
        })
      })
  }

  const handelAcceptFriend = () => {
    axiosPrivate.put(('/friend-management/accept/' + userId))
      .then((response) => {
        toast.success("Xác nhận lời mời thành công", {
          position: "top-right"
        })
        setIsRefetch(!isRefetch)
      })
      .catch((error) => {
        toast.error("Xác nhận lời mời thất bại", {
          position: "top-right"
        })
      })
  }

  const handelCancelFriend = () => {
    axiosPrivate.delete(('/friend-management/unfriend/' + userId))
      .then((response) => {
        toast.success("Hủy kết bạn thành công", {
          position: "top-right"
        })
        setIsRefetch(!isRefetch)
      })
      .catch((error) => {
        toast.error("Hủy lời mời thất bại", {
          position: "top-right"
        })
      })
  }

  return (
    <div className="profile">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div className="images">
            <div className="body-cover">
              <img src={"http://127.0.0.1:5000/user-management/user/cover/" + data.cover_photo} alt="" className="cover" onClick={handelOpenPopupCover} />
              {openPopup === 2 && (
                <div className="body-edit body-edit-cover">
                  <div onClick={handleClosePopups}>Xem ảnh bìa</div>
                  {currentUser.id === data.id && <div onClick={() => setOpenUpdateImage(2)}>Chỉnh sửa ảnh bìa</div>}
                </div>
              )}
            </div>

            <div className="body-avatar">
              <img src={"http://127.0.0.1:5000/user-management/user/avatar/" + data.avatar} alt="" className="profilePic" onClick={handelOpenPopupAvatar} />
              {openPopup === 1 && (
                <div className="body-edit">
                  <div onClick={handleClosePopups} >Xem ảnh đại diện</div>
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
                    <span>Ngày sinh:</span>
                    <span>{convertToDate(data.birth_date)}</span>
                  </div>
                </div>
                <div className="buttons">
                  {
                    currentUser.id === data.id && (
                      <>
                        <button className="item" onClick={handelUpdateProfile}>
                          Chỉnh sửa thông tin
                        </button>
                        <button className="item button-exit" onClick={handelLogout}>
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
                              <button className="item" onClick={handelAddFriend}>
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
                                      <button className="item button-exit" onClick={handelCancelFriend}>
                                        Hủy kết bạn
                                      </button>
                                    </div>
                                  </>
                                )
                              }
                              <button className="item button-mess">
                                <span>Nhắn tin</span>
                                <ChatBubbleOutlineIcon />
                              </button>
                            </>
                          )
                        }
                        {
                          data.isFriend === 2 && (
                            <>
                              <button className="item button-exit" onClick={handelCancelFriend}>
                                Hủy lời mời
                              </button>
                            </>
                          )
                        }
                        {
                          data.isFriend === 3 && (
                            <>
                              <button className="item" onClick={handelAcceptFriend}>
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
            <Posts userId={userId} />
          </div>
        </>
      )}
      {openUpdate && <Update setOpenUpdate={setOpenUpdate} user={data} />}
      {openUpdateImage !== 0 && <UpdateImage setOpenUpdateImage={setOpenUpdateImage} user={data} isUpdateAvartar={openUpdateImage === 1 ? true : false} />}
    </div>
  );
};

export default Profile;
