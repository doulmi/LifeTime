import React, { Component } from 'react'

import { CircularProgress, RaisedButton, IconButton, List, ListItem, Avatar } from 'material-ui'
import Stop from 'material-ui/svg-icons/av/stop'
import SocialSentimentDissatisfied from 'material-ui/svg-icons/social/sentiment-dissatisfied'
import SocialSentimentNeutral from 'material-ui/svg-icons/social/sentiment-neutral'
import SocialSentimentSatisfied from 'material-ui/svg-icons/social/sentiment-satisfied'
import SocialSentimentVeryDissatisfied from 'material-ui/svg-icons/social/sentiment-very-dissatisfied'
import SocialSentimentVerySatisfied from 'material-ui/svg-icons/social/sentiment-very-satisfied'
import SocialWhatshot from 'material-ui/svg-icons/social/whatshot'
import Delete from 'material-ui/svg-icons/action/delete'
import LoadingProgress from './LoadingProgress'
import { grey800, deepPurple500, lightBlue500, blue500, lightGreen400, red500, grey900, brown900, deepOrange900 } from 'material-ui/styles/colors'

import Timer from '../utils/timer'
import N18 from '../constants/string'

const styles = {
  mood: {
    width: 30,
    height: 37
  },

  container: {
    padding: "0 30px 30px 30px",
  },

  footer: {
    padding: "0 30px 30px 30px",
    textAlign: 'center'
  },

  noMore: {
    color: grey800
  },

  date: {
    float: 'right'
  }
}

class MoodList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 1,
      isLoading: false,
      openDialog: false
    }

    this.loadMoods = this.loadMoods.bind(this);

    if (this.props.moods.moods.length == 0) {
      this.props.loadMoods(0);
    }
  }

  loadMoods() {
    this.props.loadMoods(this.state.page);
    this.setState({
      page: this.state.page + 1
    })
  }

  render() {
    const getMoodDiv = (slug, color) => {
      switch (slug) {
        case 'verySatisfied': return <SocialSentimentVerySatisfied color={color} style={styles.mood} />
        case 'satisfied': return <SocialSentimentSatisfied color={color} style={styles.mood} />;
        case 'neutral': return <SocialSentimentNeutral color={color} style={styles.mood} />;
        case 'dissatisfied': return <SocialSentimentDissatisfied color={color} style={styles.mood} />;
        case 'veryDissatisfied': return <SocialSentimentVeryDissatisfied color={color} style={styles.mood} />
        case 'angry': return <SocialWhatshot color={color} style={styles.mood} />;
      }
    }

    const getRow = (mood) => {
      return (
        <ListItem
          key={mood._id}
          rightIcon={<Delete onClick={() => this.props.deleteMood(mood)} />}
          primaryText={mood.text}
          secondaryText={mood.createdAt.substr(0, 10)}
          leftAvatar={getMoodDiv(mood.slug, mood.color)} >
        </ListItem>
      )
    }


    let progress = (<CircularProgress />);
    let loadMoreBtn = (
      this.props.moods.noMore ?
        <span style={styles.noMore}>{N18.noMore}</span> :
        <RaisedButton label={N18.loadMore} fullWidth={true} onClick={this.loadMoods} />
    )

    let moodsList = (
      <div>
        <List className="box">
          {
            this.props.moods.moods.length == 0 ?
              N18.noMoodAdd :
              this.props.moods.moods.map(mood => getRow(mood))
          }
        </List>
        <center style={styles.footer}>{this.props.moods.isLoading ? progress : loadMoreBtn}</center>
      </div>
    );
    return (
      <div>
        {this.state.isLoading ? progress : moodsList}
      </div>
    )
  }
}

MoodList.propTypes = {
  moods: React.PropTypes.object.isRequired,
  loadMoods: React.PropTypes.func.isRequired,
  deleteMood: React.PropTypes.func.isRequired,
}

export default MoodList