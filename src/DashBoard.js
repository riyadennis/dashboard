import React from "react";
import Container from "react-bootstrap/Container";
import Content from "./components/Content";
import Footer from "./components/Footer"
import Header from "./components/Header";
import Login from "./components/Login";
import Register from "./components/Register";
import AdminPage from "./components/admin/AdminPage";

class DashBoard extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn: localStorage.getItem('isLoggedIn') || false,
            isAdmin: false,
            message:"",
            token: "",
            showRegister: false,
            showAdmin: false,
        }
        this.handler = this.handler.bind(this)
        this.logout = this.logout.bind(this)
        this.showRegister = this.showRegister.bind(this)
        this.showLogin = this.showLogin.bind(this)
        this.handleRoleLoaded = this.handleRoleLoaded.bind(this)
        this.showAdminPage = this.showAdminPage.bind(this)
        this.showHome = this.showHome.bind(this)
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
            isAdmin: false,
            message: "",
            token: "",
            showRegister: false,
            showAdmin: false,
        })
    }
    showRegister() {
        this.setState({ showRegister: true });
    }
    showLogin() {
        this.setState({ showRegister: false });
    }
    handleRoleLoaded(role) {
        this.setState({
            isAdmin: (role || '').toUpperCase() === 'ADMIN',
        });
    }
    showAdminPage() {
        this.setState({ showAdmin: true });
    }
    showHome() {
        this.setState({ showAdmin: false });
    }
    render(){
        const { isLoggedIn, isAdmin, showRegister, showAdmin } = this.state;
        let authView;
        if (isLoggedIn) {
            if (showAdmin && isAdmin) {
                authView = <AdminPage />;
            } else {
                authView = <Content userData={this.state} onRoleLoaded={this.handleRoleLoaded}/>;
            }
        } else if (showRegister) {
            authView = <Register onLoginClick={this.showLogin} onRegistered={this.showLogin}/>;
        } else {
            authView = <Login handler={this.handler} onRegisterClick={this.showRegister}/>;
        }
        return(
            <Container className="p-3">
            <div style={{textAlign: "justify"}}>
            <Header
                isLoggedIn={this.state.isLoggedIn}
                isAdmin={isAdmin}
                logout={this.logout}
                onAdminClick={this.showAdminPage}
                onHomeClick={this.showHome}
            />
                {authView}
                <Footer/>
            </div>
            </Container>

        )
    }
}
export default DashBoard