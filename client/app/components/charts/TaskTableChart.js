import React, { Component } from 'react'
import {List, ListItem, Paper, Divider} from 'material-ui'
import ImageLens from 'material-ui/svg-icons/image/lens';
import {grey500} from 'material-ui/styles/colors'

import N18 from '../../constants/string'
import Timer from '../../utils/timer'

const styles = {
  container: {
  },
  mostTracked: {
    fontSize: 24,
    color: grey500,
    marginTop: 42,
    marginBottom: 10
  },
  title: {
    fontSize: 12,
    fontWeight: 'bold'
  },
  subtitle: {
    fontSize: 12,
  },
  innerDiv: {
    minHeight: 60
  },
  sanBorderList: {
    paddingBottom: 0,
    paddingTop: 0
  }
}
class TaskTableChart extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let taskWithName = [];
    let tags = [];
    
    this.props.tasks.map(task => {
      if(taskWithName[task.text] == undefined) {
        if(task.tag != undefined) {
          tags[task.text] = task.tag;
        } else {
          tags[task.text] = {
            name: N18.noTag,
            color: '#000000'
          };
        }
        taskWithName[task.text] = []; 
      }
      taskWithName[task.text].push(task);
    });

    let keys = Object.keys(taskWithName);
    let times = [];
    keys.map(key => {
      let time = 0;
      taskWithName[key].map(task => {
        time += task.duration;
      })
      times[key] = time;
    });

    return(
      <div style={styles.container}>
        <div style={styles.mostTracked}>{N18.mostTracked}</div>
        <Paper>
          <List style={styles.sanBorderList}>
            {keys.map( key => (
              <div>
              <Divider />
              <ListItem key={key}
                innerDivStyle={styles.innerDiv}
                key={key}>
                <div><span style={styles.title}>{key}</span><span className="pull-right" style={styles.subtitle}>{Timer.hms(times[key])}</span></div>
                <div><ImageLens style={{width: 10, height: 10}} color={tags[key].color} /> <span style={styles.subtitle}>{tags[key].name}</span></div>
              </ListItem> 
              </div>
            ))}
          </List>
        </Paper>
      </div>
    )
  }
}

export default TaskTableChart