import { useContext, useState, useEffect } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/authContext";
import Loading from "../loading/Loading";
import useAxiosPrivate from '../../api/axiosPrivate'
import { toast } from 'react-toastify';
import InfiniteScroll from 'react-infinite-scroll-component'
import Comment from "./Comment";
import InputCustom from '../inputCustom/InputCustom'
import { LINK_API_AVATAR } from "../../api/const";

const Comments = ({ postId }) => {
  const { currentUser } = useContext(AuthContext);
  const axiosPrivate = useAxiosPrivate();
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [pageNum, setPageNum] = useState(1);
  const [refecthComment, setRefecthComment] = useState(false);

  useEffect(() => {
    setPageNum(1);
    setResults([])
  }, [refecthComment])

  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller

    axiosPrivate.post(('/post-management/post/comments'), {
      'post_id': postId,
      'page': pageNum
    }, { signal })
      .then(response => {
        const data = response.data;

        setResults(prev => [...prev, ...data.data.datas])
        setHasNextPage(pageNum <= data.data.maxPage - 1)
        setIsLoading(false)
      })
      .catch(e => {

        setIsLoading(false)
        if (signal.aborted) return
      })

    return () => controller.abort()

  }, [axiosPrivate, pageNum, refecthComment, isLoading, postId])



  const content = results.map((comment) => <Comment comment={comment} currentUser={currentUser} key={comment.id} />)

  const handleComment = (desc) => {
    if (desc.trim() === '') return;

    axiosPrivate.post(('/post-management/post/comment'), { 'id_post': postId, 'content': desc })
      .then((response) => {
        setRefecthComment(!refecthComment)
      })
      .catch((err) => {
        toast.error("comment posted error", {
          position: 'top-right'
        });
      });
  }

  return (
    <div className="comments">
      <div className="write">
        <img src={LINK_API_AVATAR + currentUser.avatar} alt="" />
        <InputCustom handelSendMessage={handleComment} />
      </div>
      <div className="list-comment">
        <InfiniteScroll
          dataLength={results.length}
          next={() => setPageNum(pageNum + 1)}
          hasMore={hasNextPage}
          loader={<Loading />}
          height={300}
          className="content-comment"
        >
          {content}
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default Comments;
