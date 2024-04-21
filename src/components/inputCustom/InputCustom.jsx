import SendIcon from '@mui/icons-material/Send';
import { useState } from 'react';

function InputCustom({ handelSendMessage, maxRow = 5 }) {
    const maxRows = maxRow;
    const [inputValue, setInputValue] = useState('');
    const [textareaHeight, setTextareaHeight] = useState(22);

    const handleKeyDown = (event) => {
        if (event.keyCode === 13 && event.shiftKey) {
            event.preventDefault();
            setInputValue(inputValue + '\n');
            const newHeight = textareaHeight + 16;
            if (newHeight <= maxRows * 16) {
                setTextareaHeight(newHeight);
            }
        } else if (event.keyCode === 13) {
            event.preventDefault();
            handelSend()
        }
    };

    const handleChange = (event) => {
        const { value } = event.target;
        setInputValue(value);
        const rows = value.split('\n').length;
        const newHeight = rows * 16;
        if (newHeight <= maxRows * 16) {
            setTextareaHeight(newHeight);
        }

    };

    const handelSend = () => {
        handelSendMessage(inputValue);
        setTextareaHeight(22);
        setInputValue('')
    }

    return (
        <div className='input-mess'>
            <textarea
                value={inputValue}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder='Aa'
                style={{
                    height: `${textareaHeight}px`,
                    overflowY: (textareaHeight >= maxRows * 16) ? 'scroll' : 'hidden',
                    resize: 'none'
                }}
            />
            <SendIcon className='send-icon' onClick={handelSend} />
        </div>
    );
}

export default InputCustom;