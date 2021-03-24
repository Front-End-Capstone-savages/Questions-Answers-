import React, { Component } from "react";
import Search from "./components/Search.jsx";
import axios from "axios";
import token from "./config/config.js"

export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
          questions: []
        }
    }

    componentDidMount() {
      axios.get(`https://app-hrsei-api.herokuapp.com/api/fec2/hrnyc/qa/questions/?product_id=${11002}`, {
        headers: {
          'Authorization': `${token}`
        }
      })
      .then((res) => {
        this.setState({questions: res.data.results})
      })
      .catch((error) => {
        console.error(error)
      })
    }
    
  render() {
    console.log(this.state.questions)
    return (
      <div className="container">
        <div className="row">
            <h6>Questions & Answers</h6>
          <Search quest={this.state}/>
        </div>
      </div>
    );
  }
}
