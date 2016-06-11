import $ from 'jquery';
import React from 'react';
import ReactDom from 'react-dom';
import {Line as LineChart} from 'react-chartjs';
import {Radar as RadarChart} from 'react-chartjs';
import {Doughnut as DoughnutChart} from 'react-chartjs';
import {browserHistory} from 'react-router';
import BubbleChart from './BubbleChart.jsx';


export default class ChartComponent extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      d3Data: null
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
        console.log('------------');
        console.log('NEW sD_cV:', sessionData);
        console.log('------------');
        var concept = JSON.parse(sessionData[0].concept);

        // format data to be d3-friendly
        var d3Data = [];
        sessionData.forEach(function(conceptObj) {
          // grab data from object
          var concept = JSON.parse(conceptObj.concept);
          var topic = concept.label;      
          var score = conceptObj.score;

          // create wikipedia link
          var wikiEndpoint = concept.label.replace(/ /g, '_');
          var wikiURL = "https://en.wikipedia.org/wiki/" + wikiEndpoint;

          // push formated concept object 
          d3Data.push({"topic": topic, // NOTE: Need to concat double quotes?
                       "wikiURL": wikiURL,
                       "score": score
                      });
        }); // end forEach

        this.setState({
          d3Data: d3Data
        });

        console.log(d3Data);
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
          <BubbleChart data={this.D3data} />
        </div>
      </div>
    )
  }
}
