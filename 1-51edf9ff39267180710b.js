(window.webpackJsonp=window.webpackJsonp||[]).push([[1],{147:function(e,t,a){"use strict";a.r(t),a.d(t,"graphql",function(){return f}),a.d(t,"StaticQueryContext",function(){return m}),a.d(t,"StaticQuery",function(){return p});var n=a(0),r=a.n(n),i=a(4),o=a.n(i),s=a(148),c=a.n(s);a.d(t,"Link",function(){return c.a}),a.d(t,"withPrefix",function(){return s.withPrefix}),a.d(t,"navigate",function(){return s.navigate}),a.d(t,"push",function(){return s.push}),a.d(t,"replace",function(){return s.replace}),a.d(t,"navigateTo",function(){return s.navigateTo});var l=a(159),u=a.n(l);a.d(t,"PageRenderer",function(){return u.a});var d=a(48);a.d(t,"parsePath",function(){return d.a});var m=r.a.createContext({}),p=function(e){return r.a.createElement(m.Consumer,null,function(t){return e.data||t[e.query]&&t[e.query].data?(e.render||e.children)(e.data?e.data.data:t[e.query].data):r.a.createElement("div",null,"Loading (StaticQuery)")})};function f(){throw new Error("It appears like Gatsby is misconfigured. Gatsby related `graphql` calls are supposed to only be evaluated at compile time, and then compiled away,. Unfortunately, something went wrong and the query was left in the compiled code.\n\n.Unless your site has a complex or custom babel/Gatsby configuration this is likely a bug in Gatsby.")}p.propTypes={data:o.a.object,query:o.a.string.isRequired,render:o.a.func,children:o.a.func}},151:function(e,t,a){"use strict";var n=a(176),r=a(0),i=a.n(r),o=a(4),s=a.n(o),c=a(177),l=a.n(c),u=a(147);function d(e){var t=e.description,a=e.lang,r=e.meta,o=e.keywords,s=e.title;return i.a.createElement(u.StaticQuery,{query:m,render:function(e){var n=t||e.site.siteMetadata.description;return i.a.createElement(l.a,{htmlAttributes:{lang:a},title:s,titleTemplate:"%s | "+e.site.siteMetadata.title,meta:[{name:"description",content:n},{property:"og:title",content:s},{name:"referrer",content:"no-referrer"},{property:"og:description",content:n},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary"},{name:"twitter:creator",content:e.site.siteMetadata.author},{name:"twitter:title",content:s},{name:"twitter:description",content:n}].concat(o.length>0?{name:"keywords",content:o.join(", ")}:[]).concat(r)})},data:n})}d.defaultProps={lang:"en",meta:[],keywords:[]},d.propTypes={description:s.a.string,lang:s.a.string,meta:s.a.array,keywords:s.a.arrayOf(s.a.string),title:s.a.string.isRequired},t.a=d;var m="1025518380"},153:function(e,t,a){"use strict";a(74),a(81);var n=a(7),r=a.n(n),i=a(0),o=a.n(i),s=(a(147),a(160),a(174),function(e){function t(t){var a;return(a=e.call(this,t)||this).handleClick=function(){a.setState({visible:!a.state.visible})},a.state={visible:!1},a}return r()(t,e),t.prototype.render=function(){return o.a.createElement("header",{className:"m-header"},o.a.createElement("div",{className:"m-header-title"},o.a.createElement("a",{href:"/",target:"_self"},o.a.createElement("img",{className:"logo",width:"36",src:"/img/1x.png",srcSet:"/img/2x.png 2x"}),o.a.createElement("h6",{className:"name"},"dwb - blog"))),o.a.createElement("nav",{className:"m-header-nav "+(this.state.visible?"visible":"")},o.a.createElement("ul",{className:"m-header-items"},o.a.createElement("li",{className:"item "},o.a.createElement("a",{className:"href",href:"/about"},"About")))),o.a.createElement("div",{id:"js-nav-btn",className:"m-header-btn ui-font-ydoc",onClick:this.handleClick},""))},t}(o.a.Component)),c=(a(175),function(e){function t(){return e.apply(this,arguments)||this}return r()(t,e),t.prototype.render=function(){var e=this.props,t=e.location,a=(e.title,e.children),n=e.custom,r=(t.pathname,t.pathname.split("/").filter(Boolean).pop());r&&Boolean(r.match(/^[0-9]+$/));return console.log("custom",n),o.a.createElement("div",{style:{marginLeft:"auto",marginRight:"auto"}},o.a.createElement(s,null),o.a.createElement("div",{className:"m-content "+(n?"custom":"")},o.a.createElement("div",{className:"m-content-container markdown-body"},a)),o.a.createElement("footer",{className:"m-footer"},o.a.createElement("div",{className:"m-footer-container"},o.a.createElement("span",null,"© ",(new Date).getFullYear(),", dwb, Built with"," ",o.a.createElement("a",{href:"https://www.gatsbyjs.org"},"Gatsby")))))},t}(o.a.Component));t.a=c},159:function(e,t,a){var n;e.exports=(n=a(170))&&n.default||n},170:function(e,t,a){"use strict";a.r(t);a(32);var n=a(0),r=a.n(n),i=a(4),o=a.n(i),s=a(68),c=a(2),l=function(e){var t=e.location,a=c.default.getResourcesForPathnameSync(t.pathname);return r.a.createElement(s.a,Object.assign({location:t,pageResources:a},a.json))};l.propTypes={location:o.a.shape({pathname:o.a.string.isRequired}).isRequired},t.default=l},175:function(e,t,a){},176:function(e){e.exports={data:{site:{siteMetadata:{title:"dwb-blog",description:"A paginated starter blog demonstrating what Gatsby can do. Extension of gatsby-starter-blog.",author:"dwb"}}}}}}]);
//# sourceMappingURL=1-51edf9ff39267180710b.js.map