import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import Icon from 'parts/Icon';

import Editor from 'editor/Editor';
import Messenger from 'parts/Messenger';

import RoomNotFound from 'pages/RoomNotFound';
import Loading from 'pages/Loading';

import * as Firebase from 'functions/firebase';

const avatarA = require('img/avatars/avatar-a.png');
const avatarB = require('img/avatars/avatar-b.png');
// const avatarC = require('img/avatars/avatar-c.png');
const avatarD = require('img/avatars/avatar-d.png');

export default class Home extends Component {
  static propTypes = {
    params: PropTypes.shape({
      roomName: PropTypes.string.isRequired,
    }),
  }

  constructor(props) {
    super(props);
    this.ref = Firebase.getFirebaseInstance();

    this.checkRoom();

    this.state = {
      loading: true,
      users: null,
      activeStudentIndex: -1,
    };
  }

  getInitials(nameString) {
    const firstLast = nameString.split(' ');
    let initials;
    if (firstLast.length === 1) {
      initials = firstLast[0][0];
    } else {
      initials = `${firstLast[0].charAt(0)}${firstLast[firstLast.length - 1].charAt(0)}`;
    }
    return initials;
  }

  getUsers(roomName) {
    this.ref.syncState(`rooms/${roomName}/users`, {
      context: this,
      state: 'users',
      asArray: true,
    });

    this.ref.fetch(`rooms/${roomName}/users`, {
      context: this,
      then: this.updateUsers,
    });
  }

  checkRoom() {
    const { roomName } = this.props.params;
    this.ref.fetch(`rooms/${roomName}`, {
      context: this,
      then: (room) => {
        if (room) {
          this.setState({ loading: false, roomExists: true });
          this.getUsers(roomName);
        } else {
          this.setState({ loading: false, roomExists: false });
        }
      },
    });
  }

  updateUsers = (data) => {
    this.setState({
      users: data,
    });
  }

  makeActive = (index) => {
    this.setState({
      activeStudentIndex: index,
    });
  }

  render() {
    const Sidebar = this.state.users == null ?
      <span className="loading" />
      :
      this.state.users.map((userObj, index) =>
        <li key={index} className={classNames('tab-item', 'tab-student', { active: index === this.state.activeStudentIndex })} >
          <button onClick={() => this.makeActive(index)} className="badge" data-badge="3">
            <figure className="avatar avatar-md" data-initial={this.getInitials(userObj.user.userName)} />
          </button>
        </li>
      );

    const { roomName } = this.props.params;
    const { loading, roomExists } = this.state;

    if (loading) {
      return (
        <Loading />
      );
    } else if (roomExists) {
      return (
        <div className="teach">
          <div className="sidebar">
            <ul className="tab tab-side">
              <li className="tab-item tab-teacher">
                <button onClick={() => this.makeActive(-1)}>
                  <figure className="avatar avatar-md">
                    <Icon name="group" />
                  </figure>
                </button>
              </li>
              {Sidebar}
            </ul>
          </div>
          <main className="view">
            <div className="container">
              <div className="columns">
                <div className="column col-12">
                  {this.state.activeStudentIndex === -1 ?
                    <Editor editorPath={`rooms/${roomName}/instructor/editorContent`} />
                  :
                    <Editor editorPath={`rooms/${roomName}/users/${this.state.users[this.state.activeStudentIndex].key}/editorContent`} />
                  }
                </div>
              </div>
            </div>
            <Messenger userId={'Instructor'} userName={'Instructor'} roomName={roomName} />
          </main>
        </div>
      );
    }
    return (
      <RoomNotFound roomName={roomName} fireRef={this.ref} />
    );
  }
}
