import React, { Component, PropTypes } from 'react';
import * as Firebase from 'functions/firebase';

// import Icon from 'parts/Icon';

import Editor from 'components/editor/Editor';

import Messenger from 'parts/Messenger';

export default class StudentView extends Component {
  static propTypes = {
    roomName: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props);
    const { roomName, userId } = this.props;

    this.ref = Firebase.getFirebaseInstance();

    this.ref.syncState(`rooms/${roomName}/users/${userId}/user`, {
      context: this,
      state: 'user',
    });

    this.state = {
      user: {
        userName: '',
      },
    };
  }

  changeName = (e) => {
    this.setState({ user: { userName: e.target.value } });
  }

  render() {
    const { roomName, userId } = this.props;
    const { userName } = this.state.user;

    return (
      <div className="container">
        <div className="columns">
          <div className="column col-12">
            <input value={userName} type="text" placeholder="username" onChange={this.changeName} />
          </div>
        </div>
        <div className="columns">
          <div className="column col-12">
            <Editor editorPath={`rooms/${roomName}/users/${userId}/editorContent`} />
          </div>
          <Messenger userId={userId} userName={userName} roomName={roomName} />
        </div>
      </div>
    );
  }
}
