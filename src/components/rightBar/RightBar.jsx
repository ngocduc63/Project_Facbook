import "./rightBar.scss";
import useAxiosPrivate from "../../api/axiosPrivate";
import { useEffect, useState, memo, useContext } from "react";
import { toast } from "react-toastify"
import { Link } from "react-router-dom";
import { RefecthInviteContext } from "../../context/refecthInvite"

const RightBar = () => {
  const axiosPrivate = useAxiosPrivate();
  const [listInvite, setListInvite] = useState([])
  const [pageInvite, setPageInvite] = useState(1)
  const { isRefecthInvite } = useContext(RefecthInviteContext)

  useEffect(() => {
    const fetchInviteList = async () => {
      try {
        const response = await axiosPrivate.get(`/friend-management/invite-friend/${pageInvite}`);
        setListInvite(response.data.data.datas);
      } catch (error) {
        if (error.response.status === 402) return;
        toast.error("Lỗi không tải được danh sách bạn bè", {
          position: "top-right"
        });
      }
    };

    fetchInviteList();
  }, [axiosPrivate, pageInvite, isRefecthInvite]);

  const deleteListInvite = (friend_id) => {
    let newList = listInvite.filter(item => item.friend_id !== friend_id);

    setListInvite(newList)
  }

  const handelAcceptFriend = (e, friend_id) => {
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

  const handelCancelFriend = (e, friend_id) => {
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

  return (
    <div className="rightBar">
      <div className="container">
        <div className="item">
          <span>Danh sách lời mời</span>
          {listInvite.map(user =>
          (
            <Link to={"/profile/" + user.friend_id} className="user" key={user.friend_id}>
              <div className="userInfo">
                <img
                  src={"http://localhost:5000/user-management/user/avatar/" + user.avatar}
                  alt=""
                />
              </div>
              <div className="info">
                <span>{user.name}</span>

                <div className="buttons">
                  <button onClick={(e) => handelAcceptFriend(e, user.friend_id)}>Xác nhận</button>
                  <button onClick={(e) => handelCancelFriend(e, user.friend_id)}>Hủy</button>
                </div>
              </div>
            </Link>
          )
          )}
        </div>

        <div className="item">
          <span>Online Friends</span>
          <div className="user">
            <div className="userInfo">
              <img
                src="https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600"
                alt=""
              />
              <div className="online" />
              <span>Jane Doe</span>
            </div>
          </div>
          <div className="user">
            <div className="userInfo">
              <img
                src="https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600"
                alt=""
              />
              <div className="online" />
              <span>Jane Doe</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default memo(RightBar);
