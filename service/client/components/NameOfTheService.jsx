import React from 'react';

export default class NameOfTheService extends React.Component {
  constructor() {
    super();

    this.state = {};
  }

  componentDidMount() {
    console.log('service mounted')
  }

  render() {
    return (
      <div>
        <h1>Hello Service 1</h1>
      </div>
    );
  }
}