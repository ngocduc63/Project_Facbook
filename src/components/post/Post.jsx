import "./post.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from "react-router-dom";
import Comments from "../comments/Comments";
import React, { useState, useEffect } from "react";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { NotifiPostContext } from "../../context/notifiPostContext";
import useAxiosPrivate from "../../api/axiosPrivate";
import { timeAgo } from "../../helps/timer";
import socket from "../../helps/socket"

const Post = React.forwardRef(({ post }, ref) => {
  const [commentOpen, setCommentOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const axiosPrivate = useAxiosPrivate()
  const [dataPost, setDataPost] = useState({});
  const [like, setLike] = useState(0);
  const { currentUser } = useContext(AuthContext);
  const { setData, postId } = useContext(NotifiPostContext);
  const [numComment, setNumComment] = useState(post.num_comment);
  const [isDelete, setIsDelete] = useState(false);

  const dataRequestLike = {
    'id_post': post.id,
    'category': 1
  }

  useEffect(() => {

    const joinRoomNotifi = (room) => {
      if (room !== "") {
        socket.emit("join_notification_post", room);
      }
    };

    joinRoomNotifi({ post_id: post.id })

    const handleNotification = (data) => {
      setData(data)

      if (data.post_id === post.id && data.hasOwnProperty('mess') && data.hasOwnProperty('num_like')) {
        setDataPost(data)

        if (currentUser.id === data.user_id) setLike(prve => prve + 1)
      }
      else if (data.hasOwnProperty('num_comment')) {
        setNumComment(data.num_comment)
      }
    };
    socket.on("notification_post", handleNotification);

    return () => {
      socket.emit("leave_notification_post", { post_id: post.id });
      socket.off("notification_post", handleNotification);
    };

  }, [currentUser, post.id, setData, postId]);

  const handleLike = () => {
    axiosPrivate.post(('/post-management/post/like'), dataRequestLike)
      .then(res => {
        // const data = res.data;
        // console.log('like succcess');
      })
      .catch(err => {
        console.log(err);
      })

  }

  const handleUnLike = () => {
    axiosPrivate.delete((`/post-management/post/unlike/${post.id}`))
      .then(res => {
        // const data = res.data;
        // console.log('unlike success');
      })
      .catch(err => {
        console.log(err);
      })
  }

  const handleDelete = () => {
    axiosPrivate.delete((`/post-management/post/delete/${post.id}`))
      .then(res => {
        setIsDelete(true)
      })
      .catch(err => {
        console.log(err);
      })
  };
  const postBody = (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <img src={"http://127.0.0.1:5000/user-management/user/avatar/" + post.user.avatar} alt="" />
            <div className="details">
              <Link
                to={`/profile/${post.user.id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span className="name">{post.user.username}</span>
              </Link>
              <span className="date">{timeAgo(post.create_at)}</span>
            </div>
          </div>
          <MoreHorizIcon onClick={() => setMenuOpen(!menuOpen)} className="icon-menu" />
          <div className="menu">
            {menuOpen && post.user.id === currentUser.id && (
              <>
                <button onClick={handleDelete}>Sửa bài viết</button>
                <button onClick={handleDelete}>Xóa bài viết</button>
              </>
            )}
          </div>
        </div>
        <div className="content">
          <p>{post.title}</p>
          {
            (
              post.category === 0 && <img src={"http://127.0.0.1:5000/post-management/post/image/" + post.image} alt="" />
            )
          }
          {
            (
              post.category === 1 && <img src={"http://127.0.0.1:5000/user-management/user/avatar/" + post.image} alt="" />
            )
          }
          {
            (
              post.category === 2 && <img src={"http://127.0.0.1:5000/user-management/user/cover/" + post.image} alt="" />
            )
          }

        </div>
        <div className="info">
          <div className="item">
            {(like % 2 === 0 ? post.liked : !post.liked) ?
              (
                <FavoriteOutlinedIcon
                  style={{ color: "red" }}
                  onClick={handleUnLike}
                />
              ) : (
                <FavoriteBorderOutlinedIcon onClick={handleLike} />
              )}
            {dataPost.num_like ? dataPost.num_like : post?.num_like} Likes
          </div>
          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon />
            {numComment} Comments
          </div>
          <div className="item">
            <ShareOutlinedIcon />
            Share
          </div>
        </div>
        {commentOpen && <Comments postId={post.id} />}
      </div>
    </div>
  );

  return !isDelete && <article>{postBody}</article>
});

export default Post;
