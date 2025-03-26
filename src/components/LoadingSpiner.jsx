import { Oval } from 'react-loader-spinner';

function LoadingSpiner({ height = 200, width = 100, showLabel = true, label = 'Cargando...', paddingBottom = 30 }) {
    return (
        <div style={{ paddingBottom: paddingBottom }}>
            <div className='d-flex justify-content-center '>
                <Oval
                    height={height}
                    width={width}
                    color='#3380FF'
                    ariaLabel="Guardando..."
                />
            </div>
            {showLabel && <h6 className='d-flex justify-content-center'>{label}</h6>}
        </div>
    );
}

export default LoadingSpiner;