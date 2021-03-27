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
    const array = this.state.quests_answers;
    array[index].question_helpfulness = numHelpfulness;
    axios.put(`https://app-hrsei-api.herokuapp.com/api/fec2/hrnyc/qa/questions/${question_id}/helpful`,numHelpfulness,
        {headers: { Authorization: `${token}` },}
      ).then((res) => {
        console.log("response", res),
          this.setState({ quests_answers: array }, () =>
            console.log(this.state.quests_answers));
      }).catch((err) => console.log(err));
  }

  render() {
    const questions = this.state.quests_answers.filter(
      (question, i) => i < this.state.displayed_quests
    );
    console.log(this.state);

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
                  <div key={answer.id}>
                    <p>
                      <strong>A:</strong> {answer.body}
                    </p>
                    <pre className="text-muted">
                      <small>
                        by {answer.answerer_name},
                        {moment(answer.date).format("LL")} | Helpful?{" "}
                        <u onClick={() => console.log(answer.id)}>Yes</u>(
                        {answer.helpfulness}) |{" "}
                        <u onClick={() => console.log("click")}>Report</u>
                      </small>
                    </pre>
                  </div>
                ))}
              <strong
                className="strongstr"
                onClick={() =>
                  this.setState({
                    displayed_answers: this.state.displayed_answers + 2,
                  })
                }
              >
                LOAD MORE ANSWERS
              </strong>
            </div>
            <div className="col-4 addAnswerForQuest">
              <pre className="text-muted">
                <small>
                  Helpful?{" "}
                  <u
                    id={index}
                    onClick={() =>
                      this.updateQuestion_helpfulness(
                        question.question_id,
                        question.question_helpfulness + 1,
                        index
                      )
                    }
                  >
                    Yes
                  </u>
                  ({question.question_helpfulness}) |{" "}
                  <u onClick={() => console.log("click")}>Add Answer</u>
                </small>
              </pre>
            </div>
          </article>
        ))}
        {this.state.quests_answers.length - this.state.displayed_quests > 0 ? (
          <button
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
      </div>
    );
  }
}
