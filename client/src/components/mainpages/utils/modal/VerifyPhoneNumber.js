import axios from 'axios'
import React, { useState, useContext, useEffect } from 'react'
import { GlobalState } from '../../../../GlobalState'
import { FaRegTimesCircle } from 'react-icons/fa'
import { toast } from 'react-toastify'

function VerifyPhoneNumber() {
    const state = useContext(GlobalState)
    const [token] = state.token
    const [user] = state.userAPI.user
    const [callback, setCallback] = state.userAPI.callback
    const [phone, setPhone] = useState('')
    const [code, setCode] = useState('')
    const [isReady, setIsReady] = useState(false)

    useEffect(() => {
        setPhone(user.phone ?? '')
    }, [user])

    const handleCloseView = (e) => {
        e.preventDefault()
        const viewbox = document.querySelector('.verify-phone-profile-box')
        viewbox.classList.remove('active')
    }

    const handleSendCode = async () => {
        try {
            await axios.post(`/user/verifyphonenumber/`, { phone }, {
                headers: { Authorization: token }
            })

            toast.info('Mã OTP đang được gửi đến số điện thoại của bạn.', {
                position: "top-center",
                autoClose: 3000
              });
            setIsReady(true)

        } catch (err) {
            toast.error(err.response.data.msg)
        }
    }

    const handleVerifyPhoneNumber = async (e) => {
        try {

            await axios.post(`/user/verifycodesms/`, { phone, code }, {
                headers: { Authorization: token }
            })

            toast.success('Xác thực thành công', {
                position: "top-center",
                autoClose: 3000
            })

            setCallback(!callback)
            setIsReady(false)
            const viewbox = document.querySelector('.verify-phone-profile-box')
            viewbox.classList.remove('active')

        } catch (err) {
            toast.error(err.response.data.msg, {
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
                        <span>+84 {phone}</span>
                    </div>
                    <div className='change-phone-number-field'>
                        <button
                            className='save-change-phone-modal-btn'
                            onClick={handleSendCode}
                            style={{
                                color: '#fff',
                                backgroundColor: 'crimson',
                                height: '30px',
                                width: '200px',
                                marginBottom: '15px'
                            }}>Send OTP</button>
                        {
                            isReady ?
                                <div>
                                    <label>Code:</label>
                                    <input value={code} onChange={(e) => setCode(e.target.value)} required />
                                </div> : <p>Bấm "Send OTP" Chúng tôi sẽ gửi mã OTP tới số điện thoại của bạn</p>
                        }
                    </div>
                </div>
                <div className="phone-close" onClick={handleCloseView}>
                    <FaRegTimesCircle style={{ color: 'crimson' }} />
                </div>
                <div className='btn-ctrl-modal'>
                    <button className='cancel-change-phone-modal-btn' onClick={handleCloseView}>Cancel</button>
                    {
                        code.length === 6 ?
                            <button className='save-change-phone-modal-btn' onClick={handleVerifyPhoneNumber}>Confirm</button> :
                            <div></div>
                    }
                </div>
            </section>
        </div>
    )
}

export default VerifyPhoneNumber