import React from 'react';
import ReactDom from 'react-dom';
import { browserHistory } from 'react-router';
import RouteTransition from '../main-layout/RouteTransition.jsx';

export default class AllReports extends React.Component {

  handleConceptClick(e) {
    e.preventDefault();
    browserHistory.push('/allreports/'+ this.props.params.sessionId.toString()+'/concepts/');
  };

  handleTextClick(e) {
    e.preventDefault();
    browserHistory.push('/allreports/'+ this.props.params.sessionId.toString()+'/textAnalysis/');
  };

  handlePerformanceClick(e) {
    e.preventDefault();
    browserHistory.push('/allreports/'+ this.props.params.sessionId.toString()+'/reports/');
  };

  render() {
    return (
      <div>
        <span>
          <button style={{marginRight: '5px'}} className="pure-button pure-button-active" onClick={this.handleTextClick.bind(this)}>View Text Analysis</button>
          <button style={{marginRight: '5px'}} className="pure-button pure-button-active" onClick={this.handlePerformanceClick.bind(this)}>View Performance Analysis</button>
          <button style={{marginRight: '5px'}} className="pure-button pure-button-active" onClick={this.handleConceptClick.bind(this)}>View Concept Insights</button>
        </span>
        <RouteTransition pathname={this.props.location.pathname}>
          {this.props.children}
        </RouteTransition>
      </div>
    )
  }
}

