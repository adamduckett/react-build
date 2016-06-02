import React from 'react';

class HelloWorld extends React.Component{
  render () {
    return (
      <p>{this.props.text}</p>
    );
  }
}

export default HelloWorld;
