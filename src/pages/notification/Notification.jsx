import { useEffect, useState, useContext, memo } from "react";
import { AuthContext } from "../../context/authContext";
import socket from "../../helps/socket";
import { toast } from "react-toastify"
import { RefecthInviteContext } from '../../context/refecthInvite';

const joinRoomNotifi = (room) => {
    if (room !== "") {
        socket.emit("join_notification_add_friend", room);
    }
};

const showNotifications = (mess, toggle) => {
    toast.info(mess, {
        position: "top-right",
        onOpen: () => {
            toggle()
        }
    })
}

function Notification() {
    const { currentUser } = useContext(AuthContext);
    const { toggle } = useContext(RefecthInviteContext);
    useEffect(() => {
        joinRoomNotifi({ user_id: currentUser.id })
        const handleNotification = (data) => {
            showNotifications(data.description, toggle)
        };
        socket.on("join_notification_add_friend", handleNotification);

        return () => {
            socket.off("join_notification_add_friend", handleNotification);
        };

    }, [currentUser, toggle]);

    return (
        <>
        </>
    );
}

export default memo(Notification);