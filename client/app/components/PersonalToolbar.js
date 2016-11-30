import React, { Component } from 'react'

import { IconButton, FlatButton } from 'material-ui'
import { cyan500 } from 'material-ui/styles/colors'
import NavigationArrowBack from 'material-ui/svg-icons//navigation/arrow-back'
import N18 from '../constants/string'

const styles = {
  toolbar: {
    padding: 10,
    background: cyan500,
  },

  buttons: {
    marginTop: 8,
    float: 'right'
  }
}

class PersonalToolbar extends Component {
  constructor(props) {
    super(props);

    this.taskPage = this.taskPage.bind(this);
    this.optiquePage = this.optiquePage.bind(this);
    this.moodPage = this.moodPage.bind(this);
    this.goBack = this.goBack.bind(this);
  }


  taskPage() {
    let user = this.props.user;
    this.context.router.push({
      pathname: '/users/tasks/' + user._id,
      state: { user: user }
    })
  }

  optiquePage() {
    let user = this.props.user;
    this.context.router.push({
      pathname: '/users/optiques/' + user._id,
      state: { user: user }
    })
  }

  moodPage() {
    let user = this.props.user;
    this.context.router.push({
      pathname: '/users/moods/' + user._id,
      state: { user: user }
    })
  }

  goBack() {
    this.context.router.goBack();
  }

  render() {
    return (
      <div style={styles.toolbar}>
        <IconButton tooltip={N18.back} onTouchTap={this.goBack} >
          <NavigationArrowBack color="white" />
        </IconButton>
        <span style={styles.buttons}>
          <FlatButton
            labelStyle={{ color: 'white' }}
            onTouchTap={this.taskPage}
            label={N18.taskInfo} />
          <FlatButton
            label={N18.optiqueInfo}
            onTouchTap={this.optiquePage}
            labelStyle={{ color: 'white' }}
            />
          <FlatButton
            onTouchTap={this.moodPage}
            label={N18.moodInfo}
            labelStyle={{ color: 'white' }}
            />
        </span>
      </div>
    )
  }
}


PersonalToolbar.contextTypes = {
  router: React.PropTypes.object.isRequired
}
export default PersonalToolbar