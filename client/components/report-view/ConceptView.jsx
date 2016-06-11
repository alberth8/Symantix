import $ from 'jquery';
import React from 'react';
import ReactDom from 'react-dom';
import {browserHistory} from 'react-router';
import BubbleChart from './BubbleChart.jsx';


export default class ChartComponent extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      bubbleData: [{
        topic: "Who cares",
        wikiURL: "emptystring",
        score: 100
      }]
    }
  }

  componentDidMount () {
    $.ajax({
      type: 'GET',
      url: '/api/concept',
      data: { sessionId: this.props.params.sessionId },
      error: function(request, status, error) {
        console.error('error while fetching report data', error);
      },
      success: function(sessionData) {
        // console.log('------------');
        // console.log('NEW sD_cV:', sessionData);
        // console.log('------------');
        var concept = JSON.parse(sessionData[0].concept);

        // format data to be d3-friendly
        var bubbleData = [];
        sessionData.forEach(function(conceptObj) {
          // grab data from object
          var concept = JSON.parse(conceptObj.concept);
          var topic = concept.label;      
          var score = conceptObj.score;

          // create wikipedia link
          var wikiEndpoint = concept.label.replace(/ /g, '_');
          var wikiURL = "https://en.wikipedia.org/wiki/" + wikiEndpoint;

          // push formated concept object 
          bubbleData.push({"topic": topic, // NOTE: Need to concat double quotes?
                       "wikiURL": wikiURL,
                       "score": score
                      });
        }); // end forEach

        this.setState({
          bubbleData: bubbleData
        });

        // console.log("DID THE DATA SET?", bubbleData);
      }.bind(this)
    })
  };

  handleConceptClick(e) {
    e.preventDefault();
    browserHistory.push('/concepts/' + this.props.params.sessionId.toString());
  };

  handleTextClick(e) {
    e.preventDefault();
    browserHistory.push('/textAnalysis/' + this.props.params.sessionId.toString());
  };

  handlePerformanceClick(e) {
    e.preventDefault();
    browserHistory.push('/reports/' + this.props.params.sessionId.toString());
  };
  render() {
    return (
      <div>
        <span>
          <button style={{marginRight: '5px'}} className="pure-button pure-button-active" onClick={this.handleTextClick.bind(this)}>View Text Analysis</button>
          <button style={{marginRight: '5px'}} className="pure-button pure-button-active" onClick={this.handlePerformanceClick.bind(this)}>View Performance Analysis</button>
          <button style={{marginRight: '5px'}} className="pure-button pure-button-active" onClick={this.handleConceptClick.bind(this)}>View Concept Insights</button>
        </span>
        <div className='chartview'>
          <h3>Concept Insight</h3>
          <BubbleChart bubbleData={this.state.bubbleData} />
        </div>
      </div>
    )
  }
}
