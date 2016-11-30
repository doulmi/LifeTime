import React, { Component } from 'react'
import { connect } from 'react-redux'

import { IconButton, Paper, FlatButton } from 'material-ui'
import { cyan500 } from 'material-ui/styles/colors'
import NavigationArrowBack from 'material-ui/svg-icons//navigation/arrow-back'

import LoadingProgress from '../../components/LoadingProgress'
import OptiqueChart from '../../components/charts/OptiqueChart'
import PersonalToolbar from '../../components/PersonalToolbar'

import { fetchOptiques } from '../../actions/optiqueActions'
import N18 from '../../constants/string'

class StudentOptiquesDataPage extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    let userId = this.context.router.params.id;
    this.props.fetchOptiques(userId);
  }

  render() {
    return (
      <Paper>
        <PersonalToolbar user={this.props.location.state.user} />
        <div className="box">
          {
            this.props.isLoading ? <LoadingProgress /> :
              <OptiqueChart optiques={this.props.optiques} />
          }
        </div>
      </Paper>
    )
  }
}

StudentOptiquesDataPage.propTypes = {
  fetchOptiques: React.PropTypes.func.isRequired,
  optiques: React.PropTypes.array.isRequired,
  isLoading: React.PropTypes.bool.isRequired,
}

StudentOptiquesDataPage.contextTypes = {
  router: React.PropTypes.object.isRequired
}

const mapStateToProps = (state, ownProps) => {
  return {
    optiques: state.optiques.optiques,
    isLoading: state.optiques.isLoading,
  }
}

export default connect(mapStateToProps, { fetchOptiques })(StudentOptiquesDataPage)