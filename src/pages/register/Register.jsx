import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./register.scss";
import axios from "axios";
import { toast } from 'react-toastify'
import Loading from '../../components/loading/Loading'
import { LINK_API } from "../../api/const";

const Register = () => {
  const [inputs, setInputs] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    cfpassword: "",
    birth_date: "",
    gender: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    let value = e.target.value;
    if (e.target.type === 'date') {
      const parts = value.split('-');
      value = `${parts[1]}/${parts[2]}/${parts[0]}`;
    }
    setInputs((prev) => ({ ...prev, [e.target.name]: value }));
  };

  const toastEr = (mess) => {
    toast.error(mess, {
      position: "top-right"
    })
  }
  const handleClick = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (inputs.password !== inputs.cfpassword) {
      toastEr("Mật khẩu không giống nhau")
      setIsLoading(false);
      return;
    }

    const request = {
      'username': inputs.firstname + ' ' + inputs.lastname,
      'email': inputs.email,
      'password': inputs.password,
      'birth_date': inputs.birth_date,
      'gender': inputs.gender,
    }

    try {
      await axios.post(`${LINK_API}user-management/user/register`, request);
      toast.success("Đăng kí thành công", {
        position: "top-right"
      })

      setIsLoading(false);
      navigate("/login")
    } catch (err) {
      const errCode = err.response.data.errorCode

      if (errCode === 1) toastEr("Vui lòng nhập đủ thông tin")
      else if (errCode === 3) toastEr("Email chưa đúng định dạng")
      else if (errCode === 4) toastEr("Dộ dài từ 8-16 kí tự và phải bao gồm ít nhất 1 ký tự viết hoa, 1 ký tự đặc biệt (VD: @, #, $,...) và 1 chữ số")
      else if (errCode === 5) toastEr("Ngày tháng chưa đúng định dạng")
      else if (errCode === 9) toastEr("Tài khoản đã tồn tại")
      else if (errCode === 13) toastEr("Không thể kết nối tới mát chủ")

      setIsLoading(false);
    }
  };


  return (
    <div className="register">
      <div className="card">
        <div className="left">
          <h1>Facebook</h1>
          <p>
            Facebook helps you connect and share with the people in your life.
          </p>
          <span>Do you have an account?</span>
          <Link to="/login">
            <button>Đăng nhập</button>
          </Link>
        </div>
        <div className="right">
          <h1>Đăng kí</h1>
          <form>
            <input
              type="text"
              placeholder="Frist name"
              name="firstname"
              onChange={handleChange}
            />
            <input
              type="text"
              placeholder="Last name"
              name="lastname"
              onChange={handleChange}
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
            />
            <input
              type="password"
              placeholder="Comfirm password"
              name="cfpassword"
              onChange={handleChange}
            />
            <input
              type="date"
              id="dob"
              placeholder="Date of birth"
              name="birth_date"
              onChange={handleChange}
            />
            <div className="column">
              <input
                type="radio"
                id="male"
                name="gender"
                value="1"
                onChange={handleChange}
              />
              <label htmlFor="male">Nam</label>
              <input
                type="radio"
                id="female"
                name="gender"
                value="2"
                onChange={handleChange}
              />
              <label htmlFor="female">Nữ</label>
            </div>
            {isLoading ? <Loading size={20} /> : <button onClick={handleClick}>Đăng kí</button>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
