import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

import Content from "./Content";
import Footer from "./Footer"
import Header from "./Header";
import Login from "./Login";

class App extends React.Component{
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
export default App