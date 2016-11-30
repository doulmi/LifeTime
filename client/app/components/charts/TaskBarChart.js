import React, { Component } from 'react'
import { Paper, Dialog, Popover, DatePicker, RaisedButton, FlatButton } from 'material-ui'
import NavigationExpandMore from 'material-ui/svg-icons/navigation/expand-more'
import NavigationExpandLess from 'material-ui/svg-icons/navigation/expand-less'
import { grey400 } from 'material-ui/styles/colors'
import Highcharts from 'react-highcharts'

import N18 from '../../constants/string'
import Timer from '../../utils/timer'
import DateTimeFormat from '../../constants/format'

const styles = {
    container: {
        padding: "30px 0 0 0"
    },
    dashboard: {
        fontSize: 30,
        paddingBottom: 0
    }
}

class TaskBarChart extends Component {
    constructor(props) {
        super(props);
    }

    day(tasks) {
        let keys = Object.keys(tasks);
        if (keys.length > 0) {
            let time = 0;
            let key = keys[0];
            tasks[key].map(task => {
                time += Number(task.duration);
            })
            return {
                categories: keys,
                data: [Timer.hour(time)]
            }
        } else {
            return [{
                data: 0
            }]
        }
    }

    week(tasks) {
        let keys = Object.keys(tasks);

        if (keys.length > 0) {
            let times = [];
            keys.map(key => {
                let time = 0;
                tasks[key].map(task => {
                    time += Number(task.duration);
                })
                times.push(Timer.hour(time));
            })

            return {
                categories: keys,
                data: times
            }
        } else {
            return [{
                data: 0
            }]
        }
    }

    month(tasks) {
    }

    year(tasks) {
    }

    //get chart data
    getConfig(tasks) {
        let taskWithDate = [];
        tasks.map(task => {
            if (taskWithDate[task.date] == undefined) {
                taskWithDate[task.date] = [];
            }
            taskWithDate[task.date].push(task);
        })


        switch (this.props.period) {
            case 'day': return this.day(taskWithDate);
            case 'week': return this.week(taskWithDate);
            case 'month': return this.month(taskWithDate);
            case 'year': return this.year(taskWithDate);
            default: return this.year(taskWithDate);
        }
    }

    render() {
        let tasks = this.props.tasks;
        let {categories, data} = this.getConfig(tasks);

        let config = {
            chart: {
                type: 'column',
                zoomType: 'x'
            },
            title: {
                text: ''
            },
            subtitle: {
                text: ''
            },
            lang: N18.chartLang,
            xAxis: {
                categories: categories
            },
            yAxis: {
                min: 0,
                title: {
                    text: N18.hour
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            series: [{
                name: N18.timeCount,
                data: data
            }]
        }

        return (
            <Paper>
                <div style={styles.container}>
                    <Highcharts config={config} ref="chart" ></Highcharts>
                </div>
            </Paper>
        )
    }
}

TaskBarChart.propTypes = {
    tasks: React.PropTypes.array.isRequired,
    period: React.PropTypes.string.isRequired   //数据的时期：按周，月，年的跨度来分析
}

export default TaskBarChart