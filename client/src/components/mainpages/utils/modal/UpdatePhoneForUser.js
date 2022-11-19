import axios from 'axios'
import React, {useState, useContext, useEffect} from 'react'
import { GlobalState } from '../../../../GlobalState'
import { FaRegTimesCircle } from 'react-icons/fa'
import { toast } from 'react-toastify'

function UpdatePhoneForUser() {
    const state = useContext(GlobalState)
    const [token] = state.token
    const [user] = state.userAPI.user
    const [callback, setCallback] = state.userAPI.callback
    const [phone, setPhone] = useState('')


    useEffect(() => {
        setPhone(user.phone ?? '')
    }, [user])

    const handleCloseView = (e) => {
        e.preventDefault()
        const viewbox = document.querySelector('.update-phone-profile-box')
        viewbox.classList.remove('active')
    }
    
    const handleSaveChangePhone = async (e) => {
        try {

            await axios.patch(`/user/updatephone/`, { phone }, {
                headers: { Authorization: token }
            })

            toast.success('Cập nhật số điện thoại thành công!', {
                position: "top-center",
                autoClose: 3000
              });
            setCallback(!callback)

            const viewbox = document.querySelector('.update-phone-profile-box')
            viewbox.classList.remove('active')

        } catch (err) {
            toast.error(err.response.data.msg)
        }
    }
    return (
    <div className="phone-change-modal">
         <section className="form-change-phone">
            <div className='form-change-phone-wrapper'>
                <div className='change-phone-number-field'>
                    <label>Phone number:</label>
                    <div className='phone-number-profile-input'>
                        <span>+84</span>
                        <input value={phone} maxLength="9" onChange={(e) => setPhone(e.target.value)}/>
                    </div>
                </div>
            </div>
            <div className="phone-close" onClick={handleCloseView}>
                    <FaRegTimesCircle style={{ color: 'crimson' }} />
            </div>
            <div className='btn-ctrl-modal'>
                <button className='cancel-change-phone-modal-btn' onClick={handleCloseView}>Cancel</button>
                {
                    user.phone === phone ? 
                    <button className='save-change-phone-modal-btn'>Save</button>
                    : <button className='save-change-phone-modal-btn' onClick={handleSaveChangePhone}>Save</button>
                }
                
            </div>
         </section>
    </div>
  )
}

export default UpdatePhoneForUser
