import React, { Component } from 'react'
import { connect } from 'react-redux'

import Paper from 'material-ui/Paper'

import MoodInput from '../components/MoodInput'
import MoodList from '../components/MoodList'

//funcs
import { loadMoods, addMood, deleteMood } from '../actions/moodActions'

class MoodsPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Paper>
        <MoodInput addMood={this.props.addMood} />
        <MoodList moods={this.props.moods} deleteMood={this.props.deleteMood} loadMoods={this.props.loadMoods} />
      </Paper>
    )
  }
}

MoodsPage.propTypes = {
  loadMoods: React.PropTypes.func.isRequired,
  addMood: React.PropTypes.func.isRequired,
  deleteMood: React.PropTypes.func.isRequired
}

const mapStateToProps = (state) => {
  return {
    moods: state.moods,
  }
}

export default connect(mapStateToProps, { loadMoods, addMood, deleteMood })(MoodsPage)