import React, { useContext } from 'react'
import Logo from '../logo/thiv_level-logo-2.png'
import * as AiIcons from 'react-icons/ai'
import * as ImIcons from 'react-icons/im'
import { Link } from 'react-router-dom'
import { GlobalState } from '../../GlobalState'
function Footer() {
    const state = useContext(GlobalState)
    const [categories] = state.categoriesAPI.categories

    return (
        <footer className="footer res-row">
            <div className="col l-10 l-o-1 m-10 m-o-1 c-12">
                <div className="res-row">
                    <div className="col l-3 m-3 c-12 footer-item">
                        <div className="footer-logo">
                            <img src={Logo} alt="" />
                            <ul>
                                <li>
                                    <AiIcons.AiFillMail />
                                    <span>
                                        vtclothes.shop@gmail.com
                                    </span>
                                </li>
                                <li>
                                    <AiIcons.AiFillPhone />
                                    <span>
                                        0123 456 789
                                    </span>
                                </li>
                                <li>
                                    <ImIcons.ImLocation />
                                    <span>
                                        71/9 XVNT
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="col l-3 m-3 c-6 footer-item">
                        <div className="footer-item social-network">
                            <h3 className="footer-item-header">Mạng xã hội</h3>
                            <ul>
                                <li>
                                    <a href="https://www.facebook.com/profile.php?id=100088054956329" target="_blank">
                                        <AiIcons.AiFillFacebook />
                                        <span>
                                            Fanpage ThiV Level
                                        </span>
                                    </a>
                                </li>
                                <li>
                                    <a href="#!">
                                        <AiIcons.AiFillInstagram />
                                        <span>
                                            Instagram ThiV Level
                                        </span>
                                    </a>
                                </li>
                                <li>
                                    <a href="#!">
                                        <AiIcons.AiFillYoutube />
                                        <span>
                                            Youtube ThiV Level
                                        </span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="col l-3 m-3 c-6 footer-item">
                        <div className="footer-item policy">
                            <h3 className="footer-item-header">Về ThivLevel</h3>
                            <ul>
                                <li>
                                    <Link to="/pages/introduction">
                                        Giới thiệu
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/pages/guarantee">
                                        Chính sách đổi trả
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/pages/privacyPolicy">
                                        Chính sách bảo mật
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/pages/termOfService">
                                        Điều khoản dịch vụ
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="col l-3 m-3 c-6 footer-item">
                        <div className="footer-item category">
                            <h3 className="footer-item-header">Danh mục</h3>
                            <ul>
                                {
                                    categories.map((category) => (
                                        <li key={category._id}>
                                            <Link to="#!">
                                                {category.name}
                                            </Link>
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                    </div>
                    <div className="col l-12 m-12 c-12">
                        <h5 className="copyright">Designed by Thuần Việt Corporation</h5>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer