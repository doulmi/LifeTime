import React, { Component } from 'react'
import Highcharts from 'react-highcharts'
import { Chip, Dialog, DatePicker, RaisedButton, FlatButton } from 'material-ui'
import { grey400 } from 'material-ui/styles/colors'
import NavigationExpandMore from 'material-ui/svg-icons/navigation/expand-more'
import NavigationExpandLess from 'material-ui/svg-icons/navigation/expand-less'

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

class OptiqueChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openDateSelect: false,
      period: N18.all,
      start: new Date(),
      stop: new Date(),
      optiques: this.props.optiques
    }

    this.openDateSelect = this.openDateSelect.bind(this);
    this.closeDateSelect = this.closeDateSelect.bind(this);
    this.selectPeriod = this.selectPeriod.bind(this);
    this.changeStartDate = this.changeStartDate.bind(this);
    this.changeStopDate = this.changeStopDate.bind(this);
    this.loadOptiqueByDate = this.loadOptiqueByDate.bind(this);

    //对视力信息根据日期进行分类
    this.optiquesWithDate = {};
    this.props.optiques.map(optique => {
      let date = Timer.getYmd(new Date(optique.date));
      if (this.optiquesWithDate[date] == undefined) {
        this.optiquesWithDate[date] = [];
      }
      this.optiquesWithDate[date].push(optique);
    });
    this.keys = Object.keys(this.optiquesWithDate);
  }

  today() {
    let start = stop = Timer.getYmd(new Date());
    this.loadOptiqueByDate(start, stop);
  }

  yesterday() {
    let start = stop = Timer.getYmd(Timer.yesterday(new Date()));
    this.loadOptiqueByDate(start, stop);
  }

  thisMonth() {
    let start = Timer.getYmd(Timer.showMonthFirstDay(new Date()));
    let stop = Timer.getYmd(new Date());
    this.loadOptiqueByDate(start, stop);
  }

  thisWeek() {
    let start = Timer.getYmd(Timer.showWeekFirstDay(new Date()));
    let stop = Timer.getYmd(new Date());
    this.loadOptiqueByDate(start, stop);
  }

  loadOptiqueByDate(start, stop) {
    let optiques = [];

    let startDate = new Date(start);
    let stopDate = new Date(stop);
    stopDate.setDate(stopDate.getDate() + 1);

    this.keys.map(key => {
      let keyDate = new Date(key);
      if (keyDate >= startDate && keyDate <= stopDate) {
        this.optiquesWithDate[key].map(optique => {
          optiques.push(optique);
        });
      }
    });

    this.setState({
      period: start + ' - ' + stop,
      openDateSelect: false,
      optiques: optiques
    })
  }

  thisYear() {
    let today = new Date();
    //first year
    let start = Timer.getYmd(new Date(today.getFullYear(), 0, 1, 0, 0, 0, 0));
    let stop = Timer.getYmd(today);
    this.loadOptiqueByDate(start, stop);
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
    this.loadOptiqueByDate(start, stop);
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

  comoponentWillReceiveProps(nextProps) {

  }
  
  render() {
    let optiques = this.props.optiques.sort((e1, e2) => {return new Date(e1.date) > new Date(e2.date)});
    console.log(this.state.optiques)

    let categories = [];
    let leftOptiques = [];
    let rightOptiques = [];
    optiques.map(optique => {
      categories.push(Timer.getYmd(new Date(optique.date)));
      leftOptiques.push(parseFloat(optique.left));
      rightOptiques.push(parseFloat(optique.right));
    });

    const config = {
      title: {
        text: N18.optiqueStatistics,
      },
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle',
        borderWidth: 0
      },
      chart: {
        zoomType: 'x'
      },
      lang: N18.chartLang,
      xAxis: {
        categories: categories
      },

      yAxis: {
        title: {
          text: ''
        }
      },
      series: [{
        name: N18.rightOptique,
        data: rightOptiques
      }, {
        name: N18.leftOptique,
        data: leftOptiques
      }]
    }

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
      <div>
        <div className="pull-right" style={{ marginTop: 5 }}>
          <FlatButton
            label={this.state.period}
            labelPosition="before"
            icon={periodIcon}
            onTouchTap={this.openDateSelect}
            />
        </div>
        <Highcharts config={config} ref="chart" ></Highcharts>
        {dialog}
      </div>
    )
  }
}

OptiqueChart.propTypes = {
  optiques: React.PropTypes.array.isRequired,
}

export default OptiqueChart