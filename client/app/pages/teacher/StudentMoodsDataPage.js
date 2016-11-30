import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Chip, RaisedButton, Dialog, DatePicker, IconButton, Paper, FlatButton } from 'material-ui'
import { grey400, cyan500 } from 'material-ui/styles/colors'
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back'
import NavigationExpandLess from 'material-ui/svg-icons/navigation/expand-less';
import NavigationExpandMore from 'material-ui/svg-icons/navigation/expand-more';

import LoadingProgress from '../../components/LoadingProgress'
import MoodPieChart from '../../components/charts/MoodPieChart'
import MoodChart from '../../components/charts/MoodChart'
import PersonalToolbar from '../../components/PersonalToolbar'

import { fetchMoods } from '../../actions/moodActions'
import N18 from '../../constants/string'
import Timer from '../../utils/timer'
import DateTimeFormat from '../../constants/format'

const styles = {
  wrapper: {
    marginTop: 30,
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    marginRight: 10
  }
}


class StudentMoodsDataPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      openDateSelect: false,
      period: N18.all,
      start: new Date(),
      stop: new Date(),
      moods: this.props.moods
    }

    this.openDateSelect = this.openDateSelect.bind(this);
    this.closeDateSelect = this.closeDateSelect.bind(this);
    this.selectPeriod = this.selectPeriod.bind(this);
    this.changeStartDate = this.changeStartDate.bind(this);
    this.changeStopDate = this.changeStopDate.bind(this);
    this.loadMoodByDate = this.loadMoodByDate.bind(this);
  }

  componentWillMount() {
    let userId = this.context.router.params.id;
    this.props.fetchMoods(userId)


    this.moods = this.props.moods;
  }

  today() {
    let start = stop = Timer.getYmd(new Date());
    this.loadMoodByDate(start, stop);
  }

  yesterday() {
    let start = stop = Timer.getYmd(Timer.yesterday(new Date()));
    this.loadMoodByDate(start, stop);
  }

  thisMonth() {
    let start = Timer.getYmd(Timer.showMonthFirstDay(new Date()));
    let stop = Timer.getYmd(new Date());
    this.loadMoodByDate(start, stop);
  }

  thisWeek() {
    let start = Timer.getYmd(Timer.showWeekFirstDay(new Date()));
    let stop = Timer.getYmd(new Date());
    this.loadMoodByDate(start, stop);
  }

  loadMoodByDate(start, stop) {
    //对视力信息根据日期进行分类
    this.moodsWithDate = {};
    this.props.moods.map(mood => {
      let date = Timer.getYmd(new Date(mood.createdAt));
      if (this.moodsWithDate[date] == undefined) {
        this.moodsWithDate[date] = [];
      }
      this.moodsWithDate[date].push(mood);
    });

    this.keys = Object.keys(this.moodsWithDate);

    let moods = [];

    let startDate = new Date(start);
    let stopDate = new Date(stop);
    stopDate.setDate(stopDate.getDate() + 1);

    this.keys.map(key => {
      let keyDate = new Date(key);
      if (keyDate >= startDate && keyDate <= stopDate) {
        this.moodsWithDate[key].map(mood => {
          moods.push(mood);
        });
      }
    });

    this.setState({
      period: start + ' - ' + stop,
      openDateSelect: false,
      moods: moods
    })
  }

  thisYear() {
    let today = new Date();
    //first year
    let start = Timer.getYmd(new Date(today.getFullYear(), 0, 1, 0, 0, 0, 0));
    let stop = Timer.getYmd(today);
    this.loadMoodByDate(start, stop);
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
    this.loadMoodByDate(start, stop);
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

    let periodIcon = (this.state.openDateSelect ? <NavigationExpandLess color={grey400} /> : <NavigationExpandMore color={grey400} />)

    return (
      <Paper>
        <PersonalToolbar user={this.props.location.state.user} />
        <div className="box">
          <div>
            <div className="pull-right" style={{ marginTop: 5 }}>
              <FlatButton
                label={this.state.period}
                labelPosition="before"
                icon={periodIcon}
                onTouchTap={this.openDateSelect}
                />
            </div>
            {
              this.props.isLoading ? <LoadingProgress /> :
                <MoodChart moods={this.state.moods.length == 0 ? this.props.moods: this.state.moods} />
            }
            {dialog}
          </div>
        </div>
      </Paper>
    )
  }
}

StudentMoodsDataPage.propTypes = {
  fetchMoods: React.PropTypes.func.isRequired,
  moods: React.PropTypes.array.isRequired,
  isLoading: React.PropTypes.bool.isRequired,
}

StudentMoodsDataPage.contextTypes = {
  router: React.PropTypes.object.isRequired
}

const mapStateToProps = (state, ownProps) => {
  return {
    moods: state.moods.moods,
    isLoading: state.moods.isLoading,
  }
}

export default connect(mapStateToProps, { fetchMoods })(StudentMoodsDataPage)