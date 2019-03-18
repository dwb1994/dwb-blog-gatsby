const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)
const moment = require(`moment`)

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions
  

  const blogPost = path.resolve(`./src/templates/blog-post.js`)
  return graphql(
    `
      {
        allMarkdownRemark(
          sort: { fields: [frontmatter___date], order: DESC }
          limit: 1000
        ) {
          edges {
            node {
              fields {
                slug
              }
              frontmatter {
                title
                type
              }
            }
          }
        }
      }
    `
  ).then(result => {
    if (result.errors) {
      throw result.errors
    }
    // Create blog posts pages.
    const posts = result.data.allMarkdownRemark.edges
    // console.log(JSON.stringify(posts, null, 4));

    const formatPosts = {
      blog: [],
      design: [],
      other: []
    }
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

    // 新建页面 所有页面
    posts.forEach((post, index) => {
      // posts.forEach((post, index) => {
      // console.log(JSON.stringify(post.node.fields, null, 4));
      const previous = index === posts.length - 1 ? null : posts[index + 1].node
      const next = index === 0 ? null : posts[index - 1].node
      createPage({
        path: post.node.fields.slug,
        component: blogPost,
        context: {
          slug: post.node.fields.slug,
          previous,
          next,
        },
      })
    })

    // Create blog post list pages
    const postsPerPage = 10;
    const numPages = Math.ceil(formatPosts.blog.length / postsPerPage);

    Array.from({ length: numPages }).forEach((_, i) => {
      createPage({
        path: i === 0 ? `/` : `/${i + 1}`,
        component: path.resolve('./src/templates/blog-list.js'),
        context: {
          limit: postsPerPage,
          skip: i * postsPerPage,
          numPages,
          currentPage: i + 1
        },
      });
    });
  })
}

// 添加 blog 前缀
function addBlogPrefix(path, frontmatter) {
  const { type } = frontmatter;
  switch (type) {
    case 'blog':
      return '/blog' + path;
      break;
    case 'design':
      return '/design' + path;
      break;
    default:
      return path;
      break;
  }
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    let value = createFilePath({ node, getNode })
    if (node.frontmatter.date) {
      const formatDate = moment(node.frontmatter.date).format('YYYY-MM-DD-');
      if (value.indexOf(formatDate) !== -1) {
        value = value.replace(formatDate, '')
      }
    }
    if (node.frontmatter.type) {
      value = addBlogPrefix(value, node.frontmatter)
    }
    
    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}