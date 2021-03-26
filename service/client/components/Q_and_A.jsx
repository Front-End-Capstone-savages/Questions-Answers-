import React, { Component } from "react";
import axios from "axios";
import token from "../config/config.js";
import moment from "moment";

export default class Q_and_A extends Component {
  constructor(props) {
    super(props);

    this.state = {
      quests_answers: [],
      displayed_quests: 2
    };
    this.compare = this.compare.bind(this);
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
    axios
      .get(
        `https://app-hrsei-api.herokuapp.com/api/fec2/hrnyc/qa/questions/?product_id=${11002}`,
        {
          headers: { Authorization: `${token}` },
        }
      )
      .then((res) => {
        this.setState({ quests_answers: res.data.results.sort(this.compare) });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  render() {
    const questions = this.state.quests_answers.filter((question, i) => i < this.state.displayed_quests);
    console.log(this.state)

    return (
      <div className="row">
        {questions.map((question) => (
          <article key={question.question_id}>
            <strong>Q: {question.question_body}</strong>
            <pre>
              <code>
                Helpful? <u onClick={() => console.log("click")}>Yes</u>(
                {question.question_helpfulness}) |{" "}
                <u onClick={() => console.log("click")}>Add Answer</u>
              </code>
            </pre>
            {Object.values(question.answers)
              .sort((a, b) => b.helpfulness - a.helpfulness)
              .filter((answers, i) => i < 2)
              .map((answer) => (
                <div key={answer.id}>
                  <p>
                    <strong>A:</strong> {answer.body}
                  </p>
                  <pre>
                    <code>
                      by {answer.answerer_name},
                      {moment(answer.date).format("LL")} | Helpful?{" "}
                      <u onClick={() => console.log("click")}>Yes</u>(
                      {answer.helpfulness}) |{" "}
                      <u onClick={() => console.log("click")}>Report</u>
                    </code>
                  </pre>
                </div>
              ))}
            <code>
              <strong onClick={() => console.log("+answers")}>
                LOAD MORE ANSWERS
              </strong>
            </code>
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
            <strong>LESS ANSWERED QUESTION</strong>
          </button>
        )}
      </div>
    );
  }
}
