import React, { useEffect, useState} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUp } from '@fortawesome/free-solid-svg-icons'
import './bttopBtn.css'

function BttopBtn() {
    const [active, setActive] = useState("")

    useEffect(() => {
        document.onscroll = () => {
            if (document.documentElement.scrollTop > 600 || window.scrollY >600)
                setActive("active")
            else 
                setActive("")
        }
    })

    const backToTop = () => {
        document.body.scrollTop = 0; // For Safari
        // document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        }); // For Chrome, Firefox, IE and Opera
    }

    return (
        <div className={`back-to-top-Btn ${active}`} onClick={backToTop}>
            <FontAwesomeIcon
                icon={faArrowUp}
            />
        </div>
    )
}

export default BttopBtn