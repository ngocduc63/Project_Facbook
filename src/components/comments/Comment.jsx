import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { timeAgo } from '../../helps/timer';
import useAxiosPrivate from '../../api/axiosPrivate'
import { useEffect, useRef, useState } from "react";
import SendIcon from '@mui/icons-material/Send';
import { toast } from "react-toastify";
import SpanCustom from '../spanCustom/spanCustom'
import InputCustom from "../inputCustom/InputCustom";
import Loading from "../loading/Loading";

function Comment({ comment, currentUser }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const axiosPrivate = useAxiosPrivate();
    const [showUpdateComment, setUpdateComment] = useState(false);
    const [content, setContent] = useState(comment.content);
    const [isDelete, setIsDelete] = useState(false);
    const inputRef = useRef();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!showUpdateComment) return;
        inputRef.current.focus();

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

    const handleSummit = (inputValue) => {
        setIsLoading(true);
        axiosPrivate.put(('/post-management/post/update-comment'), { 'id_comment': comment.id, 'content': inputValue })
            .then(res => {
                setContent(res.data.data.content);
                handelCloseUpdate();
                setIsLoading(false);
            })
            .catch(err => {
                console.log(err);
                setIsLoading(false);
            })
    }

    return (!isDelete &&
        <div className="comment">
            <div className="image">
                <img src={"http://127.0.0.1:5000/user-management/user/avatar/" + comment.user.avatar} alt="" />
            </div>
            <div className="info">
                <span>{comment.user.username}</span>
                {!showUpdateComment && <SpanCustom data={content} />}
                {showUpdateComment &&
                    <>
                        {isLoading ? <Loading size={20} /> :
                            <>
                                <div className="form-update">
                                    <InputCustom handelSendMessage={handleSummit} inputRef={inputRef} defaultValue={content} />
                                </div>
                                <span className="btn-cancel" onClick={handelCloseUpdate}>Hủy</span>
                            </>
                        }
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