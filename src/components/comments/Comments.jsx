import { useContext, useState } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/authContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import moment from "moment";

const Comments = ({ postId }) => {
  const [desc, setDesc] = useState("");
  const dataLocal = useContext(AuthContext)
  const requestData = {
    'post_id': postId,
    'page': 1
  }

  const { isLoading, error, data } = useQuery(["comments"], () =>
    makeRequest.post("/post-management/post/comments", requestData).then((res) => {
      return res.data.data;
    })
  );

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (newComment) => {
      return makeRequest.post("/comments", newComment);
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["comments"]);
      },
    }
  );

  const handleClick = async (e) => {
    e.preventDefault();
    mutation.mutate({ desc, postId });
    setDesc("");
  };

  return (
    <div className="comments">
      <div className="write">
        <img src={"http://127.0.0.1:5000/user-management/user/avatar/" + dataLocal.currentUser.avatar} alt="" />
        <input
          type="text"
          placeholder="write a comment"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <button onClick={handleClick}>Send</button>
      </div>
      {error
        ? "Something went wrong"
        : isLoading
        ? "loading"
        : data.data.map((comment) => (
            <div className="comment">
              <img src={"http://127.0.0.1:5000/user-management/user/avatar/" + comment.user.avatar} alt="" />
              <div className="info">
                <span>{comment.user.username}</span>
                <p>{comment.content}</p>
              </div>
              <span className="date">
                {moment(comment.create_at).fromNow()}
              </span>
            </div>
          ))}
    </div>
  );
};

export default Comments;
