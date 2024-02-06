import { Outlet, useLocation } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

export const Management = () => {

const location=useLocation();

    return (
        <div className="scroll">

            <Navbar expand="lg" className="bg-body-tertiary" sticky="top">
                <Container>
                    <Nav variant="underline" activeKey={location.pathname} className="me-auto">
                        <Nav.Link href="/homePage/management/forumManagement">ניהול פורומים</Nav.Link>
                        <Nav.Link href="/homePage/management/userManagement">ניהול משתמשים</Nav.Link>
                        <Nav.Link href="/homePage/management/categoryManegment">ניהול קטגוריות</Nav.Link>
                        <Nav.Link href="/homePage/management/customerManagement">ניהול פרסומים</Nav.Link>
                    </Nav>
                    <Navbar.Collapse id="basic-navbar-nav">
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Outlet />
        </div>
    )
}
