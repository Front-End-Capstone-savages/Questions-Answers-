import React, { Component } from "react";
import axios from "axios";
import token from "../config/config.js"

export default class Search extends Component {
  constructor(props) {
    super(props);

    this.state = {
      quests_answers: [],
      value: ""
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
    console.log("imput", this.state.value)  

    return (
      <div className="row">
        <h6 className="text-muted">Questions & Answers</h6>
        <input type="text" placeholder="Have a question? Search for answers"
          title="Type in a name" onChange={(e) => {this.setState({ value: e.target.value.toLocaleLowerCase() });}}/>
          <div className="searchDiv">
        {this.state.value.length >= 3 ? (
          <ul>
            {this.state.quests_answers.filter((questions) =>
                questions.question_body.toLowerCase().includes(this.state.value)
              ).map((question) => (
                <div key={question.question_id} className="hover-li">
                  <a>{question.question_body}</a>
                </div>
              ))}
          </ul>
        ) : (
          ""
        )}
        </div>
      </div>
    );
  }
}
