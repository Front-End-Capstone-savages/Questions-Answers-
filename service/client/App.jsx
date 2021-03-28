import React, { Component } from "react";
import Search from "./components/Search.jsx";
import Q_and_A from "./components/Q_and_A.jsx"
// import axios from "axios";
// import token from "./config/config.js"

export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {}
    }

    
  render() {
      
    return (
      <div className="text-muted Q_A_container">
          <Search />
          <Q_and_A />
      </div>
    );
  }
}
