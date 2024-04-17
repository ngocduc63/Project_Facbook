import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { timeAgo } from '../../helps/timer';
import useAxiosPrivate from '../../api/axiosPrivate'
import { useEffect, useRef, useState } from "react";
import SendIcon from '@mui/icons-material/Send';
import { toast } from "react-toastify";

function Comment({ comment, currentUser }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const axiosPrivate = useAxiosPrivate();
    const [showUpdateComment, setUpdateComment] = useState(false);
    const [inputComment, setInputComment] = useState(comment.content);
    const [content, setContent] = useState(comment.content);
    const [isDelete, setIsDelete] = useState(false);
    const inputRef = useRef();

    useEffect(() => {
        if (!showUpdateComment) return;
        inputRef.current.focus();
        if (content) setInputComment(content)

    }, [showUpdateComment, content]);

    const handleDelete = () => {
        axiosPrivate.delete((`/post-management/post/delete-comment/${comment.id}`))
            .then(res => {
                setIsDelete(true);
                toast.success('Xóa bình luận thành công', {
                    position: 'top-right',
                })
            })
            .catch(err => {
                console.log(err);
            })
    };

    const handelCloseUpdate = () => {
        setUpdateComment(false)
    }

    const handleUpdate = () => {
        setMenuOpen(false);
        setUpdateComment(true);

    };

    const handleSummit = () => {
        axiosPrivate.put(('/post-management/post/update-comment'), { 'id_comment': comment.id, 'content': inputComment })
            .then(res => {
                setContent(res.data.data.content)
                handelCloseUpdate()
                toast.success('Chỉnh sửa bình luận thành công', {
                    position: 'top-right',
                })
            })
            .catch(err => {
                console.log(err);
            })
    }

    const handelSummitWithKeyDown = (e) => {
        if (e.keyCode === 13) {
            e.preventDefault();
            handleSummit()
        }
    }

    return (!isDelete &&
        <div className="comment">
            <div className="image">
                <img src={"http://127.0.0.1:5000/user-management/user/avatar/" + comment.user.avatar} alt="" />
            </div>
            <div className="info">
                <span>{comment.user.username}</span>
                {!showUpdateComment && <p>{content ? content : comment.content}</p>}
                {showUpdateComment &&
                    <>
                        <div className="form-update">
                            <input type="text" value={inputComment} ref={inputRef} onChange={(e) => setInputComment(e.target.value)} onKeyDown={handelSummitWithKeyDown} />
                            <SendIcon className='send-icon' onClick={handleSummit} />
                        </div>
                        <span className="btn-cancel" onClick={handelCloseUpdate}>Hủy</span>
                    </>
                }
            </div>
            <div className="date">
                <span>
                    {timeAgo(comment.create_at)}
                </span>
                {comment.user.id === currentUser.id && (
                    <>
                        <MoreHorizIcon onClick={() => setMenuOpen(!menuOpen)} className="icon-menu" style={{ cursor: 'pointer' }} />
                        {menuOpen && (
                            <div className="menu">
                                <>
                                    <button onClick={handleUpdate}>Sửa bình luận</button>
                                    <button onClick={handleDelete}>Xóa bình luận</button>
                                </>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default Comment;