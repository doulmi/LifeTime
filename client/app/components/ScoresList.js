import React, { Component } from 'react'
import { Snackbar, FlatButton, RaisedButton, FloatingActionButton, TextField, Paper, Dialog, Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn, SelectField, MenuItem, IconMenu, IconButton } from 'material-ui'
import N18 from '../constants/string'

class ScoresList extends Component {
  constructor(props) {
    super(props);
    this.goBack = this.goBack.bind(this);
  }

  //回退
  goBack() {
    this.context.router.goBack();
  }

  render() {
    let scoresWithSemester = {};
    this.props.scores.map(score => {
      if (scoresWithSemester[score.semester] == undefined) {
        scoresWithSemester[score.semester] = [];
      }
      scoresWithSemester[score.semester].push(score);
    });

    let keys = Object.keys(scoresWithSemester);
    return (
      <div>
        {keys.map(key => (
          <div>
            <h3>{N18['semester' + key]}</h3>
             <Table selectable={false}>
              <TableBody displayRowCheckbox={false} showRowHover={true}>
                {scoresWithSemester[key] && scoresWithSemester[key].map(score => (
                  <TableRow key={score._id}>
                    <TableRowColumn>{score.course.name}</TableRowColumn>
                    <TableRowColumn>{score.note}</TableRowColumn>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ))}
      </div>
    )
  }
}

ScoresList.propTypes = {
  scores: React.PropTypes.array.isRequired,
}

export default ScoresList