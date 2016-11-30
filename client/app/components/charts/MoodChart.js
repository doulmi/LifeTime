import React, { Component } from 'react'
import Highcharts from 'react-highcharts'

import N18 from '../../constants/string'
import Timer from '../../utils/timer'

class MoodChart extends Component {
  render() {
    let getMoodValue = (slug) => {
      switch (slug) {
        case 'verySatisfied': return 6
        case 'satisfied': return 5
        case 'neutral': return 4
        case 'dissatisfied': return 3
        case 'veryDissatisfied': return 2
        case 'angry': return 1
      }
    }
    let moods = this.props.moods;

    let categories = [];
    let slugs = [];
    let colors = [];
    moods.map(mood => {
      categories.push(Timer.getYmd(new Date(mood.createdAt)));
      slugs.push(getMoodValue(mood.slug));
      colors.push(mood.color);
    });

    const config = {
      title: {
        text: N18.moodStatistics,
      },

      chart: {
        zoomType: 'x'
      },
      lang: N18.chartLang,

      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle',
        borderWidth: 0
      },

      xAxis: {
        categories: categories
      },

      yAxis: {
        title: {
          text: ''
        },
        labels: {
          formatter: function () {
            switch (this.value) {
              case 6: return '6:' + N18.verySatisfied
              case 5: return '5:' + N18.satisfied
              case 4: return '4:' + N18.neutral
              case 3: return '3:' + N18.dissatisfied
              case 2: return '2:' + N18.veryDissatisfied
              case 1: return '1:' + N18.angry
            }
          }
        }
      },
      series: [{
        name: N18.mood,
        data: slugs
      }]
    }

    return (
      <Highcharts config={config} ref="chart" ></Highcharts>
    )
  }
}

MoodChart.propTypes = {
  moods: React.PropTypes.array.isRequired,
}

export default MoodChart