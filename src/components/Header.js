import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Button from 'react-bootstrap/Button';
import NavDropdown from "react-bootstrap/NavDropdown";

class Header extends React.Component{
    constructor(props) {
        super(props);
        // Load theme from localStorage or default to 'light'
        this.state = {
          theme: localStorage.getItem('theme') || 'light'
        };
      }
      componentDidMount() {
        // Apply theme to entire application on initial mount
        document.documentElement.setAttribute('data-bs-theme', this.state.theme);
      }
      componentDidUpdate(prevProps, prevState) {
        // Update theme globally and save to localStorage when state changes
        if (prevState.theme !== this.state.theme) {
          document.documentElement.setAttribute('data-bs-theme', this.state.theme);
          localStorage.setItem('theme', this.state.theme);
        }
      }
    
      toggleTheme = () => {
        this.setState(prevState => ({
          theme: prevState.theme === 'light' ? 'dark' : 'light'
        }));
      }
    
    render(){
        return(
            <Navbar expand="lg">
                <Navbar.Brand href="#home">Dashboard</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="#home">Home</Nav.Link>
                        <Nav.Link href="#link">Link</Nav.Link>
                        <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                            <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <Nav>
                        <Button 
                            variant="outline-light" 
                            onClick={this.toggleTheme}
                            size="sm"
                        >
                            {this.state.theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
                        </Button>
                    </Nav>
                    <Form className="d-flex">
                        <FormControl type="text" placeholder="Search" className="me-2" />
                        <Button variant="outline-success">Search</Button>
                    </Form>
                </Navbar.Collapse>
            </Navbar>
        )
    }
}
export default Header