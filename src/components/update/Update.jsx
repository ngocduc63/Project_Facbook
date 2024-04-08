import { useState, useContext } from "react";
import "./update.scss";
import { convertToTime } from "../../helps/timer";
import useAxiosPrivate from '../../api/axiosPrivate'
import {toast} from 'react-toastify'
import { AuthContext } from "../../context/authContext";

const Update = ({ setOpenUpdate, user }) => {
  const {setCurrentUser} = useContext(AuthContext);
  const axiosPrivate = useAxiosPrivate()
  const [input, setInput] = useState({
    username: user.username,
    nickname: user.nickname,
    description: user.description,
    birth_date: convertToTime(user.birth_date),
    gender: user.gender,
  });

  const toastEr = (mess) =>{
    toast.error(mess, {
      position: "top-right"
    })
  }

  const handleChange = (e) => {
    setInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const valueDate = input.birth_date.toString().split('-')
    const newData = input;
    newData.birth_date = `${valueDate[1]}/${valueDate[2]}/${valueDate[0]}`;

    axiosPrivate.put(('/user-management/user/update'), newData)
      .then((res) =>{
        setCurrentUser(res.data.data)
        toast.success("Thay đổi thông tin thành công", {
          position: "top-right"
        })
      setOpenUpdate(false);

      })
      .catch((err) => {
        const errCode = err.response.data.errorCode

        if (errCode === 1) toastEr("Vui lòng nhập đủ thông tin")
        else if(errCode === 5) toastEr("Ngày tháng chưa đúng định dạng")
        else if(errCode === 8) toastEr("Tài khoản không tồn tại")
        else if(errCode === 13) toastEr("Không thể kết nối tới mát chủ")
      })
  }
  
  return (
    <div className="update">
      <div className="wrapper">
        <h1>Chỉnh sửa thông tin</h1>
        <form>
          <label>Họ tên</label>
          <input
            type="text"
            name="username"
            placeholder={user.username}
            onChange={handleChange}
          />
          <label>Nick name</label>
          <input
            type="text"
            placeholder={user.nickname}
            name="nickname"
            onChange={handleChange}
          />
          <label>Mô tả</label>
          <input
            type="text"
            placeholder={user.description}
            name="description"
            onChange={handleChange}
          />
          <label>Ngày sinh</label>
          <input
            type="date"
            value={input.birth_date}
            name="birth_date"
            onChange={handleChange}
          />
          <button onClick={handleSubmit}>Xác nhận</button>
        </form>
        <button className="close" onClick={() => setOpenUpdate(false)}>
          Đóng
        </button>
      </div>
    </div>
  );
};

export default Update
