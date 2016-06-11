import React from 'react';
import BubbleChart from './BubbleClass.js'

export default class ChartComponent extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      Bubble: new BubbleChart(this.props.data) // ??? 
    }
  }
  
  // Invoked after initial render; DOM or state updates occur here
  componentDidMount() {     
    var elem = ReactDOM.findDOMNode(this);
    this.state.Bubble.blow(elem); // no options parameter given
    this.state.Bubble.update(elem);
  }

  // Called just after rendering; operate on DOM here
  componentDidUpdate() {
    var elem = ReactDOM.findDOMNode(this);
    this.state.Bubble.update(elem); // need second parameter for state?
  }

  // Called before removed from DOM; clean up operations occur here
  // TODO: How to destroy?
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