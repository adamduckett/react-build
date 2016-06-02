import React from 'react';

import HelloWorld from './components/helloworld';

class App extends React.Component{
  render () {
    return  (
      <div>
        <HelloWorld text={this.props.message} />
      </div>
    );
  }
}

export default App;
