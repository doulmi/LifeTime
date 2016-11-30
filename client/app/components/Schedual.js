import React, { Component } from 'react'
import {Table, TableHeader, TableBody, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui'
import {loadScheduals, deleteSchedual} from '../actions/schedualActions'

import Timer from '../utils/timer'
import N18 from '../constants/string'

class Schedual extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
    }
  }

  componentWillMount() {
    if(this.props.scheduals == undefined || this.props.scheduals.length == 0) {
      let today = new Date();
      let monday = Timer.showWeekFirstDay(today);
      let sunday = Timer.showWeekLastDay(today);
      
      this.props.loadScheduals(this.props.classId, monday, sunday).then(
        res => {
          this.setState({isLoading: false}) 
        },
        err => {}
      );
    } else {
      this.setState({
        isLoading: false
      })
    }
  }

  render() {
    return (
      <Paper>
      <div style={styles.toolbar} className="toolbar">
          {isAdmin &&
            <span style={styles.buttons}>
              <FloatingActionButton secondary={true} onTouchTap={this.createSchedu} >
                <ContentAdd />
              </FloatingActionButton>
            </span>
          }
        </div>
      <div className='box'>
        {this.state.isLoading ? <LoadingProgress /> :
          <Table >
                  <TableHeader displaySelectAll={false} adjustForCheckbox={false} >
                    <TableRow selectable={false}>
                      <TableHeaderColumn></TableHeaderColumn>
                      <TableHeaderColumn >{N18.monday}</TableHeaderColumn>
                      <TableHeaderColumn >{N18.tuesday}</TableHeaderColumn>
                      <TableHeaderColumn >{N18.wednesday}</TableHeaderColumn>
                      <TableHeaderColumn >{N18.thursday}</TableHeaderColumn>
                      <TableHeaderColumn >{N18.friday}</TableHeaderColumn>
                      <TableHeaderColumn >{N18.saturday}</TableHeaderColumn>
                      <TableHeaderColumn >{N18.sunday}</TableHeaderColumn>
                    </TableRow>
                  </TableHeader>
                  <TableBody displayRowCheckbox={false} showRowHover={true}>
                    {this.props.scheduals && this.props.scheduals.map(collect => (
                      <TableRow key={scheduals._id}>
                        <TableRowColumn style={{ width: 80 }}>
                          <IconMenu
                            useLayerForClickAway={true}
                            iconButtonElement={iconButtonElement}>
                            <MenuItem onTouchTap={() => this.detailsPage(scheduals)}>{N18.read}</MenuItem>
                            {isAdmin && <MenuItem onTouchTap={() => this.props.deleteSchedual(scheduals)}>{N18.delete}</MenuItem>}
                          </IconMenu>
                        </TableRowColumn>
                      </TableRow>
                    ))
                    }
                  </TableBody>
                </Table> 
        }
      </div>
      </Paper>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    scheduals: state.scheduals.scheduals
  }
}
export default connect(mapStateToProps, {loadScheduals, deleteSchedual})(Schedual)