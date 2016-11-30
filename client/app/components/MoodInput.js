import React, { Component } from 'react'

//ui
import { RaisedButton, Avatar, IconButton, Chip, TextField } from 'material-ui'
import SocialSentimentDissatisfied from 'material-ui/svg-icons/social/sentiment-dissatisfied'
import SocialSentimentNeutral from 'material-ui/svg-icons/social/sentiment-neutral'
import SocialSentimentSatisfied from 'material-ui/svg-icons/social/sentiment-satisfied'
import SocialSentimentVeryDissatisfied from 'material-ui/svg-icons/social/sentiment-very-dissatisfied'
import SocialSentimentVerySatisfied from 'material-ui/svg-icons/social/sentiment-very-satisfied'
import SocialWhatshot from 'material-ui/svg-icons/social/whatshot'
import { deepPurple500, lightBlue500, blue500, lightGreen400, red500, grey900, brown900, deepOrange900 } from 'material-ui/styles/colors'

import N18 from '../constants/string'
import { moodTextIsRequired } from '../utils/validators'
import { validMoodData } from '../utils/validators'

const styles = {
  container: {
    textAlign: 'center',
    padding: 30
  },
  largeIcon: {
    width: 40,
    height: 40,
  },
  large: {
    width: 80,
    height: 80,
    padding: 20,
  },
  title: {
    fontSize: 25,
    paddingTop: 30
  }
}


class MoodInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      slug: 'verySatisfied',
      text: '',
      errors: {},
      color: deepPurple500
    }

    this.changeMood = this.changeMood.bind(this);
    this.onChange = this.onChange.bind(this);
    this.createMood = this.createMood.bind(this);
  }

  changeMood(mood, color) {
    this.setState({
      slug: mood,
      color: color
    })
  }

  createMood() {
    let {errors, isValid} = validMoodData(this.state);
    if (isValid) {
      this.props.addMood(this.state);
      this.state = {
        slug: 'verySatisfied',
        text: '',
        errors: {},
        color: deepPurple500
      }
    } else {
      this.setState({ errors })
    }
  }

  onChange(e) {
    this.setState({
      text: e.target.value
    })
  }

  render() {
    return (
      <div styles={styles.container}>
        <center>
          <div style={styles.title}>{N18.yourMood}</div>
          <IconButton iconStyle={styles.largeIcon} style={styles.large} onTouchTap={() => this.changeMood('verySatisfied', deepPurple500)}><SocialSentimentVerySatisfied color={deepPurple500} /></IconButton>
          <IconButton iconStyle={styles.largeIcon} style={styles.large} onTouchTap={() => this.changeMood('satisfied', blue500)} ><SocialSentimentSatisfied color={blue500} /></IconButton>
          <IconButton iconStyle={styles.largeIcon} style={styles.large} onTouchTap={() => this.changeMood('neutral', lightGreen400)} ><SocialSentimentNeutral color={lightGreen400} /></IconButton>
          <IconButton iconStyle={styles.largeIcon} style={styles.large} onTouchTap={() => this.changeMood('dissatisfied', red500)}><SocialSentimentDissatisfied color={red500} /></IconButton>
          <IconButton iconStyle={styles.largeIcon} style={styles.large} onTouchTap={() => this.changeMood('veryDissatisfied', brown900)}><SocialSentimentVeryDissatisfied color={brown900} /></IconButton>
          <IconButton iconStyle={styles.largeIcon} style={styles.large} onTouchTap={() => this.changeMood('angry', deepOrange900)}><SocialWhatshot color={deepOrange900} /></IconButton>
        </center>
        <div className="row" style={styles.container}>
          <div className="col-md-10 col-sm-8 col-xs-12">
            <TextField
              hintText={N18.expressMood}
              name='mood'
              value={this.state.text}
              onChange={this.onChange}
              fullWidth={true}
              errorText={this.state.errors.text}
              inputStyle={{ color: this.state.color }}
              floatingLabelStyle={{ color: this.state.color }}
              floatingLabelText={N18.expressMood}>
            </TextField>
          </div>
          <div className="col-md-2 col-sm-4 col-xs-12">
            <RaisedButton
              labelColor="#FFFFFF"
              backgroundColor={this.state.color}
              style={{ marginTop: 28 }}
              fullWidth={true}
              onTouchTap={this.createMood}
              label={N18.new}
              />
          </div></div>
      </div>
    )
  }
}

MoodInput.propTypes = {
  addMood: React.PropTypes.func.isRequired
}

export default MoodInput
