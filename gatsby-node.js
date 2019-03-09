const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

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
    // createPage({
    //   path: '/test/',
    //   component: blogPost,

    // })

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

    // console.log('formatPosts: ==\n');
    // console.log(JSON.stringify(formatPosts, null, 4));
    function addBlogPrefix(path, type) {
      if (type === 'blog') {
        return 'blog' + path;
      } else {
        return path;
      }
    }

    posts.forEach((post, index) => {
      const previous = index === posts.length - 1 ? null : posts[index + 1].node
      const next = index === 0 ? null : posts[index - 1].node
      console.log('post.node.fields.slug');
      console.log(post.node.fields.slug, post.node.frontmatter.type);
      createPage({
        path: addBlogPrefix(post.node.fields.slug, post.node.frontmatter.type),
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
    const numPages = Math.ceil(posts.length / postsPerPage);
    // console.log('numPages:', numPages);
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

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}
