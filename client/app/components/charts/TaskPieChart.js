import React, { Component } from 'react'
import Highcharts from 'react-highcharts'
import Paper from 'material-ui/Paper'
import ImageLens from 'material-ui/svg-icons/image/lens';

import N18 from '../../constants/string'
import Timer from '../../utils/timer'

import HighchartsMore from 'highcharts-more'
import HighchartsExporting from 'highcharts-exporting'

HighchartsMore(Highcharts.Highcharts);
HighchartsExporting(Highcharts.Highcharts);

const styles = {
  container: {
    marginTop: 12,
    padding: 30
  },
  line: {
    height: 40,
    padding: 5
  },
  headerLine: {
    height: 40,
    padding: 5,
    fontWeight: 'bold'
  },
  details: {
    paddingTop: 50
  }
}

class TaskPieChart extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let taskWithTag = [];
    let colors = [];
    taskWithTag[N18.noTag] = [];
    colors[N18.noTag] = '#000000';

    this.props.tasks.map(task => {
      if (task.tag != undefined) {
        if (taskWithTag[task.tag.name] === undefined) {
          colors[task.tag.name] = task.tag.color;
          taskWithTag[task.tag.name] = []
        }
        taskWithTag[task.tag.name].push(task);
      } else {
        taskWithTag[N18.noTag].push(task);
      }
    })
    //get tag times
    let times = [];
    let totalTime = 0;
    let keys = Object.keys(taskWithTag);
    keys.map(key => {
      let tasks = taskWithTag[key];
      let time = 0;
      tasks.map(task => {
        let number = Number(task.duration);
        time += number;
        totalTime += number;
      })
      times[key] = time;
    })

    //generate chart config
    let data = [];
    keys.map(key => {
      data.push({
        name: key,
        y: times[key] / totalTime
      })
    })

    let config = {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie',


      },

      lang: N18.chartLang,
      title: {
        text: ''
      },

      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },

      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
            style: {
              color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
            }
          }
        }
      },
      series: [{
        name: N18.percentage,
        colorByPoint: true,
        data: data
      }]
    }

    return (
      <Paper>
        <div className="row" style={styles.container}>
          <div className="col-xs-12 col-sm-5 col-md-5" style={styles.details}>
            {keys.map(key => (
              <div style={styles.line} key={key}>
                <ImageLens style={{ width: 10, height: 10 }} color={colors[key]} /> {key} <span className="pull-right">{Timer.hms(times[key])}</span>
              </div>
            ))}
            <div style={styles.headerLine} >
              {N18.totalTime}: <span className="pull-right">{Timer.hms(totalTime)}</span>
            </div>
          </div>

          <div className="col-xs-12 col-sm-7 col-md-7">
            <Highcharts config={config} ref="chart"></Highcharts>
          </div>
        </div>
      </Paper>
    )
  }
}

TaskPieChart.propTypes = {
  tasks: React.PropTypes.array.isRequired
}
export default TaskPieChart;