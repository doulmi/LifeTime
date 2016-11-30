import React, { Component } from 'react'
import { Paper, Dialog, RaisedButton, IconButton, List, ListItem } from 'material-ui'
import { red900, red500, grey500 } from 'material-ui/styles/colors'
import ActionGavel from 'material-ui/svg-icons/action/gavel';
import PunishmentDialog from './PunishmentDialog'

import N18 from '../constants/string'
import Timer from '../utils/timer'

const styles = {
  titie: {
    fontWeight: 'bold'
  },
  container: {
    padding: "30px 0"
  },
  title: {
    fontSize: 30
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

class PunishmentList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      punishment: {},
      open: false,
    }
    this.openDialog = this.openDialog.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
  }

  openDialog(punishment) {
    this.setState({
      open: true,
      punishment: punishment
    })
  }

  closeDialog() {
    this.setState({
      open: false
    })
  }

  render() {
    let punishments = this.props.punishments;

    const actions = [
      <RaisedButton
        label={N18.close}
        primary={true}
        onTouchTap={this.closeDialog}
        />,
    ]

    const dialog = (
      <Dialog
        title={this.state.punishment.title}
        actions={actions}
        modal={false}
        open={this.state.open}
        onRequestClose={this.closeDialog}
        >
        <p>
          {this.state.punishment.content}
        </p>
      </Dialog>
    )
    return (
      punishments.length == 0 ?
        <center style={{ marginTop: 30 }}>{N18.noPunishment}</center> :
        <div style={styles.container}>
          <div style={styles.title}>{N18.allPunishments}</div>
          <Paper>
            <List>
              {
                punishments.map(punishment => (
                  <ListItem
                    key={punishment._id}
                    style={{ margin: "6px 0", borderLeft: '4px solid ' + red900 }}
                    onTouchTap={() => this.openDialog(punishment)}
                    >
                    <div>
                      <div style={styles.subtitle}>{punishment.title}</div>
                      <span style={styles.date}>{Timer.getYmd(new Date(punishment.happenAt))}</span>
                    </div>
                  </ListItem>
                ))
              }
            </List>
          </Paper>
          {dialog}
        </div>
    )
  }
}

PunishmentList.propTypes = {
  loadPunishments: React.PropTypes.func.isRequired,
  punishments: React.PropTypes.array.isRequired,
  student: React.PropTypes.object.isRequired,
}

export default PunishmentList