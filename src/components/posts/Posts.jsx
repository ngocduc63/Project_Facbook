import Post from "../post/Post";
import "./posts.scss";
import { useState, useEffect, memo } from "react";
import Loading from "../loading/Loading";
import InfiniteScroll from "react-infinite-scroll-component";
import useAxiosPrivate from '../../api/axiosPrivate';

const Posts = ({ userId, isRefecth }) => {
  const axiosPrivate = useAxiosPrivate();
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({});
  const [hasNextPage, setHasNextPage] = useState(false);
  const [pageNum, setPageNum] = useState(1)

  useEffect(() => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    setResults([])
  }, [isRefecth])

  useEffect(() => {
    setIsLoading(true);
    setError({});

    const controller = new AbortController();
    const { signal } = controller;

    axiosPrivate
      .get(`/post-management/post/get-new-feed/${pageNum}`, { signal })
      .then((response) => {
        const data = response.data;

        setResults((prev) => [...prev, ...data.data.datas]);
        setHasNextPage(pageNum <= data.data.maxPage - 1);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
        if (signal.aborted) return;
        setError({ message: e.message });
      });

    return () => controller.abort();
  }, [axiosPrivate, pageNum]);

  const content = results.map((post, i) => {
    if (results.length === i + 1) {
      return <Post key={post.id} post={post} />
    }
    return <Post key={post.id} post={post} />
  })

  return (
    <>
      <InfiniteScroll
        dataLength={results.length}
        next={() => setPageNum(pageNum + 1)}
        hasMore={hasNextPage}
        loader={<Loading />}
        className="posts"
      >
        {content}
      </InfiniteScroll>
      {isLoading && <Loading />}
      <p className="center"><a href="#top" className="button-load">Lên đầu trang</a></p>
    </>
  );
};

export default memo(Posts);
