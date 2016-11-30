import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Paper, RaisedButton, FlatButton } from 'material-ui';

import Paginator from '../components/Paginator'
import PunishmentList from '../components/PunishmentList'
import LoadingProgress from '../components/LoadingProgress'
import { loadPunishments } from '../actions/punishmentActions'

const styles = {
  timeline: {
    width: '100%',
    margin: 'auto',
  }
}

class PunishmentsPage extends Component {
  constructor(props) {
    super(props);
    this.props.loadPunishments(0, this.props.location.search);
  }

  render() {
    return (
      <Paper>
        <div style={styles.timeline} className="box">
          {this.props.isLoading ? <LoadingProgress /> :
            <div>
              <PunishmentList
                punishments={this.props.punishments}
                loadPunishments={this.props.loadPunishments}
                student={this.props.user}
                />
              <Paginator
                paginate={this.props.paginate}
                query={this.props.location.search}
                loadData={this.props.loadPunishments}
                />
            </div>
          }
        </div>
      </Paper>
    );
  }
}

PunishmentsPage.propTypes = {
  loadPunishments: React.PropTypes.func.isRequired,
  punishments: React.PropTypes.array.isRequired,
  paginate: React.PropTypes.object.isRequired,
  isLoading: React.PropTypes.bool.isRequired
}

PunishmentsPage.contextTypes = {
  router: React.PropTypes.object.isRequired
}

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    punishments: state.punishments.punishments,
    paginate: state.punishments.paginate,
    isLoading: state.punishments.isLoading,
  }
}

export default connect(mapStateToProps, { loadPunishments })(PunishmentsPage)