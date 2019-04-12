app.AxisX=function(d){var f,c,l,v,h,w=[],m={};app.months=["Jan","Fab","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];var g=new app.E("div");function x(e,t){e.sC("tween"),e.sX(t)}function y(e){e.rC("tween"),w.push(e)}function t(){for(var e in c=1,f=0,m)w.push(m[e]),m[e].sO(0);m={}}return g.sY(250),d.add(g),{setOver:function(e){t(),v=e.columns[0].slice(1),h=v.map(function(e){var t=new Date(e);return t.getUTCDate()+" "+app.months[t.getUTCMonth()]})},setDat:function(e){t(),v=e.columns[0].slice(1),h=v.map(function(e){var t=new Date(e),n=t.getUTCHours(),i=t.getUTCMinutes();return(n<10?"0":"")+n+":"+(i<10?"0":"")+i})},render:function(e,t,n){for(var i,s=Math.floor((t-e)/5),a=1;a<s;)a*=1.4;a=Math.floor(a);var o,r=e,u=t;for(l=m,m={};r<=u;r+=a)r<0||((i=l[r])?i.sX((v[r]-v[e])*n):((i=w.pop())||(o=void 0,(o=new app.E("div")).sT(0),o.sW(50),o.sY(6),d.add(o),i=o,g.add(i)),i.index=r,i.sO(1),i.sT(h[r]),i.sX((v[r]-v[f])*c),setTimeout(x,1,i,(v[r]-v[e])*n)),m[i.index]=i);for(var p in l)i=l[p],m[i.index]||(i.sX((v[i.index]-v[e])*n),i.sO(0),setTimeout(y,500,i));f=e,c=n}}},app.Buttons=function(e,n,u){var p,d;function t(t){var n=[],r=[];t.columns.slice(1).forEach(function(e){n.push(t.names[e[0]]),r.push(t.colors[e[0]])}),p=n.map(function(e,t){var s,n,i,a,o;return(s=new app.E("div")).name=e,s.color=r[t],s.e.style.backgroundColor=r[t],s.sC("button"),d.add(s),(n=new app.E("img")).e.src="img/tick.png",n.sC("tween"),n.sC("tick"),s.add(n),(i=new app.E("span")).sC("button-text"),i.sT(e),s.add(i),s.isActive=!0,s.tick=n,s.text=i,s.onDown(function(){s.isDown=!0,o=Date.now(),a=setTimeout(function(){!function(e){var t,n,i;for(e.isDown=!1,t=0,i=p.length;t<i;t++)(e=p[t]).isActive=e===s,n=e.isActive?1:0,e.tick.sS(n,n);u(p)}(s)},200)}),s.onUp(function(){if(s.isDown&&!(200<Date.now()-o)){s.isDown=!1,clearTimeout(a),s.isActive=!s.isActive;var e=s.isActive?1:0;n.sS(e,e),u(p)}}),s})}return(d=new app.E("div")).sY(450),e.add(d),{setOver:function(e){!p&&t(e),n?(this.views=[{isActive:!0,name:e.names.y0}],d.sO(0)):this.views=p},setDat:function(e){if(d.sO(1),this.views=p,n)for(var t=0;t<p.length;t++)p[t].name=e.names[e.columns[t+1][0]],p[t].text.sT(p[t].name)},views:null}},app.Chart=function(e,t){var n,i,s,a,o,r,u,p,d,f=app.E,c=app.i,l=e.overview,v=e.data,h=0,w=3===t,m=Math.min(90,l.columns[0].length-2),g=document.body,x={getInputX:function(){return(c.x-n.e.offsetLeft)/n.sc+app.getScrollX()},getInputY:function(){return(c.y-n.e.offsetTop)/n.sc+app.getscrollY()}};function y(){d=!0,o.setOver(l),a.setOver(v[0]),r.setOver(l),i.setOver(l),s.setOver(l),p.setOver(l),u.setOver(l),r.setRange(h,m),r.renderDiagram()}return n=new f("div"),g.appendChild(n.e),n.sW(400),n.sH(540),n.sC("chart"),o=app.Header(n,y),a=app.Buttons(n,w,function(){r.renderDiagram(),i.render(r.leftIndex,r.rightIndex,s)}),p=new app.HLines(l.y_scaled?2:1),(i=app.Diagram(400,250,a,p,!0)).view.sX(0),i.view.sY(80),n.add(i.view),s=app.AxisX(i.view),r=app.ScrollBar(x,a,w,function(){o.setRange(r.leftIndex,r.rightIndex),i.render(r.leftIndex,r.rightIndex,s)}),n.add(r.view),u=app.Info(x,i,r,a,w,function(e){if(!d)return;d=!1;var t=v[e];h=r.leftIndex,m=r.rightIndex,e,o.setDat(t),a.setDat(t),r.setDat(t),r.setDat(t),i.setDat(t),s.setDat(t),p.setDat(t),u.setDat(t),r.setRange(0,Math.min(36,t.columns[0].length-2)),r.renderDiagram()}),i.bgColor="#ffffff",r.diagram.bgColor="#ffffff",y(),{view:n,update:function(){}}},app.Diagram=function(i,s,r,f,e){var c,u,p,l,n,a,d,v,h,o,w,m,g,x,y,C,D,T,E,M,O,b=0,X=[],U=[],L=-1,A=5,I=Number.MAX_VALUE,H=-Number.MAX_VALUE,Y=[],S=[],W=[],N=[],B=[],F=[],_=[],k=[],V=e?400:0,t=new app.E("div");t.sW(i),t.sH(s);var R=new app.E("div");R.e.style.overflow="hidden",R.sW(i),R.sH(s),t.add(R);var P=new app.E("div");function J(e){z(e),J=z;for(var t=0;t<T;t++)y=new app.E("div"),R.add(y),C=document.createElement("canvas"),D=C.getContext("2d",{alpha:1!==T}),C.width=i+2*V,C.height=s,C.style.transform="scale(1, -1)",C.style.height=s+"px",C.style.position="absolute",y.e.appendChild(C),B[t]=C,_[t]=D,F[t]=y;if(!l)for(t=1;t<o;t++)B[t]=B[0],_[t]=_[0],F[t]=F[0]}function z(t){h=!1,c=t.columns[0].slice(1),a=t.types,l=t.y_scaled,n=t.stacked||"bar"===a.y0,u=[],p=t.columns.slice(1).map(function(e){return u.push(t.colors[e[0]]),e=e.slice(1)}),o=p.length,O=n?(x=Z,d=t.percentage?j:G,Q):(x=K,$),T=l?o:1,b=i/(c[c.length-1]-c[0])}function q(){h=!1;for(var e=0;e<T;e++)(C=B[e]).style.width=2*V+i+"px",C.style.height=C.height+"px",C.style.top="0px",C.style.left="0px",C.classList.add("tween")}return P.sW(t.w),P.sH(t.h),P.sO(0),t.add(P),f&&f.addTo(t),{view:t,bgColor:"#ffffff",overlayLayer:P,setOver:function(e){J(e)},setDat:function(e){J(e)},render:function(e,t,n,i){var s,a,o,r,u,p=Math.ceil(t-e);if(u=e!==L&&t!==v?r=1:e!==L?(r=2,0):(r=0,2),a=Math.max(0,e-Math.floor(p*r)),o=Math.min(c.length-1,t+Math.floor(p*u)),O(e,t,a,o),_[0].fillStyle=this.bgColor,_[0].fillRect(0,0,C.width,C.height),l&&_[1].clearRect(0,0,C.width,C.height),I!==Number.MAX_VALUE){if(n&&n.render(e,t,g),f&&f.render(W,Y,S,I,M,E,i),!h){for(h=!0,s=0;s<T;s++){C=B[s],y=F[s],C.style.top=(U[s]-N[s])*X[s]+"px",C.style.height=parseInt(C.style.height)*X[s]/Y[s]+"px",C.style.width=parseInt(C.style.width)*b/g+"px",C.classList.remove("tween");var d=y.x;y.sX((c[a]-m)*g),C.style.left=d-y.x+(c[a]-c[L])*b+"px",X[s]=Y[s],U[s]=N[s]}setTimeout(q,0)}b=g,v=o,m=c[L=a],w=c[o],x(a,o)}}};function K(e,t){var n,i,s;for(n=0;n<o;n++)if(r.views[n].isActive){for(s=p[n],(D=_[n]||_[0]).beginPath(),D.moveTo((c[e]-m)*g,(s[e]-W[n])*Y[n]),i=e+1;i<=t;i++)D.lineTo((c[i]-m)*g,(s[i]-W[n])*Y[n]);D.strokeStyle=u[n],D.stroke()}}function Z(e,t){var n,i,s,a,o;for(a=(c[t]-m)*g/(t-e),n=p.length-1;0<=n;n--)if(r.views[n].isActive){for(o=p[n],s=(c[e]-m)*g,D.beginPath(),D.moveTo(s,0),i=e;i<=t;i++,s+=a)d(s,o,k,i,a);D.lineTo(s,0),D.closePath(),D.fillStyle=u[n],D.fill()}}function j(e,t,n,i){D.lineTo((c[i]-m)*g,(n[i]-I)*Y),n[i]-=t[i]}function G(e,t,n,i,s){var a=(n[i]-I)*M;n[i]-=t[i],D.lineTo(e,a),D.lineTo(e+s,a)}function Q(e,t,n,i){var s,a;for(k.length=0,H=-Number.MAX_VALUE,a=n;a<=i;a++)k[a]=0;for(s=0;s<o;s++)if(r.views[s].isActive)for(a=n;a<=i;a++)k[a]+=p[s][a];for(a=e;a<=t;a++)H=Math.max(H,k[a]);I=0,ee(e,t)}function $(e,t){var n,i,s;for(I=Number.MAX_VALUE,H=-Number.MAX_VALUE,n=0;n<o;n++)if(r.views[n].isActive){for(s=p[n],W[n]=Number.MAX_VALUE,N[n]=-Number.MAX_VALUE,i=e;i<=t;i++)W[n]=Math.min(W[n],s[i]),N[n]=Math.max(N[n],s[i]);S[n]=Math.max(1,Math.floor((N[n]-W[n])/A)),H=Math.max(N[n],H),I=Math.min(W[n],I)}I=I===H?0:I,ee(e,t)}function ee(e,t){var n;if(m=c[e],w=c[t],g=i/(w-m),I=app.round(I,"floor"),E=Math.max(1,Math.floor((H-I)/A)),E=app.round(E,"ceil"),M=s/((H=I+E*A)-I),l)for(n=0;n<o;n++)Y[n]=M*E/S[n];else for(n=0;n<o;n++)Y[n]=M,W[n]=I,N[n]=H,S[n]=E}},function(){function e(e){var t=document.createElement(e);t.style.position="absolute",this.x=0,this.y=0,this.w=0,this.h=0,this.o=1,this.e=t}var t=e.prototype;t.constructor=e,t.gX=function(){return this.x},t.sX=function(e){this.x=e,this.e.style.left=e+"px"},t.gY=function(){return this.y},t.sB=function(e){this.e.style.bottom=e+"px"},t.sY=function(e){this.y=e,this.e.style.top=e+"px"},t.gW=function(){return this.w},t.sW=function(e){this.w=e,this.e.style.width=e+"px"},t.gH=function(){return this.h},t.sH=function(e){this.h=e,this.e.style.height=e+"px"},t.sS=function(e,t){this.e.style.transform="scale("+e+", "+t+")"},t.add=function(e){this.e.appendChild(e.e)},t.sC=function(e){this.e.classList.add(e)},t.rC=function(e){this.e.classList.remove(e)},t.sT=function(e){this.e.innerText=e},t.sTween=function(e){console.log(e),this.e.style.transition=e,this.e.style.webkitTransition=e},t.onDown=function(e){this.e.addEventListener("mousedown",e),this.e.addEventListener("touchstart",e)},t.onUp=function(e){this.e.addEventListener("mouseup",e),this.e.addEventListener("touchend",e)},t.sO=function(e){this.o=e,this.e.style.opacity=e},app.E=e}(),app.HLines=function(d){var f,c,l,v,h=[],w={},m=new app.E("div");m.sY(250);var e=new app.E("div");function g(){var e=new app.E("div");e.sW(400),e.sH(2),e.sC("axis-line"),e.texts=[],m.add(e);for(var t,n=0;n<d;n++)t=new app.E("div"),1===n&&(t.e.style.right="0px"),t.sY(-16),e.add(t),e.texts.push(t);return e}function x(e,t){e.sC("tween"),e.sB(t)}function y(e){e.rC("tween"),h.push(e)}function t(){for(var e in v=1,l=0,w)h.push(w[e]),w[e].sO(0);w={}}return e.sW(400),e.sH(3),e.sY(-1),e.sC("main-line"),m.add(e),{addTo:function(e){e.add(m)},setOver:function(){t()},setDat:function(){t()},render:function(e,t,n,i,s,a){var o,r,u;for(c=w,w={},o=0,u=i;o<6;u+=a,o++){for((f=c[u])?f.sB((u-i)*s):((f=h.pop())||(f=g(),m.add(f)),f.index=u,f.sO(1),f.sB((u-l)*v),setTimeout(x,0,f,(u-i)*s)),r=0;r<d;r++)f.texts[r].sT(app.format(e[r]+n[r]*o));w[f.index]=f}for(var p in c)f=c[p],w[f.index]||(f.sB((f.index-i)*s),f.sO(0),setTimeout(y,500,f));l=i,v=s}}},app.Header=function(e,t){var n,i,s,a,o=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],r=u;function u(e,t){var n=new Date(e),i=new Date(t),s=n.getUTCDate()+" "+app.months[n.getUTCMonth()]+" "+n.getUTCFullYear(),a=new Date(e);return a.setUTCMonth(n.getUTCMonth()+1),a.getTime()!==i.getTime()&&(s+=" - "+i.getUTCDate()+" "+app.months[i.getUTCMonth()]+" "+i.getUTCFullYear()),s}function p(e,t){var n=new Date(e),i=new Date(t),s=o[n.getUTCDay()]+", "+n.getUTCDate()+" "+app.months[n.getUTCMonth()]+" "+n.getUTCFullYear(),a=new Date(e);return a.setUTCDate(n.getUTCDate()+1),a.getTime()!==i.getTime()&&(s+=o[i.getUTCDay()]+", "+i.getUTCDate()+" "+app.months[i.getUTCMonth()]+" "+i.getUTCFullYear()),s}return(n=new app.E("div")).sT("Statistic"),n.sC("tween"),n.sC("title"),n.sY(20),e.add(n),(i=new app.E("div")).sC("zoom"),i.sY(20),i.sT("Zoom Out"),i.sS(1,0),i.sC("tween"),i.inputEnabled=!1,e.add(i),i.onDown(function(){i.inputEnabled&&t()}),(a=new app.E("div")).sY(20),a.sC("range-text"),e.add(a),{setOver:function(e){s=e,i.inputEnabled=!1,n.sS(1,1),i.sS(1,0),r=u},setDat:function(e){s=e,i.inputEnabled=!0,n.sS(1,0),i.sS(1,1),r=p},setRange:function(e,t){a.sT(r(s.columns[0][e+1],s.columns[0][t+1])),a.sX(400-a.e.getBoundingClientRect().width)}}},app.Info=function(p,d,f,c,t,n){var i,l,v,h,w,m,s,g,x,y,C=0,a=!1,D=[],T=[],E=["Sun","Mon","Tue","Wed","Thu","Fri","Sut"],M=["Jan","Fab","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];(i=new app.E("div")).sC("tween"),i.sW(d.view.w),i.sH(d.view.h),i.sO(0),i.sY(0),d.view.add(i),(x=new app.E("div")).sW(0),x.sH(d.view.h),x.sC("info-overlay"),d.overlayLayer.add(x),(y=new app.E("div")).sW(0),y.sH(d.view.h),y.e.style.right="0px",y.sC("info-overlay"),d.overlayLayer.add(y),(l=new app.E("div")).sW(2),l.sY(0),l.sH(d.view.h),l.sC("info-line"),i.add(l),(v=new app.E("div")).sC("info-bg"),v.sW(160),v.sH(60),v.onDown(function(e){if(!a)return;e.preventDefault(),e.stopPropagation(),n(C)}),i.add(v),(m=new app.E("div")).sC("info-main-text"),m.sX(10),m.sY(4),v.add(m),(s=document.createElement("i")).classList.add("arrow-right"),s.style.left="140px",s.style.top="7px",s.style.position="absolute",v.e.appendChild(s);for(var e=0;e<7;e++){var o=new app.E("div");v.add(o),o.sC("info-name"),o.sX(10),D.push(o);var r=new app.E("div");r.sX(110),r.sC("info-val"),r.e.style.right="10px",v.add(r),T.push(r)}function u(){var e,t,n=p.getInputY()-d.view.y,i=p.getInputX()-d.view.x;if(e=f.rightIndex-f.leftIndex,t=d.view.w/e,!(n<0||n>d.view.h||i<0||i>d.view.w+t)){i=(C=Math.min(f.rightIndex-(g?1:0),Math.floor(i/t)))*t,v.e.style.bottom=d.view.h-n+20+"px",i<v.w+10?v.sX(i+t+10):v.sX(i-v.w-10),g?(x.sW(Math.min(d.view.w-Math.max(3,t),i)),y.sW(Math.max(0,d.view.w-i-Math.max(3,t))),d.overlayLayer.sO(1),l.sX(100500)):(d.overlayLayer.sO(0),l.sX(i));for(var s,a,o=0,r=0,u=D.length;o<u;o++)c.views[o]&&c.views[o].isActive?(a=26+20*r,D[o].sO(1),T[o].sO(1),D[o].sY(a),T[o].sY(a),D[o].sT(c.views[o].name),T[o].e.style.color=c.views[o].color,T[o].sT(app.format(w[o][C+1],!0)),r++):(D[o].sO(0),T[o].sO(0));s=new Date(h[f.leftIndex+C+1]),m.sT(E[s.getUTCDay()]+", "+M[s.getUTCMonth()]+" "+s.getUTCDate()+" "+s.getUTCFullYear()),v.sH(30+20*r)}}function O(e){h=e.columns[0],w=e.columns.slice(1),setTimeout(u,0)}return d.view.onDown(function(){i.sO(1),d.overlayLayer.sO(1),setTimeout(function(){a=!0,v.e.style.cursor="pointer"},0),u()}),app.i.downHandlers.push(function(){var e=p.getInputY()-d.view.y;(e<0||e>d.view.h)&&(i.sO(0),d.overlayLayer.sO(0),a=!1,v.e.style.cursor="default")}),app.i.moveHandlers.push(function(e){e.isDown&&u()}),{setOver:function(e){O(e),g="bar"===e.types.y0,s.style.visibility="visible"},setDat:function(e){O(e),g="bar"===e.types.y0&&!t,s.style.visibility="hidden"}}},function(){document.body;var s={x:0,y:0,dx:0,dy:0,isDown:!1,moveHandlers:[],upHandlers:[],downHandlers:[]};function t(e){e.preventDefault&&e.preventDefault(),s.x=e.clientX,s.y=e.clientY,s.isDown=!0;for(var t=0,n=s.downHandlers,i=n.length;t<i;t++)n[t](s)}function n(e){e.preventDefault&&e.preventDefault(),s.isDown=!1;for(var t=0,n=s.upHandlers,i=n.length;t<i;t++)n[t](s)}function i(e){e.preventDefault&&e.preventDefault(),s.x=e.clientX,s.y=e.clientY;for(var t=0,n=s.moveHandlers,i=n.length;t<i;t++)n[t](s)}document.addEventListener("mousemove",i),document.addEventListener("mousedown",t),document.addEventListener("mouseup",n),document.addEventListener("touchmove",function(e){e.preventDefault(),i(e.touches[0])}),document.addEventListener("touchstart",function(e){e.preventDefault(),t(e.touches[0])}),document.addEventListener("touchend",function(e){e.preventDefault(),n(e)}),app.i=s}(),window.addEventListener("load",function(){for(var i,s=[],e=3;e<4;e++)i=app.Chart(app.contest[e],e),s.push(i);function t(){for(var e=Math.min(1,window.innerWidth/450),t=0,n=s.length;t<n;t++)(i=s[t]).view.sX(25*e),i.view.sY((20+560*t)*e),i.view.sS(e,e),i.view.sc=e,s.push(i)}t(),window.addEventListener("resize",t),function e(){requestAnimationFrame(e);for(var t=0,n=s.length;t<n;t++)s[t].update()}()}),app.format=function(e){if(0===e)return 0;var t="";return 1e9<e?(e*=1e-9,t="B"):1e6<e?(e*=1e-6,t="M"):1e3<e&&(e*=.001,t="K"),e.toFixed(10<=e?0:1)+t},app.round=function(e,t){for(var n=String(e).length-2,i="1",s=0;s<n;s++)i+="0";return i=Number(i),Math[t](e/i)*i},app.supportPageOffset=void 0!==window.pageXOffset,app.isCSS1Compat="CSS1Compat"===(document.compatMode||""),app.getScrollX=app.supportPageOffset?function(){return window.pageXOffset}:app.isCSS1Compat?function(){return document.documentElement.scrollLeft}:function(){return document.body.scrollLeft},app.getscrollY=app.supportPageOffset?function(){return window.pageYOffset}:app.isCSS1Compat?function(){return document.documentElement.scrollTop}:function(){return document.body.scrollTop},app.ScrollBar=function(e,t,n,i){var s,a,o,r,u,p,d,f=app.E,c=20,l=400,v=T,h=1,w=[],m=[];function g(e,t){w.length=0,m.length=0,w.push(0),m.push(0);var n,i,s=e.columns[0];for(n=2,i=s.length-1;n<i;n++)t(new Date(s[n]),n)&&(w.push((n-1)/(i-2)*l),m.push(n-1));w.push(l),m.push(i-1)}function x(e,t){d.leftIndex=e,d.rightIndex=t,u.sX(e/h*l-c),p.sX(t/h*l),o.sX(u.x-5+c),o.sW(p.x-u.x-c+3),i(e,t)}function y(){return e.getInputX()-s.x}function C(e){for(var t,n=0,i=w.length,s=0,a=Number.MAX_VALUE;n<i;n++)(t=Math.abs(w[n]-e))<a&&(a=t,s=n);return m[s]}function D(){var e=(p.x-(u.x+u.w))/2,t=Math.max(0,Math.min(d.rightIndex,C(y()-e))),n=Math.max(d.leftIndex,Math.min(h,C(y()+e)));t!==d.leftIndex&&n!==d.rightIndex&&x(t,n)}function T(){}return(s=new f("div")).sY(370),s.sW(l),s.sH(50),a=app.Diagram(l,50,t),s.add(a.view),(o=new f("div")).sY(-3),o.sH(50),o.sC("frame"),s.add(o),o.onDown(function(){v=D}),r=[function(){var e=Math.max(0,C(y()));d.leftIndex!==e&&e<d.rightIndex&&x(e,d.rightIndex)},function(){var e=Math.min(h,C(y()));d.rightIndex!==e&&e>d.leftIndex&&x(d.leftIndex,e)}].map(function(e){var t=new f("div");return t.sY(-3),t.sW(c),t.sH(s.gH()+6),t.sC("side-day"),s.add(t),t.onDown(function(){v=e}),t}),u=r[0],p=r[1],d={view:s,leftIndex:0,rightIndex:0,diagram:a,setRange:x,setOver:function(e){h=e.columns[0].length-2,a.setOver(e),g(e,function(e){return 1===e.getUTCDate()})},setDat:function(e){h=e.columns[0].length-2,a.setDat(e),g(e,n?function(e,t){return t%36==1}:function(e){return 0===e.getUTCHours()})},renderDiagram:function(){a.render(0,h)}},app.i.moveHandlers.push(function(){v()}),app.i.upHandlers.push(function(){v=T}),d};