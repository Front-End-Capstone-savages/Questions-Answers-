import React, { Component } from "react";
import axios from "axios";
import token from "../config/config.js";
import moment from 'moment';

export default class Q_and_A extends Component {
  constructor(props) {
    super(props);

    this.state = {
      quests_answers: [],
      
    };
    this.compare =this.compare.bind(this)
  }

  compare(a, b) { //=> i use this function within the componentDidMount to sort the questions by question_helpfulness(reviews)
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
      headers: {'Authorization': `${token}`}
    }).then((res) => {
      this.setState({quests_answers: res.data.results.sort(this.compare)})
    }).catch((error) => {
      console.error(error)
    })
  }

  render() {
    
    const questions = this.state.quests_answers.filter((question, i)=> i < 2);

    return (
      <div className="container">
        <div className="row">
            {questions.map(question =>
          <article key={question.question_id}>
            <strong>Q: {question.question_body}</strong>
            {/* {question.answers.map()} */}
            {Object.values(question.answers).sort((a, b) => b.helpfulness - a.helpfulness).filter((answers, i)=> i < 2).map(answer =>
            <div key={answer.id}>
            <p><strong>A:</strong> {answer.body}</p>
            {/* <code>by {answer.answerer_name}</code>, <code>{answer.date}</code> */}
            <pre>by {answer.answerer_name}, {moment(answer.date).format('LL')}  |  Helpful? Yes ({answer.helpfulness})  |  Report</pre>
            </div>)}
          </article>
          )}
          {}
        </div>
      </div>
    );
  }
}
