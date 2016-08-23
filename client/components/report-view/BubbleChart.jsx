import React from 'react';
import ReactDOM from 'react-dom'
import BubbleClass from './BubbleClass.js'

export default class ChartComponent extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      Bubble: new BubbleClass() // ??? 
    }
  }
  
  // Invoked after initial render; DOM or state updates occur here
  componentDidMount() {     
    // console.log('this.state.Bubble', this.state.Bubble);
    var elem = ReactDOM.findDOMNode(this);
    this.state.Bubble.blow(elem); // no options parameter given
  }

  // Called just after rendering; operate on DOM here
  componentDidUpdate() {
    console.log('INBUBBLECLASS:', this.props.bubbleData); 
    // var elem = ReactDOM.findDOMNode(this);
    this.state.Bubble.update(this.props.bubbleData);
  }

  // Called before removed from DOM; clean up operations occur here
  componentWillUnmount() {
    var elem = ReactDOM.findDOMNode(this);
    // this.state.Bubble.pop(elem);
  }

  render() {
    return (
      <div id="Bubbles">
      </div>
    )
  }
}