import React, { useContext } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import * as BiIcons from 'react-icons/bi'
import * as AiIcons from 'react-icons/ai'
import { GlobalState } from '../../GlobalState'
import { SidebarData } from './SidebarData'
import SubMenu from './SubMenu'
import { IconContext } from 'react-icons/lib'
import MainPages from '../mainpages/Pages'
import axios from 'axios'

const Nav = styled.div`
  border-bottom: 1px solid #ddd;
  background: #fff;
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const NavIcon = styled(Link)`
  margin-left: 2rem;
  font-size: 2rem;
  height: 80px;
  color: #008c90;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: 600;
`;

const SidebarNav = styled.nav`
  background: #eee;
  width: 100%;
  height: calc(100vh - 80px);
  z-index: 10;
  display: flex;
  margin-top: 15px;
`;

const Content = styled.div`
  flex: 1;
  overflow-y: auto;
  background-color: #eee;
`;

const SidebarWrap = styled.div`
  border-radius: 10px;
  overflow: hidden;
  margin-right: 20px;
  background: #fff;
  border: 1px solid #ddd;
`;

const FlexDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

const Logout = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  color: #008c90;
  padding: 5px;
  margin-right: 20px;
`

const AdminProfile = styled(Link)`
  margin: 0 20px;
  font-size: 18px;
  color: #008c90;
  font-weight: 500;
  display: flex;
  align-items: center;
`

function Sidebar() {

  const state = useContext(GlobalState)
  const [isAdmin] = state.userAPI.isAdmin

  const logoutUser = async () => {
    await axios.get('/user/logout')

    localStorage.removeItem('firstLogin')

    window.location.href = "/"
  }

  if (!isAdmin) return null;
  return (
    <>
      <IconContext.Provider value={{ color: '#008c90' }}>
        <Nav>
          <NavIcon to="/">
            <AiIcons.AiFillHome style={{ marginRight: 10}}/>
            Admin
          </NavIcon>

          <FlexDiv>
            <AdminProfile to='/user'>
              <BiIcons.BiUser style={{ marginRight: 10, color: '#008c90'}} />
              Hồ sơ của tôi
            </AdminProfile>

            <Logout to="/" onClick={logoutUser}>
              <BiIcons.BiLogOut style={{ marginRight: 10 }} />
              Đăng xuất
            </Logout>
          </FlexDiv>
        </Nav>

        <SidebarNav>
          <SidebarWrap>
            {SidebarData.map((item, index) => (
              <SubMenu
                item={item}
                key={index}
              />
            ))}
          </SidebarWrap>
          <Content>
            <MainPages></MainPages>
          </Content>
        </SidebarNav>
      </IconContext.Provider>
    </>
  )
}

export default Sidebar