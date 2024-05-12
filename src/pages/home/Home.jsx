import Stories from "../../components/stories/Stories"
import Posts from "../../components/posts/Posts"
import Share from "../../components/share/Share"
import { memo, useContext, useState, useEffect } from 'react'
import "./home.scss"
import { HomeContext } from "../../context/homeContext"
import Post from "../../components/post/Post"
import useAxiosPrivate from "../../api/axiosPrivate"

const Home = () => {
  const axiosPrivate = useAxiosPrivate();
  const { isRefetch, isShowPopupPost, currentPost } = useContext(HomeContext)
  const [dataPost, setDataPost] = useState();

  useEffect(() => {
    document.title = 'Facebook';
  }, []);

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

  }, [isShowPopupPost, axiosPrivate, currentPost]);

  return (
    <div className="home">
      <Share />
      {!isShowPopupPost && <Posts isRefecth={isRefetch} />}
      {isShowPopupPost && dataPost && <Post post={dataPost} />}
    </div>
  )
}

export default memo(Home)