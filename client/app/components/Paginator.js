import React, { Component } from 'react'
import { Link } from 'react-router'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import { cyan500 } from 'material-ui/styles/colors'
import N18 from '../constants/string'

const styles = {
  paginate: {
    marginTop: 50,
    marginBottom: 30
  }
}
class Paginator extends Component {
  constructor(props) {
    super(props);

    this.loadPage = this.loadPage.bind(this);
  }

  loadPage(page, query) {
    // this.context.router.push(this.props.link + '/' + (page+1));
    this.props.loadData(page, query);
  }

  getPages() {
    let key = 0;
    let maxLink = 11;
    let paginate = this.props.paginate;
    let pages = [];

    let page = (number, label) => {
      return {
        active: number == this.props.paginate.currentPage,
        key: key++,
        number: number + 1,
        label: label == undefined ? number + 1 : label
      }
    }

    if (paginate != undefined && paginate.total > 1) {
      if (paginate.prePage != undefined) {
        pages.push(page(paginate.prePage, '<'));
      }

      if (paginate.total > maxLink) {
        let currentPage = paginate.currentPage;

        if (currentPage <= 5) {
          for (let i = 0; i < 8; i++) {
            pages.push(page(i));
          }
          pages.push(page(-1, '...'));
          pages.push(page(paginate.total - 2));
          pages.push(page(paginate.total - 1));
        } else if (currentPage >= paginate.total - 6) {
          pages.push(page(0));
          pages.push(page(1));
          pages.push(page(-1, '...'));

          for (let i = paginate.total - 8; i < paginate.total; i++) {
            pages.push(page(i));
          }
        } else {
          pages.push(page(0));
          pages.push(page(1));
          pages.push(page(-1, '...'));

          for (let i = paginate.currentPage - 4; i < paginate.currentPage + 4; i++) {
            pages.push(page(i));
          }

          pages.push(page(-1, '...'));
          pages.push(page(paginate.total - 2));
          pages.push(page(paginate.total - 1));
        }
      } else {
        for (let i = 0; i < paginate.total; i++) {
          pages.push(page(i))
        }
      }
      if (paginate.nextPage != undefined) {
        pages.push(page(paginate.nextPage, '>'));
      }
    }
    return pages;
  }

  render() {
    let pages = this.getPages();

    let activeBgColor = this.props.activeBgColor == undefined ? cyan500 : this.props.activeBgColor;
    let activeLabelColor = this.props.activeLabelStyle == undefined ? { color: 'white' } : { color: this.props.activeLabelStyle };

    let bgColor = this.props.bgColor == undefined ? 'white' : this.props.bgColor;
    let labelColor = this.props.labelStyle == undefined ? { color: cyan500 } : { color: this.props.labelStyle };

    return (
      <center style={styles.paginate}>
        {pages.map(page => (
            <RaisedButton
              key={page.number + 1 + page.label}
              style={{ minWidth: 20 }}
              label={page.label}
              labelStyle={page.active ? activeLabelColor : labelColor}
              backgroundColor={page.active ? activeBgColor : bgColor}
              onTouchTap={page.number == 0 ? {} : () => this.loadPage(page.number - 1, this.props.query)}
              />
        ))}
      </center>
    )
  }
}

Paginator.propTypes = {
  query: React.PropTypes.string,
  loadData: React.PropTypes.func.isRequired
}

Paginator.contextTypes = {
  router: React.PropTypes.object.isRequired
}

export default Paginator