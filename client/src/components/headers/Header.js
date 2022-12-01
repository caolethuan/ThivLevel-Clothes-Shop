import React, { useContext, useState } from 'react'
import { GlobalState } from '../../GlobalState'
import Cart from './icon/cart.svg'
import Logo from '../logo/thiv_level-logo_2-no_tagline.png'
import Unknow from '../../images/unknow.jpg'
import * as CgIcons from 'react-icons/cg'
import * as MdIcons from 'react-icons/md'
import * as BiIcons from 'react-icons/bi'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { Twirl as Hamburger } from 'hamburger-react'

function Header() {
    const state = useContext(GlobalState)
    const [isLogged] = state.userAPI.isLogged
    const [isAdmin] = state.userAPI.isAdmin
    const [user] = state.userAPI.user
    const [cart] = state.userAPI.cart

    const [open, setOpen] = useState(false)

    const logoutUser = async () => {
        await axios.get('/user/logout')
        localStorage.removeItem('firstLogin')
        window.location.href = "/"
        setOpen(false)
    }

    const loggedRouter = () => {
        return (
            <>
                <li className="user__container">
                    <div className="user__wrapper">
                        <div className="user__name">Hi, {user.username}</div>
                        <img src={user.imageProfile?.url ?? Unknow} alt="" />
                    </div>
                    <ul className="user__dropdown">
                        <li>
                            <Link to="/user">
                                <CgIcons.CgProfile style={{ fontSize: 20 }} />
                                <span>Hồ sơ</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/history">
                                <MdIcons.MdHistory style={{ fontSize: 20 }} />
                                <span>Lịch sử mua hàng</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/" onClick={logoutUser}>
                                <BiIcons.BiLogOut style={{ fontSize: 20 }} />
                                <span>Đăng xuất</span>
                            </Link>
                        </li>
                    </ul>
                </li>
                <li>
                    <div className="cart-icon">
                        <span>{cart.length}</span>
                        <Link to="/cart">
                            <img src={Cart} alt="" width="30" />
                        </Link>
                    </div>
                </li>
            </>
        )
    }
    const loggedRouterMobile = () => {
        return (
            <>
                <li className="user__container-mobile">
                    <ul>
                        <li className="cart-icon">
                            <span>{cart.length}</span>
                            <Link to="/cart" onClick={() => setOpen(false)}>
                                <CgIcons.CgShoppingCart style={{ fontSize: 24, marginRight: 15 }} />
                                <span>Giỏ hàng</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/user" onClick={() => setOpen(false)}>
                                <CgIcons.CgProfile style={{ fontSize: 24, marginRight: 15 }} />
                                <span>Hồ sơ</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/history" onClick={() => setOpen(false)}>
                                <MdIcons.MdHistory style={{ fontSize: 24, marginRight: 15 }} />
                                <span>Lịch sử mua hàng</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/" onClick={logoutUser}>
                                <BiIcons.BiLogOut style={{ fontSize: 20, marginRight: 15 }} />
                                <span>Đăng xuất</span>
                            </Link>
                        </li>
                    </ul>
                </li>
            </>
        )
    }
    if (isAdmin) return null;
    return (
        <header>
            <div className="logo">
                <div style={{ width: 'fit-content' }}>
                    <Link to="/">
                        <img src={Logo} alt="" className="header-logo" />
                    </Link>
                </div>
            </div>

            <ul className="header-nav">
                <li><Link to="/">Trang chủ</Link></li>
                <li><Link to="/products">Sản phẩm</Link></li>
                <li><Link to="/pages/introduction">Giới thiệu</Link></li>
                {
                    isLogged ? loggedRouter() : <li><Link to="/login">Đăng nhập</Link></li>
                }
            </ul>
            <div className="header-nav-tablet-mobile">
                {
                    isLogged ?
                        <div className="user__wrapper">
                            <img src={user.imageProfile?.url ?? Unknow} alt="" />
                        </div>
                    : null
                }
                <div className="navbar-icon">
                    <Hamburger
                        color="rgb(36, 98, 132)" toggled={open}
                        size="40" rounded toggle={setOpen}
                    />
                </div>
                <div className={`navbar-tablet-mobile-wrapper ${open ? 'active' : ''}`}>
                    <ul>
                        <li><Link to="/" onClick={() => setOpen(false)}>Trang chủ</Link></li>
                        <li><Link to="/products" onClick={() => setOpen(false)}>Shop</Link></li>
                        <li><Link to="/pages/introduction" onClick={() => setOpen(false)}>About us</Link></li>
                        {
                            isLogged ? loggedRouterMobile() : <li><Link to="/login" onClick={() => setOpen(false)}>Đăng nhập</Link></li>
                        }
                    </ul>
                </div>
            </div>
            {open ? <div className="header-nav-tablet-mobile overlay"
                onClick={() => setOpen(false)}
            ></div> : null}

        </header>
    )
}

export default Header