(window.webpackJsonp=window.webpackJsonp||[]).push([[82],{1929:function(t,e,n){"use strict";n.r(e);n(23),n(8),n(24),n(116),n(32),n(41),n(10),n(161),n(9),n(12),n(46),n(51),n(76),n(17),n(190),n(19),n(11),n(13),n(14),n(16),n(15),n(20),n(59),n(22),n(64),n(65),n(66),n(67),n(37),n(39),n(40),n(63);var r=n(0),o=n.n(r),a=n(18),i=n.n(a),c=n(6),l=n(396),u=n(69),s=n(1),f=n(128),d=n(43),h=n(2),p=n(3),m=n(5),v=n(334),y=n(71);n(1699);function g(t){return(g="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function b(t){return function(t){if(Array.isArray(t))return k(t)}(t)||function(t){if("undefined"!=typeof Symbol&&null!=t[Symbol.iterator]||null!=t["@@iterator"])return Array.from(t)}(t)||A(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function w(){/*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */w=function(){return t};var t={},e=Object.prototype,n=e.hasOwnProperty,r=Object.defineProperty||function(t,e,n){t[e]=n.value},o="function"==typeof Symbol?Symbol:{},a=o.iterator||"@@iterator",i=o.asyncIterator||"@@asyncIterator",c=o.toStringTag||"@@toStringTag";function l(t,e,n){return Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{l({},"")}catch(t){l=function(t,e,n){return t[e]=n}}function u(t,e,n,o){var a=e&&e.prototype instanceof d?e:d,i=Object.create(a.prototype),c=new x(o||[]);return r(i,"_invoke",{value:A(t,n,c)}),i}function s(t,e,n){try{return{type:"normal",arg:t.call(e,n)}}catch(t){return{type:"throw",arg:t}}}t.wrap=u;var f={};function d(){}function h(){}function p(){}var m={};l(m,a,(function(){return this}));var v=Object.getPrototypeOf,y=v&&v(v(O([])));y&&y!==e&&n.call(y,a)&&(m=y);var b=p.prototype=d.prototype=Object.create(m);function E(t){["next","throw","return"].forEach((function(e){l(t,e,(function(t){return this._invoke(e,t)}))}))}function L(t,e){var o;r(this,"_invoke",{value:function(r,a){function i(){return new e((function(o,i){!function r(o,a,i,c){var l=s(t[o],t,a);if("throw"!==l.type){var u=l.arg,f=u.value;return f&&"object"==g(f)&&n.call(f,"__await")?e.resolve(f.__await).then((function(t){r("next",t,i,c)}),(function(t){r("throw",t,i,c)})):e.resolve(f).then((function(t){u.value=t,i(u)}),(function(t){return r("throw",t,i,c)}))}c(l.arg)}(r,a,o,i)}))}return o=o?o.then(i,i):i()}})}function A(t,e,n){var r="suspendedStart";return function(o,a){if("executing"===r)throw new Error("Generator is already running");if("completed"===r){if("throw"===o)throw a;return P()}for(n.method=o,n.arg=a;;){var i=n.delegate;if(i){var c=k(i,n);if(c){if(c===f)continue;return c}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if("suspendedStart"===r)throw r="completed",n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);r="executing";var l=s(t,e,n);if("normal"===l.type){if(r=n.done?"completed":"suspendedYield",l.arg===f)continue;return{value:l.arg,done:n.done}}"throw"===l.type&&(r="completed",n.method="throw",n.arg=l.arg)}}}function k(t,e){var n=e.method,r=t.iterator[n];if(void 0===r)return e.delegate=null,"throw"===n&&t.iterator.return&&(e.method="return",e.arg=void 0,k(t,e),"throw"===e.method)||"return"!==n&&(e.method="throw",e.arg=new TypeError("The iterator does not provide a '"+n+"' method")),f;var o=s(r,t.iterator,e.arg);if("throw"===o.type)return e.method="throw",e.arg=o.arg,e.delegate=null,f;var a=o.arg;return a?a.done?(e[t.resultName]=a.value,e.next=t.nextLoc,"return"!==e.method&&(e.method="next",e.arg=void 0),e.delegate=null,f):a:(e.method="throw",e.arg=new TypeError("iterator result is not an object"),e.delegate=null,f)}function N(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function S(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function x(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(N,this),this.reset(!0)}function O(t){if(t){var e=t[a];if(e)return e.call(t);if("function"==typeof t.next)return t;if(!isNaN(t.length)){var r=-1,o=function e(){for(;++r<t.length;)if(n.call(t,r))return e.value=t[r],e.done=!1,e;return e.value=void 0,e.done=!0,e};return o.next=o}}return{next:P}}function P(){return{value:void 0,done:!0}}return h.prototype=p,r(b,"constructor",{value:p,configurable:!0}),r(p,"constructor",{value:h,configurable:!0}),h.displayName=l(p,c,"GeneratorFunction"),t.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===h||"GeneratorFunction"===(e.displayName||e.name))},t.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,p):(t.__proto__=p,l(t,c,"GeneratorFunction")),t.prototype=Object.create(b),t},t.awrap=function(t){return{__await:t}},E(L.prototype),l(L.prototype,i,(function(){return this})),t.AsyncIterator=L,t.async=function(e,n,r,o,a){void 0===a&&(a=Promise);var i=new L(u(e,n,r,o),a);return t.isGeneratorFunction(n)?i:i.next().then((function(t){return t.done?t.value:i.next()}))},E(b),l(b,c,"Generator"),l(b,a,(function(){return this})),l(b,"toString",(function(){return"[object Generator]"})),t.keys=function(t){var e=Object(t),n=[];for(var r in e)n.push(r);return n.reverse(),function t(){for(;n.length;){var r=n.pop();if(r in e)return t.value=r,t.done=!1,t}return t.done=!0,t}},t.values=O,x.prototype={constructor:x,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=void 0,this.done=!1,this.delegate=null,this.method="next",this.arg=void 0,this.tryEntries.forEach(S),!t)for(var e in this)"t"===e.charAt(0)&&n.call(this,e)&&!isNaN(+e.slice(1))&&(this[e]=void 0)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var e=this;function r(n,r){return i.type="throw",i.arg=t,e.next=n,r&&(e.method="next",e.arg=void 0),!!r}for(var o=this.tryEntries.length-1;o>=0;--o){var a=this.tryEntries[o],i=a.completion;if("root"===a.tryLoc)return r("end");if(a.tryLoc<=this.prev){var c=n.call(a,"catchLoc"),l=n.call(a,"finallyLoc");if(c&&l){if(this.prev<a.catchLoc)return r(a.catchLoc,!0);if(this.prev<a.finallyLoc)return r(a.finallyLoc)}else if(c){if(this.prev<a.catchLoc)return r(a.catchLoc,!0)}else{if(!l)throw new Error("try statement without catch or finally");if(this.prev<a.finallyLoc)return r(a.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var o=this.tryEntries[r];if(o.tryLoc<=this.prev&&n.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var a=o;break}}a&&("break"===t||"continue"===t)&&a.tryLoc<=e&&e<=a.finallyLoc&&(a=null);var i=a?a.completion:{};return i.type=t,i.arg=e,a?(this.method="next",this.next=a.finallyLoc,f):this.complete(i)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),f},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.finallyLoc===t)return this.complete(n.completion,n.afterLoc),S(n),f}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.tryLoc===t){var r=n.completion;if("throw"===r.type){var o=r.arg;S(n)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(t,e,n){return this.delegate={iterator:O(t),resultName:e,nextLoc:n},"next"===this.method&&(this.arg=void 0),f}},t}function E(t,e,n,r,o,a,i){try{var c=t[a](i),l=c.value}catch(t){return void n(t)}c.done?e(l):Promise.resolve(l).then(r,o)}function L(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){var n=null==t?null:"undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(null!=n){var r,o,a,i,c=[],l=!0,u=!1;try{if(a=(n=n.call(t)).next,0===e){if(Object(n)!==n)return;l=!1}else for(;!(l=(r=a.call(n)).done)&&(c.push(r.value),c.length!==e);l=!0);}catch(t){u=!0,o=t}finally{try{if(!l&&null!=n.return&&(i=n.return(),Object(i)!==i))return}finally{if(u)throw o}}return c}}(t,e)||A(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function A(t,e){if(t){if("string"==typeof t)return k(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?k(t,e):void 0}}function k(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}var N=function(t){var e=t.rightClickedAnnotation,n=t.setRightClickedAnnotation,a=L(Object(c.e)((function(t){return[p.a.isElementDisabled(t,m.a.LINK_MODAL),p.a.isElementOpen(t,m.a.LINK_MODAL),p.a.getTotalPages(t),p.a.getCurrentPage(t),p.a.getSelectedTab(t,m.a.LINK_MODAL),p.a.getPageLabels(t),p.a.isRightClickAnnotationPopupEnabled(t),p.a.getActiveDocumentViewerKey(t),p.a.getSelectedTab(t,"linkModal")]})),9),g=a[0],A=a[1],k=a[2],N=a[3],S=a[4],x=a[5],O=a[6],P=a[7],j=a[8],C=L(Object(l.a)(),1)[0],I=Object(c.d)(),_=o.a.createRef(),T=o.a.createRef(),M=L(Object(r.useState)(""),2),U=M[0],D=M[1],G=L(Object(r.useState)(""),2),R=G[0],B=G[1],F=s.a.isAnnotationSelected(e,P),H=s.a.getSelectedAnnotations(P),K=s.a.getAnnotationManager(P),Y=function(){I(h.a.closeElement(m.a.LINK_MODAL)),D(""),s.a.setToolMode(u.a),n(null)},W=function(t,e,n,r){var o=arguments.length>4&&void 0!==arguments[4]?arguments[4]:N,a=new window.Core.Annotations.Link;return a.PageNumber=o,a.StrokeColor=new window.Core.Annotations.Color(0,165,228),a.StrokeStyle="underline",a.StrokeThickness=2,a.Author=s.a.getCurrentUser(),a.Subject="Link",a.X=t,a.Y=e,a.Width=n,a.Height=r,a},X=function(t){var n=[],r=s.a.getSelectedTextQuads(P);if(r){var o=s.a.getSelectedText(P),a=function(e){var a=[];r[e].forEach((function(t){a.push(W(Math.min(t.x1,t.x3),Math.min(t.y1,t.y3),Math.abs(t.x1-t.x3),Math.abs(t.y1-t.y3),parseInt(e)))})),z(a,r[e],o,t),n.push.apply(n,a)};for(var i in r)a(i)}return(!O||F?H:[e]).forEach((function(e){if(e){var r=K.getGroupAnnotations(e);if(r.length>1){var o=r.filter((function(t){return t instanceof window.Core.Annotations.Link}));o.length>0&&s.a.deleteAnnotations(o,P)}var a=W(e.X,e.Y,e.Width,e.Height);a.addAction("U",t),s.a.addAnnotations([a],P),n.push(a),K.groupAnnotations(e,[a])}})),n},z=function(){var t,e=(t=w().mark((function t(e,n,r,o){var a,i;return w().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:a=e[0],(i=new window.Core.Annotations.TextHighlightAnnotation).PageNumber=a.PageNumber,i.X=a.X,i.Y=a.Y,i.Width=a.Width,i.Height=a.Height,i.StrokeColor=new window.Core.Annotations.Color(0,0,0,0),i.Opacity=0,i.Quads=n,i.Author=s.a.getCurrentUser(P),i.setContents(r),e.forEach((function(t,e){t.addAction("U",o),0===e?s.a.addAnnotations([t,i],P):s.a.addAnnotations([t],P)})),K.groupAnnotations(i,e,P);case 14:case"end":return t.stop()}}),t)})),function(){var e=this,n=arguments;return new Promise((function(r,o){var a=t.apply(e,n);function i(t){E(a,r,o,i,c,"next",t)}function c(t){E(a,r,o,i,c,"throw",t)}i(void 0)}))});return function(t,n,r,o){return e.apply(this,arguments)}}(),J=function(t){if(t.preventDefault(),U.length){var e;e=s.a.isValidURI(U)?U:"https://".concat(U);var n=new window.Core.Actions.URI({uri:e}),r=X(n).map((function(t){return t.PageNumber}));(r=b(new Set(r))).forEach((function(t){s.a.drawAnnotations(t,null,!0,void 0,P)})),Y()}},Q=function(t){t.preventDefault();var e={dest:new(0,window.Core.Actions.GoTo.Dest)({page:x.indexOf(R)+1})},n=new window.Core.Actions.GoTo(e),r=X(n).map((function(t){return t.PageNumber}));(r=b(new Set(r))).forEach((function(t){s.a.drawAnnotations(t,null,!0,void 0,P)})),Y()};Object(r.useEffect)((function(){if(A){var t=s.a.getSelectedText(P);if(t){var e=t.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);e&&e.length>0&&D(e[0])}B(x.length>0?x[0]:"1")}}),[k,A]),Object(r.useEffect)((function(){"PageNumberPanelButton"===S&&A?T.current.focus():"URLPanelButton"===S&&A&&_.current.focus()}),[S,A,T,_]),Object(r.useEffect)((function(){return s.a.addEventListener("documentUnloaded",Y),function(){s.a.removeEventListener("documentUnloaded",Y)}}),[]);var V=i()({Modal:!0,LinkModal:!0,open:A,closed:!A});return g?null:o.a.createElement(y.a,{dataElement:m.a.LINK_MODAL,className:V},o.a.createElement(v.a,{title:C("link.insertLinkOrPage"),isOpen:A,closeHandler:Y,onCloseClick:Y,swipeToClose:!0},o.a.createElement("div",{className:"container",onMouseDown:function(t){return t.stopPropagation()}},o.a.createElement(f.d,{id:"linkModal"},o.a.createElement("div",{className:"tabs-header-container"},o.a.createElement("div",{className:"tab-list"},o.a.createElement(f.a,{dataElement:"URLPanelButton"},o.a.createElement("button",{className:"tab-options-button"},C("link.url"))),o.a.createElement("div",{className:"tab-options-divider"}),o.a.createElement(f.a,{dataElement:"PageNumberPanelButton"},o.a.createElement("button",{className:"tab-options-button"},C("link.page"))))),o.a.createElement(f.c,{dataElement:"URLPanel"},o.a.createElement("div",{className:"panel-body"},o.a.createElement("div",{className:"add-url-link"},o.a.createElement("form",{onSubmit:J},o.a.createElement("label",{htmlFor:"urlInput",className:"inputLabel"},C("link.enterUrlAlt")),o.a.createElement("div",{className:"linkInput"},o.a.createElement("input",{id:"urlInput",className:"urlInput",ref:_,value:U,onChange:function(t){return D(t.target.value)}})))))),o.a.createElement(f.c,{dataElement:"PageNumberPanel"},o.a.createElement("div",{className:"panel-body"},o.a.createElement("div",{className:"add-url-link"},o.a.createElement("form",{onSubmit:Q},o.a.createElement("label",{htmlFor:"pageInput",className:"inputLabel"},C("link.enterpage")),o.a.createElement("div",{className:"linkInput"},o.a.createElement("input",{id:"pageInput",className:"pageInput",ref:T,value:R,onChange:function(t){return B(t.target.value)}}))))))),o.a.createElement("div",{className:"divider"}),o.a.createElement("div",{className:"footer"},"URLPanelButton"===j?o.a.createElement(d.a,{className:"ok-button",dataElement:"linkSubmitButton",label:C("action.link"),onClick:J,disabled:!U.length}):o.a.createElement(d.a,{className:"ok-button",dataElement:"linkSubmitButton",label:C("action.link"),onClick:Q,disabled:!(null==x?void 0:x.includes(R))})))))};e.default=N}}]);
//# sourceMappingURL=82.chunk.js.map