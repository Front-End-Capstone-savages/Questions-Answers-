import React, { Component } from "react";
import axios from "axios";
import token from "../config/config.js";

export default class Q_and_A extends Component {
  constructor(props) {
    super(props);

    this.state = {
      quests_answers: [],
    };
    this.compare =this.compare.bind(this)
  }

  compare(a, b) { //=> i use this function within componentDidMount to sort the questions by question_helpfulness(reviews)
    if ( a.question_helpfulness < b.question_helpfulness ){
      return 1;
    }
    if ( a.question_helpfulness > b.question_helpfulness ){
      return -1;
    }
    return 0;
  }

  componentDidMount() {
    axios.get(`https://app-hrsei-api.herokuapp.com/api/fec2/hrnyc/qa/questions/?product_id=${11002}`, {
      headers: {'Authorization': `${token}` }
    }).then((res) => {
      this.setState({quests_answers: res.data.results.sort(this.compare)})
    }).catch((error) => {
      console.error(error)
    })
  }

  render() {
    // console.log(this.state)
    const questions = this.state.quests_answers.filter((question, i)=> { 
        var quest = question[0]
        for(var key in quest) {
         console.log(quest[key])
        }
    });
    // console.log(questions)

    return (
      <div className="container">
        <div className="row">
            {/* {questions.map(question =>
          <article key={question.question_id}>
            <h5>Q: {question.question_body}</h5>
            <p></p>
            <code></code>
          </article>
          )} */}
        </div>
      </div>
    );
  }
}
