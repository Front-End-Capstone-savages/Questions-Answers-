import React, { Component } from "react";
import axios from "axios";
import token from "../config/config.js"

export default class Search extends Component {
  constructor(props) {
    super(props);

    this.state = {
      quests_answers: [],
      search: ""
    };
    
  }

  componentDidMount() {
    axios.get(`https://app-hrsei-api.herokuapp.com/api/fec2/hrnyc/qa/questions/?product_id=${11002}`, {
      headers: {
        'Authorization': `${token}` }
    }).then((res) => {
      this.setState({quests_answers: res.data.results})
    }).catch((error) => {
      console.error(error)
    })
  }
  
  render() {
    // console.log("state", this.state)  

    return (
      <div className="container">
        <div className="row">
          <div id="custom-search-input">
            <div className="input-group col-md-12">
              <input
                type="text"
                className="  search-query form-control"
                placeholder="Have a question? Search for answers..."
                onChange={(e)=>{this.setState({search: e.target.value})}}/>
              <span className="input-group-btn">
                <button className="btn btn-danger btn-search" type="button">
                  <i className="bi bi-search">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-search"
                      viewBox="0 0 16 16" >
                      <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                    </svg>
                  </i>
                </button>
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
