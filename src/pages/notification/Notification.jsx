import { useEffect, useState, useContext, memo } from "react";
import { AuthContext } from "../../context/authContext";
import { ChatContext } from "../../context/chatContext";
import socket from "../../helps/socket";
import { toast } from "react-toastify"
import { RefecthInviteContext } from '../../context/refecthInvite';

function Notification() {
    const { currentUser } = useContext(AuthContext);
    const { setRoomNoti, updateListRoom } = useContext(ChatContext);
    const { toggle } = useContext(RefecthInviteContext);

    useEffect(() => {
        const joinRoomNotifi = (room) => {
            if (room !== "") {
                socket.emit("join_notification", room);
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
        socket.on("join_notification", handleNotification);

        return () => {
            socket.off("join_notification", handleNotification);
        };

    }, [currentUser, toggle, setRoomNoti]);

    return (
        <>
        </>
    );
}

export default memo(Notification);