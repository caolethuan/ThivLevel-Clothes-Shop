import React from 'react'
import * as FaIcons from 'react-icons/fa'
import * as BiIcons from "react-icons/bi"
import * as GiIcons from "react-icons/gi"

export const SidebarData = [

    {
        title: 'Biểu đồ',
        path: '/chart',
        icon: <FaIcons.FaChartPie />
    },
    {
        title: 'Quản lý người dùng',
        path: '/users',
        icon: <FaIcons.FaUsers />
    },
    {
        title: 'Quản lý nhân viên',
        path: '/staff',
        icon: <FaIcons.FaUserShield />
    },

    {
        title: 'Danh sách sản phẩm',
        path: '/products_list',
        icon: <GiIcons.GiClothes />
    },
    {
        title: 'Tạo sản phẩm',
        path: '/create_product',
        icon: <BiIcons.BiAddToQueue />
    },
    {
        title: 'Tạo danh mục',
        path: '/category',
        icon: <BiIcons.BiCategory />
    },

    {
        title: 'Danh sách đơn hàng',
        path: '/listorders',
        icon: <BiIcons.BiReceipt />
    }

]