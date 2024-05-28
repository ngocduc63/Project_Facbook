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
import { HomeContext } from '../../context/homeContext';
import { useNavigate } from 'react-router-dom';
import { NotifiPostContext } from '../../context/notifiPostContext';
import { NotificationContext } from '../../context/notificationContext';

function Notification() {
    const { socketio } = useContext(SocketContext);
    const { currentUser } = useContext(AuthContext);
    const { setUserCallData } = useContext(HomeContext);
    const { setCountNotification } = useContext(NotificationContext);
    const { setRoomNoti, updateListRoom } = useContext(ChatContext);
    const { setData } = useContext(NotifiPostContext);
    const { toggle } = useContext(RefecthInviteContext);
    const [isShowPopupCall, setIsShowPopupCall] = useState(false);
    const [userCall, setUserCall] = useState(null);
    const nagivate = useNavigate()

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

            // notifi popup mess
            if (data.hasOwnProperty('_id')) {
                if (+data?.last_mess?.sender !== currentUser?.id) {
                    const friend = data?.users?.username_key?.user_id === currentUser.id ? data.users.username_friend : data.users.username_key;
                    setRoomNoti(data, friend);
                }
                updateListRoom(data)
                return;
            }

            // notifi popup call
            if (data.hasOwnProperty('type') && data?.type === 'call') {
                setUserCall(data)
                setIsShowPopupCall(true)
            }

            // notifi add, acp friend
            if (data?.created_by?.id === currentUser?.id) return;
            toast.info(data?.description, {
                position: "bottom-left",
                onOpen: () => {
                    setCountNotification(data?.total_notification)
                    toggle()
                }
            })

            // notifi post
            if (data.hasOwnProperty('num_like') || data.hasOwnProperty('num_comment') || data.hasOwnProperty('num_share') || data.hasOwnProperty('mess')) {
                setData(data)
                setCountNotification(data?.total_notification)
            }
        }

        const handleNotification = (data) => {
            showNotifications(data, toggle)
        };
        socketio.on("join_notification", handleNotification);

        return () => {
            socketio.emit("leave_notification", { user_id: currentUser.id });
            socketio.off("join_notification", handleNotification);
        };

    }, [currentUser, toggle, setRoomNoti, socketio, updateListRoom, setData, setCountNotification]);

    const handleCancelCall = () => {
        socketio.emit("leave_room_call", { room: userCall?.room, user: currentUser });
        setIsShowPopupCall(false);
    }

    const handleAcpectCall = () => {
        setIsShowPopupCall(false);
        setUserCallData(userCall)
        nagivate(`call/${userCall?.room}_true`);
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
                            <div className='cancel-btn' onClick={handleCancelCall}>
                                <LocalPhoneIcon />
                            </div>
                            <div className='accept-btn' onClick={handleAcpectCall}>
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