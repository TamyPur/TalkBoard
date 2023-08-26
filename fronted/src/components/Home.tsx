import WhiteTalk from '../assets/whiteTalk.png'
import Logo from '../assets/logo.png';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { RiLogoutCircleLine } from 'react-icons/ri';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { TUser } from '../interfaces/user';

export const Home = () => {
  const apiUri = 'http://localhost:3000';

  const [currentUser, setCurrentUser] = useState<TUser>();


  useEffect(() => {
    const token = Cookies.get('JwtToken');
    axios.get(`${apiUri}/user/getCurrentUser`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    }
    ).then(res => setCurrentUser(res.data))
      .catch(err => alert(err))
  }, [])


  return (
    <div className="home-page">
      <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary" bg="dark" data-bs-theme="dark" sticky="top" >
        <Container>
          {/* <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand> */}
          <img style={{ height: "40px" }} src={Logo} />
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">

            <Nav>
              <Nav.Link href="/homePage/profile">פרופיל החברה</Nav.Link>
              {/* <Nav.Link href="#deets">לקוחות החברה</Nav.Link> */}
              <Nav.Link href="/homePage/forumList">פורומים</Nav.Link>
            </Nav>

            <Nav className="me-auto">
              <Nav.Link >{currentUser?.name}</Nav.Link>
              <Nav.Link href="/" onClick={() => Cookies.set('JwtToken', "")}><RiLogoutCircleLine /></Nav.Link>
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
      <Outlet />
    </div>
  )
};
