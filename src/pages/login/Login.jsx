import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import Loading from '../../components/loading/Loading'
import "./login.scss";
import { toast } from 'react-toastify'

const Login = () => {
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate()

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const { login } = useContext(AuthContext);
  const toastEr = (mess) => {
    toast.error(mess, {
      position: "top-right"
    })
  }

  const handleLogin = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    try {
      await login(inputs);
      setIsLoading(false)
      toast.success("Đăng nhập thành công", {
        position: "top-right"
      })
      navigate("/")
    } catch (err) {
      const errCode = err.response.data.errorCode

      if (errCode === 1) toastEr("Vui lòng nhập đủ thông tin")
      else if (errCode === 3) toastEr("Email chưa đúng định dạng")
      else if (errCode === 4) toastEr("Mật khẩu phải đủ 6 kí tự trở lên")
      else if (errCode === 6) toastEr("Tài khoản không tồn tại")
      else if (errCode === 7) toastEr("Mật khẩu không chính xác")
    }
  };

  return (
    <div className="login">
      <div className="card">
        <div className="left">
          <h1>Facebook</h1>
          <p>
            Facebook helps you connect and share with the people in your life.
          </p>
          <span>Don't you have an account?</span>
          <Link to="/register">
            <button>Đăng kí</button>
          </Link>
        </div>
        <div className="right">
          <h1>Đăng nhập</h1>
          <form>
            <input
              type="text"
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
            {!isLoading && <button onClick={handleLogin}>Đăng nhập</button>}
            {isLoading && <button ><Loading size={20} /></button>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
