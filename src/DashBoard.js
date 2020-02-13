import React from "react";
import './bootstrap.min.css';

import Content from "./components/Content";
import Footer from "./components/Footer"
import Header from "./components/Header";
import Login from "./components/Login";

class DashBoard extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn: false
        }
        this.handler = this.handler.bind(this)
    }
    handler() {
        this.setState({
            isLoggedIn: true
        })
    }
    render(){
        return(
            <div style={{textAlign: "justify"}}>
                <Header/>
                {this.state.isLoggedIn ? <Content/> : <Login handler = {this.handler}/>}
                <Footer/>
            </div>
        )
    }
}
export default DashBoard