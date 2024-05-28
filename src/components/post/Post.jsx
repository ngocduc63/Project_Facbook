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
import { convertTimespanToDay, timeAgo } from "../../helps/timer";
import UpdatePost from "../update/UpdatePost";
import Share from "../update/Share";
import Loading from "../loading/Loading";
import InfiniteScroll from "react-infinite-scroll-component";
import { SocketContext } from "../../context/socketContext";
import { LINK_API_AVATAR, LINK_API_COVER, LINK_API_POST } from "../../api/const";
import { toast } from "react-toastify";

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
  const [numShare, setNumShare] = useState(post.num_share);
  const [isDelete, setIsDelete] = useState(false);
  const [showPopupUpdate, setShowPopupUpdate] = useState(false);
  const [showPopupShare, setShowPopupShare] = useState(false);
  const [showPopupLikes, setShowPopupLikes] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dataPostShare, setDataPostShare] = useState(post);

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
      if (data.post_id !== post.id) return;
      if (data.hasOwnProperty('mess') && data.hasOwnProperty('num_like')) {
        const data_rs = dataPost
        dataPost.num_like = data.num_like
        setDataPost(data_rs)

        if (currentUser.id === data.user_id) setLike(prve => prve + 1)
      }
      else if (data.hasOwnProperty('num_comment')) {
        setNumComment(data.num_comment)
      }
      else if (data.hasOwnProperty('num_share')) {
        console.log(data)
        setNumShare(data.num_share)
      }
    };
    socketio.on("notification_post", handleNotification);

    return () => {
      socketio.emit("leave_notification_post", { post_id: post.id });
      socketio.off("notification_post", handleNotification);
    };

  }, [currentUser, post.id, postId, socketio, dataPost]);

  const handleLike = () => {
    setIsLoading(true);
    axiosPrivate.post(('/post-management/post/like'), dataRequestLike)
      .then(() => {
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        toast.error('Lỗi không thể like bài viết', {
          position: 'top-right'
        })
      })
  }

  const handleUnLike = () => {
    setIsLoading(true);
    axiosPrivate.delete((`/post-management/post/unlike/${post.id}`))
      .then(() => {
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        toast.error('Lỗi không thể unlike bài viết', {
          position: 'top-right'
        })
      })
  }

  const handleDelete = () => {
    axiosPrivate.delete((`/post-management/post/delete/${post.id}`))
      .then(() => {
        setMenuOpen(false);
        setIsDelete(true);
        toast.success('Xóa bài viết thành công', {
          position: 'top-right'
        })
      })
      .catch(() => {
        toast.error('Lỗi không thể xóa bài viết', {
          position: 'top-right'
        })
      })
  };

  const handleUpdate = () => {
    setShowPopupUpdate(true);
    setMenuOpen(false);
  };

  const handleShare = () => {
    if (dataPostShare.hasOwnProperty('post_share')) {
      setDataPostShare(post.post_share)
    }

    setShowPopupShare(true);
  };

  const handleShowPopupLikes = () => {
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
      {showPopupShare && <Share post={dataPostShare} setShowPopupShare={setShowPopupShare} dataPost={dataPost} />}
      <div className="post">
        <div className="container">
          <div className="user">
            <Link to={`/profile/${post.user.id}`} className="userInfo" style={{ textDecoration: "none", color: "inherit" }}>
              <img src={LINK_API_AVATAR + post.user.avatar} alt="" style={{ cursor: 'pointer' }} />
              <div className="details">
                <div>
                  <span className="name">{post.user.username}</span>
                </div>
                <span className="date" title={convertTimespanToDay(post.create_at)}>{timeAgo(post.create_at)}</span>
              </div>
            </Link>
            {(post.user.id === currentUser.id || currentUser.role === 1) && (
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

          {post.hasOwnProperty('post_share') &&
            <div className="content-share">
              <div className="user">
                <Link to={`/profile/${post.user.id}`} className="userInfo" style={{ textDecoration: "none", color: "inherit" }}>
                  <img src={LINK_API_AVATAR + post.post_share.user.avatar} alt="" />
                  <div className="details">
                    <div
                      to={`/profile/${post.post_share.user.id}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <span className="name">{post.post_share.user.username}</span>
                    </div>
                    <span className="date" title={convertTimespanToDay(post.post_share.create_at)}>{timeAgo(post.post_share.create_at)}</span>
                  </div>
                </Link>
              </div>
              <div className="content">
                <p>{post.post_share.title ? post.post_share.title : post.post_share.title}</p>
                {
                  (
                    post.post_share.category === 0 && <img src={LINK_API_POST + (post.post_share.image ?? post.post_share.image)} alt="" />
                  )
                }
                {
                  (
                    post.post_share.category === 1 && <img src={LINK_API_AVATAR + (post.post_share.image ?? post.post_share.image)} alt="" />
                  )
                }
                {
                  (
                    post.post_share.category === 2 && <img src={LINK_API_COVER + (post.post_share.image ?? post.post_share.image)} alt="" />
                  )
                }
              </div>
            </div>
          }

          <div className="info">
            <div className="item">
              {isLoading && <Loading size={20} />}
              {
                !isLoading && (
                  <>
                    {(like % 2 === 0 ? post.liked : !post.liked) ?
                      (
                        <FavoriteOutlinedIcon
                          style={{ color: "red" }}
                          onClick={handleUnLike}
                        />
                      ) : (
                        <FavoriteBorderOutlinedIcon onClick={handleLike} />
                      )}
                  </>
                )
              }
              <span onClick={handleShowPopupLikes}>{dataPost.num_like ? dataPost.num_like : post?.num_like} Likes</span>
              {showPopupLikes && (
                <ContentListLikes postId={post.id} />
              )}
            </div>
            <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
              <TextsmsOutlinedIcon />
              {numComment} Comments
            </div>
            <div className="item" onClick={handleShare}>
              <ShareOutlinedIcon />
              {`${numShare} Share`}
            </div>
          </div>
          {commentOpen && <Comments postId={post.id} isAdmin={currentUser.role === 1 || post.user.id === currentUser.id} />}
        </div>
      </div>
    </>
  );

  return !isDelete && <article>{postBody}</article>
});

export default Post;
