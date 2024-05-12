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
import UpdatePost from "../update/UpdatePost";
import Loading from "../loading/Loading";
import InfiniteScroll from "react-infinite-scroll-component";
import { SocketContext } from "../../context/socketContext";
import { LINK_API_AVATAR, LINK_API_COVER, LINK_API_POST } from "../../api/const";

const Post = React.forwardRef(({ post }, ref) => {
  const { socketio } = useContext(SocketContext)
  const [commentOpen, setCommentOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const axiosPrivate = useAxiosPrivate()
  const [dataPost, setDataPost] = useState(post);
  const [like, setLike] = useState(0);
  const { currentUser } = useContext(AuthContext);
  const { postId } = useContext(NotifiPostContext);
  const [numComment, setNumComment] = useState(post.num_comment);
  const [isDelete, setIsDelete] = useState(false);
  const [showPopupUpdate, setShowPopupUpdate] = useState(false);
  const [showPopupLikes, setShowPopupLikes] = useState(false);

  const dataRequestLike = {
    'id_post': post.id,
    'category': 1
  }

  useEffect(() => {

    const joinRoomNotifi = (room) => {
      if (room !== "") {
        socketio.emit("join_notification_post", room);
      }
    };

    joinRoomNotifi({ post_id: post.id })

    const handleNotification = (data) => {
      if (data.post_id === post.id && data.hasOwnProperty('mess') && data.hasOwnProperty('num_like')) {
        setDataPost(data)

        if (currentUser.id === data.user_id) setLike(prve => prve + 1)
      }
      else if (data.hasOwnProperty('num_comment')) {
        setNumComment(data.num_comment)
      }
    };
    socketio.on("notification_post", handleNotification);

    return () => {
      socketio.emit("leave_notification_post", { post_id: post.id });
      socketio.off("notification_post", handleNotification);
    };

  }, [currentUser, post.id, postId, socketio]);

  const handleLike = () => {
    axiosPrivate.post(('/post-management/post/like'), dataRequestLike)
      .catch(err => {
        console.log(err);
      })
  }

  const handleUnLike = () => {
    axiosPrivate.delete((`/post-management/post/unlike/${post.id}`))
      .catch(err => {
        console.log(err);
      })
  }

  const handleDelete = () => {
    axiosPrivate.delete((`/post-management/post/delete/${post.id}`))
      .then(() => {
        setMenuOpen(false);
        setIsDelete(true)
      })
      .catch(err => {
        console.log(err);
      })
  };

  const handleUpdate = () => {
    setShowPopupUpdate(true);
    setMenuOpen(false);
  };

  const handelShowPopupLikes = () => {
    setShowPopupLikes(!showPopupLikes)
  }

  const ContentListLikes = ({ postId }) => {
    const [hasNextPage, setHasNextPage] = useState(false);
    const [pageNum, setPageNum] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [dataLikes, setDataLikes] = useState([])

    useEffect(() => {
      const controller = new AbortController();
      const { signal } = controller;

      axiosPrivate.post(('/post-management/post/likes'),
        {
          'post_id': postId,
          'page': pageNum
        }, { signal })
        .then((response) => {
          const data = response.data;

          setDataLikes((prev) => [...prev, ...data.data.datas]);
          setHasNextPage(pageNum <= data.data.maxPage - 1);
          setIsLoading(false);
        })
        .catch((e) => {
          if (signal.aborted) return;
        });

      return () => controller.abort();
    }, [postId, pageNum]);

    const content = dataLikes.map((like) => {
      return (
        <Link className="item-like" key={like.id} to={`/profile/${like.user.id}`}>
          <img src={LINK_API_AVATAR + like.user.avatar} alt="" />
          <div className="details">
            <span className="name">{like.user.username}</span>
          </div>
        </Link>
      )
    })

    return (
      <>
        {isLoading && <Loading />}
        <InfiniteScroll
          dataLength={dataLikes.length}
          next={() => setPageNum(pageNum + 1)}
          hasMore={hasNextPage}
          loader={<Loading />}
          className="popup-likes"
          height={350}
        >
          {content}
        </InfiniteScroll>
      </>
    )
  }

  const postBody = (
    <>
      {showPopupUpdate && <UpdatePost post={post} setShowPopupUpdate={setShowPopupUpdate} setDataPost={setDataPost} dataPost={dataPost} />}
      <div className="post">
        <div className="container">
          <div className="user">
            <div className="userInfo">
              <img src={LINK_API_AVATAR + post.user.avatar} alt="" />
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
            {post.user.id === currentUser.id && (
              <>
                <MoreHorizIcon onClick={() => setMenuOpen(!menuOpen)} className="icon-menu" />
                {menuOpen && (
                  <div className="menu">
                    <>
                      <button onClick={handleUpdate}>Sửa bài viết</button>
                      <button onClick={handleDelete}>Xóa bài viết</button>
                    </>
                  </div>
                )}
              </>
            )}
          </div>
          <div className="content">
            <p>{dataPost.title ? dataPost.title : post.title}</p>
            {
              (
                post.category === 0 && <img src={LINK_API_POST + (dataPost.image ?? post.image)} alt="" />
              )
            }
            {
              (
                post.category === 1 && <img src={LINK_API_AVATAR + (dataPost.image ?? post.image)} alt="" />
              )
            }
            {
              (
                post.category === 2 && <img src={LINK_API_COVER + (dataPost.image ?? post.image)} alt="" />
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
              <span onClick={handelShowPopupLikes}>{dataPost.num_like ? dataPost.num_like : post?.num_like} Likes</span>
              {showPopupLikes && (
                <ContentListLikes postId={post.id} />
              )}
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
    </>
  );

  return !isDelete && <article>{postBody}</article>
});

export default Post;
