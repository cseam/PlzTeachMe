import React, { Component, PropTypes } from 'react';
import Editor from '../Editor';

export default class ExampleComponent extends Component {
  static propTypes = {
    children: PropTypes.element,
  };

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div>
        <Editor />
      </div>
    );
  }
}
