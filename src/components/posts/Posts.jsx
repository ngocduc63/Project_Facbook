import Post from "../post/Post";
import "./posts.scss";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";

const Posts = ({userId}) => {
  const dataLocal = useContext(AuthContext);
  const { isLoading, error, data } = useQuery(["posts"], () =>
    makeRequest.get("/post-management/post/get-new-feed/1",{
      headers: {
        Authorization: `Bearer ${dataLocal.token.access_token}`,
      },
    }).then((res) => {
      return res.data.data;
    })
  );

  return (
    <div className="posts">
      {error
        ? "Something went wrong!"
        : isLoading
        ? "loading"
        : data.message
        // : data.map((post) => <Post post={post} key={post.id} />)
      }
    </div>
  );
};

export default Posts;
