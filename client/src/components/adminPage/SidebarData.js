import React from 'react'
import * as FaIcons from 'react-icons/fa'
import * as BiIcons from "react-icons/bi"
import * as GiIcons from "react-icons/gi"

export const SidebarData = [

    {
        title: 'Charts',
        path: '/chart',
        icon: <FaIcons.FaChartPie />
    },
    {
        title: 'Users',
        path: '/users',
        icon: <FaIcons.FaUsers />
    },
    {
        title: 'Staff',
        path: '/staff',
        icon: <FaIcons.FaUserShield />
    },

    {
        title: 'Products list',
        path: '/products_list',
        icon: <GiIcons.GiClothes />
    },
    {
        title: 'Create product',
        path: '/create_product',
        icon: <BiIcons.BiAddToQueue />
    },
    {
        title: 'Create category',
        path: '/category',
        icon: <BiIcons.BiCategory />
    },

    {
        title: 'List Orders',
        path: '/listorders',
        icon: <BiIcons.BiReceipt />
    }

]