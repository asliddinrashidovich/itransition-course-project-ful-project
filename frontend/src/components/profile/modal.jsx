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
const API = import.meta.env.VITE_API;

function ModalCompopnent({isModalOpen, selectedUsers, methodMyself, setIsModalOpen, handleLogout}) {
    const token = localStorage.getItem('token')    

    const handleOk = async () => {
        setIsModalOpen(false);
        await axios.patch(`${API}/api/users/role`, { userIds: selectedUsers, role: methodMyself}, {
            headers: {Authorization: `Bearer ${token}`},
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