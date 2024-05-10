import "./share.scss";
import Image from "../../assets/img.png";
import Map from "../../assets/map.png";
import Friend from "../../assets/friend.png";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import useAxiosPrivate from "../../api/axiosPrivate";
import { LINK_API_AVATAR } from "../../api/const";
import { HomeContext } from "../../context/homeContext";
import { toast } from "react-toastify";

const Share = () => {
  const { refetchHome } = useContext(HomeContext)
  const axiosPrivate = useAxiosPrivate()
  const [file, setFile] = useState(null);
  const [desc, setDesc] = useState("");

  const { currentUser } = useContext(AuthContext);

  const handleClick = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("data", JSON.stringify({ title: desc, status: 1 }));
    if (file) {
      formData.append("image", file);
    }
    axiosPrivate.post("/post-management/post/create", formData)
      .then((response) => {
        toast.success('Đăng bài thành công', {
          position: 'top-right'
        })
        refetchHome();
      })
      .catch((error) => {

      })

    setDesc("");
    setFile(null);
  };

  return (
    <div className="share">
      <div className="container">
        <div className="top">
          <div className="left">
            <img src={LINK_API_AVATAR + currentUser.avatar} alt="" />
            <input
              type="text"
              placeholder={`What's on your mind ${currentUser.username}?`}
              onChange={(e) => setDesc(e.target.value)}
              value={desc}
            />
          </div>
          <div className="right">
            {file && (
              <img className="file" alt="" src={URL.createObjectURL(file)} />
            )}
          </div>
        </div>
        <hr />
        <div className="bottom">
          <div className="left">
            <input
              type="file"
              id="file"
              style={{ display: "none" }}
              onChange={(e) => setFile(e.target.files[0])}
            />
            <label htmlFor="file">
              <div className="item">
                <img src={Image} alt="" />
                <span>Add Image</span>
              </div>
            </label>
            <div className="item">
              <img src={Map} alt="" />
              <span>Add Place</span>
            </div>
            <div className="item">
              <img src={Friend} alt="" />
              <span>Tag Friends</span>
            </div>
          </div>
          <div className="right">
            <button onClick={handleClick}>Share</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Share;
