import './postPage.scss';

import Post from '../../components/post/Post'
import useAxiosPrivate from "../../api/axiosPrivate"
import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { toast } from 'react-toastify';
import Loading from '../../components/loading/Loading';

function PostPage() {
    const location = useLocation();
    const axiosPrivate = useAxiosPrivate();
    const postId = +location.pathname.split("/")[2];
    const [dataPost, setDataPost] = useState();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        document.title = 'Bài viết'
    }, []);

    useEffect(() => {
        setIsLoading(true);
        const controller = new AbortController()
        const { signal } = controller

        axiosPrivate.get((`/post-management/post/${postId}`), { signal })
            .then((response) => {
                const data = response.data?.data
                setDataPost(data);
                setIsLoading(false);

                setTimeout(() => {
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }, 5)
            })
            .catch((error) => {
                if (error?.response?.data?.errorCode === 14) {
                    toast.error('Bài viết không tồn tại', {
                        position: 'top-right'
                    })
                }
                setDataPost()
                setIsLoading(false);
                if (signal.aborted) return
            })

        return () => controller.abort()

    }, [axiosPrivate, postId]);
    return (
        <div className='post-page'>
            {!isLoading && dataPost && <Post post={dataPost} />}
            {!isLoading && !dataPost && <span style={{ fontWeight: 600 }}>Bài viết không tồn tại</span>}
            {isLoading && <Loading size={30} />}
        </div>
    );
}

export default PostPage;