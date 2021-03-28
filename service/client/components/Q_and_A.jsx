import React, { Component } from "react";
import axios from "axios";
import token from "../config/config.js";
import moment from "moment";

export default class Q_and_A extends Component {
  constructor(props) {
    super(props);

    this.state = {
      quests_answers: [],
      displayed_quests: 2,
      displayed_answers: 2,
      likeQuest: false,
      likeAnswers: false,
    };
    this.compare = this.compare.bind(this);
    this.updateQuestion_helpfulness = this.updateQuestion_helpfulness.bind(this);
  }

  compare(a, b) {
    //=> i use this function within the componentDidMount to sort the questions by question_helpfulness(reviews)
    if (a.question_helpfulness < b.question_helpfulness) {
      return 1;
    }
    if (a.question_helpfulness > b.question_helpfulness) {
      return -1;
    }
    return 0;
  }

  componentDidMount() {
    axios.get(`https://app-hrsei-api.herokuapp.com/api/fec2/hrnyc/qa/questions/?product_id=${11002}`,
        {headers: { Authorization: `${token}` },}
      ).then((res) => {
        this.setState({ quests_answers: res.data.results.sort(this.compare) });
      }).catch((error) => {
        console.error(error);});
  }

  updateQuestion_helpfulness(question_id, numHelpfulness, index) {
    if(!this.state.likeQuest){ 
    const array = this.state.quests_answers;
    array[index].question_helpfulness = numHelpfulness;
    axios.put(`https://app-hrsei-api.herokuapp.com/api/fec2/hrnyc/qa/questions/${question_id}/helpful`,numHelpfulness,
        {headers: { Authorization: `${token}` },}
      ).then((res) => {
        console.log("response", res),
          this.setState({ quests_answers: array,
                          likeQuest: true});
      }).catch((err) => console.log(err));
      
    }
  }

  

  render() {
    const questions = this.state.quests_answers.filter(
      (question, i) => i < this.state.displayed_quests & question.reported == false);
  
    return (
      <div>
        {questions.map((question, index) => (
          <article className="row" key={question.question_id}>
            <div className="col-8">
              <strong>Q: {question.question_body}</strong>
              {Object.values(question.answers)
                .sort((a, b) => b.helpfulness - a.helpfulness)
                .filter((answers, i) => i < this.state.displayed_answers)
                .map((answer) => (
                  <div className="answersBody" key={answer.id}>
                    <p className="answersP">
                      <strong>A:</strong><small> {answer.body}</small>
                    </p>
                    <pre>
                      <small>
                        by {answer.answerer_name},
                        {moment(answer.date).format("LL")} | <strong>Helpful?</strong>{" "}
                        <u type="button" onClick={() => console.log(answer.id)}><strong>Yes</strong></u>(
                        {answer.helpfulness}) |{" "}
                        <u type="button" onClick={() => console.log("Report")}><strong>Report</strong></u>
                      </small>
                    </pre>
                  </div>
                ))}
                <p className="more_answersB">
              <strong
                type="button"
                onClick={() =>
                  this.setState({
                    displayed_answers: this.state.displayed_answers + 2,
                  })
                }
              >
                LOAD MORE ANSWERS
              </strong>
              </p>
            </div>
            <div className="col-4 addAnswerForQuest">
              <pre>
                <small>
                  <strong>Helpful?</strong>{" "}
                  
                  <u type="button"
                    id={index}
                    onClick={() =>
                      this.updateQuestion_helpfulness(
                        question.question_id,
                        question.question_helpfulness + 1,
                        index
                      )
                    }
                  >
                    <strong>Yes</strong>
                  </u>
                  ({question.question_helpfulness}) |{" "}
                  <u type="button" onClick={() => console.log("click")}><strong>Add Answer</strong></u>
                </small>
              </pre>
            </div>
          </article>
        ))}
        {this.state.quests_answers.length - this.state.displayed_quests > 0 ? (
          <button
            className="all_Button"
            type="button"
            onClick={() =>
              this.setState({
                displayed_quests: this.state.displayed_quests + 2,
              })
            }
          >
            <strong>MORE ANSWERED QUESTION</strong>
          </button>
        ) : (
          <button
            className="all_Button"
            type="button"
            onClick={() =>
              this.setState({
                displayed_quests: 2,
              })
            }
          >
            <strong>LESS QUESTION</strong>
          </button>
        )}
        <button className="add_question_button" type="button" onClick={() =>console.log("ADD A QUESTION  +")}><strong>ADD A QUESTION  +</strong></button>
      </div>
    );
  }
}
