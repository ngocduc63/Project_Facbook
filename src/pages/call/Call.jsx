import './call.scss';
import React, { useContext, useEffect, useRef, useState } from "react"
import Peer from "simple-peer"
import { useLocation } from "react-router-dom";
import { AuthContext } from '../../context/authContext';
import { SocketContext } from '../../context/socketContext';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import VideocamIcon from '@mui/icons-material/Videocam';
import Loading from "../../components/loading/Loading";

function Call() {
    const { socketio } = useContext(SocketContext)
    const { currentUser } = useContext(AuthContext)
    const [stream, setStream] = useState()
    const [callAccepted, setCallAccepted] = useState(false)
    const [userCall, setUserCall] = useState(null)
    const [callEnded, setCallEnded] = useState(false)
    const [cancelCall, setCancelCall] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const myVideo = useRef()
    const userVideo = useRef()
    const roomId = useLocation().pathname.split("/")[2];

    useEffect(() => {
        document.title = 'Video call'
    }, []);

    useEffect(() => {
        if (!socketio) return;

        const getUserMedia = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                setStream(stream)
                myVideo.current.srcObject = stream;
            } catch (err) {
                console.log(err);
            }
        };
        getUserMedia();

    }, [socketio, roomId, currentUser])

    useEffect(() => {
        if (!stream) return;

        if (roomId.includes('_')) {
            try {
                const data = sessionStorage.getItem('userCall')
                const userCall = JSON.parse(data)
                setUserCall(userCall)
                const room = roomId.split('_')[0]
                answerCall(room, userCall.signalData)
            } catch (err) {
                console.log(err);
            }
        } else {
            callUser()
        }
    }, [stream, roomId, socketio]);

    const callUser = () => {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream: stream
        })
        peer.on("signal", (data) => {
            socketio.emit('create_room_call',
                {
                    room: roomId,
                    user_id: currentUser.id,
                    signalData: data,
                })

        })
        peer.on("stream", (stream) => {
            if (callEnded && !cancelCall) return;
            userVideo.current.srcObject = stream

        })
        socketio.on("room_call_notification", (data) => {
            if (data?.type === 'end_call') {
                setCallEnded(true)
                setIsLoading(false)
                if (!userCall) {
                    setUserCall(data?.user)
                    setCancelCall(true)
                }
                return;
            }
            setUserCall(data?.user)
            setCallAccepted(true)
            peer.signal(data?.signal)
            setIsLoading(false)
        })
    }

    const answerCall = (room, callerSignal) => {

        setCallAccepted(true)
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream: stream
        })
        peer.on("signal", (data) => {
            socketio.emit('join_room_call',
                {
                    room: room,
                    user: currentUser,
                    signal: data
                })
        })
        peer.on("stream", (stream) => {
            if (callEnded) return;
            userVideo.current.srcObject = stream
        })

        socketio.on("room_call_notification", (data) => {
            if (data?.type === 'end_call') setCallEnded(true)
        })

        peer.signal(callerSignal)
        setIsLoading(false)
    }

    const handelEndCall = () => {
        let room = roomId
        if (roomId.includes('_')) room = roomId.split('_')[0]
        socketio.emit('leave_room_call', { room })
        setCallEnded(true)
    }

    const handelRecall = () => {
        setCallEnded(false)
        setUserCall(null)
        setIsLoading(true)
        callUser()
    }
    return (
        <>
            <div className="container-video-call">
                <div className="video-container">
                    <div className="my-video">
                        <video playsInline muted ref={myVideo} autoPlay style={{ width: "300px" }} />
                        <div className='popup-call'>
                            <div className="buttons">
                                {callAccepted && !callEnded ?
                                    (
                                        <div className='cancel-btn' onClick={handelEndCall}>
                                            <LocalPhoneIcon />
                                            <span>Kết thúc</span>
                                        </div>
                                    ) :
                                    cancelCall ? (
                                        <div className='accept-btn' onClick={handelRecall}>
                                            <VideocamIcon />
                                            <span>Gọi lại</span>
                                        </div>
                                    ) :
                                        null
                                }
                            </div>
                        </div>
                    </div>
                    <div className="user-video">
                        {isLoading && <Loading />}
                        {userCall &&
                            (
                                <>
                                    <div className='user-info'>
                                        <div className="avatar">
                                            <img src={"http://localhost:5000/user-management/user/avatar/" + userCall?.avatar} alt="" />
                                        </div>
                                        <span>{userCall?.username}</span>
                                    </div>
                                    {callAccepted && !callEnded && <video playsInline ref={userVideo} autoPlay />}
                                    {callEnded && <span>{cancelCall ? 'Đã từ chối cuộc gọi' : 'Cuộc gọi đã kết thúc'}</span>}
                                </>
                            )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Call;