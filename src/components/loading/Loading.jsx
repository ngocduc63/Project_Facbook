import BeatLoader from "react-spinners/BeatLoader"
import './loading.scss'

const Loading = ({ size = 40 }) => {
    return (
        <div className='center'>
            <BeatLoader
                color={'#0752e9'}
                size={size}
            />
        </div>
    );
}

export default Loading;