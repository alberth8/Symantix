import $ from 'jquery';
import React from 'react';
import ReactDom from 'react-dom';
import {browserHistory} from 'react-router';
import BubbleChart from './BubbleChart.jsx';

const styles = {
  graphContainer: {
    border: '1px solid black',
    padding: '15px'
  }
}

export default class ChartComponent extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      bubbleData: [{
        topic: 'abc',
        wikiURL: 'wikipedia',
        score: 10
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
      success: function(conceptData) {
        // console.log('NEW sD_cV:', conceptData);

        // format data to be d3-friendly
        var bubbleData = [];
        conceptData.forEach(function(conceptObj) {
          // grab data from object
          var concept = conceptObj.concept;
          var score = conceptObj.score;

          // create wikipedia link
          var wikiEndpoint = concept.replace(/ /g, '_');
          var wikiURL = 'https://en.wikipedia.org/wiki/' + wikiEndpoint;

          // push formated concept object
          bubbleData.push({
            'topic': concept,
            'wikiURL': wikiURL,
            'score': score
          });
        }); // end forEach

        this.setState({
          bubbleData: bubbleData
        });
      }.bind(this)
    })
  };

  render() {
    return (
      <div>
        <div className='chartview' style={styles.graphContainer}>
          <h3>Concept Insight</h3>
          <BubbleChart bubbleData={this.state.bubbleData} />
        </div>
      </div>
    )
  }
}
