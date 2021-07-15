var e=Object.defineProperty,t=Object.defineProperties,o=Object.getOwnPropertyDescriptors,l=Object.getOwnPropertySymbols,r=Object.prototype.hasOwnProperty,a=Object.prototype.propertyIsEnumerable,s=(t,o,l)=>o in t?e(t,o,{enumerable:!0,configurable:!0,writable:!0,value:l}):t[o]=l,n=(e,t)=>{for(var o in t||(t={}))r.call(t,o)&&s(e,o,t[o]);if(l)for(var o of l(t))a.call(t,o)&&s(e,o,t[o]);return e},_=(e,l)=>t(e,o(l));import{R as i,C as m,a as d,B as c,S as u,b as p,c as E,d as h}from"./vendor.af781945.js";let f;const y={},v=function(e,t){if(!t)return e();if(void 0===f){const e=document.createElement("link").relList;f=e&&e.supports&&e.supports("modulepreload")?"modulepreload":"preload"}return Promise.all(t.map((e=>{if(e in y)return;y[e]=!0;const t=e.endsWith(".css"),o=t?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${e}"]${o}`))return;const l=document.createElement("link");return l.rel=t?"stylesheet":f,t||(l.as="script",l.crossOrigin=""),l.href=e,document.head.appendChild(l),t?new Promise(((e,t)=>{l.addEventListener("load",e),l.addEventListener("error",t)})):void 0}))).then((()=>e()))},b=[{label:"Home",path:"/home",component:i.lazy((()=>v((()=>import("./home.route.143a8bfa.js")),["/assets/home.route.143a8bfa.js","/assets/vendor.af781945.js"]))),layout:"default"},{label:"Epoch",path:"/epoch",layout:"default",component:i.lazy((()=>v((()=>import("./epoch.route.429c7b8c.js")),["/assets/epoch.route.429c7b8c.js","/assets/epoch.route.a5642458.css","/assets/vendor.af781945.js"]))),routes:[{label:"Home",path:"/epoch/home",layout:"default",icon:"home_solid",component:i.lazy((()=>v((()=>import("./epoch.home.route.3067c3af.js")),["/assets/epoch.home.route.3067c3af.js","/assets/vendor.af781945.js"])))},{label:"Workspace",path:"/epoch/workspace",layout:"default",icon:"list_solid",component:i.lazy((()=>v((()=>import("./epoch.workspace.route.7427cc7d.js")),["/assets/epoch.workspace.route.7427cc7d.js","/assets/vendor.af781945.js"])))}]},{label:"Toast",path:"/toast",layout:"default",component:i.lazy((()=>v((()=>import("./toast.route.df70d98f.js")),["/assets/toast.route.df70d98f.js","/assets/toast.route.b6bbef23.css","/assets/vendor.af781945.js"])))},{path:"/",exact:!0,component:i.lazy((()=>v((()=>import("./home.route.143a8bfa.js")),["/assets/home.route.143a8bfa.js","/assets/vendor.af781945.js"])))},{path:"*",component:i.lazy((()=>v((()=>import("./not-found.route.3cac07ff.js")),["/assets/not-found.route.3cac07ff.js","/assets/vendor.af781945.js"])))}];const g=new class{constructor(){this.layouts={default:i.lazy((()=>v((()=>import("./default.layout.4a63c97e.js")),["/assets/default.layout.4a63c97e.js","/assets/default.layout.beaa175e.css","/assets/vendor.af781945.js"]))),admin:i.lazy((()=>v((()=>import("./admin.layout.3fcd8201.js")),["/assets/admin.layout.3fcd8201.js","/assets/admin.layout.ce0a1bfa.css","/assets/vendor.af781945.js"])))},this.layout=this.layouts.default}get setLayout(){return Object.keys(this.layouts).reduce(((e,t)=>(e[t]=()=>this.layout=this.layouts[t]||this.layouts.default,e)),{})}},x=({children:e})=>i.createElement(i.Fragment,null,i.createElement(m.exports.Suspense,{fallback:i.createElement("div",null,"Loading layout...")},i.createElement(g.layout,{},e))),z=()=>{let e=(new Date).getTime();return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,(function(t){var o=(e+16*Math.random())%16|0;return e=Math.floor(e/16),("x"===t?o:3&o|8).toString(16)}))};var L={modalContainer:"_modalContainer_1dzmq_1",modalWrapper:"_modalWrapper_1dzmq_17",moveable:"_moveable_1dzmq_53",header:"_header_1dzmq_61",content:"_content_1dzmq_97",footer:"_footer_1dzmq_145",modalComponent:"_modalComponent_1dzmq_181"};const R=({onClose:e,component:t,resizeable:o,moveable:l,size:r})=>{const[a,s]=m.exports.useState([0,0]),[n,_]=m.exports.useState([0,0]),[d,c]=m.exports.useState(["0px","0px"]),[u,p]=m.exports.useState(!1),E=m.exports.useRef(null),h=[0,0],f={small:["clamp(20rem, 20vw, 30rem)","clamp(20rem, 20vh, 30rem)"],medium:["clamp(20rem, 30vw, 40rem)","clamp(20rem, 30vh, 40rem)"],large:["clamp(20rem, 50vw, 50rem)","clamp(20rem, 50vh, 50rem)"],xlarge:["clamp(20rem, 70vw, 70rem)","clamp(20rem, 70vh, 70rem)"],full:["100vw","100vh"]};"full"==r&&(o=!1,l=!1),m.exports.useEffect((()=>{var e;const t=null==(e=E.current)?void 0:e.getBoundingClientRect();if(t){if(r)c([f[r][0],f[r][1]]);else{const e=[window.innerWidth/2,window.innerHeight/2],o=[e[0]-t.width/2,e[1]-t.height/2];c([t.width+"px",t.height+"px"]),s(o)}p(!0)}}),[]),m.exports.useEffect((()=>()=>{b.unsubscribe()}),[]);const y=m.exports.useMemo((()=>{const e={width:d[0],height:d[1]};return n[0]&&n[1]?(e.transform=`translate(${n[0]}px,${n[1]}px)`,e):(a[0]&&a[1]?(e.left=`${a[0]}px`,e.top=`${a[1]}px`):e.position="relative",u||(e.opacity=0),e)}),[n,a,d,E]),v=m.exports.useMemo((()=>[L.header,l?L.moveable:""].filter(Boolean).join(" ")),[l]),b={element:void 0,getRects:()=>b.element.getBoundingClientRect(),mousedown:e=>{var t;if(!l)return;b.element=E.current;const o=null==(t=b.element)?void 0:t.getBoundingClientRect();if(!o)return;const r=[o.left,o.top],a=[e.clientX,e.clientY];h[0]=a[0]-r[0],h[1]=a[1]-r[1],b.subscribe()},mouseup:()=>{b.unsubscribe();const e=b.element.getBoundingClientRect();_([0,0]),s([e.x,e.y])},mousemove:e=>{1!==e.buttons&&b.unsubscribe(),e.preventDefault();const t=[e.clientX,e.clientY],o=[t[0]-h[0],t[1]-h[1]],l=b.element.getBoundingClientRect(),r=[o[0]+l.width<window.innerWidth&&o[0]>1?o[0]:o[0]<=1?1:window.innerWidth-l.width,o[1]+l.height<window.innerHeight&&o[1]>1?o[1]:o[1]<=1?1:window.innerHeight-l.height];_([r[0],r[1]])},subscribe:()=>{addEventListener("mousemove",b.mousemove),addEventListener("mouseup",b.mouseup)},unsubscribe:()=>{removeEventListener("mousemove",b.mousemove),removeEventListener("mouseup",b.mouseup)}},g={element:void 0,getRects:()=>g.element.getBoundingClientRect(),mousedown:e=>{var t;if(!o)return;g.element=E.current;const l=null==(t=g.element)?void 0:t.getBoundingClientRect();if(!l)return;const r=[l.right,l.bottom],a=[e.clientX,e.clientY];h[0]=r[0]-a[0],h[1]=r[1]-a[1],g.subscribe()},mouseup:()=>{g.unsubscribe()},mousemove:e=>{1!==e.buttons&&g.unsubscribe(),e.preventDefault();const t=g.getRects(),{innerWidth:o,innerHeight:l}=window,r=e.clientX+h[0],a=e.clientY+h[1],s=a>1&&a<l?a:a>l?l:1,n=[(r>1&&r<o?r:r>o?o:1)-t.left,s-t.top];n[0]=n[0]+"px",n[1]=n[1]+"px",c(n)},subscribe:()=>{addEventListener("mousemove",g.mousemove),addEventListener("mouseup",g.mouseup)},unsubscribe:()=>{removeEventListener("mousemove",g.mousemove),removeEventListener("mouseup",g.mouseup)}};return i.createElement("div",{ref:E,className:L.modalWrapper,style:y},i.createElement("section",{onMouseDown:b.mousedown,className:v},i.createElement("div",{onClick:e},i.createElement(A,{svgName:"times_solid",size:"small"}))),i.createElement("section",{className:L.content},i.createElement(t,{onClose:e})),i.createElement("section",{className:L.footer},o?i.createElement("div",{onMouseDown:g.mousedown},i.createElement(A,{svgName:"signal_solid",size:"small"})):i.createElement(i.Fragment,null)))},O=m.exports.forwardRef(((e,t)=>{((e,t)=>{var o={};for(var s in e)r.call(e,s)&&t.indexOf(s)<0&&(o[s]=e[s]);if(null!=e&&l)for(var s of l(e))t.indexOf(s)<0&&a.call(e,s)&&(o[s]=e[s])})(e,[]);const{loaded:o,portalId:s}=(()=>{const[e,t]=m.exports.useState(!1),[o]=m.exports.useState(`modal-portal-${z()}`);return m.exports.useEffect((()=>{const e=document.createElement("div");return e.id=o,e.style="position: fixed; top: 0px; left: 0px;",document.getElementsByTagName("body")[0].appendChild(e),t(!0),()=>document.getElementsByTagName("body")[0].removeChild(e)}),[o]),{loaded:e,portalId:o}})(),[n,_]=m.exports.useState([]);return m.exports.useImperativeHandle(t,(()=>({addModal(e,t=!0,o=!0){_([...n,{component:e,id:z(),moveable:t,resizeable:o}])}}))),o?d.exports.createPortal(n.length?i.createElement("div",{className:L.modalContainer},n.map((({component:e,id:t,moveable:o,resizeable:l},r)=>i.createElement(R,{key:r,onClose:()=>(e=>{_(n.filter((t=>t.id!==e)))})(t),component:e,moveable:o,resizeable:l,size:"xlarge"})))):i.createElement(i.Fragment,null),document.getElementById(s)):i.createElement(i.Fragment,null)})),j=()=>i.createElement(c,null,i.createElement(m.exports.Suspense,{fallback:i.createElement("div",null,"Loading...")},i.createElement(u,null,b.map(((e,t)=>i.createElement(D,n({key:t},e))))))),P=e=>i.createElement(i.Fragment,null,i.createElement(p,{path:e.path,exact:e.exact,render:t=>{var o;return i.createElement(i.Fragment,null,i.createElement(e.component,_(n({},t),{routes:e.routes})),e.redirect?i.createElement(E,{to:null==(o=e.redirect)?void 0:o.to}):i.createElement(i.Fragment,null))}})),D=e=>{var t,o;return m.exports.useMemo((()=>{g.setLayout[e.layout||"default"]()}),[e.layout]),i.createElement(x,null,e.redirect?i.createElement(i.Fragment,null,i.createElement(p,{path:e.path,exact:null==(t=e.redirect)?void 0:t.exact,render:t=>i.createElement(e.component,_(n({},t),{routes:e.routes}))}),i.createElement(E,{to:null==(o=e.redirect)?void 0:o.to})):i.createElement(p,{path:e.path,exact:e.exact,render:t=>i.createElement(e.component,_(n({},t),{routes:e.routes}))}))};var I="_svgWrapper_195xj_1";const T=new class{constructor(){this.svgs={},this.add=(e,t)=>this.svgs[e]=t}},A=({size:e,width:t,svgName:o})=>{const l=T.svgs[o],r={small:"1rem",medium:"1.5rem",large:"3rem",xlarge:"5rem"},a={width:e?r[e]:t||r.medium,height:e?r[e]:t||r.medium};return i.createElement("div",{style:a,className:I},i.createElement(l,null))};T.svgs={not_found:i.lazy((()=>v((()=>import("./404-error.1ccaa142.js")),["/assets/404-error.1ccaa142.js","/assets/vendor.af781945.js"]))),frostbite_logo:i.lazy((()=>v((()=>import("./frostbite_logo.cb224bf1.js")),["/assets/frostbite_logo.cb224bf1.js","/assets/vendor.af781945.js"]))),bars_solid:i.lazy((()=>v((()=>import("./bars-solid.8d38b9f6.js")),["/assets/bars-solid.8d38b9f6.js","/assets/vendor.af781945.js"]))),box_open_solid:i.lazy((()=>v((()=>import("./box-open-solid.5356cba8.js")),["/assets/box-open-solid.5356cba8.js","/assets/vendor.af781945.js"]))),calendar_alt_regular:i.lazy((()=>v((()=>import("./calendar-alt-regular.83698191.js")),["/assets/calendar-alt-regular.83698191.js","/assets/vendor.af781945.js"]))),calendar_plus_regular:i.lazy((()=>v((()=>import("./calendar-plus-regular.ca4407e1.js")),["/assets/calendar-plus-regular.ca4407e1.js","/assets/vendor.af781945.js"]))),check_circle_regular:i.lazy((()=>v((()=>import("./check-circle-regular.5d51fbb6.js")),["/assets/check-circle-regular.5d51fbb6.js","/assets/vendor.af781945.js"]))),chevron_up_solid:i.lazy((()=>v((()=>import("./chevron-up-solid.f3cde363.js")),["/assets/chevron-up-solid.f3cde363.js","/assets/vendor.af781945.js"]))),chevron_down_solid:i.lazy((()=>v((()=>import("./chevron-down-solid.8753476c.js")),["/assets/chevron-down-solid.8753476c.js","/assets/vendor.af781945.js"]))),chevron_left_solid:i.lazy((()=>v((()=>import("./chevron-left-solid.89979280.js")),["/assets/chevron-left-solid.89979280.js","/assets/vendor.af781945.js"]))),chevron_right_solid:i.lazy((()=>v((()=>import("./chevron-right-solid.ba226d19.js")),["/assets/chevron-right-solid.ba226d19.js","/assets/vendor.af781945.js"]))),chevron_up_double_solid:i.lazy((()=>v((()=>import("./chevron-up-double-solid.7ea05db2.js")),["/assets/chevron-up-double-solid.7ea05db2.js","/assets/vendor.af781945.js"]))),chevron_down_double_solid:i.lazy((()=>v((()=>import("./chevron-down-double-solid.ff979170.js")),["/assets/chevron-down-double-solid.ff979170.js","/assets/vendor.af781945.js"]))),chevron_left_double_solid:i.lazy((()=>v((()=>import("./chevron-left-double-solid.761b5350.js")),["/assets/chevron-left-double-solid.761b5350.js","/assets/vendor.af781945.js"]))),chevron_right_double_solid:i.lazy((()=>v((()=>import("./chevron-right-double-solid.022dc56a.js")),["/assets/chevron-right-double-solid.022dc56a.js","/assets/vendor.af781945.js"]))),cog_solid:i.lazy((()=>v((()=>import("./cog-solid.83841288.js")),["/assets/cog-solid.83841288.js","/assets/vendor.af781945.js"]))),dice_d6_solid:i.lazy((()=>v((()=>import("./dice-d6-solid.c5b55b38.js")),["/assets/dice-d6-solid.c5b55b38.js","/assets/vendor.af781945.js"]))),dolly_flatbed_solid:i.lazy((()=>v((()=>import("./dolly-flatbed-solid.426427da.js")),["/assets/dolly-flatbed-solid.426427da.js","/assets/vendor.af781945.js"]))),edit_regular:i.lazy((()=>v((()=>import("./edit-regular.1056fef5.js")),["/assets/edit-regular.1056fef5.js","/assets/vendor.af781945.js"]))),ellipsis_h_solid:i.lazy((()=>v((()=>import("./ellipsis-h-solid.175cd347.js")),["/assets/ellipsis-h-solid.175cd347.js","/assets/vendor.af781945.js"]))),ellipsis_v_solid:i.lazy((()=>v((()=>import("./ellipsis-v-solid.9d989856.js")),["/assets/ellipsis-v-solid.9d989856.js","/assets/vendor.af781945.js"]))),es_logo:i.lazy((()=>v((()=>import("./es-logo.fe317b26.js")),["/assets/es-logo.fe317b26.js","/assets/vendor.af781945.js"]))),eye_regular:i.lazy((()=>v((()=>import("./eye-regular.1ef978c3.js")),["/assets/eye-regular.1ef978c3.js","/assets/vendor.af781945.js"]))),eye_slash_regular:i.lazy((()=>v((()=>import("./eye-slash-regular.5d854926.js")),["/assets/eye-slash-regular.5d854926.js","/assets/vendor.af781945.js"]))),favicon:i.lazy((()=>v((()=>import("./favicon.2f04d4f1.js")),["/assets/favicon.2f04d4f1.js","/assets/vendor.af781945.js"]))),file_regular:i.lazy((()=>v((()=>import("./file-regular.06b28260.js")),["/assets/file-regular.06b28260.js","/assets/vendor.af781945.js"]))),font_solid:i.lazy((()=>v((()=>import("./font-solid.a12ff10b.js")),["/assets/font-solid.a12ff10b.js","/assets/vendor.af781945.js"]))),home_solid:i.lazy((()=>v((()=>import("./home-solid.b3560494.js")),["/assets/home-solid.b3560494.js","/assets/vendor.af781945.js"]))),keyboard_solid:i.lazy((()=>v((()=>import("./keyboard-solid.abfe47f1.js")),["/assets/keyboard-solid.abfe47f1.js","/assets/vendor.af781945.js"]))),list_solid:i.lazy((()=>v((()=>import("./list-solid.840614fa.js")),["/assets/list-solid.840614fa.js","/assets/vendor.af781945.js"]))),logo:i.lazy((()=>v((()=>import("./logo.13316d71.js")),["/assets/logo.13316d71.js","/assets/vendor.af781945.js"]))),minus_square_regular:i.lazy((()=>v((()=>import("./minus-square-regular.00169ffb.js")),["/assets/minus-square-regular.00169ffb.js","/assets/vendor.af781945.js"]))),paper_plane_solid:i.lazy((()=>v((()=>import("./paper-plane-solid.fa90367d.js")),["/assets/paper-plane-solid.fa90367d.js","/assets/vendor.af781945.js"]))),plus_square_regular:i.lazy((()=>v((()=>import("./plus-square-regular.5546fee7.js")),["/assets/plus-square-regular.5546fee7.js","/assets/vendor.af781945.js"]))),question_solid:i.lazy((()=>v((()=>import("./question-solid.93d651a8.js")),["/assets/question-solid.93d651a8.js","/assets/vendor.af781945.js"]))),save_solid:i.lazy((()=>v((()=>import("./save-solid.ab0e93d7.js")),["/assets/save-solid.ab0e93d7.js","/assets/vendor.af781945.js"]))),search_solid:i.lazy((()=>v((()=>import("./search-solid.e5c99cb4.js")),["/assets/search-solid.e5c99cb4.js","/assets/vendor.af781945.js"]))),signal_solid:i.lazy((()=>v((()=>import("./signal-solid.8eb98b2b.js")),["/assets/signal-solid.8eb98b2b.js","/assets/vendor.af781945.js"]))),sync_alt_solid:i.lazy((()=>v((()=>import("./sync-alt-solid.7aec42fb.js")),["/assets/sync-alt-solid.7aec42fb.js","/assets/vendor.af781945.js"]))),times_circle_regular:i.lazy((()=>v((()=>import("./times-circle-regular.ddce3abc.js")),["/assets/times-circle-regular.ddce3abc.js","/assets/vendor.af781945.js"]))),times_solid:i.lazy((()=>v((()=>import("./times-solid.979ddf4b.js")),["/assets/times-solid.979ddf4b.js","/assets/vendor.af781945.js"]))),trash_alt_regular:i.lazy((()=>v((()=>import("./trash-alt-regular.2151a34d.js")),["/assets/trash-alt-regular.2151a34d.js","/assets/vendor.af781945.js"]))),undo_solid:i.lazy((()=>v((()=>import("./undo-solid.8d4e704d.js")),["/assets/undo-solid.8d4e704d.js","/assets/vendor.af781945.js"]))),user_solid:i.lazy((()=>v((()=>import("./user-solid.65aa71de.js")),["/assets/user-solid.65aa71de.js","/assets/vendor.af781945.js"]))),wave_square_solid:i.lazy((()=>v((()=>import("./wave-square-solid.c5905cc7.js")),["/assets/wave-square-solid.c5905cc7.js","/assets/vendor.af781945.js"]))),wind_solid:i.lazy((()=>v((()=>import("./wind-solid.a01d9c1d.js")),["/assets/wind-solid.a01d9c1d.js","/assets/vendor.af781945.js"]))),wpexplorer_brands:i.lazy((()=>v((()=>import("./wpexplorer-brands.435a409d.js")),["/assets/wpexplorer-brands.435a409d.js","/assets/vendor.af781945.js"])))},h.render(i.createElement(i.StrictMode,null,i.createElement(j,null)),document.getElementById("root"));export{O as F,P as R,A as S,b as r,z as u};