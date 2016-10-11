import React, { Component, PropTypes } from 'react';
import { Button } from 'semantic-ui-react';

console.log(chrome);

export default class Root extends Component {
  state = {
    streming: false
  }

  createStream = () => {
    console.log(chrome);
    chrome.runtime.sendMessage({ type: 'createStream' }, (res) => {
      console.log(res);
    });
  }

  render() {
    return (
      <div>
        <Button onClick={this.createStream}>Create stream</Button>
      </div>
    );
  }
}
