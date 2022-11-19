import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import Guarantee from './Guarantee'
import Private from './Private'
import TermOfService from './TermOfService'
import Introduction from './Introduction'
import NotFound from '../utils/not_found/NotFound'

function About() {
    const params = useParams()
    const [page, setPage] = useState('')

    useEffect(() => {
        switch (params.pageName) {
            case 'introduction':
                setPage(<Introduction />)
                break;
            case 'guarantee':
                setPage(<Guarantee />)
                break;
            case 'privacyPolicy':
                setPage(<Private />)
                break;
            case 'termOfService':
                setPage(<TermOfService />)
                break;
            default:
                setPage(<NotFound />)
        }
    }, [params])

    return (
        <div className="res-row about-container">
            <div className="col l-3 m-3 c-12">
                <div className="group-menu">
                    <div className="heading">Danh mục trang</div>
                    <ul className="page-items">
                        <li>
                            <Link to='/pages/introduction'>Giới thiệu</Link>
                        </li>
                        <li>
                            <Link to='/pages/guarantee'>Chính sách đổi trả</Link>
                        </li>
                        <li>
                            <Link to='/pages/privacyPolicy'>Chính sách bảo mật</Link>
                        </li>
                        <li>
                            <Link to='/pages/termOfService'>Điều khoản dịch vụ</Link>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="col l-9 m-9 c-12">
                <div className="page-wrapper">
                    {page}
                </div>
            </div>
        </div>
    )
}

export default About