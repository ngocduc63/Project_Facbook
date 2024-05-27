import { memo } from 'react';
import SpanCustom from '../spanCustom/spanCustom';
import { LINK_API_AVATAR } from '../../api/const';
import { convertTimespanToDay } from '../../helps/timer';

function CotentMess({ dataMess, friendRoom, currentUser }) {
    const content_user = (data) => {
        return (
            <>
                {
                    data.map((data, index) => {
                        return <div key={index}><SpanCustom data={data.text} colorCustom={'#fff'} /></div>
                    })
                }
            </>
        )
    }

    const content_friend = (data) => {
        return (
            <>
                <div className='image'>
                    <img src={LINK_API_AVATAR + friendRoom.avatar} alt="" />
                </div>
                <div className='friend-chat'>
                    {
                        data.map((data, index) => {
                            return <div key={index} title={convertTimespanToDay(data.created_at)}><SpanCustom data={data.text} /></div>
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