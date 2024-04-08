import "./post.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from "react-router-dom";
import Comments from "../comments/Comments";
import React, { useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import useAxiosPrivate from "../../api/axiosPrivate";
import { timeAgo } from "../../helps/timer";

const Post = React.forwardRef(({ post }, ref) => {
  const [commentOpen, setCommentOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const axiosPrivate = useAxiosPrivate()

  const { currentUser } = useContext(AuthContext);
  const dataRequestLike = {
    'id_post': post.id,
    'category': 1
  }

  const handleLike = () => {
    axiosPrivate.post(('/post-management/post/like'), dataRequestLike)
      .then(res => {
        const data = res.data;
        console.log('like succcess');
      })
      .catch(err => {
        console.log(err);
      })
    
  }

  const handleUnLike = () => {
    axiosPrivate.delete((`/post-management/post/unlike/${post.id}`))
      .then(res => {
        const data = res.data;
        console.log('unlike success');
      })
      .catch(err => {
        console.log(err);
      })
    
  }

  // const handleDelete = () => {
  //   deleteMutation.mutate(post.id);
  // };
  const postBody = (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <img src={"http://127.0.0.1:5000/user-management/user/avatar/"+post.user.avatar} alt="" />
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
          <MoreHorizIcon onClick={() => setMenuOpen(!menuOpen)} />
          {/* {menuOpen && post.user.id === currentUser.id && (
            <button onClick={handleDelete}>delete</button>
          )} */}
        </div>
        <div className="content">
          <p>{post.title}</p>
          <img src={"http://127.0.0.1:5000/post-management/post/image/" + post.image} alt="" />
        </div>
        <div className="info">
          <div className="item">
            {post.liked ? 
             (
              <FavoriteOutlinedIcon
                style={{ color: "red" }}
                onClick={handleUnLike}
              />
            ) : (
              <FavoriteBorderOutlinedIcon onClick={handleLike} />
            )}
            {post?.num_like} Likes
          </div>
          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon />
            See Comments
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

  const content = ref
        ? <article ref={ref}>{postBody}</article>
        : <article>{postBody}</article>


  return content
});

export default Post;
