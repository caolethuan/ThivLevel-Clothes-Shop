import React, { useContext } from 'react'
import { GlobalState } from './GlobalState'
import Header from './components/headers/Header'
import MainPages from './components/mainpages/Pages'
import Sidebar from './components/adminPage/Sidebar'
import Footer from './components/footer/Footer'

function Content() {

    const state = useContext(GlobalState)
    const [isAdmin] = state.userAPI.isAdmin

    if (isAdmin)
        return (
            <div className="admin grid">
                <Sidebar></Sidebar>
            </div>
        )
    return (
        <>
            <Header />
            <div className="client grid">
                <MainPages />
            </div>
            <Footer />
        </>
    )
}

export default Content