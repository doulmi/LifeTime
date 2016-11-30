import React, { Component } from 'react'
import { connect } from 'react-redux'
import { loadScores } from '../actions/scoreActions'
import { Paper, IconButton } from 'material-ui'
import { cyan500, cyan700, grey500, grey900 } from 'material-ui/styles/colors'

import NavigationArrowBack from 'material-ui/svg-icons//navigation/arrow-back'
import LoadingProgress from '../components/LoadingProgress'
import ScoresList from '../components/ScoresList'
import N18 from '../constants/string'

const styles = {
  top3: {
    marginTop: 30
  },
  toolbar: {
    padding: 10,
    background: cyan500,
  },
  buttons: {
    marginTop: 5
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold'
  }
}

class ScoresPage extends Component {
  constructor(props) {
    super(props);
    this.goBack = this.goBack.bind(this);
  }

 //回退
  goBack() {
    this.context.router.goBack();
  }

  componentWillMount() {
    let id = this.props.params.studentId;
    this.props.loadScores(id);
  }

  render() {
    return (
      <Paper>
        {this.props.user.role != 'student' &&
          <div style={styles.toolbar}>
            <IconButton tooltip={N18.back} onTouchTap={this.goBack} >
              <NavigationArrowBack color="white" />
            </IconButton>
          </div>
        }

        {this.props.isLoading ? <LoadingProgress /> :
          <div>
            {this.props.scores.length == 0 ? 
              <center>{N18.noScores}</center> :
              <div className="box">
                <ScoresList scores={this.props.scores} />
              </div>
            }
          </div>
        }
      </Paper>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    scores: state.scores.scores,
    isLoading: state.scores.isLoading,
    user: state.auth.user
  }
}

ScoresPage.contextTypes = {
  router: React.PropTypes.object.isRequired
}

export default connect(mapStateToProps, { loadScores })(ScoresPage)