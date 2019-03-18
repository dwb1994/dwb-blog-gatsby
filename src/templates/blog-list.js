import React from 'react'
import { Link, graphql, navigate } from 'gatsby'

import SEO from '../components/seo'
import Layout from '../components/Layout'
import { rhythm } from '../utils/typography'

class BlogIndex extends React.Component {

  articleClick = (link) => {
    navigate(link);
  }

  render() {
    const { data } = this.props
    // console.log(JSON.stringify(data, null, 4));
    const siteTitle = data.site.siteMetadata.title
    const posts = data.allMarkdownRemark.edges
    const { currentPage, numPages } = this.props.pageContext
    const isFirst = currentPage === 1
    const isLast = currentPage === numPages
    const prevPage = currentPage - 1 === 1 ? '/' : (currentPage - 1).toString()
    const nextPage = (currentPage + 1).toString()

    const formatPosts = {
      blog: [],
      design: [],
      other: []
    }
    // console.log('posts', posts.length);
    // console.log(JSON.stringify(posts, null, 4));
    posts.forEach((post, index) => {
      switch (post.node.frontmatter.type) {
        case 'design':
          formatPosts.design.push(post)
          break;
        case 'other':
          formatPosts.other.push(post)
          break;
        case 'blog':
          formatPosts.blog.push(post)
          break;
        default:
          formatPosts.blog.push(post)
          break;
      }
    });
    // console.log(JSON.stringify(formatPosts.blog.length, null, 4));
    
    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO
          title={siteTitle}
          keywords={[`blog`, `dwb`, `董文博`, `dwbbb`, `dwbbb.com`,`javascript`, `design`]}
        />
        {/* <Bio /> */}
        {formatPosts.blog.map(({ node }) => {
          // console.log(JSON.stringify(node, null, 4));
          const title = node.frontmatter.title || node.fields.slug
          // console.log('title', title);
          return (
            <article
              key={node.fields.slug}
              className="m-post"
              onClick={() => this.articleClick(node.fields.slug)}
            >
              <div className="m-post-content">
                <h3 className="title">{title}</h3>
                <small>{node.frontmatter.date}</small>
                {
                  node.frontmatter.excerpt ? 
                  <p>{node.frontmatter.excerpt}</p> : <p dangerouslySetInnerHTML={{ __html: node.excerpt }} />
                }
              </div>
              <div className="m-post-img">
                <img
                  className="ui-img"
                  src={node.frontmatter.photos[0]}
                  alt=""
                />
              </div>
            </article>
          )
        })}
        <ul
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            listStyle: 'none',
            padding: 0,
          }}
        >
          {!isFirst && (
            <Link to={prevPage} rel="prev">
              ← Previous Page
            </Link>
          )}
          {Array.from({ length: numPages }, (_, i) => (
            <li
              key={`pagination-number${i + 1}`}
              style={{
                margin: '0 8px',
              }}
            >
              <Link
                to={`/${i === 0 ? '' : i + 1}`}
                style={{
                  padding: `.5em`,
                  textDecoration: 'none',
                }}
              >
                {i + 1}
              </Link>
            </li>
          ))}
          {!isLast && (
            <Link to={nextPage} rel="next">
              Next Page →
            </Link>
          )}
        </ul>
      </Layout>
    )
  }
}

export default BlogIndex

export const pageQuery = graphql`
  query blogPageQuery($skip: Int!, $limit: Int!) {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      limit: $limit
      skip: $skip
      filter: {
        frontmatter: {type: {eq: "blog" }}
      }
    ) {
      edges {
        node {
          excerpt(
            format: PLAIN
            pruneLength: 100
            truncate: true
          )
          fields {
            slug
          }
          frontmatter {
            date(formatString: "DD MMMM, YYYY")
            title
            type
            photos
          }
        }
      }
    }
  }
`
