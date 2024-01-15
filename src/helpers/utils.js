import Swal from "sweetalert2";

export const showMessage = ( _icon, _message, _moreTextOptional = '' ) => {
    Swal.fire({
        icon: _icon,
        title: _message,
        width: 600,
        padding: '2em',
        text: _moreTextOptional,
        backdrop: 'rgba(0, 0, 0, 0.75) left top no-repeat'
      });      
}