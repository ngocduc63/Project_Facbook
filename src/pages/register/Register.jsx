import { useState } from "react";
import { Link } from "react-router-dom";
import "./register.scss";
import axios from "axios";

const Register = () => {
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password_hash: "",
    birth_date: "",
    gender: ""
  });
  const [err, setErr] = useState(null);

  const handleChange = (e) => {
    let value = e.target.value;
    if (e.target.type === 'date') {
    const parts = value.split('-'); // Phân tách ngày, tháng và năm thành mảng
    // Chuyển định dạng sang "DD/MM/YYYY"
    value = `${parts[1]}/${parts[2]}/${parts[0]}`;
  }
    setInputs((prev) => ({ ...prev, [e.target.name]: value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://127.0.0.1:5000/user-management/user/register", inputs);
      console.log('Đăng ký thành công')
    } catch (err) {
      setErr(err.response.data);
    }
  };

  console.log(err)

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
            <button>Login</button>
          </Link>
        </div>
        <div className="right">
          <h1>Register</h1>
          <form>
            <input
              type="text"
              placeholder="Username"
              name="username"
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
              name="password_hash"
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
            {err && err}
            <button onClick={handleClick}>Register</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
