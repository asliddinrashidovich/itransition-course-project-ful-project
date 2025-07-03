import { Modal } from "antd"
import axios from "axios";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

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
    const {t} = useTranslation()

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
            title={t('doYouwantIncludeTitle')}
            closable={{ 'aria-label': 'Custom Close Button' }}
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
        >
            <p className="mb-[10px]">{t('doYouwantIncludeParagraph')}</p>
        </Modal> 
    </>
  )
}

export default ModalCompopnent