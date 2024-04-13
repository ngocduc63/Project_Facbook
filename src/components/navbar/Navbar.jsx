import "./navbar.scss";
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { DarkModeContext } from "../../context/darkModeContext";
import { AuthContext } from "../../context/authContext";
import useAxiosPrivate from "../../api/axiosPrivate";
import { toast } from 'react-toastify';
import Loading from "../../components/loading/Loading";

const Navbar = (props) => {
  const axiosPrivate = useAxiosPrivate();
  const { toggle, darkMode } = useContext(DarkModeContext);
  const [inputSearch, setInputSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resultSearch, setResultSearch] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const { isRefecth, setIsRefecth } = props;

  const handleRefecth = () => {
    setIsRefecth(!isRefecth);
  }

  const handelInput = (e) => {
    setIsLoading(true);
    const input = e.target.value
    setInputSearch(input);
    if (input && input.trim() !== '') debounceSearch(input);
    else handelResetSearch()
  }

  const handelResetSearch = () => {
    setInputSearch('')
    setResultSearch([])
    setIsLoading(false)
  }

  const handelSearch = (e) => {
    if (e.keyCode === 13) {
      handelResetSearch();
    }

  }

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const debounceSearch = debounce((input) => {
    axiosPrivate.get(`/user-management/user/find/${input}`)
      .then(res => {
        setResultSearch(res.data.data)
      })
      .catch(err => {
        toast.error("Lỗi không tìm được", {
          position: "top-right"
        });
      });

    setIsLoading(false)
  }, 200)

  return (
    <div className="navbar">
      <div className="left">
        <Link to="/" style={{ textDecoration: "none" }} onClick={handleRefecth}>
          <span>FACEBOOK</span>
        </Link>
        <Link to="/" onClick={handleRefecth}>
          <HomeOutlinedIcon />
        </Link>
        {darkMode ? (
          <WbSunnyOutlinedIcon onClick={toggle} />
        ) : (
          <DarkModeOutlinedIcon onClick={toggle} />
        )}
        <div className="search">
          {resultSearch.length > 0 && <ArrowBackIcon className="cur-point" onClick={handelResetSearch} />}
          <SearchOutlinedIcon />
          <input type="text" placeholder="Nhập tên người bạn muốn tìm..." value={inputSearch} onChange={handelInput} onKeyDown={handelSearch} />

          {(resultSearch.length > 0 || isLoading) && (
            <div className="list-user" onClick={handelResetSearch}>
              {isLoading && <Loading />}
              {
                resultSearch.map(user =>
                  <Link to={`profile/${user.id}`} className="item" key={user.id}>
                    <div className="avatar">
                      <img src={"http://localhost:5000/user-management/user/avatar/" + user.avatar} alt="" />
                    </div>
                    <div className="right-item-search">
                      <span>{user.username}<span>{user.nickname && ` (${user.nickname})`}</span></span>
                      {user.isFriend === 1 && (<span className="check-friend">Bạn bè</span>)}
                    </div>
                  </Link>
                )
              }
            </div>
          )}
        </div>
      </div>
      <div className="right">
        <PersonOutlinedIcon />
        <ChatBubbleOutlineIcon />
        <NotificationsOutlinedIcon />
        <Link to={`/profile/${currentUser.id}`} className="user">
          <img
            src={"http://localhost:5000/user-management/user/avatar/" + currentUser.avatar}
            alt=""
          />
          <span>{currentUser.username}</span>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
