(window.webpackJsonp=window.webpackJsonp||[]).push([[7],{122:function(e,t,a){"use strict";var s=a(0),n=a.n(s),o=a(110),c=a.n(o),r=a(99),i=a(98),l=a(102),u=a(48),m=a.n(u);t.a=({showAll:e=!1})=>{const{siteConfig:t={}}=Object(i.a)(),{users:a}=t.customFields,s=(e?a:a.filter((e=>e.pinned))).map(((e,t)=>n.a.createElement("a",{key:t,className:m.a.showcaseLogo,href:e.infoUrl},n.a.createElement("img",{src:Object(l.a)(e.imageUrl),title:e.caption}))));return n.a.createElement("section",{className:c()("text--center margin-top--xl",m.a.showcase)},n.a.createElement("h2",{className:c()("showcaseHeading",m.a.showcaseHeadingColored)},"Who's Using This?"),n.a.createElement("div",{className:m.a.showcaseLogos},s),e&&n.a.createElement("p",null,"Are you using this project?"),n.a.createElement("div",{className:"more-users"},e?n.a.createElement(r.a,{className:c()("button button--primary button--outline",m.a.button),href:"https://github.com/facebook/fbt/edit/main/website/docusaurus.config.js"},"Add your company/project"):n.a.createElement(r.a,{className:c()("button button--primary button--outline",m.a.button),to:Object(l.a)("users")},"More ",t.title," Users")))}},67:function(e,t,a){"use strict";a.r(t);var s=a(0),n=a.n(s),o=a(104),c=a(98),r=a(122);t.default=()=>{const{siteConfig:e={}}=Object(c.a)();return n.a.createElement(o.a,{title:`${e.title} - ${e.tagline}`,description:e.tagline},n.a.createElement(r.a,{showAll:!0}))}}}]);