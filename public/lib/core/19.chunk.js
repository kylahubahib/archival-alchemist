/** Notice * This file contains works from many authors under various (but compatible) licenses. Please see core.txt for more information. **/
(function(){(window.wpCoreControlsBundle=window.wpCoreControlsBundle||[]).push([[19],{589:function(ya){(function(){ya.exports={Ma:function(){function ta(b,e){this.scrollLeft=b;this.scrollTop=e}function n(b){if(null===b||"object"!==typeof b||void 0===b.behavior||"auto"===b.behavior||"instant"===b.behavior)return!0;if("object"===typeof b&&"smooth"===b.behavior)return!1;throw new TypeError("behavior member of ScrollOptions "+b.behavior+" is not a valid value for enumeration ScrollBehavior.");}function pa(b,e){if("Y"===
e)return b.clientHeight+f<b.scrollHeight;if("X"===e)return b.clientWidth+f<b.scrollWidth}function na(b,e){b=fa.getComputedStyle(b,null)["overflow"+e];return"auto"===b||"scroll"===b}function oa(b){var e=pa(b,"Y")&&na(b,"Y");b=pa(b,"X")&&na(b,"X");return e||b}function ka(b){var e=(h()-b.startTime)/468;var a=.5*(1-Math.cos(Math.PI*(1<e?1:e)));e=b.QF+(b.x-b.QF)*a;a=b.RF+(b.y-b.RF)*a;b.method.call(b.gN,e,a);e===b.x&&a===b.y||fa.requestAnimationFrame(ka.bind(fa,b))}function ja(b,e,a){var w=h();if(b===x.body){var z=
fa;var aa=fa.scrollX||fa.pageXOffset;b=fa.scrollY||fa.pageYOffset;var ca=r.scroll}else z=b,aa=b.scrollLeft,b=b.scrollTop,ca=ta;ka({gN:z,method:ca,startTime:w,QF:aa,RF:b,x:e,y:a})}var fa=window,x=document;if(!("scrollBehavior"in x.documentElement.style&&!0!==fa.CNa)){var y=fa.HTMLElement||fa.Element,r={scroll:fa.scroll||fa.scrollTo,scrollBy:fa.scrollBy,w5:y.prototype.scroll||ta,scrollIntoView:y.prototype.scrollIntoView},h=fa.performance&&fa.performance.now?fa.performance.now.bind(fa.performance):Date.now,
f=RegExp("MSIE |Trident/|Edge/").test(fa.navigator.userAgent)?1:0;fa.scroll=fa.scrollTo=function(b,e){void 0!==b&&(!0===n(b)?r.scroll.call(fa,void 0!==b.left?b.left:"object"!==typeof b?b:fa.scrollX||fa.pageXOffset,void 0!==b.top?b.top:void 0!==e?e:fa.scrollY||fa.pageYOffset):ja.call(fa,x.body,void 0!==b.left?~~b.left:fa.scrollX||fa.pageXOffset,void 0!==b.top?~~b.top:fa.scrollY||fa.pageYOffset))};fa.scrollBy=function(b,e){void 0!==b&&(n(b)?r.scrollBy.call(fa,void 0!==b.left?b.left:"object"!==typeof b?
b:0,void 0!==b.top?b.top:void 0!==e?e:0):ja.call(fa,x.body,~~b.left+(fa.scrollX||fa.pageXOffset),~~b.top+(fa.scrollY||fa.pageYOffset)))};y.prototype.scroll=y.prototype.scrollTo=function(b,e){if(void 0!==b)if(!0===n(b)){if("number"===typeof b&&void 0===e)throw new SyntaxError("Value could not be converted");r.w5.call(this,void 0!==b.left?~~b.left:"object"!==typeof b?~~b:this.scrollLeft,void 0!==b.top?~~b.top:void 0!==e?~~e:this.scrollTop)}else e=b.left,b=b.top,ja.call(this,this,"undefined"===typeof e?
this.scrollLeft:~~e,"undefined"===typeof b?this.scrollTop:~~b)};y.prototype.scrollBy=function(b,e){void 0!==b&&(!0===n(b)?r.w5.call(this,void 0!==b.left?~~b.left+this.scrollLeft:~~b+this.scrollLeft,void 0!==b.top?~~b.top+this.scrollTop:~~e+this.scrollTop):this.scroll({left:~~b.left+this.scrollLeft,top:~~b.top+this.scrollTop,behavior:b.behavior}))};y.prototype.scrollIntoView=function(b){if(!0===n(b))r.scrollIntoView.call(this,void 0===b?!0:b);else{for(b=this;b!==x.body&&!1===oa(b);)b=b.parentNode||
b.host;var e=b.getBoundingClientRect(),a=this.getBoundingClientRect();b!==x.body?(ja.call(this,b,b.scrollLeft+a.left-e.left,b.scrollTop+a.top-e.top),"fixed"!==fa.getComputedStyle(b).position&&fa.scrollBy({left:e.left,top:e.top,behavior:"smooth"})):fa.scrollBy({left:a.left,top:a.top,behavior:"smooth"})}}}}}})()}}]);}).call(this || window)
