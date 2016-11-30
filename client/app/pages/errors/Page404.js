import React, { Component } from 'react'
import SocialSentimentDissatisfied from 'material-ui/svg-icons/social/sentiment-dissatisfied';
import N18 from '../../constants/string'
import { grey400, grey500 } from 'material-ui/styles/colors'

const styles = {
  title: {
    fontSize: 80,
    color: grey500
  },

  subtitle: {
    fontSize: 24,
    color: grey400
  },

  face: {
    width: 200,
    height: 200,
    color: grey500 
  },

  top3: {
    height: 100
  }
}

class Page404 extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div style={styles.top3} />
        <center>
          <SocialSentimentDissatisfied style={styles.face} />
          <div style={styles.title}>404</div>
          <div style={styles.subtitle}>{N18.pageNotFound}</div>
        </center>
      </div>
    )
  }
}

export default Page404