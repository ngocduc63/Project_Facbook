import { useState } from "react";
import "./update.scss";
import useAxiosPrivate from '../../api/axiosPrivate'
import { toast } from 'react-toastify'
import Loading from '../loading/Loading';
import useLogout from "../../api/logout";

const UpdatePassword = ({ setOpenChangePassword }) => {
    const axiosPrivate = useAxiosPrivate();
    const logout = useLogout();
    const [isLoading, setIsLoading] = useState(false);
    const [input, setInput] = useState({
        password_last: '',
        password_new: '',
        password_new_2: '',
    });

    const handleChange = (e) => {
        setInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (input.password_new !== input.password_new_2) {
            toast.error('Mật khẩu mới không trùng khớp', {
                position: 'top-right'
            })
            setIsLoading(false);

            return;
        }

        const request = {
            'password_last': input.password_last,
            'password_new': input.password_new
        }

        axiosPrivate.put(('/user-management/user/change-password'), request)
            .then(() => {
                setIsLoading(false);
                toast.success("Đổi mật khẩu thành công. Vui lòng đăng nhập lại", {
                    position: "top-right"
                })
                setOpenChangePassword(false);
                logout();
            })
            .catch((err) => {
                const errCode = err.response.data.errorCode
                if (errCode === 7) {
                    toast.error('Mật khẩu không chính xác', {
                        position: 'top-right'
                    })
                }
                else if (errCode === 4) {
                    toast.error('Mật khẩu tối thiếu 6 kí tự', {
                        position: 'top-right'
                    })
                }
                else {
                    toast.error('Đổi mật khẩu thất bại', {
                        position: 'top-right'
                    })
                }

                setIsLoading(false);
            })
    }

    return (
        <div className="update">
            <div className="wrapper">
                <h1>Đổi mật khẩu</h1>
                <form>
                    <label>Nhập mật khẩu hiện tại</label>
                    <input
                        type="password"
                        name="password_last"
                        placeholder='Nhập mật khẩu hiện tại'
                        onChange={handleChange}
                    />
                    <label>Nhập mật khẩu mới</label>
                    <input
                        type="password"
                        placeholder='Nhập mật khẩu mới'
                        name="password_new"
                        onChange={handleChange}
                    />
                    <label>Nhập lại mật khẩu mới</label>
                    <input
                        type="password"
                        placeholder='Nhập lại mật khẩu mới'
                        name="password_new_2"
                        onChange={handleChange}
                    />
                    {!isLoading && <button onClick={handleSubmit}>Xác nhận</button>}
                    {isLoading && <button><Loading size={20} /></button>}
                </form>
                <button className="close" onClick={() => setOpenChangePassword(false)}>
                    Đóng
                </button>
            </div>
        </div>
    );
};

export default UpdatePassword
