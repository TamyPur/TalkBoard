import WhiteTalk from '../assets/whiteTalk.png'
import Logo from '../assets/logo.png';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Outlet, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { RiLogoutCircleLine } from 'react-icons/ri';
import { Dispatch, useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { TUser } from '../interfaces/user';
import { useDispatch, useSelector } from 'react-redux';
import { UserState } from '../type';
import { updateUser } from '../store/actionCreators';
import { Avatar, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import React from 'react';
import { UpdatePassword } from './UpdatePassword';
import CloseIcon from '@mui/icons-material/Close';



export const Home = () => {

  const currentUser: TUser = useSelector(
    (state: UserState) => state.currentUser
  )
  const apiUri = 'http://localhost:3000';
  const token = Cookies.get('JwtToken');
  const location = useLocation();
  let navigate = useNavigate();

  const [admin, setAdmin] = useState<TUser>()
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(false);

  // const handleClickOpen = () => {
  //   setOpen(true);
  // };

  const handleClose = () => {
    if (currentUser.password != "needDeletePass")
      setOpen(false);
  };

  const dispatch: Dispatch<any> = useDispatch()
  const saveUser = useCallback(
    (user: TUser) => dispatch(updateUser(user)),
    [dispatch]
  )


  useEffect(() => {
    getCurrentUser()
    if (location.pathname.includes("/homePage/management"))
      location.pathname = "/homePage/management/forumManagement"
  }, [open])

  useEffect(() => {
    checkPassword();
  }, [currentUser])

  const checkPassword = () => {
    if (currentUser.password == "needDeletePass")
      setOpen(true)
  }

  const getCurrentUser = () => {
    // alert("getCurrentUser in home component")
    axios.get(`${apiUri}/user/getCurrentUser`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    }
    ).then(res => {
      // alert(res.data.password)
      saveUser(res.data);
    })
      .catch(err => console.log(err))
  }

  const isAdmin = () => {
    axios.get(`${apiUri}/user/getSystemAdmin`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    }
    ).then(res => setAdmin(res.data))
    return (admin?._id == currentUser._id)
  }

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <div className="home-page">
      <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary" bg="dark" data-bs-theme="dark" sticky="top" >
        <Container>
          <img style={{ height: "40px" }} src={Logo} />
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">

            <Nav variant="underline" activeKey={location.pathname}>
              <Nav.Link href="/homePage/profile">פרופיל החברה</Nav.Link>
              <Nav.Link href="/homePage/customersList">לקוחות החברה</Nav.Link>
              <Nav.Link href="/homePage/forumList">פורומים</Nav.Link>
              <Nav.Link href="/homePage/account">איזור אישי</Nav.Link>
              {isAdmin() ? (<Nav.Link href="/homePage/management/forumManagement">ניהול המערכת</Nav.Link>) : (<></>)}


            </Nav>

            <Nav className="me-auto">
              <Nav.Link >{currentUser?.name}</Nav.Link>
              <Nav.Link href="/" onClick={() => Cookies.set('JwtToken', "")}><RiLogoutCircleLine /></Nav.Link>
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt={currentUser.name} src={`${apiUri}/files/${currentUser.profilePicture}`} />
              </IconButton>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem key={1} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">
                    <b>{currentUser.name}</b><br />
                    {currentUser.occupation}<br />
                    {currentUser.email} | {currentUser.phoneNumber}<br />
                    {currentUser.address}<br />
                  </Typography>
                </MenuItem>
                <MenuItem key={2} onClick={() => {handleCloseUserMenu(); navigate("/homePage/account") }}>
                  <Typography textAlign="center">
                    איזור אישי
                  </Typography>
                </MenuItem>
                <MenuItem key={3} onClick={() => {handleCloseUserMenu(); navigate(`/`), Cookies.set('JwtToken', "") }}>
                  <Typography textAlign="center">
                    התנתקות
                  </Typography>
                </MenuItem>
              </Menu>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div className="left">
        <div className="card">
          <Link to='/homePage/newForum'><img className="card-img-top" src={WhiteTalk} /></Link>
          <div className="card-body">
          </div>
        </div>
      </div>

      <React.Fragment>
        {/* <Button  sx={{ "width": "10%" }} variant="outlined" onClick={handleClickOpen}>
        Open alert dialog
      </Button> */}
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {/* {"עדכון סיסמה"} */}
          </DialogTitle>

          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>

          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <UpdatePassword />
            </DialogContentText>
          </DialogContent>
        </Dialog>
      </React.Fragment>

      <Outlet />
    </div>

  )
};
