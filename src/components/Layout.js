import React from 'react'
import { Link } from 'gatsby'

import Header from './Header'
import '../styles/index.scss'; // scss 入口
// import '../../static/nav.min.js'

class Layout extends React.Component {
  render() {
    const { location, title, children } = this.props
    const isRootPath = location.pathname === `${__PATH_PREFIX__}/`
    const pageNumber = location.pathname
      .split('/')
      .filter(Boolean)
      .pop()
    const isPaginatedPath = pageNumber && Boolean(pageNumber.match(/^[0-9]+$/))
    
    return (
      <div
        style={{
          marginLeft: `auto`,
          marginRight: `auto`,
        }}
      >
        <Header />
        <div className="m-content">
          <div className="m-content-container markdown-body">
            {children}
          </div>        
        </div>
        <footer className="m-footer">
          <div className="m-footer-container">
          <span>
          © {new Date().getFullYear()}, dwb, Built with
              {` `}
              <a href="https://www.gatsbyjs.org">Gatsby</a>
          </span>
          </div>
        </footer>
      </div>
    )
  }
}

export default Layout
