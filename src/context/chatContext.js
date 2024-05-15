import { createContext, useState, useEffect } from 'react';

export const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
    const [roomCurrent, setRoomCurrent] = useState('');
    const [dataHiden, setDataHidden] = useState([]);
    const [listRoom, setListRoom] = useState([]);
    const [isFirstLogin, setIsFirstLogin] = useState(0);

    useEffect(() => {
        if (dataHiden && isFirstLogin !== 0) {
            sessionStorage.setItem('listRoomMini', JSON.stringify(dataHiden));
        } else {
            if (isFirstLogin > 0) return;
            try {
                const dataHiden = sessionStorage.getItem('listRoomMini');
                if (dataHiden) setDataHidden(JSON.parse(dataHiden));
                setIsFirstLogin(1);
            } catch (e) {
                return;
            }
        }
    }, [dataHiden, isFirstLogin]);

    useEffect(() => {
        if (roomCurrent && isFirstLogin !== 0) {
            sessionStorage.setItem('roomCurrent', JSON.stringify(roomCurrent));
        } else {
            if (isFirstLogin > 1) return;
            try {
                const roomCurrent = sessionStorage.getItem('roomCurrent');
                if (roomCurrent) setRoomCurrent(JSON.parse(roomCurrent));
                setIsFirstLogin(2);
            } catch (e) {
                return;
            }
        }
    }, [roomCurrent, isFirstLogin]);

    const setRoomNoti = (data, friend = {}) => {
        if (roomCurrent) {
            setDataHidden((prev) => {
                const existingItemIndex = data.hasOwnProperty('_id')
                    ? prev.findIndex((item) => item.room === data._id?.room_id?.$oid)
                    : prev.findIndex((item) => item.room === data.room);

                if (existingItemIndex !== -1) {
                    const existingItem = prev[existingItemIndex];
                    const updatedPrev = prev.filter((_, index) => index !== existingItemIndex);
                    return [...updatedPrev, existingItem];
                } else {
                    if (data.hasOwnProperty('_id')) {
                        data = {
                            room: data._id?.room_id?.$oid,
                            friend: friend,
                        };
                    }

                    return [...prev, data];
                }
            });
        } else {
            if (data.hasOwnProperty('_id')) {
                setRoomCurrent(data._id?.room_id?.$oid);
            } else {
                setRoomCurrent(data.room);
            }
        }
    };

    const updateListRoom = (dataRoom) => {
        const roomCurrent = listRoom.find((room) => room._id?.room_id?.$oid === dataRoom._id?.room_id?.$oid);

        if (roomCurrent) {
            const index = listRoom.indexOf(roomCurrent);
            if (index > -1) {
                const listRoomNew = [...listRoom];
                listRoomNew.splice(index, 1);
                listRoomNew.unshift(dataRoom);
                setListRoom(listRoomNew);
            }
        }
    };

    return (
        <ChatContext.Provider
            value={{
                roomCurrent,
                setRoomCurrent,
                dataHiden,
                setDataHidden,
                setRoomNoti,
                listRoom,
                setListRoom,
                updateListRoom,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};
