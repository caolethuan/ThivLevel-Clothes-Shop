import React, { useState, useEffect, useContext, useRef } from 'react'
import { GlobalState } from '../../../GlobalState'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { FaEdit } from 'react-icons/fa'
import { toast } from 'react-toastify'
import Loading from '../utils/loading/Loading'
import LocationForm from '../utils/address/LocationForm'
import Unknow from '../../../images/unknow.jpg'
import UpdatePhoneForUser from '../utils/modal/UpdatePhoneForUser'
import VerifyPhoneNumber from '../utils/modal/VerifyPhoneNumber'
import axios from 'axios'

function UserInfor() {
    const state = useContext(GlobalState)
    const [token] = state.token
    const [user] = state.userAPI.user
    const [callback, setCallback] = state.userAPI.callback
    const [loading, setLoading] = useState(false)

    const [avt, setAvt] = useState(Unknow)
    const [username, setUserName] = useState('')
    const [phone, setPhone] = useState('')
    const [address, setAddress] = useState('')
    const [gender, setGender] = useState('')
    const [dob, setDob] = useState('')

    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [verifyPassword, setVerifyPassword] = useState('')

    const inputRef = useRef()
    const addressRef = useRef()

    const [avtChange, setAvtChange] = useState(false)

    useEffect(() => {
        setAvt(user.imageProfile?.url ?? Unknow)
        setUserName(user.username ?? '')
        setPhone(user.phone ?? '')
        setAddress(user.address ?? '')
        setGender(user.gender ?? '')
        setDob(user.dateOfbirth ?? '')
    }, [user])

    async function handleUpload(e) {
        e.preventDefault()

        const file = e.target.files[0]
        // Validate image
        try {
            if (!file)
                return toast.error("File does not exist", {
                    position: "top-center",
                    autoClose: 3000
                })

            if (file.type !== 'image/jpeg' && file.type !== 'image/png')
                return toast.error("File format must be JPGE/PNG", {
                    position: "top-center",
                    autoClose: 3000
                })


            if (file.size > 1024 * 1024)
                return toast.error("Size too large", {
                    position: "top-center",
                    autoClose: 3000
                })

            setAvtChange(true)
            setAvt(file)

        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    const handleChangePhone = () => {
        const viewbox = document.querySelector('.update-phone-profile-box')
        viewbox.classList.toggle('active')
    }

    const handleVerifyPhone = () => {
        const viewbox = document.querySelector('.verify-phone-profile-box')
        viewbox.classList.toggle('active')
    }

    function handleChangeAddress() {
        addressRef.current.classList.add('active')
    }

    async function handleChangePassword(e) {
        try {
            const res = await axios.patch('/user/changepassword', {
                oldPassword: currentPassword,
                newPassword,
                verifyPassword
            }, {
                headers: { Authorization: token }
            })

            toast.success(res.data.msg, {
                position: "top-center",
                autoClose: 3000
            })

            setCallback(!callback)
            setCurrentPassword('')
            setNewPassword('')
            setVerifyPassword('')
        } catch (error) {
            toast.error(error.response.data.msg, {
                position: "top-center",
                autoClose: 3000
            })
        }
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setLoading(true)


        if (avtChange) {
            // Upload avatar user to database
            let form = new FormData();
            form.append('file', avt)
            const avtRes = await axios.post('/api/uploadprofile', form, {
                headers: { 'context-type': 'multipart/form-data', Authorization: token }
            })

            // Update profile
            const res = await axios.put(
                '/user/updateUser',
                { ...user, imageProfile: avtRes.data, username, dateOfbirth: dob, address, gender }, {
                headers: { Authorization: token }
            })

            console.log(res);
        } else {

            // Update profile
            const res = await axios.put(
                '/user/updateUser',
                { ...user, username, dateOfbirth: dob, address, gender }, {
                headers: { Authorization: token }
            })
            console.log(res);
        }

        toast.success("Updated successfull!", {
            position: "top-center",
            autoClose: 3000
        })

        setCallback(!callback)
        setAvtChange(false)
        setLoading(false)
    }

    if (loading) return <Loading />
    return (
        <div className="user-profile-container">
            <div className="res-row">
                <div className="user-header">
                    <h2 className="header-title">Hồ sơ của tôi</h2>
                    <p className="header-description">Quản lý thông tin cá nhân</p>
                </div>
            </div>
            <div className="profile-container res-row">
                <div className="col l-3 m-3 c-12 profile-user-avt">
                    <img
                        src={avtChange ? URL.createObjectURL(avt) : avt}
                        alt="" />
                    <input type="file" size="60" onChange={handleUpload} ref={inputRef} />
                    <button className='select-img' onClick={() => inputRef.current.click()}>Chọn ảnh</button>
                    <span>Kích thước file tối đa: 1 MB <br /> Định dạng: .JPEG, .PNG</span>
                </div>
                <div className="divider"></div>
                <div className="col l-6 m-6 c-12 user-infor-wrapper">
                    <form onSubmit={handleSubmit}>
                        <div className="user-infor-field">
                            <label>ID Người dùng</label>
                            <div id="user-id">{user._id}</div>
                        </div>

                        <div className="user-infor-field">
                            <label>Tên</label>
                            <input type="text" id="user-name"
                                value={username} onChange={e => setUserName(e.target.value)} />
                        </div>

                        <div className="user-infor-field">
                            <label>Email</label>
                            <div id="user-email">{user.email}</div>
                        </div>

                        <div className="user-infor-field">
                            <label>Số điện thoại</label>
                            <span style={{marginRight: '15px'}}>+84 {phone}</span>
                            <a href="#!" onClick={() => handleChangePhone()}>
                                <FaEdit style={{ color: '#9e9e9e', cursor: 'pointer' }} />
                            </a> 
                            
                        </div>
                        <div className="user-infor-field">
                            <label>Xác thực SĐT</label>
                            {   
                                user.phone ? 
                                user.isVerifyPhone ? <span>Đã xác thực</span>:
                                <a href="#!" onClick={() => handleVerifyPhone()} className="phone-number-verify">
                                    Chưa xác thực, Xác thực ngay.
                                </a> : <span>Chưa cập nhật SĐT</span>
                            }
                        </div>

                        <div className="user-infor-field">
                            <label>Địa chỉ</label>
                            <div id="user-address">
                                {address.city?.label ? `${address.detailAddress || ''} ${address.ward?.label}, ${address.district?.label}, ${address.city?.label}` : `${address}`}
                                <a href="#!" className="change-address"
                                    onClick={handleChangeAddress}>
                                    <FontAwesomeIcon icon={faEdit} />
                                    Thay đổi địa chỉ
                                </a>
                                <div className="address-form" ref={addressRef}>
                                    <LocationForm element={"address-form"} onSave={setAddress} initAddress={address} />
                                </div>
                            </div>
                        </div>

                        <div className="user-infor-field">
                            <label>Giới tính</label>
                            <div id="user-gender">
                                <div className="user-gender-item">
                                    <input type="radio" name="gender" value="male" id="male" checked={gender === "male" ? true : false}
                                        onChange={(e) => setGender(e.target.value)} />
                                    <label htmlFor="male">Nam</label>
                                </div>
                                <div className="user-gender-item">
                                    <input type="radio" name="gender" value="female" id="female" checked={gender === "female" ? true : false}
                                        onChange={(e) => setGender(e.target.value)} />
                                    <label htmlFor="female">Nữ</label>
                                </div>
                                <div className="user-gender-item">
                                    <input type="radio" name="gender" value="other" id="other" checked={gender === "other" ? true : false}
                                        onChange={(e) => setGender(e.target.value)} />
                                    <label htmlFor="other">Khác</label>
                                </div>
                            </div>
                        </div>

                        <div className="user-infor-field">
                            <label htmlFor="">Ngày sinh</label>
                            <input type="date" value={dob} onChange={e => setDob(e.target.value)} />
                        </div>
                        <div className="user-infor-field">
                            <label>Thời gian tạo</label>
                            <div id="user-created-time">{new Date(user.createdAt).toLocaleDateString()}</div>
                        </div>

                        <button type="submit" className="save-btn">Lưu thay đổi</button>
                    </form>
                </div>
                <div className="divider"></div>
                {
                    !user.isLogSocialNetwork ?
                        <div className="col l-3 m-3 c-12 change-password">
                            <div className="change-password-wrapper">
                                <h2 className="change-password-heading">Đổi mật khẩu</h2>
                                <div className="change-password-input-wrapper">
                                    <div className="password-input-item">
                                        <label htmlFor="user-current-password">Mật khẩu hiện tại</label>
                                        <input type="password" id="user-current-password"
                                            value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
                                    </div>
                                    <div className="password-input-item">
                                        <label htmlFor="user-new-password">Mật khẩu mới</label>
                                        <input type="password" id="user-new-password"
                                            value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                                    </div>
                                    <div className="password-input-item">
                                        <label htmlFor="user-verify-password">Xác nhận mật khẩu</label>
                                        <input type="password" id="user-verify-password"
                                            value={verifyPassword} onChange={e => setVerifyPassword(e.target.value)} />
                                    </div>
                                    <button className="change-password-btn"
                                        onClick={handleChangePassword}
                                    >
                                        Đổi mật khẩu
                                    </button>
                                </div>
                            </div>
                        </div>
                        :
                        null
                }
            </div>
            <div className="update-phone-profile-box">
                {<UpdatePhoneForUser />}
            </div>
            <div className="verify-phone-profile-box">
                {<VerifyPhoneNumber />}
            </div>  
        </div>
    )
}

export default UserInfor