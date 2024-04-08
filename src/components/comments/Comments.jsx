import { useContext, useState, useEffect } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/authContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import useComments from "../../hooks/useComments";
import Loading from "../loading/Loading";

const Comments = ({ postId }) => {
  const [desc, setDesc] = useState("");
  const dataLocal = useContext(AuthContext)
  const [requestData, setRequestData] = useState({
    'post_id': postId,
    'page': 1
  })

  const {
    isLoading,
    isError,
    error,
    results,
    hasNextPage
  } = useComments(requestData)

  // const isLoading = false
  // const error = false
  // const results = [];
  // const queryClient = useQueryClient();

  // const mutation = useMutation(
  //   (newComment) => {
  //     return axiosPrivate.post("/comments", newComment);
  //   },
  //   {
  //     onSuccess: () => {
  //       // Invalidate and refetch
  //       queryClient.invalidateQueries(["comments"]);
  //     },
  //   }
  // );

  // const handleClick = async (e) => {
  //   e.preventDefault();
  //   mutation.mutate({ desc, postId });
  //   setDesc("");
  // };

  if (isError) return <p className='center'>Error: {error.message}</p>

  const content = results.map((comment, i) => {
    return (
      <div className="comment" key={comment.id}>
        <img src={"http://127.0.0.1:5000/user-management/user/avatar/" + comment.user.avatar} alt="" />
        <div className="info">
          <span>{comment.user.username}</span>
          <p>{comment.content}</p>
        </div>
        <span className="date">
          {moment(comment.create_at).fromNow()}
        </span>
    </div>
    )
})

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
        {/* <button onClick={handleClick}>Send</button> */}
        <button >Send</button>
      </div>
      {content}
      {isLoading && <Loading/>}
    </div>
  );
};

export default Comments;
