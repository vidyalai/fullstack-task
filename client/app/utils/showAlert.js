import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const showAlert = () => {
   
    Swal.fire({
        title: '<strong>Your Title</strong>',
        html: 'Your <b>HTML</b> content goes here.',
        // icon: 'success',
        showCloseButton: true,
        showCancelButton: false,
        focusConfirm: false,
        confirmButtonText: '<i class="fa fa-thumbs-up"></i> Great!',
        confirmButtonAriaLabel: 'Thumbs up, great!',
        cancelButtonText: '<i class="fa fa-thumbs-down"></i>',
        cancelButtonAriaLabel: 'Thumbs down',
        customClass: {
          popup: 'max-w-sm w-full bg-zinc-800 rounded-xl p-8 shadow-md',
          title: 'text-2xl font-bold text-center mb-4 text-white',
          htmlContainer: 'text-gray-300',
          confirmButton: 'w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition',
        },
        background: 'rgba(31, 41, 55, 0.8)',
        position: 'top-start',
        showConfirmButton: true,
        // timer: 3000
      });
      
      

}
export default showAlert;
