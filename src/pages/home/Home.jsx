// import Stories from "../../components/stories/Stories"
import Posts from "../../components/posts/Posts"
import Share from "../../components/share/Share"
import { memo, useContext, useEffect } from 'react'
import "./home.scss"
import { HomeContext } from "../../context/homeContext"
import useAxiosPrivate from "../../api/axiosPrivate"
import { AuthContext } from "../../context/authContext"
import { NotificationContext } from "../../context/notificationContext"

const Home = () => {
  const axiosPrivate = useAxiosPrivate();
  const { isRefetch, } = useContext(HomeContext)
  const { setCountNotification } = useContext(NotificationContext)
  const { currentUser } = useContext(AuthContext)

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

  return (
    <div className="home">
      <Share />
      <Posts isRefecth={isRefetch} isAdmin={currentUser.role === 1} />
    </div>
  )
}

export default memo(Home)