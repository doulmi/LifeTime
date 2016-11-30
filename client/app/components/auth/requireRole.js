import React, { Component } from 'react'
import { connect } from 'react-redux'

/**
 * 判断用户是否有权限访问该Link
 */
export default function (ComposedComponent, roles) {
  class Authenticate extends React.Component {
    componentWillMount() {
      let {isAuthenticated, user} = this.props.auth;
      if (!isAuthenticated) {
        this.context.router.push('/login');
      }
      
      let isArray = (obj) => {
        return !!obj && Array === obj.constructor;
      }

      if (isArray(roles)) {
        if (roles.indexOf(user.role) == -1) { //find
          this.context.router.push('/404');
        }
      }

      if (typeof (roles) == 'string') {
        if (roles != user.role) {
          this.context.router.push('/404')
        }
      }
    }

    componentWillUpdate(nextProps) {
      if (!nextProps.auth.isAuthenticated) {
        this.context.push('/login');
      }
    }

    render() {
      return (
        <ComposedComponent {...this.props} />
      )
    }
  }

  Authenticate.propTypes = {
    auth: React.PropTypes.object.isRequired
  }

  Authenticate.contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  const mapStateToProps = (state) => {
    return {
      auth: state.auth
    }
  }
  return connect(mapStateToProps)(Authenticate);
}
