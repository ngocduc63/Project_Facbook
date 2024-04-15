import { memo } from 'react';

function CotentMess({ dataMess, friendRoom, currentUser }) {
    const loadMess = (data) => {
        if (data.includes('\n')) {
            const lines = data.split('\n');
            return (
                lines.map((line, index) => (
                    <p key={index}>{line}</p>
                ))
            );
        } else {
            return <p>{data}</p>
        }
    }

    const content_user = (data) => {
        return (
            <>
                {
                    data.map((data) => {
                        return <div key={data.created_at}>{loadMess(data.text)}</div>
                    })
                }
            </>
        )
    }

    const content_friend = (data) => {
        return (
            <>
                <div className='image'>
                    <img src={"http://127.0.0.1:5000/user-management/user/avatar/" + friendRoom.avatar} alt="" />
                </div>
                <div className='friend-chat'>
                    {
                        data.map((data) => {
                            return <div key={data.created_at}>{loadMess(data.text)}</div>
                        })
                    }
                </div>
            </>
        )
    }

    let content_mess = [];
    let data_chat = [];
    let next_sender = 1;
    let key = 0;

    dataMess.forEach((data, index) => {
        next_sender = dataMess[index + 1]?.sender;
        if (next_sender !== data.sender || index + 1 === dataMess.length) {
            data_chat.push(data)
            if (+data.sender === currentUser.id) {
                content_mess.push(<div key={key} className='content-user'>{content_user(data_chat.reverse(), key)}</div>)
                key++;
            } else {
                content_mess.push(<div key={key} className='content-friend'>{content_friend(data_chat.reverse(), key)}</div>)
                key++;
            }
            data_chat = [];
        }
        else {
            data_chat.push(data)

        }
    })

    return content_mess;
}

export default memo(CotentMess);