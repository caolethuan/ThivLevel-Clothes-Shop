import { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify';

function UserAPI(token) {
    const [isLogged, setIsLogged] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)
    const [cart, setCart] = useState([])
    const [history, setHistory] = useState([])
    const [user, setUser] = useState([])
    const [callback, setCallback] = useState(false)
    const [allUser, setAllUser] = useState([])
    const [allUserCopy, setAllUserCopy] = useState([])
    const [allStaff, setAllStaff] = useState([])
    const [allStaffCopy, setAllStaffCopy] = useState([])

    useEffect(() => {
        if (token) {
            const getUser = async () => {
                try {
                    const res = await axios.get('/user/infor', {
                        headers: { Authorization: token }
                    })

                    setIsLogged(true)
                    res.data.role === 1 ? setIsAdmin(true) : setIsAdmin(false)
                    setUser(res.data)
                    setCart(res.data.cart)

                    if(res.data.role === 1)
                    {
                        const getAllUser = async () => {
                            try {
                                const res = await axios.get('/user/alluser?role=0', {
                                    headers: { Authorization: token }
                                })

                                setAllUser(res.data)
                                setAllUserCopy(res.data)

                            } catch (err) {
                                alert(err.response.data.msg)
                            }
                        }
                        getAllUser()
                        
                        const getAllStaff = async () => {
                            try {
                                const res = await axios.get('/user/alluser?role=1', {
                                    headers: { Authorization: token }
                                })

                                setAllStaff(res.data)
                                setAllStaffCopy(res.data)

                            } catch (err) {
                                alert(err.response.data.msg)
                            }
                        }
                        getAllStaff()
                     }
                } catch (err) {
                    alert(err.response.data.msg)
                }
            }
            getUser()
        
        }
        
    }, [token, callback])

    const addCart = async (product, color, size, quantity) => {
        if (!isLogged) return toast.warning('????ng nh???p ????? ti???p t???c!', {
            position: "top-center",
            autoClose: 3000,
        });

        if(product.countInStock < quantity ) return toast.warning('S???n ph???m n??y hi???n kh??ng ????? s??? l?????ng ????p ???ng.', {
            position: "top-center",
            autoClose: 3000,
        });

        const check = cart.every(item => {
            return item.product_id !== product.product_id || 
            (item.product_id === product.product_id && (item.color !== color && item.size === size)) ||
            (item.product_id === product.product_id && (item.color === color && item.size !== size)) ||
            (item.product_id === product.product_id && (item.color !== color && item.size !== size))
        })
        
        const totalQuantity = cart.reduce((acc, curr) => {
            return (curr.product_id === product.product_id) ? acc + curr.quantity : acc 
        }, 0)


        if(product.countInStock < totalQuantity + quantity) return toast.warning('S???n ph???m n??y hi???n kh??ng ????? s??? l?????ng ????p ???ng.', {
            position: "top-center",
            autoClose: 3000,
        });

        const guid = () => {
            const s4 = () => {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }
            //return id of format 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaaaaaa'
            return s4() + s4() + s4() + s4() + s4() + s4()
        }

        if (check) {
            setCart([...cart, { ...product, _id: guid(), color, size, quantity }])
            await axios.patch('/user/addcart', {
                cart: [...cart, { ...product, _id: guid(), color, size, quantity }]
            }, {
                headers: { Authorization: token }
            })
            toast.success('Th??m v??o gi??? h??ng th??nh c??ng!', {
                position: "top-center",
                autoClose: 3000
            });
        } else {
            toast.warning('S???n ph???m ???? c?? s???n trong gi??? h??ng.', {
                position: "top-center",
                autoClose: 3000
            });
        }
    }
    return {
        isLogged: [isLogged, setIsLogged],
        isAdmin: [isAdmin, setIsAdmin],
        callback: [callback, setCallback],
        cart: [cart, setCart],
        addCart: addCart,
        history: [history, setHistory],
        user: [user, setUser],
        allUser: [allUser, setAllUser],
        allUserCopy: [allUserCopy, setAllUserCopy],
        allStaff: [allStaff, setAllStaff],
        allStaffCopy: [allStaffCopy, setAllStaffCopy]
    }
}

export default UserAPI