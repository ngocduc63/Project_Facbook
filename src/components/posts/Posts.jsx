import Post from "../post/Post";
import "./posts.scss";
import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "../../api/axiosPrivate";
import { useState, useEffect } from "react";

const Posts = ({userId}) => {
  const [hasFetched, setHasFetched] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const { isLoading, error, data, refetch } = useQuery(["posts"], () =>
    axiosPrivate.get("/post-management/post/get-new-feed/1").then((res) => {
      return res.data.data;
    })
  );
  useEffect(() => {
    // Gọi lại dữ liệu chỉ khi chưa thực hiện cuộc gọi API
    if (!hasFetched) {
      refetch();
    }
  }, [hasFetched, refetch]);
  return (
    <div className="posts">
      {error
        ? "Something went wrong!"
        : isLoading
        ? "loading"
        : data.datas.map((post) => <Post post={post} key={post.id} />)
      }
    </div>
  );
};

export default Posts;
