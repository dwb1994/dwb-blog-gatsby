(window.webpackJsonp=window.webpackJsonp||[]).push([[5],{142:function(e,t,n){"use strict";n.r(t),n.d(t,"pageQuery",function(){return f});n(80),n(205),n(79),n(207);var a=n(7),r=n.n(a),o=n(0),i=n.n(o),l=n(147),c=n(151),s=n(153),u=(n(154),function(e){function t(){for(var t,n=arguments.length,a=new Array(n),r=0;r<n;r++)a[r]=arguments[r];return(t=e.call.apply(e,[this].concat(a))||this).articleClick=function(e){Object(l.navigate)(e)},t}return r()(t,e),t.prototype.render=function(){var e=this,t=this.props.data,n=t.site.siteMetadata.title,a=t.allMarkdownRemark.edges,r=this.props.pageContext,o=r.currentPage,u=r.numPages,f=1===o,g=o===u,p=o-1==1?"/":(o-1).toString(),m=(o+1).toString(),d={blog:[],design:[],other:[]};return a.forEach(function(e,t){switch(e.node.frontmatter.type){case"design":d.design.push(e);break;case"other":d.other.push(e);break;case"blog":default:d.blog.push(e)}}),i.a.createElement(s.a,{location:this.props.location,title:n},i.a.createElement(c.a,{title:n,keywords:["blog","dwb","董文博","dwbbb","dwbbb.com","javascript","design"]}),d.blog.map(function(t){var n=t.node,a=n.frontmatter.title||n.fields.slug;return i.a.createElement("article",{key:n.fields.slug,className:"m-post",onClick:function(){return e.articleClick(n.fields.slug)}},i.a.createElement("div",{className:"m-post-content"},i.a.createElement("h3",{className:"title"},a),i.a.createElement("small",null,n.frontmatter.date),n.frontmatter.excerpt?i.a.createElement("p",null,n.frontmatter.excerpt):i.a.createElement("p",{dangerouslySetInnerHTML:{__html:n.excerpt}})),i.a.createElement("div",{className:"m-post-img"},i.a.createElement("img",{className:"ui-img",src:n.frontmatter.photos[0],alt:""})))}),i.a.createElement("ul",{style:{display:"flex",flexWrap:"wrap",justifyContent:"center",alignItems:"center",listStyle:"none",padding:0}},!f&&i.a.createElement(l.Link,{to:p,rel:"prev"},"← Previous Page"),Array.from({length:u},function(e,t){return i.a.createElement("li",{key:"pagination-number"+(t+1),style:{margin:"0 8px"}},i.a.createElement(l.Link,{to:"/"+(0===t?"":t+1),style:{padding:".5em",textDecoration:"none"}},t+1))}),!g&&i.a.createElement(l.Link,{to:m,rel:"next"},"Next Page →")))},t}(i.a.Component));t.default=u;var f="88060731"},154:function(e,t){},205:function(e,t,n){"use strict";var a=n(18),r=n(11),o=n(26),i=n(75),l=n(76),c=n(14),s=n(206),u=n(77);r(r.S+r.F*!n(78)(function(e){Array.from(e)}),"Array",{from:function(e){var t,n,r,f,g=o(e),p="function"==typeof this?this:Array,m=arguments.length,d=m>1?arguments[1]:void 0,h=void 0!==d,y=0,v=u(g);if(h&&(d=a(d,m>2?arguments[2]:void 0,2)),null==v||p==Array&&l(v))for(n=new p(t=c(g.length));t>y;y++)s(n,y,h?d(g[y],y):g[y]);else for(f=v.call(g),n=new p;!(r=f.next()).done;y++)s(n,y,h?i(f,d,[r.value,y],!0):r.value);return n.length=y,n}})},206:function(e,t,n){"use strict";var a=n(24),r=n(53);e.exports=function(e,t,n){t in e?a.f(e,t,r(0,n)):e[t]=n}},207:function(e,t,n){"use strict";n(208);var a=n(5),r=n(73),o=n(16),i=/./.toString,l=function(e){n(17)(RegExp.prototype,"toString",e,!0)};n(25)(function(){return"/a/b"!=i.call({source:"a",flags:"b"})})?l(function(){var e=a(this);return"/".concat(e.source,"/","flags"in e?e.flags:!o&&e instanceof RegExp?r.call(e):void 0)}):"toString"!=i.name&&l(function(){return i.call(this)})},208:function(e,t,n){n(16)&&"g"!=/./g.flags&&n(24).f(RegExp.prototype,"flags",{configurable:!0,get:n(73)})}}]);
//# sourceMappingURL=component---src-templates-blog-list-js-cecb79e48384f44ee7f2.js.map