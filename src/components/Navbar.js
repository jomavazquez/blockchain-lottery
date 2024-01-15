import React from "react";
import { Navbar, Nav, Button, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

const Navigation = ({ account }) => {
    return (
        <Navbar expand="lg" bg="dark" variant="dark">
            <Container>
                <Navbar.Brand href="/">DApp</Navbar.Brand>
                <Navbar.Toggle aria-controls="navbar navbar-dark bg-primary" />
                <Navbar.Collapse id="navbar navbar-dark bg-primary">
                    <Nav className="me-auto">
                        <Nav.Link as={ Link } to="/">Tokens</Nav.Link>
                        <Nav.Link as={ Link } to="/lottery">Tickets</Nav.Link>
                        <Nav.Link as={ Link } to="/winner">Winner</Nav.Link>
                    </Nav>
                    <Nav>
                        <Nav.Link
                            href={`https://etherscan.io/address/${account}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="button nav-button btn-sm mx-4">
                            <Button variant="outline-light">
                                { account.slice(0, 7) + '...' + account.slice(35, 42) }
                            </Button>
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )

}

export default Navigation;