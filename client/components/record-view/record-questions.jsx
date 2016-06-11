import React from 'react';
import ReactDom from 'react-dom';

var style = {

  'width': '100%',
  'height': '100%',
  'background': '#5F777E',
  'line-height':  '35px',
  'border':  'black',
  'margin-bottom': '20px',
  'box-shadow': '3px 3px 6px rgba(0,0,0,.5) inset', 
  '-webkit-box-shadow': '3px 3px 6px rgba(0,0,0,.5) inset', 
  'color': '#fff', 
  'padding': '0 10px', 
  'font-size': '1em', 
  '-webkit-box-sizing': 'border-box',  
  '-moz-box-sizing': 'border-box', 
  'box-sizing': 'border-box',
  'transition': 'all .2s', 
  '-webkit-transition': 'all .2s',
  'line-height':'1.308em',
  'padding': '10px',
  'min-height':'350px',
  'margin-left': '10px',
  'margin-right': '10px'
}


export default class RecordQuestions extends React.Component {
  constructor(props){
    super(props)
  }

  render(){
    console.log('in the textarea render', this.props);

    return (
    	<div className="record-questions pure-u-1-1">
    		<h1 className='whitetext's>Speak</h1>
         <div className="button-bar">
           <form id="form" onSubmit={(e) => this.props.clicked(e)}>
            <button type="submit" className="stop-button pure-button pure-button-error">Stop</button>
    		    <textarea style={style} rows="4" cols="20" value={this.props.speech} form="form" id="textarea" />
          </form>
        </div>
    	</div>
  )}
}
