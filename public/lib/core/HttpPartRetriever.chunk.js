/** Notice * This file contains works from many authors under various (but compatible) licenses. Please see core.txt for more information. **/
(function(){(window.wpCoreControlsBundle=window.wpCoreControlsBundle||[]).push([[0],{572:function(ya,ta,n){n.r(ta);n.d(ta,"ByteRangeRequest",function(){return w});var pa=n(0),na=n(1);n.n(na);var oa=n(3),ka=n(195);ya=n(120);var ja=n(328),fa=n(109),x=n(100),y=n(327),r=n(219);n=n(495);var h=[],f=[],b=window,e=function(){return function(){this.tq=1}}(),a;(function(aa){aa[aa.UNSENT=0]="UNSENT";aa[aa.DONE=4]="DONE"})(a||(a={}));var w=function(){function aa(ca,ba,ha,ea){var ma=this;this.url=ca;this.range=ba;this.Nf=
ha;this.withCredentials=ea;this.Yia=a;this.request=new XMLHttpRequest;this.request.open("GET",this.url,!0);b.Uint8Array&&(this.request.responseType="arraybuffer");ea&&(this.request.withCredentials=ea);z.DISABLE_RANGE_HEADER||(Object(na.isUndefined)(ba.stop)?this.request.setRequestHeader("Range","bytes=".concat(ba.start)):this.request.setRequestHeader("Range",["bytes=",ba.start,"-",ba.stop-1].join("")));ha&&Object.keys(ha).forEach(function(la){ma.request.setRequestHeader(la,ha[la])});this.request.overrideMimeType?
this.request.overrideMimeType("text/plain; charset=x-user-defined"):this.request.setRequestHeader("Accept-Charset","x-user-defined");this.status=y.a.NOT_STARTED}aa.prototype.start=function(ca){var ba=this,ha=this.request;ha.onreadystatechange=function(){if(ba.aborted)return ba.status=y.a.ABORTED,ca({code:y.a.ABORTED});if(this.readyState===ba.Yia.DONE){ba.IK();var ea=0===window.document.URL.indexOf("file:///");200===ha.status||206===ha.status||ea&&0===ha.status?(ea=b.s7(this),ba.NY(ea,ca)):(ba.status=
y.a.ERROR,ca({code:ba.status,status:ba.status}))}};this.request.send(null);this.status=y.a.STARTED};aa.prototype.NY=function(ca,ba){this.status=y.a.SUCCESS;if(ba)return ba(!1,ca)};aa.prototype.abort=function(){this.IK();this.aborted=!0;this.request.abort()};aa.prototype.IK=function(){var ca=Object(r.c)(this.url,this.range,f);-1!==ca&&f.splice(ca,1);if(0<h.length){ca=h.shift();var ba=new aa(ca.url,ca.range,this.Nf,this.withCredentials);ca.request=ba;f.push(ca);ba.start(Object(r.d)(ca))}};aa.prototype.extend=
function(ca){var ba=Object.assign({},this,ca.prototype);ba.constructor=ca;return ba};return aa}(),z=function(aa){function ca(ba,ha,ea,ma,la){ea=aa.call(this,ba,ea,ma)||this;ea.nm={};ea.OI=ha;ea.url=ba;ea.DISABLE_RANGE_HEADER=!1;ea.XE=w;ea.d_=3;ea.Nf=la||{};return ea}Object(pa.c)(ca,aa);ca.prototype.gC=function(ba,ha,ea){var ma=-1===ba.indexOf("?")?"?":"&";switch(ea){case !1:case x.a.NEVER_CACHE:ba="".concat(ba+ma,"_=").concat(Object(na.uniqueId)());break;case !0:case x.a.CACHE:ba="".concat(ba+ma,
"_=").concat(ha.start,",").concat(Object(na.isUndefined)(ha.stop)?"":ha.stop)}return ba};ca.prototype.z4=function(ba,ha,ea,ma){void 0===ea&&(ea={});return new this.XE(ba,ha,ea,ma)};ca.prototype.Xsa=function(ba,ha,ea,ma,la){for(var ia=0;ia<h.length;ia++)if(Object(na.isEqual)(h[ia].range,ha)&&Object(na.isEqual)(h[ia].url,ba))return h[ia].fj.push(ma),h[ia].aM++,null;for(ia=0;ia<f.length;ia++)if(Object(na.isEqual)(f[ia].range,ha)&&Object(na.isEqual)(f[ia].url,ba))return f[ia].fj.push(ma),f[ia].aM++,null;
ea={url:ba,range:ha,OI:ea,fj:[ma],aM:1};if(0===h.length&&f.length<this.d_)return f.push(ea),ea.request=this.z4(ba,ha,la,this.withCredentials),ea;h.push(ea);return null};ca.prototype.zs=function(ba,ha,ea){var ma=this.gC(ba,ha,this.OI);(ba=this.Xsa(ma,ha,this.OI,ea,this.Nf))&&ba.request.start(Object(r.d)(ba));return function(){var la=Object(r.c)(ma,ha,f);if(-1!==la){var ia=--f[la].aM;0===ia&&f[la].request&&f[la].request.abort()}else la=Object(r.c)(ma,ha,h),-1!==la&&(ia=--h[la].aM,0===ia&&h.splice(la,
1))}};ca.prototype.J6=function(){return{start:-ka.a}};ca.prototype.Lxa=function(){var ba=-(ka.a+ka.e);return{start:ba-ka.d,end:ba}};ca.prototype.Wy=function(ba){var ha=this;this.YI=!0;var ea=ka.a;this.zs(this.url,this.J6(),function(ma,la,ia){function ra(){var qa=ha.Pe.G6();ha.zs(ha.url,qa,function(sa,ua){if(sa)return Object(oa.i)("Error loading central directory: ".concat(sa)),ba(sa);ua=Object(fa.a)(ua);if(ua.length!==qa.stop-qa.start)return ba("Invalid XOD file: Zip central directory data is wrong size! Should be ".concat(qa.stop-
qa.start," but is ").concat(ua.length));ha.Pe.nba(ua);ha.hR=!0;ha.YI=!1;return ba(!1)})}if(ma)return Object(oa.i)("Error loading end header: ".concat(ma)),ba(ma,la,ia);la=Object(fa.a)(la);if(la.length!==ea)return ba("Invalid XOD file: Zip end header data is wrong size!");try{ha.Pe=new ja.a(la)}catch(qa){return ba(qa)}ha.Pe.mAa?ha.zs(ha.url,ha.Lxa(),function(qa,sa){if(qa)return Object(oa.i)("Error loading zip64 header: ".concat(qa)),ba(qa);sa=Object(fa.a)(sa);ha.Pe.QAa(sa);ra()}):ra()})};ca.prototype.l7=
function(ba){ba(Object.keys(this.Pe.Rr))};ca.prototype.YW=function(ba,ha){var ea=this;if(this.Pe.h4(ba)){var ma=this.Pe.$C(ba);if(ma in this.nm){var la=this.Bj[ba];la.mx=this.nm[ma];la.mx.tq++;la.cancel=la.mx.cancel}else{var ia=this.Pe.pva(ba),ra=this.zs(this.url,ia,function(sa,ua){sa?(Object(oa.i)('Error loading part "'.concat(ba,'": ').concat(sa)),ea.zs(ea.url,ia,function(va,Ba){if(va)return ha(va,ba);ea.rba(Ba,ia,ma,ba,ha)})):ea.rba(ua,ia,ma,ba,ha)}),qa=this.Bj[ba];qa&&(qa.tea=!0,qa.cancel=function(){qa.mx.tq--;
0===qa.mx.tq&&(ra(),delete ea.nm[ma])},this.nm[ma]=new e(ma),qa.mx=this.nm[ma],qa.mx.cancel=qa.cancel)}}else delete this.Bj[ba],ha(Error('File not found: "'.concat(ba,'"')),ba)};ca.prototype.rba=function(ba,ha,ea,ma,la){if(ba.length!==ha.stop-ha.start)la(Error("Part data is wrong size!"),ma);else{do{if(!this.nm[ea])return;ma=this.nm[ea].tq;for(var ia=ha.Bv.length,ra=0;ra<ia;++ra){var qa=ha.Bv[ra];la(!1,qa.yv,ba["string"===typeof ba?"substring":"subarray"](qa.start,qa.stop),this.Pe.N8(qa.yv));qa.yv in
this.Bj&&delete this.Bj[qa.yv]}}while(ma!==this.nm[ea].tq);delete this.nm[ea]}};ca.DISABLE_RANGE_HEADER=!1;ca.d_=3;return ca}(ya.a);(function(aa){function ca(ba,ha,ea){var ma=aa.call(this)||this,la;for(la in ba)ma[la]=ba[la];ma.eQa=ba;ma.startOffset=ha;ma.endOffset=ea;ma.z4=function(ia,ra,qa,sa){Object(na.isUndefined)(ra.stop)?(ra.start+=ma.endOffset,ra.stop=ma.endOffset):(ra.start+=ma.startOffset,ra.stop+=ma.startOffset);ia=ma.gC(ma.url,ra,ma.OI);return new ba.XE(ia,ra,qa,sa)};return ma}Object(pa.c)(ca,
aa);return ca})(z);Object(n.a)(z);Object(n.b)(z);ta["default"]=z}}]);}).call(this || window)
