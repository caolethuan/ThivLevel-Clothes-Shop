import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { GoogleLogin } from 'react-google-login';
import { gapi } from 'gapi-script'

function Login() {
  const clientId = "711887640793-m0i8nt5fjdidt4urjpio2jpd88suip6n.apps.googleusercontent.com"
  const [user, setUser] = useState({
    email: '',
    password: ''
  })

  useEffect(() => {
    gapi.load("client:auth2", () => {
      gapi.auth2.init({ clientId: clientId })
    })
  }, [])

  const onChangeInput = (e) => {
    const { name, value } = e.target
    setUser({ ...user, [name]: value })
  }

  const loginSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post('/user/login', { ...user })

      localStorage.setItem('firstLogin', true)

      window.location.href = "/"
    } catch (err) {
      toast.error(err.response.data.msg, {
        position: "top-center",
        autoClose: 3000
      })
    }
  }

  const responseGoogleSuccess = async (res) => {
    console.log(res)
    const result = res?.profileObj
    const accessToken  = res.accessToken
    try {
      const { name, email, imageUrl } = result
      await axios.post('/user/googleauth', { name, email, imageUrl, accessToken })

      localStorage.setItem('firstLogin', true)

      window.location.href = "/"
    } catch (err) {
      console.log(err)
    }
  }

  const responseGoogleFailure = (err) => {
    console.log(err)
  }


  return (
    <div className="login-page">
      <form onSubmit={loginSubmit} className="form-signin-signout">
        <h2>Đăng nhập</h2>
        <label>Email</label>
        <input type="email" name="email"
          value={user.email}
          onChange={onChangeInput}
          required
        />

        <label>Mật khẩu</label>
        <input type="password" name="password"
          value={user.password}
          autoComplete="on"
          onChange={onChangeInput}
          required
        />

        <div className="row">
          <button type="submit">Đăng nhập</button>
          <span>Chưa có tài khoản? <Link to="/register">Đăng ký ngay!</Link></span>
        </div>

        <div className="row">
          <span><Link to="/forgotpassword">Quên mật khẩu</Link></span>
        </div>
      </form>
      <div className="signin-with-social">
        <span>Hoặc đăng nhập với</span>
        <GoogleLogin
          clientId={clientId}
          buttonText="Google"
          onSuccess={responseGoogleSuccess}
          onFailure={responseGoogleFailure}
          cookiePolicy={'single_host_origin'}
        />
      </div>
   
    </div>
  )
}

export default Login