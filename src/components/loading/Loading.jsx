import BeatLoader from "react-spinners/BeatLoader"
import './loading.scss'

const Loading = () =>{
    return ( 
        <div class = 'center'>
            <BeatLoader
                color={'#0752e9'}
                size={40}
            />
        </div>
    );
}

export default Loading;