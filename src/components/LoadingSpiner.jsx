import { Oval } from 'react-loader-spinner';

function LoadingSpiner(){
    return (
        <div style={{ paddingBottom: "30px" }}>
            <div className='d-flex justify-content-center '>
                <Oval
                    height="200"
                    width="100"
                    color='#3380FF'
                    ariaLabel="Guardando..."
                />
            </div>
            <h6 className='d-flex justify-content-center'>Cargando...</h6>
        </div>
    );
}

export default LoadingSpiner;