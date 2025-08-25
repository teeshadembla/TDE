import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ConfirmDelete = (eventId, onConfirm) => {
  toast(
    ({ closeToast }) => (
      <div>
        <p>Are you sure you want to delete this event?</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button
            onClick={() => {
              onConfirm();
              closeToast();
            }}
            style={{ background: 'red', color: 'white', border: 'none', padding: '5px 10px' }}
          >
            Delete
          </button>
          <button
            onClick={closeToast}
            style={{ border: '1px solid gray', padding: '5px 10px' }}
          >
            Cancel
          </button>
        </div>
      </div>
    ),
    {
      position: 'top-center',
      autoClose: false,
      closeOnClick: false,
      closeButton: false,
    }
  );
};

export default ConfirmDelete;