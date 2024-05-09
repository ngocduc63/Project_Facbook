import './notification.scss'
import { useEffect, useState, useContext, memo } from "react";
import { AuthContext } from "../../context/authContext";
import { ChatContext } from "../../context/chatContext";
import { toast } from "react-toastify"
import { RefecthInviteContext } from '../../context/refecthInvite';
import { SocketContext } from "../../context/socketContext";
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import VideocamIcon from '@mui/icons-material/Videocam';
import { LINK_API_AVATAR } from '../../api/const';

function Notification() {
    const { socketio } = useContext(SocketContext);
    const { currentUser } = useContext(AuthContext);
    const { setRoomNoti, updateListRoom } = useContext(ChatContext);
    const { toggle } = useContext(RefecthInviteContext);
    const [isShowPopupCall, setIsShowPopupCall] = useState(false);
    const [userCall, setUserCall] = useState(null);

    useEffect(() => {
        if (!socketio) return;

        const joinRoomNotifi = (room) => {
            if (room !== "") {
                socketio.emit("join_notification", room);
            }
        };

        joinRoomNotifi({ user_id: currentUser.id })

        const showNotifications = (data, toggle) => {
            try {
                data = JSON.parse(data);
            }
            catch (err) {
            }

            if (data.hasOwnProperty('_id')) {
                if (+data?.last_mess?.sender !== currentUser?.id) {
                    const friend = data?._id?.username_key?.user_id === currentUser.id ? data._id.username_friend : data._id.username_key;
                    setRoomNoti(data, friend);
                }
                updateListRoom(data)
                return;
            }

            if (data.hasOwnProperty('type') && data?.type === 'call') {
                setUserCall(data)
                setIsShowPopupCall(true)
            }

            if (data?.created_by?.id === currentUser?.id) return;
            toast.info(data?.description, {
                position: "top-right",
                onOpen: () => {
                    toggle()
                }
            })
        }

        const handleNotification = (data) => {
            showNotifications(data, toggle)
        };
        socketio.on("join_notification", handleNotification);

        return () => {
            socketio.off("join_notification", handleNotification);
        };

    }, [currentUser, toggle, setRoomNoti, socketio]);

    const handelCancelCall = () => {
        socketio.emit("leave_room_call", { room: userCall?.room, user: currentUser });
        setIsShowPopupCall(false);
    }

    const handelAcpectCall = () => {
        setIsShowPopupCall(false);
        sessionStorage.setItem('userCall', JSON.stringify(userCall))
        window.open(`call/${userCall?.room}_true`, '_blank');
    }

    return (
        <>
            {isShowPopupCall &&
                <div className="popup-call-noti">
                    <div className="container">
                        <header>Cuộc gọi</header>
                        <div className="content">
                            <div className="avatar">
                                <img src={LINK_API_AVATAR + userCall?.avatar} alt="" />
                            </div>
                            <span>{userCall?.username}</span>
                        </div>
                        <div className="buttons">
                            <div className='cancel-btn' onClick={handelCancelCall}>
                                <LocalPhoneIcon />
                            </div>
                            <div className='accept-btn' onClick={handelAcpectCall}>
                                <VideocamIcon />
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    );
}

export default memo(Notification);