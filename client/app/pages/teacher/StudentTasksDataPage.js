import React, { Component } from 'react'
import { connect } from 'react-redux'

import { RaisedButton, Dialog, DatePicker, IconButton, Paper, FlatButton, Chip } from 'material-ui'
import { grey400, cyan500 } from 'material-ui/styles/colors'
import NavigationExpandMore from 'material-ui/svg-icons/navigation/expand-more'
import NavigationExpandLess from 'material-ui/svg-icons/navigation/expand-less'

import LoadingProgress from '../../components/LoadingProgress'
import TaskPieChart from '../../components/charts/TaskPieChart'
import TaskTableChart from '../../components/charts/TaskTableChart'
import PersonalToolbar from '../../components/PersonalToolbar'

import { fetchTasks } from '../../actions/taskActions'
import N18 from '../../constants/string'
import Timer from '../../utils/timer'
import DateTimeFormat from '../../constants/format'

const styles = {
  container: {
    padding: "30px 0 0 0"
  },
  dashboard: {
    fontSize: 30
  },
  wrapper: {
    marginTop: 30,
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    marginRight: 10
  }
}

class StudentTasksDataPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      openDateSelect: false,
      period: N18.thisMonth,
      start: new Date(),
      stop: new Date(),
      shouldLoad: false
    }
    this.openDateSelect = this.openDateSelect.bind(this);
    this.closeDateSelect = this.closeDateSelect.bind(this);
    this.selectPeriod = this.selectPeriod.bind(this);
    this.changeStartDate = this.changeStartDate.bind(this);
    this.changeStopDate = this.changeStopDate.bind(this);
    this.loadTaskByDate = this.loadTaskByDate.bind(this);
  }

  componentWillMount() {
    let userId = this.context.router.params.id;

    let today = new Date();

    let firstDayOfMonth = Timer.showMonthFirstDay(today);
    this.props.fetchTasks(userId, Timer.getYmd(firstDayOfMonth), Timer.getYmd(today));
  }

  today() {
    let start = stop = Timer.getYmd(new Date());
    this.loadTaskByDate(start, stop);
  }

  yesterday() {
    let start = stop = Timer.getYmd(Timer.yesterday(new Date()));
    this.loadTaskByDate(start, stop);
  }

  thisMonth() {
    let start = Timer.getYmd(Timer.showMonthFirstDay(new Date()));
    let stop = Timer.getYmd(new Date());
    this.loadTaskByDate(start, stop);
  }

  thisWeek() {
    let start = Timer.getYmd(Timer.showWeekFirstDay(new Date()));
    let stop = Timer.getYmd(new Date());
    this.loadTaskByDate(start, stop);
  }

  loadTaskByDate(start, stop) {
    let userId = this.context.router.params.id;

    this.props.fetchTasks(userId, start, stop);
    this.setState({
      period: start + ' - ' + stop,
      openDateSelect: false
    })
  }

  thisYear() {
    let today = new Date();
    //first year
    let start = Timer.getYmd(new Date(today.getFullYear(), 0, 1, 0, 0, 0, 0));
    let stop = Timer.getYmd(today);
    this.loadTaskByDate(start, stop);
  }

  openDateSelect() {
    this.setState({
      openDateSelect: true
    })
  }

  closeDateSelect() {
    this.setState({
      openDateSelect: false
    })
  }

  changeStartDate(useless, date) {
    this.setState({
      start: date
    })
  }
  changeStopDate(useless, date) {
    this.setState({
      stop: date
    })
  }

  selectPeriod() {
    let start = Timer.getYmd(this.state.start, '/');
    let stop = Timer.getYmd(this.state.stop, '/')
    this.setState({
      period: start + ' - ' + stop,
      openDateSelect: false
    })

    start = Timer.getYmd(this.state.start, '-');
    stop = Timer.getYmd(this.state.stop, '-');
    this.loadTaskByDate(start, stop);
  }


  getPeriod() {
    let days = Timer.dateDiffInDays(this.state.start, this.state.stop);
    if (days == 1 || days == 0) {
      return 'day';
    } else if (days <= 7) {
      return 'week';
    } else if (days <= 31) {
      return 'month';
    } else {
      return 'year';
    }
  }

  render() {

    const actions = [
      <FlatButton
        label={N18.cancel}
        primary={true}
        onTouchTap={this.closeDateSelect}
        />,
      <RaisedButton
        label={N18.ok}
        primary={true}
        onTouchTap={this.selectPeriod}
        />,
    ];

    let dialog = (
      <Dialog
        title={N18.selectPeriod}
        actions={actions}
        open={this.state.openDateSelect}
        onRequestClose={this.closeDateSelect}
        >
        <div className="row">
          <div className="col-md-6 col-xs-6">
            <DatePicker
              hintText={N18.start}
              floatingLabelText={N18.start}
              DateTimeFormat={DateTimeFormat}
              okLabel={N18.ok}
              value={this.state.start}
              fullWidth={true}
              autoOk={true}
              cancelLabel={N18.cancel}
              locale="zh"
              onChange={this.changeStartDate}
              />
          </div>
          <div className="col-md-6 col-xs-6">
            <DatePicker
              hintText={N18.stop}
              floatingLabelText={N18.stop}
              DateTimeFormat={DateTimeFormat}
              okLabel={N18.ok}
              value={this.state.stop}
              minDate={this.state.start}
              autoOk={true}
              fullWidth={true}
              cancelLabel={N18.cancel}
              locale="zh"
              onChange={this.changeStopDate}
              />
          </div>
        </div>
        <div style={styles.wrapper}>
          <Chip style={styles.chip} onTouchTap={() => this.today()} > {N18.today} </Chip>
          <Chip style={styles.chip} onTouchTap={() => this.yesterday()} > {N18.yesterday} </Chip>
          <Chip style={styles.chip} onTouchTap={() => this.thisWeek()} > {N18.thisWeek} </Chip>
          <Chip style={styles.chip} onTouchTap={() => this.thisMonth()} > {N18.thisMonth} </Chip>
          <Chip style={styles.chip} onTouchTap={() => this.thisYear()} > {N18.thisYear} </Chip>
        </div>
      </Dialog>
    );

    let periodIcon = (this.state.openDateSelect ? <NavigationExpandLess color={grey400} /> : <NavigationExpandMore color={grey400} />);
    return (
      <Paper>
        <PersonalToolbar user={this.props.location.state.user} />
        <div className="box">
          {
            this.props.isLoading ? <LoadingProgress /> :
              <div className="row">
                <div className="col-md-8 col-sm-8 col-xs-12">
                  <div style={styles.container}>
                    <span style={styles.dashboard}>{N18.dashboard}</span>
                    <div className="pull-right" style={{ marginTop: 5 }}>
                      <FlatButton
                        label={this.state.period}
                        labelPosition="before"
                        icon={periodIcon}
                        onTouchTap={this.openDateSelect}
                        />
                    </div>
                  </div>
                  <TaskPieChart tasks={this.props.tasks} />
                </div>
                <div className="col-md-3 col-sm-4 col-xs-12 col-lg-3">
                  <TaskTableChart tasks={this.props.tasks} />
                </div>
              </div>
          }
        </div>
        {dialog}
      </Paper>
    )
  }
}

StudentTasksDataPage.propTypes = {
  fetchTasks: React.PropTypes.func.isRequired,
  tasks: React.PropTypes.array.isRequired,
  isLoading: React.PropTypes.bool.isRequired,
}

StudentTasksDataPage.contextTypes = {
  router: React.PropTypes.object.isRequired
}
const mapStateToProps = (state) => {
  return {
    tasks: state.tasks.analyse,
    isLoading: state.tasks.isLoading
  }
}
export default connect(mapStateToProps, { fetchTasks })(StudentTasksDataPage)