import React, { Component } from 'react'
import CircularProgress from 'material-ui/CircularProgress'

class LoadingProgress extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <center style={{marginTop: 30}}><CircularProgress /></center>
    )
  }
}

export default LoadingProgress