import React, { Component } from 'react'
import { Paper, Dialog, RaisedButton, IconButton, List, ListItem } from 'material-ui'
import { blue500, grey500 } from 'material-ui/styles/colors'
import ActionGavel from 'material-ui/svg-icons/action/gavel';
import AchievementDialog from './AchievementDialog'

import N18 from '../constants/string'
import Timer from '../utils/timer'

const styles = {
  titie: {
    fontWeight: 'bold'
  },
  title: {
    fontSize: 30
  },

  container: {
    padding: "30px 0"
  },

  date: {
    fontSize: 14,
    margin: '0 0 10px 0',
    color: grey500
  },

  content: {
    margin: '10px 0',
    fontSize: 14
  }
}

class AchievementList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      achievement: {},
    }

    this.openDialog = this.openDialog.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
  }
  openDialog(achievement) {
    this.setState({
      open: true,
      achievement: achievement
    })
  }

  closeDialog() {
    this.setState({
      open: false
    })
  }

  render() {
    let achievements = this.props.achievements;
    const actions = [
      <RaisedButton
        label={N18.close}
        primary={true}
        onTouchTap={this.closeDialog}
        />,
    ]

    const dialog = (
      <Dialog
        title={this.state.achievement.title}
        actions={actions}
        modal={false}
        open={this.state.open}
        onRequestClose={this.closeDialog}
        >
        <p>
          {this.state.achievement.content}
        </p>
      </Dialog>
    )
    return (
      achievements.length == 0 ?
        <center style={{ marginTop: 30 }}>{N18.noAchievement}</center> :
        <div style={styles.container}>
          <div style={styles.title}>{N18.allAchievements}</div>
          <Paper>
            <List>
              {
                achievements.map(achievement => (
                  <ListItem
                    key={achievement._id}
                    style={{ margin: "6px 0", borderLeft: '4px solid ' + blue500}}
                    onTouchTap={() => this.openDialog(achievement)}
                    >
                    <div>
                      <div style={styles.subtitle}>{achievement.title}</div>
                      <span style={styles.date}>{Timer.getYmd(new Date(achievement.happenAt))}</span>
                    </div>
                  </ListItem>
                ))
              }
            </List>
            {dialog}
          </Paper>
        </div>
    )
  }
}

AchievementList.propTypes = {
  loadAchievements: React.PropTypes.func.isRequired,
  achievements: React.PropTypes.array.isRequired,
  student: React.PropTypes.object.isRequired
}

export default AchievementList