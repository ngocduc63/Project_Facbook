import Post from "../post/Post";
import "./posts.scss";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/authContext";

const Posts = ({userId}) => {
  const [hasFetched, setHasFetched] = useState(false);
  const dataLocal = useContext(AuthContext);
  const { isLoading, error, data, refetch } = useQuery(["posts"], () =>
    makeRequest.get("/post-management/post/get-new-feed/1").then((res) => {
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
        : data.data.map((post) => <Post post={post} key={post.id} />)
      }
    </div>
  );
};

export default Posts;
