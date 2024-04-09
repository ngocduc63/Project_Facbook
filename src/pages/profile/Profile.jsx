import "./profile.scss";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Posts from "../../components/posts/Posts";
import { useQuery} from "@tanstack/react-query";
import useAxiosPrivate from "../../api/axiosPrivate";
import { useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import Update from "../../components/update/Update";
import UpdateImage from "../../components/update/UpdateImage";
import { useState } from "react";
import Loading from "../../components/loading/Loading";
import { convertToDate } from "../../helps/timer";

const Profile = () => {
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openUpdateImage, setOpenUpdateImage] = useState(0);
  const [openPopup, setOpenPopup] = useState(0);
  const { currentUser, setTokenAndUser } = useContext(AuthContext);
  const axiosPrivate = useAxiosPrivate();

  const userId = parseInt(useLocation().pathname.split("/")[2]);

  const { isLoading, error, data } = useQuery(["user"], () =>
    axiosPrivate.get("/user-management/user/" + userId).then((res) => {
      return res.data.data;
    })
  );

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

  return (
    <div className="profile">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div className="images">
            <div className="body-cover">
              <img src={"http://127.0.0.1:5000/user-management/user/cover/"+data.cover_photo} alt="" className="cover" onClick={handelOpenPopupCover}/>
              {openPopup ===  2 && (
                <div className="body-edit body-edit-cover">
                  <div onClick={handleClosePopups}>Xem ảnh bìa</div>
                  {currentUser.id === data.id && <div onClick={() => setOpenUpdateImage(2)}>Chỉnh sửa ảnh bìa</div>}
                </div>
              )}
            </div>

            <div className="body-avatar">
              <img src={"http://127.0.0.1:5000/user-management/user/avatar/"+data.avatar} alt="" className="profilePic" onClick={handelOpenPopupAvatar}/>
              {openPopup ===  1 && (
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
                <span>{data.username} {data.nickname && <span>({data.nickname})</span> }</span>
                {data.description && <span className="description">{data.description}</span>}
                <div className="info">
                  <div className="item">
                    <span>Ngày sinh:</span>
                    <span>{convertToDate(data.birth_date)}</span>
                  </div>
                </div>
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
              </div>
            </div>
            <Posts userId={userId} />
          </div>
        </>
      )}
      {openUpdate && <Update setOpenUpdate={setOpenUpdate} user={data} />}
      {openUpdateImage !== 0 && <UpdateImage setOpenUpdateImage={setOpenUpdateImage} user={data} isUpdateAvartar = {openUpdateImage === 1 ? true : false}/>}
    </div>
  );
};

export default Profile;
