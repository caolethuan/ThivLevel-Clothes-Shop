import React, { useContext } from 'react'
import { Switch, Route } from 'react-router-dom'
import Home from './home/Home'
import Products from './products/Products'
import ProductsList from './products/ProductsList'
import DetailProduct from './detailProduct/DetailProduct'
import Login from './auth/Login'
import Register from './auth/Register'
import Forgotpassword from './auth/Forgotpassword'
import UserInfor from './user/UserInfor'
import OrderHistory from './history/OrderHistory'
import OrderDetails from './history/OrderDetails'
import Cart from './cart/Cart'
import NotFound from './utils/not_found/NotFound'
import Categories from './categories/Categories'
import CreateProduct from './createProduct/CreateProduct'
import ScrollToTop from './utils/scrollToTop/ScrollToTop'
import Chart from './overview/Chart'
import Users from './overview/Users'
import Staff from './overview/Staff'
import Guarantee from './about/Guarantee'
import Private from './about/Private'
import TermOfService from './about/TermOfService'
import Introduction from './about/Introduction'
import About from './about/About'
import Payment from './cart/Payment'

import { GlobalState } from '../../GlobalState'
import Resetpassword from './auth/resetpassword'
import ListOrders from './listorders/ListOrders'
import DetailOrderAdmin from './listorders/DetailOrderAdmin'

import AddStaff from './overview/AddStaff'

function Pages() {
    const state = useContext(GlobalState)
    const [isLogged] = state.userAPI.isLogged
    const [isAdmin] = state.userAPI.isAdmin



    return (
        <>
            <ScrollToTop />
            <Switch>
                <Route path="/" exact component={isAdmin ? Chart : Home} />
                <Route path="/products" exact component={Products} />
                <Route path="/pages/:pageName" exact component={About} />
                <Route path="/pages/termOfService" exact component={TermOfService} />
                <Route path="/pages/privacyPolicy" exact component={Private} />
                <Route path="/pages/guarantee" exact component={Guarantee} />
                <Route path="/pages/introduction" exact component={Introduction} />

                <Route path="/login" exact component={isLogged ? NotFound : Login} />
                <Route path="/register" exact component={isLogged ? NotFound : Register} />
                <Route path="/forgotpassword" exact component={isLogged ? NotFound : Forgotpassword} />
                <Route path="/resetpassword/:id/:token" exact component={isLogged ? NotFound : Resetpassword} />

                <Route path="/detail/:id" exact component={DetailProduct} />
                <Route path="/user" exact component={isLogged ? UserInfor : NotFound} />
                <Route path="/category" exact component={isAdmin ? Categories : NotFound} />
                <Route path="/create_product" exact component={isAdmin ? CreateProduct : NotFound} />
                <Route path="/edit_product/:id" exact component={isAdmin ? CreateProduct : NotFound} />
                <Route path="/chart" exact component={isAdmin ? Chart : NotFound} />
                <Route path="/users" exact component={isAdmin ? Users : NotFound} />
                <Route path="/staff" exact component={isAdmin ? Staff : NotFound} />
                <Route path="/staff/addstaff" exact component={isAdmin ? AddStaff : NotFound} />
                <Route path="/products_list" exact component={isAdmin ? ProductsList : NotFound} />

                <Route path="/history" exact component={isLogged ? OrderHistory : NotFound} />
                <Route path="/history/:id" exact component={isLogged ? OrderDetails : NotFound} />

                <Route path="/listorders" exact component={isAdmin ? ListOrders : NotFound} />
                <Route path="/listorders/:id" exact component={isAdmin ? DetailOrderAdmin : NotFound} />

                <Route path="/cart" exact component={isLogged ? Cart : NotFound} />
                <Route path="/cart/payment" exact component={isLogged ? Payment : NotFound} />


                <Route path="*" exact component={NotFound} />
            </Switch>
        </>
    )
}

export default Pages