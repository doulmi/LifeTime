import React, { Component } from 'react'
import { Dialog, IconButton, List, ListItem, IconMenu, MenuItem, FlatButton, RaisedButton, DatePicker, TextField } from 'material-ui'
import ActionFace from 'material-ui/svg-icons/action/face';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import { grey500 } from 'material-ui/styles/colors'

import DateTimeFormat from '../constants/format'
import Timer from '../utils/timer'
import N18 from '../constants/string'

const styles = {
  title: {
    fontWeight: 'bold',
    padding: "10px 0"
  },
  left: {

  },

  right: {
    marginLeft: 15
  }
}

class OptiqueList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      date: {},
      left: '',
      right: '',
      openDialog: false,
      id: ''
    }

    this.updateOptique = this.updateOptique.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
    this.changeDate = this.changeDate.bind(this);
    this.changeLeftOptique = this.changeLeftOptique.bind(this);
    this.changeRightOptique = this.changeRightOptique.bind(this);
    this.deleteOptique = this.deleteOptique.bind(this);
  }

  updateOptique() {
    let optique = {
      date: Timer.getYmd(this.state.date),
      left: this.state.left,
      right: this.state.right,
      id: this.state.id
    }

    this.props.updateOptique(optique);
    this.setState({
      date: {},
      left: '',
      right: '',
      openDialog: false,
      id: ''
    })
  }

  closeDialog() {
    this.setState({
      openDialog: false
    })
  }

  changeOptique(optique) {
    this.setState({
      date: new Date(optique.date),
      left: optique.left,
      right: optique.right,
      id: optique._id,
      openDialog: true
    })
  }

  changeDate(useless, date) {
    this.setState({
      date: date
    })
  }

  changeLeftOptique(e) {
    this.setState({
      left: e.target.value
    })
  }

  changeRightOptique(e) {
    this.setState({
      right: e.target.value
    })
  }

  deleteOptique(optique) {
    this.props.deleteOptique(optique);
  }

  render() {
    let optiques = this.props.optiques.sort((e1, e2) => {return new Date(e1.date) < new Date(e2.date)});

    const iconButtonElement = (
      <IconButton
        touch={true}
        tooltip={N18.more}
        tooltipPosition="bottom-left"
        >
        <MoreVertIcon color={grey500} />
      </IconButton>
    );

    const actions = [
      <FlatButton
        label={N18.cancel}
        primary={true}
        onTouchTap={this.closeDialog}
        />,
      <RaisedButton
        label={N18.submit}
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.updateOptique}
        />,
    ];

    const modifyDialog = (
      <Dialog
        title={N18.modifyOptiqueDialog}
        actions={actions}
        modal={false}
        open={this.state.openDialog}
        onRequestClose={this.closeDialog}
        >
        <div className="col-md-4 col-sm-4 col-xs-12">
          <DatePicker
            hintText={N18.optiqueDate}
            floatingLabelText={N18.optiqueDate}
            DateTimeFormat={DateTimeFormat}
            okLabel={N18.ok}
            value={this.state.date}
            fullWidth={true}
            cancelLabel={N18.cancel}
            autoOk={true}
            locale="zh"
            onChange={this.changeDate}
            />
        </div>

        <div className="col-md-4 col-sm-4 col-xs-12">
          <TextField
            hintText={N18.hintOptique}
            fullWidth={true}
            onChange={this.changeLeftOptique}
            value={this.state.left}
            floatingLabelText={N18.yourLeftOptique} >
          </TextField>
        </div>

        <div className="col-md-4 col-sm-4 col-xs-12">
          <TextField
            hintText={N18.hintOptique}
            fullWidth={true}
            onChange={this.changeRightOptique}
            value={this.state.right}
            floatingLabelText={N18.yourRightOptique} >
          </TextField>
        </div>
      </Dialog>
    );
    return (
      optiques.length == 0 ?
        <center style={{ marginTop: 30 }}>{N18.noOptique}</center> :
        (
          <div style={{ marginTop: 30 }}>
            <List>
              {
                optiques.map(optique => (
                  <ListItem
                    disabled={true}
                    key={optique._id}
                    primaryText={Timer.getYmd(new Date(optique.date))}
                    secondaryText={
                      <div>
                        <span style={styles.left}>{N18.leftOptique}: {optique.left}</span>
                        <span style={styles.right}>{N18.rightOptique}: {optique.right}</span>
                      </div>
                    }
                    rightIconButton={
                      <IconMenu
                        iconButtonElement={iconButtonElement}>
                        <MenuItem onTouchTap={() => this.changeOptique(optique)}>{N18.modify}</MenuItem>
                        <MenuItem onTouchTap={() => this.deleteOptique(optique)}>{N18.delete}</MenuItem>
                      </IconMenu>
                    }
                    secondaryTextLines={2}
                    />
                ))
              }
            </List>
            {modifyDialog}
          </div>
        )
    )
  }
}

OptiqueList.propTypes = {
  updateOptique: React.PropTypes.func.isRequired,
  deleteOptique: React.PropTypes.func.isRequired,
  optiques: React.PropTypes.array.isRequired,
}

export default OptiqueList