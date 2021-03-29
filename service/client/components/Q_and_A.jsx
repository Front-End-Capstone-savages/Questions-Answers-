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
      likeQuest: [],
      likeAnswers: [],
    };
    this.updateQuestion_helpfulness = this.updateQuestion_helpfulness.bind(this);
    this.updateAnswer_helpful = this.updateAnswer_helpful.bind(this);
  }

  componentDidMount() {
    axios.get(`https://app-hrsei-api.herokuapp.com/api/fec2/hrnyc/qa/questions/?product_id=${11002}`,
        {headers: { Authorization: `${token}` },}
      ).then((res) => {
        var data = res.data.results;
        this.setState({ quests_answers: data.sort((a, b)=> b.question_helpfulness - a.question_helpfulness) });
      }).catch((error) => {
        console.error(error);});
  }

  updateQuestion_helpfulness(question_id, like_Q, index) {
    if(!this.state.likeQuest[index]){ 
    const array_Q = this.state.quests_answers;
    array_Q[index].question_helpfulness = like_Q;
    this.state.likeQuest[index] = true;
    axios.put(`https://app-hrsei-api.herokuapp.com/api/fec2/hrnyc/qa/questions/${question_id}/helpful`,like_Q,
        {headers: { Authorization: `${token}` },}
      ).then((res) => {
        console.log("question like + 1", res);
          this.setState({ quests_answers: array_Q,});
      }).catch((err) => console.log(err));
    }
  }

  updateAnswer_helpful(answer_id, like_A, index_Q) {
    if(!this.state.likeAnswers[answer_id]){
      const array_A = this.state.quests_answers;
      array_A[index_Q].answers[answer_id].helpfulness = like_A;
      this.state.likeAnswers[answer_id] = true;
      console.log(like_A, answer_id);
      axios.put(`https://app-hrsei-api.herokuapp.com/api/fec2/hrnyc/qa/answers/${answer_id}/helpful`,like_A,
      {headers: { Authorization: `${token}` },})
      .then((res) => {
        console.log("answer like + 1", res);
        this.setState({quests_answers: array_A})
      }).catch((err) => console.log(err));
    }
  }


  render() {
    const questions = this.state.quests_answers.filter(
      (question, i) => i < this.state.displayed_quests & question.reported == false);
      console.log(this.state.quests_answers)
      
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
                    {answer.photos.map((photo, i)=>
                    <div className="dispalyPicture_A" key={i}>
                    <img src={photo}/>
                    </div>
                    )}
                    <pre>
                      <small>
                        by {answer.answerer_name},
                        {moment(answer.date).format("LL")} | <strong>Helpful?</strong>{" "}
                        <u type="button" onClick={() => this.updateAnswer_helpful(answer.id, answer.helpfulness+1, index, )}>
                          <strong>Yes</strong></u>(
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
