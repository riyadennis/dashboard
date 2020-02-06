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
        if (!this.state.isLoggedIn){
            return(
                <div style={{textAlign: "justify"}}>
                    <Header/>
                    <Login/>
                    <Footer/>
                </div>
            )
        }
        return(
            <div style={{textAlign: "justify"}}>
                <Header/>
                <Content/>
                <Footer/>
            </div>
        )
    }
}
export default App