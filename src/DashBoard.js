import React from "react";
import Container from "react-bootstrap/Container";
import Content from "./components/Content";
import Footer from "./components/Footer"
import Header from "./components/Header";
import Login from "./components/Login";
import Register from "./components/Register";

class DashBoard extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn: localStorage.getItem('isLoggedIn') || false,
            message:"",
            token: "",
            showRegister: false,
        }
        this.handler = this.handler.bind(this)
        this.logout = this.logout.bind(this)
        this.showRegister = this.showRegister.bind(this)
        this.showLogin = this.showLogin.bind(this)
    }
    handler(data) {
        this.setState({
            isLoggedIn: true,
            message:data.message,
            token: data.token,
        })
    }
    logout() {
        // Clear localStorage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userID');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userName');
        // Reset state
        this.setState({
            isLoggedIn: false,
            message: "",
            token: "",
            showRegister: false,
        })
    }
    showRegister() {
        this.setState({ showRegister: true });
    }
    showLogin() {
        this.setState({ showRegister: false });
    }
    render(){
        const { isLoggedIn, showRegister } = this.state;
        let authView;
        if (isLoggedIn) {
            authView = <Content userData={this.state}/>;
        } else if (showRegister) {
            authView = <Register onLoginClick={this.showLogin} onRegistered={this.showLogin}/>;
        } else {
            authView = <Login handler={this.handler} onRegisterClick={this.showRegister}/>;
        }
        return(
            <Container className="p-3">
            <div style={{textAlign: "justify"}}>
            <Header isLoggedIn={this.state.isLoggedIn} logout={this.logout}/>
                {authView}
                <Footer/>
            </div>
            </Container>

        )
    }
}
export default DashBoard