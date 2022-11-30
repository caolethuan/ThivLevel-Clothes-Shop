import axios from 'axios'
import React, {useState} from 'react'
import { FaRegTimesCircle } from 'react-icons/fa'
import { toast } from 'react-toastify'

function ChangePhoneModal({ phoneOrder, callback, setCallback, token }) {
    const [newPhone, setNewPhone] = useState(phoneOrder.phone)

    const handleCloseView = (e) => {
        e.preventDefault()
        const viewbox = document.querySelector('.order-phone-change-box')
        viewbox.classList.remove('active')
    }
    
    const handleSaveChangePhone = async (e) => {
        try {

            await axios.patch(`/api/payment/changephonenumber/${phoneOrder._id}`, { newPhone }, {
                headers: { Authorization: token }
            })

            toast.success('Thay đổi số điện thoại thành công!', {
                position: "top-center",
                autoClose: 3000
              });
            setCallback(!callback)

            const viewbox = document.querySelector('.order-phone-change-box')
            viewbox.classList.remove('active')

        } catch (err) {
            toast.error(err.respone.data.msg, {
                position: "top-center",
                autoClose: 3000
            })
        }
    }
    return (
    <div className="phone-change-modal">
         <section className="form-change-phone">
            <div className='form-change-phone-wrapper'>
                <div className='change-phone-number-field'>
                    <label>Phone number:</label>
                    <input value={newPhone} onChange={(e) => setNewPhone(e.target.value)}/>
                </div>
            </div>
            <div className="phone-close" onClick={handleCloseView}>
                    <FaRegTimesCircle style={{ color: 'crimson' }} />
            </div>
            <div className='btn-ctrl-modal'>
                <button className='cancel-change-phone-modal-btn' onClick={handleCloseView}>Cancel</button>
                <button className='save-change-phone-modal-btn' onClick={handleSaveChangePhone}>Save</button>
            </div>
         </section>
    </div>
  )
}

export default ChangePhoneModal
