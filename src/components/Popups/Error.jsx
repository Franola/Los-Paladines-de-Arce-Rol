import Swal from "sweetalert2"

const ErrorPopUp = (errorMessage) => {
    Swal.fire({
        title: 'Error',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'Ok',
        theme: 'dark',
    });
}

export default ErrorPopUp