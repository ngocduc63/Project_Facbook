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
    const [userCall, setUserCall] = useState("")
    const [callEnded, setCallEnded] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const myVideo = useRef()
    const userVideo = useRef()
    const connectionRef = useRef()
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
            socketio.on('leave_room_call', (data) => {
                console.log(data)
            })
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
            userVideo.current.srcObject = stream

        })
        socketio.on("room_call_notification", (data) => {
            setUserCall(data.user)
            setCallAccepted(true)
            peer.signal(data?.signal)
            setIsLoading(false)
        })

        connectionRef.current = peer
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
            userVideo.current.srcObject = stream
        })

        peer.signal(callerSignal)
        connectionRef.current = peer
        setIsLoading(false)
    }

    const leaveCall = () => {
        setCallEnded(true)
        connectionRef.current.destroy()
    }

    const handelCancelCall = () => {

    }

    const handelRecall = () => {
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
                                        <div className='cancel-btn' onClick={handelCancelCall}>
                                            <LocalPhoneIcon />
                                            <span>Kết thúc</span>
                                        </div>
                                    ) :
                                    (
                                        <div className='accept-btn' onClick={handelRecall}>
                                            <VideocamIcon />
                                            <span>Gọi lại</span>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                    <div className="user-video">
                        {isLoading && <Loading />}
                        {callAccepted && !callEnded ?
                            (
                                <>
                                    <div className='user-info'>
                                        <div className="avatar">
                                            <img src={"http://localhost:5000/user-management/user/avatar/" + userCall?.avatar} alt="" />
                                        </div>
                                        <span>{userCall?.username}</span>
                                    </div>
                                    <video playsInline ref={userVideo} autoPlay />
                                </>
                            ) :
                            null}
                    </div>
                </div>
                {/* <div className="myId">
                    <div className="call-button">
                        {callAccepted && !callEnded ? (
                            <button onClick={leaveCall}>
                                End Call
                            </button>
                        ) : (
                            null
                            // <IconButton color="primary" aria-label="call" onClick={() => callUser(idToCall)}>
                            //     <PhoneIcon fontSize="large" />
                            // </IconButton>
                        )}
                        {idToCall}
                    </div>
                </div>
                <div>
                    {receivingCall && !callAccepted ? (
                        <div className="caller">
                            <h1 >{name} is calling...</h1>
                            <button onClick={answerCall}>
                                Answer
                            </button>
                        </div>
                    ) : null}
                </div> */}
            </div>
        </>
    );
}

export default Call;