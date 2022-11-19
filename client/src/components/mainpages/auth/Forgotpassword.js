import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

function Forgotpassword() {
  const [email, setEmail] = useState('')
  const [isSend, setIsSend] = useState(true)

  const forgotpasswordSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setIsSend(false)
      await axios.post('/user/forgotpassword', {email})
      setIsSend(true) 
      toast.success('Hãy kiểm tra hộp thư email của bạn nhé!', {
        position: "top-center",
        autoClose: 3000
      })
    } catch (error) {
      setIsSend(true)
      toast.error(error.response.data.msg, {
        position: "top-center",
        autoClose: 3000
      })
    }
  }

    
  return (
    <div className="login-page">
      <form onSubmit={forgotpasswordSubmit} className="form-signin-signout">
        <h2>Quên mật khẩu</h2>
        {!isSend && 
          <div className='sendmail-status'>
            <FontAwesomeIcon
              icon={faSpinner} className="fa-spin"
            /> <span>Chúng tôi đang gửi một đường dẫn tới email của bạn...</span>    
          </div>       
        }
        <label>Nhập email của bạn</label>
        <input type="email" name="email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="row">
          <button type="submit">Xác nhận</button>
          <Link to="/login">Đăng nhập</Link>
        </div>
      </form>
    </div>
  )
}

export default Forgotpassword