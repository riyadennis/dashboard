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
            isLoggedIn: false,
            message:"",
            token: "",
        }
        this.handler = this.handler.bind(this)
    }
    handler(data) {
        this.setState({
            isLoggedIn: true,
            message:data.message,
            token: data.token,
        })
    }
    render(){
        return(
            <div style={{textAlign: "justify"}}>
                <Header/>
                {this.state.isLoggedIn ? <Content userData = {this.state} /> : <Login handler = {this.handler}/>}
                <Footer/>
            </div>
        )
    }
}
export default DashBoard