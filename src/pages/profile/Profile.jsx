import "./profile.scss";
import PlaceIcon from "@mui/icons-material/Place";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Posts from "../../components/posts/Posts";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import useAxiosPrivate from "../../api/axiosPrivate";
import { useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import Update from "../../components/update/Update";
import { useState } from "react";
import BeatLoader from "react-spinners/BeatLoader"
import Loading from "../../components/loading/Loading";

const Profile = () => {
  const [openUpdate, setOpenUpdate] = useState(false);
  const { currentUser, setTokenAndUser } = useContext(AuthContext);
  const axiosPrivate = useAxiosPrivate();

  const userId = parseInt(useLocation().pathname.split("/")[2]);

  const { isLoading, error, data } = useQuery(["user"], () =>
    axiosPrivate.get("/user-management/user/" + userId).then((res) => {
      return res.data.data;
    })
  );

  // const { isLoading: rIsLoading, data: relationshipData } = useQuery(
  //   ["relationship"],
  //   () =>
  //     makeRequest.get("/relationships?followedUserId=" + userId).then((res) => {
  //       return res.data;
  //     })
  // );

  const queryClient = useQueryClient();

  // const mutation = useMutation(
  //   (following) => {
  //     if (following)
  //       return makeRequest.delete("/relationships?userId=" + userId);
  //     return makeRequest.post("/relationships", { userId });
  //   },
  //   {
  //     onSuccess: () => {
  //       // Invalidate and refetch
  //       queryClient.invalidateQueries(["relationship"]);
  //     },
  //   }
  // );

  // const handleFollow = () => {
  //   mutation.mutate(relationshipData.includes(currentUser.id));
  // };

  const logoutHandel = () => {
    setTokenAndUser(null, null)
  }
  
  return (
    <div className="profile">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div className="images">
            <img src={"http://127.0.0.1:5000/user-management/user/cover/"+data.cover_photo} alt="" className="cover" />
            <img src={"http://127.0.0.1:5000/user-management/user/avatar/"+data.avatar} alt="" className="profilePic" />
          </div>
          <div className="profileContainer">
            <div className="uInfo">
              <div className="center">
                <span>{data.username}</span>
                <div className="info">
                  <div className="item">
                    <PlaceIcon />
                    <span>{data.city}</span>
                  </div>
                  {
                    currentUser.id === data.id && (
                      <button className="item button-exit" onClick={logoutHandel}>
                        <ExitToAppIcon />
                      </button>
                    )
                  }
                </div>
                {/* {rIsLoading ? (
                  "loading"
                ) : userId === currentUser.id ? (
                  <button onClick={() => setOpenUpdate(true)}>update</button>
                ) : (
                  <button onClick={handleFollow}>
                    {relationshipData.includes(currentUser.id)
                      ? "Following"
                      : "Follow"}
                  </button>
                )*/}
              </div>
              {/* <div className="right">
                <EmailOutlinedIcon />
                <MoreVertIcon />
              </div> */}
            </div>
            <Posts userId={userId} />
          </div>
        </>
      )}
      {openUpdate && <Update setOpenUpdate={setOpenUpdate} user={data} />}
    </div>
  );
};

export default Profile;
