import './update.scss';
import { timeAgo } from '../../helps/timer';
import { useState, useContext } from 'react';
import useAxiosPrivate from '../../api/axiosPrivate';
import { toast } from 'react-toastify';
import { LINK_API_AVATAR, LINK_API_COVER, LINK_API_POST } from '../../api/const';
import Loading from '../loading/Loading';
import { HomeContext } from "../../context/homeContext";

const Share = ({ post, setShowPopupShare, dataPost }) => {
    const { refetchHome } = useContext(HomeContext)

    const [input, setInput] = useState('');
    const axiosPrivate = useAxiosPrivate();
    const handelClose = () => {
        setShowPopupShare(false);
    }
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = () => {
        setIsLoading(true);

        axiosPrivate.post(('/post-management/post/share'),
            {
                'title': input,
                'status': 1,
                'post_id': dataPost.id
            })
            .then(() => {
                setIsLoading(false);
                handelClose();
                toast.success('Chia sẻ bài viết thành công', {
                    position: 'top-right',
                })
                refetchHome();
            })
            .catch((err) => {
                const errCode = err.response.data.errorCode
                if (errCode === 26) {
                    toast.error('Không thể chia sẻ bài viết của chính mình', {
                        position: 'top-right',
                    });
                }
                else {
                    toast.error('Chia sẻ bài viết thất bại', {
                        position: 'top-right',
                    });
                }

                setIsLoading(false);
            });
    }

    return (
        <div className="update">
            <div className='wrapper'>
                <h1>Chia sẻ bài viết</h1>
                <input className='input-share' value={input} onChange={(e) => setInput(e.target.value)} placeholder='Tiêu đề' />
                <div className='content-post border-1' >
                    <div className='header'>
                        <div className='avatar'>
                            <img src={LINK_API_AVATAR + post.user.avatar} alt="" />
                        </div>
                        <div className='detail'>
                            <span>{post.user.username}</span>
                            <p>{timeAgo(post.create_at)}</p>
                        </div>
                    </div>
                    <div className='main'>
                        <span style={{ display: 'flex', marginBottom: 8, fontWeight: 600 }}>{dataPost.title}</span>
                        <div className='image-post'>
                            <label htmlFor="image">
                                <div className="imgContainer">
                                    {dataPost.image &&
                                        <img
                                            src={
                                                post.category === 0 ? LINK_API_POST + (dataPost.image ?? post.image)
                                                    : post.category === 1 ? LINK_API_AVATAR + (dataPost.image ?? post.image)
                                                        : LINK_API_COVER + (dataPost.image ?? post.image)
                                            }
                                            alt="ảnh"
                                        />
                                    }
                                </div>
                            </label>
                        </div>

                    </div>
                    {!isLoading && <button onClick={handleSubmit}>Chia sẻ</button>}
                    {isLoading && <button><Loading size={20} /></button>}
                </div>
                <button className="close" onClick={handelClose}>
                    Đóng
                </button>
            </div>
        </div>
    );
}

export default Share;