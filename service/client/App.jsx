import React, { Component } from "react";
import Search from "./components/Search.jsx";

export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {}
    }

    
  render() {
    return (
      <div className="container">
        <div className="row">
            <h6>Questions & Answers</h6>
          <Search />
        </div>
      </div>
    );
  }
}
