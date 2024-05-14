import { useState, useContext } from "react";
import "./update.scss";
import useAxiosPrivate from '../../api/axiosPrivate'
import { toast } from 'react-toastify'
import { AuthContext } from "../../context/authContext";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { LINK_API_AVATAR, LINK_API_COVER } from "../../api/const";
import Loading from '../loading/Loading';

const UpdateImage = ({ setOpenUpdateImage, user, isUpdateAvartar = false }) => {
    const { setCurrentUser } = useContext(AuthContext);
    const axiosPrivate = useAxiosPrivate()
    const [cover, setCover] = useState(null);
    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const toastEr = (mess) => {
        toast.error(mess, {
            position: "top-right"
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        const formData = new FormData();
        isUpdateAvartar ? formData.append('file', profile) : formData.append('file', cover);

        axiosPrivate.post((isUpdateAvartar ? '/user-management/user/update-avatar' : '/user-management/user/update-cover'), formData)
            .then((res) => {
                setCurrentUser(res.data.data.user);
                setIsLoading(false);
                toast.success("Thay đổi ảnh đại diện thành công", {
                    position: "top-right"
                })
                setOpenUpdateImage(0);

            })
            .catch((err) => {
                const errCode = err.response.data.errorCode

                if (errCode === 1) toastEr("Vui lòng nhập đủ thông tin")
                else if (errCode === 10) toastEr("Không gửi được file ảnh")
                else if (errCode === 11) toastEr("Không thể kết nối tới mát chủ")
            })
    }


    return (
        <div className="update">
            <div className="wrapper">
                <h1>Chỉnh sửa thông tin</h1>
                <form>
                    <div className="files">
                        {!isUpdateAvartar &&
                            <>
                                <label htmlFor="cover">
                                    <span>Ảnh bìa</span>
                                    <div className="imgContainer">
                                        <img
                                            src={
                                                cover
                                                    ? URL.createObjectURL(cover)
                                                    : LINK_API_COVER + user.cover_photo
                                            }
                                            alt="cover"
                                        />
                                        <CloudUploadIcon className="icon" />
                                    </div>
                                </label>
                                <input
                                    type="file"
                                    id="cover"
                                    style={{ display: "none" }}
                                    onChange={(e) => setCover(e.target.files[0])}
                                />
                            </>
                        }
                        {isUpdateAvartar &&
                            <>
                                <label htmlFor="profile">
                                    <span>Ảnh đại diện</span>
                                    <div className="imgContainer">
                                        <img
                                            src={
                                                profile
                                                    ? URL.createObjectURL(profile)
                                                    : LINK_API_AVATAR + user.avatar
                                            }
                                            alt="avartar"
                                        />
                                        <CloudUploadIcon className="icon" />
                                    </div>
                                </label>
                                <input
                                    type="file"
                                    id="profile"
                                    style={{ display: "none" }}
                                    onChange={(e) => setProfile(e.target.files[0])}
                                />
                            </>
                        }
                    </div>
                    {!isLoading && <button onClick={handleSubmit}>Xác nhận</button>}
                    {isLoading && <button><Loading size={20} /></button>}
                </form>
                <button className="close" onClick={() => setOpenUpdateImage(0)}>
                    Đóng
                </button>
            </div>
        </div>
    );
};

export default UpdateImage
