// import Stories from "../../components/stories/Stories"
import Posts from "../../components/posts/Posts"
import Share from "../../components/share/Share"
import { memo, useContext, useState, useEffect } from 'react'
import "./home.scss"
import { HomeContext } from "../../context/homeContext"
import Post from "../../components/post/Post"
import useAxiosPrivate from "../../api/axiosPrivate"
import { AuthContext } from "../../context/authContext"
import { NotificationContext } from "../../context/notificationContext"

const Home = () => {
  const axiosPrivate = useAxiosPrivate();
  const { isRefetch, isShowPopupPost, currentPost } = useContext(HomeContext)
  const { setCountNotification } = useContext(NotificationContext)
  const { currentUser } = useContext(AuthContext)
  const [dataPost, setDataPost] = useState();

  useEffect(() => {
    document.title = 'Facebook';
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    const controller = new AbortController()
    const { signal } = controller

    axiosPrivate.get((`/user-management/user/${currentUser.id}`), { signal })
      .then((response) => {
        const data = response.data?.data;
        setCountNotification(data.count_notification)
      })
      .catch(() => {
        if (signal.aborted) return
      })

    return () => controller.abort()

  }, [currentUser, axiosPrivate, setCountNotification]);

  useEffect(() => {
    if (!isShowPopupPost) return;

    const controller = new AbortController()
    const { signal } = controller

    axiosPrivate.get((`/post-management/post/${currentPost}`), { signal })
      .then((response) => {
        const data = response.data?.data
        setDataPost(data);

        setTimeout(() => {
          window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth'
          });
        }, 5)
      })
      .catch((error) => {
        console.log(error)
        if (signal.aborted) return
      })

    return () => controller.abort()

  }, [axiosPrivate, currentPost, isShowPopupPost]);

  return (
    <div className="home">
      <Share />
      {!isShowPopupPost && <Posts isRefecth={isRefetch} isAdmin={currentUser.role === 1} />}
      {isShowPopupPost && dataPost && <Post post={dataPost} />}
    </div>
  )
}

export default memo(Home)