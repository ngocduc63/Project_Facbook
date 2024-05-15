import './spanCustom.scss';

function SpanCustom({ data, colorCustom }) {
    if (data.includes('\n')) {
        const lines = data.split('\n');
        return (
            lines.map((line, index) => (
                <p className='span-custom' style={{ color: colorCustom }} key={index}>{line}</p>
            ))
        );
    } else {
        return <p className='span-custom' style={{ color: colorCustom }}>{data}</p>
    }
}

export default SpanCustom;