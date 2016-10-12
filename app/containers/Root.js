import React, { Component, PropTypes } from 'react';
import { Button, Input } from 'semantic-ui-react';

export default class Root extends Component {
  state = {
    streming: false
  }

  createStream = () => {
    chrome.runtime.sendMessage({ type: 'createStream' }, (res) => {
      console.log(res);
    });
  }

  listenStream = () => {
    chrome.runtime.sendMessage({ type: 'listenStream', id: this.input.value }, (res) => {
      console.log(res);
    });
  }

  render() {
    return (
      <div>
        <Button type='button' onClick={this.createStream}>Create stream</Button>
        <input placeholder='awfRoom id' ref={r => this.input = r} />
        <Button onClick={this.listenStream}>Listen</Button>
      </div>
    );
  }
}
