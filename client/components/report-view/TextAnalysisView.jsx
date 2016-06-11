import $ from 'jquery';
import React from 'react';
import ReactDom from 'react-dom';
import {Line as LineChart} from 'react-chartjs';
import {Radar as RadarChart} from 'react-chartjs';
import {Doughnut as DoughnutChart} from 'react-chartjs';
import {Pie as PieChart} from 'react-chartjs';
import {browserHistory} from 'react-router';

var options = {  
  scaleOverlay : false,
  scaleOverride : false,
  scaleSteps : null,
  scaleStepWidth : null,
  scaleStartValue : null,
  scaleShowLine : true,
  scaleLineColor : "#999",  
  scaleLineWidth : 1,
  scaleShowLabels : false,
  scaleLabel : "<%=value%>",
  scaleFontFamily : "'Arial'",
  scaleFontSize : 12, 
  scaleFontStyle : "normal",
  scaleFontColor : "#666",
  scaleShowLabelBackdrop : true,
  scaleBackdropColor : "rgba(255,255,255,0.75)",
  scaleBackdropPaddingY : 2,  
  scaleBackdropPaddingX : 2,
  angleShowLineOut : true,
  angleLineColor : "rgba(255,255,255,0.3)",
  angleLineWidth : 1,     
  pointLabelFontFamily : "'Arial'",
  pointLabelFontStyle : "normal",
  pointLabelFontSize : 12,
  pointLabelFontColor : "#EFEFEF",
  pointDot : true,
  pointDotRadius : 3,
  pointDotStrokeWidth : 1,
  datasetStroke : true,
  datasetStrokeWidth : 1,
  datasetFill : true,
  animation : true,
  animationSteps : 60,
  animationEasing : "easeOutQuart",
  onAnimationComplete : null
}

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
      emotion: { // DONUT
        labels: ['sadness', 'anger', 'fear', 'happiness', 'disgust'], // this.state.emotion.labels[i]
        datasets: [
          {
            data: [], // this.state.emotion.datasets[0].data[i]
            backgroundColor: [
              "#FF6384", // this.state.emotion.datasets[0].backgroundColor[0]
              "#36A2EB",
              "#FFCE56",
              "#cc0000",
              "#1F8261"
            ],
            hoverBackgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56",
              "#FF6384",
              "#36A2EB"
            ]
          }
        ]
      },
      language: { // Pie
        labels: ['analytical', 'confident', 'tentative'],
        datasets: [
          {
            cutoutPercentage: '50',
            data: [],
            backgroundColor: [
              "#F7464A", // this.state.emotion.datasets[0].backgroundColor[0]
              "#46BFBD",
              "#FDB45C"
            ],
            hoverBackgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56",
            ]

          }
        ]
      },
      social: { // RADAR
        labels: ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'Emotional Range', 'Dummy'],
        datasets: [
          {
            label: 'Social Tendencies',
            backgroundColor: 'rgba(179,181,198,0.2)',
            borderColor: 'rgba(179,181,198,1)',
            pointBackgroundColor: 'rgba(179,181,198,1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(179,181,198,1)',
            data: []
          }
        ]
      },
      emoData: [],
      langData: [],
      socData: []
    }
  }

  componentDidMount () {
    $.ajax({
      type: 'GET',
      url: '/api/text',
      data: { sessionId: this.props.params.sessionId },
      error: function(request, status, error) {
        console.error('error while fetching report data', error);
      },
      success: function(sessionData) {
        console.log('sD', sessionData);

        // clones of state
        var emotionClone = Object.assign({}, this.state.emotion);
        var languageClone = Object.assign({}, this.state.language);
        var socialClone = Object.assign({}, this.state.social);        

        // clones of labels
        var emotionLabelsClone = this.state.emotion.labels.slice();
        var languageLabelsClone = this.state.language.labels.slice();
        var socialLabelsClone = this.state.social.labels.slice();        

        // following 3 blocks could be abstracted
        // writing data in preparation to be saved as state
        for (var i = 0; i < this.state.emotion.labels.length; i++) {
          var feature = emotionLabelsClone[i];
          emotionClone.datasets[0]['data'].push(sessionData[0][feature]);
        }

        for (var i = 0; i < this.state.language.labels.length; i++) {
          var feature = languageLabelsClone[i];
          languageClone.datasets[0]['data'].push(sessionData[0][feature]);
        }

        for (var i = 0; i < this.state.social.labels.length; i++) {
          var feature = socialLabelsClone[i]
          socialClone.datasets[0]['data'].push(sessionData[0][feature])
        }

        // setting state to new 
        // radar chart's data is handled differently, so I've
        // separated it out here
        this.setState({social: socialClone});

        var emotionData=[];
        var languageData = [];

        // populating emotion data for the chart
        for (var i = 0; i < this.state.emotion.labels.length; i++) {
          var dataPoint = {
            color: this.state.emotion.datasets[0].backgroundColor[i],
            label: this.state.emotion.labels[i],
            value: this.state.emotion.datasets[0].data[i]
          }
          emotionData.push(dataPoint);
        }

        // populating language data for the chart
        for (var i = 0; i < this.state.language.labels.length; i++) {
          var dataPoint = {
            color: this.state.language.datasets[0].backgroundColor[i],
            label: this.state.language.labels[i],
            value: this.state.language.datasets[0].data[i]
          }
          languageData.push(dataPoint);
        }

        // setting data for emotion and language analysis
        this.setState({
          emoData: emotionData,
          langData: languageData
        })
      }.bind(this)
    })
  };
  
  render() {
    return (
      <div>
        <div className='chartview' style={styles.graphContainer}>
          <h3>Emotional Analysis</h3>
          <DoughnutChart 
            data={this.state.emoData}
            redraw
            options={options}
            generateLegend
            width="600" height="250"/>
        </div>
        <div className='chartview' style={styles.graphContainer}>
          <h3>Language Style</h3>
          <PieChart
            data={this.state.langData} 
            redraw options={options}
            width="600" height="250"/>
        </div>

        <div className='chartview' style={styles.graphContainer}>
          <h3>Social Tendencies</h3>
          <RadarChart data={this.state.social} 
            redraw options={options}
            width="600" height="250"/>
        </div>
      </div>
    )
  }
}

// {
        // <div style={styles.graphContainer}>
        //   <h3>Social Tendencies</h3>
        //   <RadarChart data={this.state.social} 
        //          redraw options={options}
        //          width="600" height="250"/>
        // </div>
// }
