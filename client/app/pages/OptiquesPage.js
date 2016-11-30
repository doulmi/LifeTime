import React, { Component } from 'react'
import { connect } from 'react-redux'

import Paper from 'material-ui/Paper'
import Toggle from 'material-ui/Toggle'

import OptiqueList from '../components/OptiqueList'
import OptiqueInput from '../components/OptiqueInput'
import OptiqueChart from '../components/charts/OptiqueChart'
import LoadingProgress from '../components/LoadingProgress'

import { addOptique, loadOptiques, deleteOptique, updateOptique } from '../actions/optiqueActions'
import N18 from '../constants/string'


const styles = {
  container: {
    padding: 30
  },

  toggle: {
    marginTop: 20,
    maxWidth: 150
  }
}
class OptiquesPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toggle: true
    }

    this.props.loadOptiques();
    this.toggleFigure = this.toggleFigure.bind(this);

  }

  toggleFigure() {
    this.setState({
      toggle: !this.state.toggle
    })
  }

  render() {
    return (
      <Paper>
        <div className="box">
          {this.props.isLoading ? <LoadingProgress /> :
            <div>
              <OptiqueInput addOptique={this.props.addOptique} />
              <div style={styles.toggle}>
                <Toggle
                  label={N18.toggleOptiqueDetails}
                  onToggle={this.toggleFigure}
                  style={styles.toggle}
                  />
              </div>
              {
                this.state.toggle ?
                  <OptiqueChart optiques={this.props.optiques} /> :
                  <OptiqueList optiques={this.props.optiques} updateOptique={this.props.updateOptique} deleteOptique={this.props.deleteOptique} />
              }
            </div>
          }
        </div>
      </Paper>
    )
  }
}

OptiquesPage.propTypes = {
  optiques: React.PropTypes.array.isRequired,
  loadOptiques: React.PropTypes.func.isRequired,
  addOptique: React.PropTypes.func.isRequired,
  updateOptique: React.PropTypes.func.isRequired,
  deleteOptique: React.PropTypes.func.isRequired
}

const mapStateToProps = (state) => {
  return {
    optiques: state.optiques.optiques,
    isLoading: state.optiques.isLoading
  }
}
export default connect(mapStateToProps, { loadOptiques, addOptique, updateOptique, deleteOptique })(OptiquesPage)