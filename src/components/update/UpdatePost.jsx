import './update.scss';
import { timeAgo } from '../../helps/timer';
import { useContext, useEffect, useState } from 'react';
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import useAxiosPrivate from '../../api/axiosPrivate';
import { toast } from 'react-toastify';
import { LINK_API_AVATAR, LINK_API_COVER, LINK_API_POST } from '../../api/const';

const UpdatePost = ({ post, setShowPopupUpdate, setDataPost, dataPost }) => {
    const [image, setImage] = useState(null);
    const [input, setInput] = useState('');
    const axiosPrivate = useAxiosPrivate();
    const handelClose = () => {
        setShowPopupUpdate(false);
    }

    useEffect(() => {
        if (dataPost) setInput(dataPost.title);
    }, [dataPost])

    const handelSummit = () => {
        const formData = new FormData();
        formData.append('data', JSON.stringify({ 'id': post.id, 'title': input, 'status': 1 }))
        formData.append('image', image)
        axiosPrivate.put(('/post-management/post/update'), formData)
            .then((response) => {
                toast.success('Chỉnh sửa bài viết tành công', {
                    position: 'top-right',
                })
                const data = response?.data?.data
                console.log(data)
                setDataPost(data);
                setInput(data.title);
                handelClose();
            })
            .catch((error) => { });
    }

    return (
        <div className="update">
            <div className='wrapper'>
                <h1>Chỉnh sửa bài viết</h1>
                <div className='content-post'>
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
                        <input className='title' value={input} onChange={(e) => setInput(e.target.value)} />
                        <div className='image-post'>
                            <label htmlFor="image">
                                <div className="imgContainer">
                                    <img
                                        src={
                                            image
                                                ? URL.createObjectURL(image)
                                                : post.category === 0 ? LINK_API_POST + (dataPost.image ?? post.image)
                                                    : post.category === 1 ? LINK_API_AVATAR + (dataPost.image ?? post.image)
                                                        : LINK_API_COVER + (dataPost.image ?? post.image)
                                        }
                                        alt="ảnh"
                                    />
                                    {post.category === 0 && <CloudUploadIcon className="icon" />}
                                </div>
                            </label>
                            {post.category === 0 &&
                                <input
                                    type="file"
                                    id="image"
                                    style={{ display: "none" }}
                                    onChange={(e) => setImage(e.target.files[0])}
                                />
                            }
                        </div>

                    </div>
                    <button onClick={handelSummit}>Xác nhận</button>
                </div>
                <button className="close" onClick={handelClose}>
                    Đóng
                </button>
            </div>
        </div>
    );
}

export default UpdatePost;