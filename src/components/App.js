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
    }

    render(){
        return(
            <div style={{textAlign: "justify"}}>
                <Header/>
                {this.state.isLoggedIn ? <Content/> : <Login/>}
                <Footer/>
            </div>
        )
    }
}
export default App