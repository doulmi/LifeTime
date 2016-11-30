import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Paper, RaisedButton, FlatButton } from 'material-ui';

import Paginator from '../components/Paginator'
import AchievementList from '../components/AchievementList'
import LoadingProgress from '../components/LoadingProgress'
import { loadAchievements } from '../actions/achievementActions'

const styles = {
  timeline: {
    width: '100%',
    margin: 'auto',
  }
}

class AchievementsPage extends Component {
  constructor(props) {
    super(props);
    this.props.loadAchievements(0, this.props.location.search);
  }

  render() {
    return (
      <Paper>
        <div style={styles.timeline} className="box">
          {this.props.isLoading ? <LoadingProgress /> :
            <div>
              <AchievementList
                achievements={this.props.achievements}
                loadAchievements={this.props.loadAchievements}
                student={this.props.user}
                />
              <Paginator
                paginate={this.props.paginate}
                query={this.props.location.search}
                loadData={this.props.loadAchievements}
                />
            </div>
          }
        </div>
      </Paper>
    );
  }
}

AchievementsPage.propTypes = {
  loadAchievements: React.PropTypes.func.isRequired,
  achievements: React.PropTypes.array.isRequired,
  paginate: React.PropTypes.object.isRequired,
  isLoading: React.PropTypes.bool.isRequired
}

AchievementsPage.contextTypes = {
  router: React.PropTypes.object.isRequired
}

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    achievements: state.achievements.achievements,
    paginate: state.achievements.paginate,
    isLoading: state.achievements.isLoading,
  }
}

export default connect(mapStateToProps, { loadAchievements })(AchievementsPage)