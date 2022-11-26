import React, { useState, useEffect} from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'

function Resetpassword() {
  const [isValid, setIsValid] = useState(false)
  const {id} = useParams()
  const {token} = useParams()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isUpdated, setIsUpdated] = useState(false)

  useEffect(() => {
    const getLink = async() =>{
        try {

          const res = await axios.get(`/user/resetpassword/${id}/${token}`)

          res.data ? setIsValid(true) : setIsValid(false)

        } catch (err) {
          return alert(err.response.data.msg)
      } 
    }
    getLink()
  }, [id, token])


  if(!isValid) return null

  const registerSubmit = async (e) => {
    e.preventDefault()
    try {
      if(password !== confirmPassword) return toast.error('Password & Confirm password is not match.', {
        position: "top-center",
        autoClose: 3000
      })

      await axios.patch('/user/updatenewpassword', {id, token, password})

      setIsUpdated(true)

      toast.success('Your password updated successfully', {
        position: "top-center",
        autoClose: 3000
      })

      setTimeout (() => {
        window.location.href = '/login'
      }, 3000)

    } catch (error) {
      setIsUpdated(false)
      toast.error(error.response.data.msg, {
        position: "top-center",
        autoClose: 3000
      })
    }
  }

  return (
    <div className="login-page">
      <form onSubmit={registerSubmit} className="form-signin-signout">
        <h2>Đặt lại mật khẩu</h2>

        <label>Mật khẩu mới</label>
        <input type="password" name="password"
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isUpdated}
        />

        <label>Xác nhận mật khẩu</label>
        <input type="password" name="confirmPassword"
          autoComplete="on"
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          disabled={isUpdated}
        />
        <div className="row">
          <button type="submit">Xác nhận</button>
          <Link to="/login">Đăng nhập</Link>
        </div>
      </form>
    </div>
  )
}

export default Resetpassword