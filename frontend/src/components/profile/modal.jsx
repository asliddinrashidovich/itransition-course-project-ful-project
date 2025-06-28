import { Modal } from "antd"
import axios from "axios";
import PropTypes from "prop-types";

ModalCompopnent.propTypes  = {
  isModalOpen: PropTypes.bool.isRequired,
  selectedUsers: PropTypes.array.isRequired,
  methodMyself: PropTypes.string.isRequired,
  setIsModalOpen: PropTypes.func.isRequired,
  handleLogout: PropTypes.func.isRequired
}

function ModalCompopnent({isModalOpen, selectedUsers, methodMyself, setIsModalOpen, handleLogout}) {
    const API = import.meta.env.VITE_API_URL;
    
    const token = localStorage.getItem('token')
    const handleOk = async () => {
        setIsModalOpen(false);
        await axios.post(`${API}/api/users/update`, { ids: selectedUsers, action: methodMyself}, {
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json'}
        }).then(() => {
            handleLogout()
        })
    };
    const handleCancel = () =>  setIsModalOpen(false);
  return (
    <>
        <Modal
            title="❗Do you really want to include yourself in this method?"
            closable={{ 'aria-label': 'Custom Close Button' }}
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
        >
            <p className="mb-[10px]">If you delete yourself, your account will be permanently deleted, and you will have to create a new account.</p>
            <p className="mb-[10px]">If you block yourself, you will not be able to log in again.</p>
            <p>If you click the ok button, you will be logged out of your account.</p>
        </Modal> 
    </>
  )
}

export default ModalCompopnent