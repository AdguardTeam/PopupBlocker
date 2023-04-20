var n,l$1,u$1,t$1,r$1,o$2,f$1,c$1={},s$1=[],a$1=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;function h$1(n,l){for(var u in l)n[u]=l[u];return n}function v$1(n){var l=n.parentNode;l&&l.removeChild(n);}function y(l,u,i){var t,r,o,f={};for(o in u)"key"==o?t=u[o]:"ref"==o?r=u[o]:f[o]=u[o];if(arguments.length>2&&(f.children=arguments.length>3?n.call(arguments,2):i),"function"==typeof l&&null!=l.defaultProps)for(o in l.defaultProps)void 0===f[o]&&(f[o]=l.defaultProps[o]);return p$1(l,f,t,r,null)}function p$1(n,i,t,r,o){var f={type:n,props:i,key:t,ref:r,__k:null,__:null,__b:0,__e:null,__d:void 0,__c:null,__h:null,constructor:void 0,__v:null==o?++u$1:o};return null==o&&null!=l$1.vnode&&l$1.vnode(f),f}function _$1(n){return n.children}function k$1(n,l){this.props=n,this.context=l;}function b$1(n,l){if(null==l)return n.__?b$1(n.__,n.__.__k.indexOf(n)+1):null;for(var u;l<n.__k.length;l++)if(null!=(u=n.__k[l])&&null!=u.__e)return u.__e;return "function"==typeof n.type?b$1(n):null}function g$2(n){var l,u;if(null!=(n=n.__)&&null!=n.__c){for(n.__e=n.__c.base=null,l=0;l<n.__k.length;l++)if(null!=(u=n.__k[l])&&null!=u.__e){n.__e=n.__c.base=u.__e;break}return g$2(n)}}function m$1(n){(!n.__d&&(n.__d=!0)&&t$1.push(n)&&!w$2.__r++||r$1!==l$1.debounceRendering)&&((r$1=l$1.debounceRendering)||o$2)(w$2);}function w$2(){var n,l,u,i,r,o,e,c;for(t$1.sort(f$1);n=t$1.shift();)n.__d&&(l=t$1.length,i=void 0,r=void 0,e=(o=(u=n).__v).__e,(c=u.__P)&&(i=[],(r=h$1({},o)).__v=o.__v+1,L$1(c,o,r,u.__n,void 0!==c.ownerSVGElement,null!=o.__h?[e]:null,i,null==e?b$1(o):e,o.__h),M(i,o),o.__e!=e&&g$2(o)),t$1.length>l&&t$1.sort(f$1));w$2.__r=0;}function x(n,l,u,i,t,r,o,f,e,a){var h,v,y,d,k,g,m,w=i&&i.__k||s$1,x=w.length;for(u.__k=[],h=0;h<l.length;h++)if(null!=(d=u.__k[h]=null==(d=l[h])||"boolean"==typeof d||"function"==typeof d?null:"string"==typeof d||"number"==typeof d||"bigint"==typeof d?p$1(null,d,null,null,d):Array.isArray(d)?p$1(_$1,{children:d},null,null,null):d.__b>0?p$1(d.type,d.props,d.key,d.ref?d.ref:null,d.__v):d)){if(d.__=u,d.__b=u.__b+1,null===(y=w[h])||y&&d.key==y.key&&d.type===y.type)w[h]=void 0;else for(v=0;v<x;v++){if((y=w[v])&&d.key==y.key&&d.type===y.type){w[v]=void 0;break}y=null;}L$1(n,d,y=y||c$1,t,r,o,f,e,a),k=d.__e,(v=d.ref)&&y.ref!=v&&(m||(m=[]),y.ref&&m.push(y.ref,null,d),m.push(v,d.__c||k,d)),null!=k?(null==g&&(g=k),"function"==typeof d.type&&d.__k===y.__k?d.__d=e=A$1(d,e,n):e=C$1(n,d,y,w,k,e),"function"==typeof u.type&&(u.__d=e)):e&&y.__e==e&&e.parentNode!=n&&(e=b$1(y));}for(u.__e=g,h=x;h--;)null!=w[h]&&("function"==typeof u.type&&null!=w[h].__e&&w[h].__e==u.__d&&(u.__d=$$1(i).nextSibling),S(w[h],w[h]));if(m)for(h=0;h<m.length;h++)O(m[h],m[++h],m[++h]);}function A$1(n,l,u){for(var i,t=n.__k,r=0;t&&r<t.length;r++)(i=t[r])&&(i.__=n,l="function"==typeof i.type?A$1(i,l,u):C$1(u,i,i,t,i.__e,l));return l}function P$1(n,l){return l=l||[],null==n||"boolean"==typeof n||(Array.isArray(n)?n.some(function(n){P$1(n,l);}):l.push(n)),l}function C$1(n,l,u,i,t,r){var o,f,e;if(void 0!==l.__d)o=l.__d,l.__d=void 0;else if(null==u||t!=r||null==t.parentNode)n:if(null==r||r.parentNode!==n)n.appendChild(t),o=null;else {for(f=r,e=0;(f=f.nextSibling)&&e<i.length;e+=1)if(f==t)break n;n.insertBefore(t,r),o=r;}return void 0!==o?o:t.nextSibling}function $$1(n){var l,u,i;if(null==n.type||"string"==typeof n.type)return n.__e;if(n.__k)for(l=n.__k.length-1;l>=0;l--)if((u=n.__k[l])&&(i=$$1(u)))return i;return null}function H$1(n,l,u,i,t){var r;for(r in u)"children"===r||"key"===r||r in l||T$2(n,r,null,u[r],i);for(r in l)t&&"function"!=typeof l[r]||"children"===r||"key"===r||"value"===r||"checked"===r||u[r]===l[r]||T$2(n,r,l[r],u[r],i);}function I$1(n,l,u){"-"===l[0]?n.setProperty(l,null==u?"":u):n[l]=null==u?"":"number"!=typeof u||a$1.test(l)?u:u+"px";}function T$2(n,l,u,i,t){var r;n:if("style"===l)if("string"==typeof u)n.style.cssText=u;else {if("string"==typeof i&&(n.style.cssText=i=""),i)for(l in i)u&&l in u||I$1(n.style,l,"");if(u)for(l in u)i&&u[l]===i[l]||I$1(n.style,l,u[l]);}else if("o"===l[0]&&"n"===l[1])r=l!==(l=l.replace(/Capture$/,"")),l=l.toLowerCase()in n?l.toLowerCase().slice(2):l.slice(2),n.l||(n.l={}),n.l[l+r]=u,u?i||n.addEventListener(l,r?z$2:j$2,r):n.removeEventListener(l,r?z$2:j$2,r);else if("dangerouslySetInnerHTML"!==l){if(t)l=l.replace(/xlink(H|:h)/,"h").replace(/sName$/,"s");else if("width"!==l&&"height"!==l&&"href"!==l&&"list"!==l&&"form"!==l&&"tabIndex"!==l&&"download"!==l&&l in n)try{n[l]=null==u?"":u;break n}catch(n){}"function"==typeof u||(null==u||!1===u&&-1==l.indexOf("-")?n.removeAttribute(l):n.setAttribute(l,u));}}function j$2(n){return this.l[n.type+!1](l$1.event?l$1.event(n):n)}function z$2(n){return this.l[n.type+!0](l$1.event?l$1.event(n):n)}function L$1(n,u,i,t,r,o,f,e,c){var s,a,v,y,p,d,b,g,m,w,A,P,C,$,H,I=u.type;if(void 0!==u.constructor)return null;null!=i.__h&&(c=i.__h,e=u.__e=i.__e,u.__h=null,o=[e]),(s=l$1.__b)&&s(u);try{n:if("function"==typeof I){if(g=u.props,m=(s=I.contextType)&&t[s.__c],w=s?m?m.props.value:s.__:t,i.__c?b=(a=u.__c=i.__c).__=a.__E:("prototype"in I&&I.prototype.render?u.__c=a=new I(g,w):(u.__c=a=new k$1(g,w),a.constructor=I,a.render=q$1),m&&m.sub(a),a.props=g,a.state||(a.state={}),a.context=w,a.__n=t,v=a.__d=!0,a.__h=[],a._sb=[]),null==a.__s&&(a.__s=a.state),null!=I.getDerivedStateFromProps&&(a.__s==a.state&&(a.__s=h$1({},a.__s)),h$1(a.__s,I.getDerivedStateFromProps(g,a.__s))),y=a.props,p=a.state,a.__v=u,v)null==I.getDerivedStateFromProps&&null!=a.componentWillMount&&a.componentWillMount(),null!=a.componentDidMount&&a.__h.push(a.componentDidMount);else {if(null==I.getDerivedStateFromProps&&g!==y&&null!=a.componentWillReceiveProps&&a.componentWillReceiveProps(g,w),!a.__e&&null!=a.shouldComponentUpdate&&!1===a.shouldComponentUpdate(g,a.__s,w)||u.__v===i.__v){for(u.__v!==i.__v&&(a.props=g,a.state=a.__s,a.__d=!1),a.__e=!1,u.__e=i.__e,u.__k=i.__k,u.__k.forEach(function(n){n&&(n.__=u);}),A=0;A<a._sb.length;A++)a.__h.push(a._sb[A]);a._sb=[],a.__h.length&&f.push(a);break n}null!=a.componentWillUpdate&&a.componentWillUpdate(g,a.__s,w),null!=a.componentDidUpdate&&a.__h.push(function(){a.componentDidUpdate(y,p,d);});}if(a.context=w,a.props=g,a.__P=n,P=l$1.__r,C=0,"prototype"in I&&I.prototype.render){for(a.state=a.__s,a.__d=!1,P&&P(u),s=a.render(a.props,a.state,a.context),$=0;$<a._sb.length;$++)a.__h.push(a._sb[$]);a._sb=[];}else do{a.__d=!1,P&&P(u),s=a.render(a.props,a.state,a.context),a.state=a.__s;}while(a.__d&&++C<25);a.state=a.__s,null!=a.getChildContext&&(t=h$1(h$1({},t),a.getChildContext())),v||null==a.getSnapshotBeforeUpdate||(d=a.getSnapshotBeforeUpdate(y,p)),H=null!=s&&s.type===_$1&&null==s.key?s.props.children:s,x(n,Array.isArray(H)?H:[H],u,i,t,r,o,f,e,c),a.base=u.__e,u.__h=null,a.__h.length&&f.push(a),b&&(a.__E=a.__=null),a.__e=!1;}else null==o&&u.__v===i.__v?(u.__k=i.__k,u.__e=i.__e):u.__e=N(i.__e,u,i,t,r,o,f,c);(s=l$1.diffed)&&s(u);}catch(n){u.__v=null,(c||null!=o)&&(u.__e=e,u.__h=!!c,o[o.indexOf(e)]=null),l$1.__e(n,u,i);}}function M(n,u){l$1.__c&&l$1.__c(u,n),n.some(function(u){try{n=u.__h,u.__h=[],n.some(function(n){n.call(u);});}catch(n){l$1.__e(n,u.__v);}});}function N(l,u,i,t,r,o,f,e){var s,a,h,y=i.props,p=u.props,d=u.type,_=0;if("svg"===d&&(r=!0),null!=o)for(;_<o.length;_++)if((s=o[_])&&"setAttribute"in s==!!d&&(d?s.localName===d:3===s.nodeType)){l=s,o[_]=null;break}if(null==l){if(null===d)return document.createTextNode(p);l=r?document.createElementNS("http://www.w3.org/2000/svg",d):document.createElement(d,p.is&&p),o=null,e=!1;}if(null===d)y===p||e&&l.data===p||(l.data=p);else {if(o=o&&n.call(l.childNodes),a=(y=i.props||c$1).dangerouslySetInnerHTML,h=p.dangerouslySetInnerHTML,!e){if(null!=o)for(y={},_=0;_<l.attributes.length;_++)y[l.attributes[_].name]=l.attributes[_].value;(h||a)&&(h&&(a&&h.__html==a.__html||h.__html===l.innerHTML)||(l.innerHTML=h&&h.__html||""));}if(H$1(l,p,y,r,e),h)u.__k=[];else if(_=u.props.children,x(l,Array.isArray(_)?_:[_],u,i,t,r&&"foreignObject"!==d,o,f,o?o[0]:i.__k&&b$1(i,0),e),null!=o)for(_=o.length;_--;)null!=o[_]&&v$1(o[_]);e||("value"in p&&void 0!==(_=p.value)&&(_!==l.value||"progress"===d&&!_||"option"===d&&_!==y.value)&&T$2(l,"value",_,y.value,!1),"checked"in p&&void 0!==(_=p.checked)&&_!==l.checked&&T$2(l,"checked",_,y.checked,!1));}return l}function O(n,u,i){try{"function"==typeof n?n(u):n.current=u;}catch(n){l$1.__e(n,i);}}function S(n,u,i){var t,r;if(l$1.unmount&&l$1.unmount(n),(t=n.ref)&&(t.current&&t.current!==n.__e||O(t,null,u)),null!=(t=n.__c)){if(t.componentWillUnmount)try{t.componentWillUnmount();}catch(n){l$1.__e(n,u);}t.base=t.__P=null,n.__c=void 0;}if(t=n.__k)for(r=0;r<t.length;r++)t[r]&&S(t[r],u,i||"function"!=typeof n.type);i||null==n.__e||v$1(n.__e),n.__=n.__e=n.__d=void 0;}function q$1(n,l,u){return this.constructor(n,u)}function B$2(u,i,t){var r,o,f;l$1.__&&l$1.__(u,i),o=(r="function"==typeof t)?null:t&&t.__k||i.__k,f=[],L$1(i,u=(!r&&t||i).__k=y(_$1,null,[u]),o||c$1,c$1,void 0!==i.ownerSVGElement,!r&&t?[t]:o?null:i.firstChild?n.call(i.childNodes):null,f,!r&&t?t:o?o.__e:i.firstChild,r),M(f,u);}n=s$1.slice,l$1={__e:function(n,l,u,i){for(var t,r,o;l=l.__;)if((t=l.__c)&&!t.__)try{if((r=t.constructor)&&null!=r.getDerivedStateFromError&&(t.setState(r.getDerivedStateFromError(n)),o=t.__d),null!=t.componentDidCatch&&(t.componentDidCatch(n,i||{}),o=t.__d),o)return t.__E=t}catch(l){n=l;}throw n}},u$1=0,k$1.prototype.setState=function(n,l){var u;u=null!=this.__s&&this.__s!==this.state?this.__s:this.__s=h$1({},this.state),"function"==typeof n&&(n=n(h$1({},u),this.props)),n&&h$1(u,n),null!=n&&this.__v&&(l&&this._sb.push(l),m$1(this));},k$1.prototype.forceUpdate=function(n){this.__v&&(this.__e=!0,n&&this.__h.push(n),m$1(this));},k$1.prototype.render=_$1,t$1=[],o$2="function"==typeof Promise?Promise.prototype.then.bind(Promise.resolve()):setTimeout,f$1=function(n,l){return n.__v.__b-l.__v.__b},w$2.__r=0;

var _=0;function o$1(o,e,n,t,f,l){var s,u,a={};for(u in e)"ref"==u?s=e[u]:a[u]=e[u];var i={type:o,props:a,key:n,ref:s,__k:null,__:null,__b:0,__e:null,__d:void 0,__c:null,__h:null,constructor:void 0,__v:--_,__source:f,__self:l};if("function"==typeof o&&(s=o.defaultProps))for(u in s)void 0===a[u]&&(a[u]=s[u]);return l$1.vnode&&l$1.vnode(i),i}

var en$1 = {
	show_popup: {
		message: "Show %destUrl%"
	},
	continue_blocking: {
		message: "Continue blocking"
	},
	allow_from: {
		message: "Allow popups for %origDomain%"
	},
	manage_pref: {
		message: "Manage preferences..."
	},
	popup_text: {
		message: "AdGuard prevented this website from opening %numPopup% pop-up windows"
	},
	options: {
		message: "Options"
	},
	silence_noti: {
		message: "Don't show this message on %origDomain%"
	},
	site_input_ph: {
		message: "Enter site name"
	},
	add_site: {
		message: "Add a site"
	},
	add: {
		message: "Add"
	},
	allowed_empty: {
		message: "List of allowed sites is empty"
	},
	allowed: {
		message: "Allowed"
	},
	silenced_empty: {
		message: "List of silenced sites is empty"
	},
	silenced: {
		message: "Silenced"
	},
	allowed_tooltip: {
		message: "Popups will be allowed for domains listed here."
	},
	silenced_tooltip: {
		message: "Notifications for blocked popups will not be shown for domains listed here."
	},
	installFrom: {
		message: "Install from <a>%name%</a>"
	},
	noinst_step_3: {
		message: "Step 3: Refresh this page to get to the userscript settings"
	},
	noinst_ignore_if_ag: {
		message: "If you installed AdGuard for Windows, you can ignore this step as the Popup Blocker userscript comes pre-installed."
	},
	noinst_rec: {
		message: "(Recommended)"
	},
	please_wait: {
		message: "Please wait, detecting the Popup Blocker"
	},
	noinst_special_prog: {
		message: "To use a userscript, you first need a special program or extension that runs userscript."
	},
	noinst_subtitle: {
		message: "AdGuard Popup Blocker userscript is not installed. Please see the instruction below."
	},
	homepage: {
		message: "Homepage"
	},
	noinst_step_1: {
		message: "Step 1: Install a userscript manager"
	},
	noinst_step_2: {
		message: "Step 2: Userscript"
	},
	extension_name: {
		message: "Popup Blocker by AdGuard"
	},
	userscript_name: {
		message: "AdGuard Popup Blocker",
		platform: [
			"userscript",
			"userscript_settings"
		]
	},
	extension_description: {
		message: "Blocks pop-up ads on web pages"
	},
	on_navigation_by_popunder: {
		message: "This transition to the new page is likely to be caused by a pop-under. Do you wish to continue?",
		platform: [
			"userscript"
		]
	},
	aborted_popunder_execution: {
		message: "Popup Blocker aborted a script execution to prevent background redirect",
		platform: [
			"userscript"
		]
	},
	ext_enabled: {
		message: "Popup Blocker is on duty"
	},
	ext_disabled: {
		message: "Popup Blocker is disabled for $DOMAIN$",
		placeholders: {
			domain: {
				content: "$1"
			}
		}
	},
	ext_disabled_default: {
		message: "Popup Blocker is disabled for this domain"
	},
	settings_saved: {
		message: "Settings saved"
	}
};
var ar = {
	show_popup: {
		message: "%destUrl%اظهار"
	},
	continue_blocking: {
		message: "متابعة الحظر"
	},
	allow_from: {
		message: "%origDomain%السماح بالنوافذ المنبثقة على"
	},
	manage_pref: {
		message: "...أداره التفضيلات"
	},
	popup_text: {
		message: "النوافذالمنبثقة%numPopup% منع ادجارد موقع الويب هذا من فتح"
	},
	options: {
		message: "الخيارات"
	},
	silence_noti: {
		message: "%origDomain%عدم إظهار هذه الرسالة على"
	},
	site_input_ph: {
		message: "ادخل اسم الموقع"
	},
	add_site: {
		message: "إضافة موقع"
	},
	add: {
		message: "إضافة"
	},
	allowed_empty: {
		message: "قائمه الاستثناءات فارعة"
	},
	allowed: {
		message: "الاستثناءات "
	},
	silenced_empty: {
		message: "قائمة المواقع التي تحتوي على إشعارات صامتة فارغة"
	},
	silenced: {
		message: "صامت"
	},
	allowed_tooltip: {
		message: "سيتم السماح بالنوافذ المنبثقة على المواقع المدرجة هنا"
	},
	silenced_tooltip: {
		message: "لن يتم عرض إشعارات النوافذ المنبثقة الممنوعة على مواقع الويب المدرجة هنا"
	},
	installFrom: {
		message: "<a>%name%</a>التثبيت من"
	},
	noinst_step_3: {
		message: "الخطوة 3: قم بتحديث هذه الصفحة للوصول إلى إعدادات userscript"
	},
	noinst_ignore_if_ag: {
		message: "إذا كان لديك برنامج ادجوارد مثبتًا على الويندوز ، فيمكنك تجاهل هذه الخطوة حيث يأتي مانع النوافذ المنبثقة مثبتة مسبقًا"
	},
	noinst_rec: {
		message: "(موصى به)"
	},
	please_wait: {
		message: "يرجى الانتظار للكشف عن مانع ظهور النوافذ المنبثقة"
	},
	noinst_special_prog: {
		message: "أولاً وقبل كل شيء, لاستخدام userscript تحتاج إلى برنامج خاص أو ملحق الذي يستطيع تشغيل userscript."
	},
	noinst_subtitle: {
		message: "لم يتم تثبيت يوزر سكربت ادجوارد مانع النوافذ المنبثقة  يرجى الاطلاع على التعليمات أدناه"
	},
	homepage: {
		message: "الصفحه الرئيسيه"
	},
	noinst_step_1: {
		message: "الخطوة 1: تثبيت مديريوزر سكربت"
	},
	noinst_step_2: {
		message: "الخطوة 2: يوزر سكربت"
	},
	extension_name: {
		message: "AdGuardمانع النوافذ المنبثقة من قبل"
	},
	userscript_name: {
		message: "مانع النوافذ المنبثقة AdGuard",
		platform: [
			"userscript",
			"userscript_settings"
		]
	},
	extension_description: {
		message: "لحظر الإعلانات المنبثقة على صفحات الويب"
	},
	on_navigation_by_popunder: {
		message: "من المحتمل ان يكون هذا الانتقال إلى الصفحة الجديدة ناتجا عن الإطار المنبثق. هل ترغب في المتابعة ؟",
		platform: [
			"userscript"
		]
	},
	aborted_popunder_execution: {
		message: "مانع النوافذ المنبثقة احبط تنفيذ script لمنع أعاده توجيه الخلفية",
		platform: [
			"userscript"
		]
	},
	ext_enabled: {
		message: "مانع النوافذ المنبثقة يعمل في الخدمة"
	},
	ext_disabled: {
		message: "$ DOMAIN $تم تعطيل مانع النوافذ المنبثقة بـ",
		placeholders: {
			domain: {
				content: "$1"
			}
		}
	},
	ext_disabled_default: {
		message: "لا يمكن تشغيل مانع النوافذ المنبثقة على هذا النطاق"
	},
	settings_saved: {
		message: "الإعدادات المحفوظة"
	}
};
var be = {
	show_popup: {
		message: "Паказаць %destUrl%"
	},
	continue_blocking: {
		message: "Працягнуць блакаванне"
	},
	allow_from: {
		message: "Дазволіць усплывальныя вокны на %origDomain%"
	},
	manage_pref: {
		message: "Кіраваць наладамі..."
	},
	popup_text: {
		message: "AdGuard запабег паказ %numPopup% усплывальных вокнаў на гэтым сайце"
	},
	options: {
		message: "Опцыі"
	},
	silence_noti: {
		message: "Не паказваць гэта паведамленне на %origDomain%"
	},
	site_input_ph: {
		message: "Увядзіце імя сайта"
	},
	add_site: {
		message: "Дадаць сайт"
	},
	add: {
		message: "Дадаць"
	},
	allowed_empty: {
		message: "Спіс выняткаў пусты"
	},
	allowed: {
		message: "Выняткі"
	},
	silenced_empty: {
		message: "Спіс сайтаў з адключанымі апавяшчэннямі пусты"
	},
	silenced: {
		message: "Без апавяшчэнняў"
	},
	allowed_tooltip: {
		message: "Усплывальныя вокны будуць дазволены на сайтах, пералічаных тут."
	},
	silenced_tooltip: {
		message: "Апавяшчэнні пра заблакаваныя ўсплывальныя вокны не будуць адлюстроўвацца на сайтах, пералічаных тут."
	},
	installFrom: {
		message: "Усталяваць з <a>%name%</a>"
	},
	noinst_step_3: {
		message: "Крок 3: Абнавіце гэту старонку, каб перайсці да налад карыстацкага скрыпту"
	},
	noinst_ignore_if_ag: {
		message: "Калі вы ўсталявалі AdGuard для Windows, вы можаце праігнараваць гэты крок, бо Блакавальнік усплывальнай рэкламы ўжо ўсталяваны."
	},
	noinst_rec: {
		message: "(Рэкамендуецца)"
	},
	please_wait: {
		message: "Калі ласка, пачакайце, спроба выявіць Блакавальнік усплывальнай рэкламы"
	},
	noinst_special_prog: {
		message: "Для выкарыстання скрыпту вам, перадусім, патрэбна адмысловая праграма (ці пашырэнне), якая можа працаваць з карыстацкімі скрыптамі."
	},
	noinst_subtitle: {
		message: "Блакавальнік усплывальнай рэкламы AdGuard не пастаўлены. Калі ласка, звярніцеся да інструкцыі ніжэй."
	},
	homepage: {
		message: "Хатняя старонка"
	},
	noinst_step_1: {
		message: "Крок 1: усталюйце праграму для кіравання карыстацкімі скрыптамі"
	},
	noinst_step_2: {
		message: "Крок 2: карыстацкі скрыпт"
	},
	extension_name: {
		message: "Блакавальнік усплывальнай рэкламы ад AdGuard"
	},
	userscript_name: {
		message: "Блакавальнік усплывальнай рэкламы ад AdGuard",
		platform: [
			"userscript",
			"userscript_settings"
		]
	},
	extension_description: {
		message: "Блакуе ўсплывальную рэкламу на старонках"
	},
	on_navigation_by_popunder: {
		message: "Гэты пераход на новую старонку найхутчэй выкліканы поп-андэрам. Усё адно працягнуць?",
		platform: [
			"userscript"
		]
	},
	aborted_popunder_execution: {
		message: "Блакавальнік усплывальнай рэкламы перапыніў выкананне скрыпту, каб перадухіліць фонавае пераадрасаванне",
		platform: [
			"userscript"
		]
	},
	ext_enabled: {
		message: "Блакавальнік усплывальнай рэкламы гатоў да працы"
	},
	ext_disabled: {
		message: "Блакавальнік усплывальнай рэкламы адключаны для $DOMAIN$",
		placeholders: {
			domain: {
				content: "$1"
			}
		}
	},
	ext_disabled_default: {
		message: "Блакавальнік усплывальнай рэкламы не працуе на гэтым дамене"
	},
	settings_saved: {
		message: "Налады захаваны"
	}
};
var cs = {
	show_popup: {
		message: "Zobrazit %destUrl%"
	},
	continue_blocking: {
		message: "Pokračovat v blokování"
	},
	allow_from: {
		message: "Povolit vyskakovací okna pro %origDomain%"
	},
	manage_pref: {
		message: "Spravovat předvolby"
	},
	popup_text: {
		message: "AdGuard zabránil tomu, aby tato webová stránka otevřela vyskakovací okna: %numPopup%"
	},
	options: {
		message: "Možnosti"
	},
	silence_noti: {
		message: "Tuto zprávu nezobrazovat na %origDomain%"
	},
	site_input_ph: {
		message: "Zadejte název stránky"
	},
	add_site: {
		message: "Přidat stránku"
	},
	add: {
		message: "Přidat"
	},
	allowed_empty: {
		message: "Seznam výjimek je prázdný"
	},
	allowed: {
		message: "Výjimky"
	},
	silenced_empty: {
		message: "Seznam webových stránek s tichými oznámeními je prázdný"
	},
	silenced: {
		message: "Umlčeno"
	},
	allowed_tooltip: {
		message: "Vyskakovací okna jsou povolena na webových stránkách uvedených zde."
	},
	silenced_tooltip: {
		message: "Oznámení o blokovaných vyskakovacích oknech se nezobrazí na zde uvedených webových stránkách."
	},
	installFrom: {
		message: "Instalovat z <a>%name%</a>"
	},
	noinst_step_3: {
		message: "Krok 3: Obnovte tuto stránku, abyste se dostali k nastavení uživatelských skriptů"
	},
	noinst_ignore_if_ag: {
		message: "Pokud máte nainstalovanou službu AdGuard for Windows, můžete tento krok ignorovat. Uživatelský skript blokování vyskakovacích oken přichází předem nainstalovaný."
	},
	noinst_rec: {
		message: "(Doporučeno)"
	},
	please_wait: {
		message: "Čekejte prosím, zjišťuji Blokátor vyskakovacích oken"
	},
	noinst_special_prog: {
		message: "Chcete-li používat uživatelský skript, potřebujete nejprve speciální program nebo rozšíření, které spustí uživatelský skript."
	},
	noinst_subtitle: {
		message: "Uživatelský skript pro blokování vyskakovacích oken AdGuard není nainstalován. Pokyny naleznete níže."
	},
	homepage: {
		message: "Domovská stránka"
	},
	noinst_step_1: {
		message: "Krok 1: Nainstalujte správce uživatelských skriptů"
	},
	noinst_step_2: {
		message: "Krok 2: Uživatelský skript"
	},
	extension_name: {
		message: "AdGuard blokátor vyskakovacích oken"
	},
	userscript_name: {
		message: "AdGuard blokátor vyskakovacích oken",
		platform: [
			"userscript",
			"userscript_settings"
		]
	},
	extension_description: {
		message: "Blokuje vyskakovací reklamy na webových stránkách"
	},
	on_navigation_by_popunder: {
		message: "Tento přechod na novou stránku bude pravděpodobně způsoben pop-under. Chcete pokračovat?",
		platform: [
			"userscript"
		]
	},
	aborted_popunder_execution: {
		message: "Blokátor vyskakovacích oken zrušil spuštění skriptu, aby zabránil přesměrování na pozadí",
		platform: [
			"userscript"
		]
	},
	ext_enabled: {
		message: "Blokování vyskakovacích oken je v provozu"
	},
	ext_disabled: {
		message: "Blokování vyskakovacích oken je zakázáno pro $DOMAIN$",
		placeholders: {
			domain: {
				content: "$1"
			}
		}
	},
	ext_disabled_default: {
		message: "Blokování vyskakovacích oken nemůže běžet na této doméně"
	},
	settings_saved: {
		message: "Nastavení uložena"
	}
};
var da = {
	show_popup: {
		message: "Vis %destUrl%"
	},
	continue_blocking: {
		message: "Fortsæt blokering"
	},
	allow_from: {
		message: "Tillad pop-op'er for %origDomain%"
	},
	manage_pref: {
		message: "Håndtere præferencer..."
	},
	popup_text: {
		message: "AdGuard forhindrede dette websted i at åbne %numPopup% pop op-vinduer"
	},
	options: {
		message: "Valgmuligheder"
	},
	silence_noti: {
		message: "Vis ikke denne meddelelse på %origDomain%"
	},
	site_input_ph: {
		message: "Angiv webstedsnavn"
	},
	add_site: {
		message: "Tilføj et websted"
	},
	add: {
		message: "Tilføj"
	},
	allowed_empty: {
		message: "Hvidliste over websteder er tom"
	},
	allowed: {
		message: "Hvidlistet"
	},
	silenced_empty: {
		message: "Listen over websteder med tavse notifikationer er tom"
	},
	silenced: {
		message: "Gjort tavse"
	},
	allowed_tooltip: {
		message: "Pop-ups vil være tilladt på de websteder, som er angivet her."
	},
	silenced_tooltip: {
		message: "Notifikationer om blokerede pop-ups vises ikke på de websteder, som er angivet her."
	},
	installFrom: {
		message: "Installér fra <a>%name%</a>"
	},
	noinst_step_3: {
		message: "Trin 3: Opfrisk siden for at kunne tilgå userscript-indstillingerne"
	},
	noinst_ignore_if_ag: {
		message: "Har du AdGuard til Windows installeret, kan du ignorere dette trin, da Popup Blocker-userscriptet er forudinstalleret."
	},
	noinst_rec: {
		message: "(Anbefalet)"
	},
	please_wait: {
		message: "Afvent venligst, detekterer Popup Blocker"
	},
	noinst_special_prog: {
		message: "For brug af et userscript kræves først og fremmest et særligt program/udvidelse, der kan afvikle userscripts."
	},
	noinst_subtitle: {
		message: "AdGuard Popup Blocker-userscriptet er ikke installeret. Tjek nedenstående vejledning."
	},
	homepage: {
		message: "Hjemmeside"
	},
	noinst_step_1: {
		message: "Trin 1: Installér en userscript-håndtering"
	},
	noinst_step_2: {
		message: "Trin 2: Userscript"
	},
	extension_name: {
		message: "Popup Blocker fra AdGuard"
	},
	userscript_name: {
		message: "AdGuard Popup Blocker",
		platform: [
			"userscript",
			"userscript_settings"
		]
	},
	extension_description: {
		message: "Blokerer pop-op annoncer på websider"
	},
	on_navigation_by_popunder: {
		message: "Denne overgang til den nye side skyldes sandsynligvis en pop-under. Fortsæt?",
		platform: [
			"userscript"
		]
	},
	aborted_popunder_execution: {
		message: "Popup Blocker afbrød en scripteksekvering for at forhindre baggrundsomdirigering",
		platform: [
			"userscript"
		]
	},
	ext_enabled: {
		message: "Popup Blocker er på vagt"
	},
	ext_disabled: {
		message: "Popup Blocker er deaktiveret for $DOMAIN$",
		placeholders: {
			domain: {
				content: "$1"
			}
		}
	},
	ext_disabled_default: {
		message: "Popup Blocker er deaktiveret på dette domæne"
	},
	settings_saved: {
		message: "Indstillinger gemt"
	}
};
var de = {
	show_popup: {
		message: "%destUrl% anzeigen"
	},
	continue_blocking: {
		message: "Weiterhin sperren"
	},
	allow_from: {
		message: "Pop-ups auf %origDomain% zulassen"
	},
	manage_pref: {
		message: "Einstellungen verwalten …"
	},
	popup_text: {
		message: "AdGuard hat auf dieser Website %numPopup% Pop-up-Fenster verhindert"
	},
	options: {
		message: "Optionen"
	},
	silence_noti: {
		message: "Diese Nachricht auf %origDomain% nicht anzeigen"
	},
	site_input_ph: {
		message: "Seitenname eingeben"
	},
	add_site: {
		message: "Eine Seite hinzufügen"
	},
	add: {
		message: "Hinzufügen"
	},
	allowed_empty: {
		message: "Liste der Ausnahmen ist leer"
	},
	allowed: {
		message: "Ausnahmen"
	},
	silenced_empty: {
		message: "Liste der Websites ohne Benachrichtigungen ist leer"
	},
	silenced: {
		message: "Ausgeschaltet"
	},
	allowed_tooltip: {
		message: "Pop-ups werden für die hier aufgeführten Domains zugelassen."
	},
	silenced_tooltip: {
		message: "Benachrichtigungen für gesperrte Pop-ups werden auf den hier aufgeführten Websites nicht angezeigt."
	},
	installFrom: {
		message: "Von <a>%name%</a> installieren"
	},
	noinst_step_3: {
		message: "Schritt 3: Aktualisieren Sie diese Seite, um zu den Benutzerskript-Einstellungen zu übergehen"
	},
	noinst_ignore_if_ag: {
		message: "Wenn Sie AdGuard für Windows installiert haben, können Sie diesen Schritt ignorieren, da das Benutzerskript für den Pop-up-Blocker bereits vorinstalliert ist."
	},
	noinst_rec: {
		message: "(Empfohlen)"
	},
	please_wait: {
		message: "Bitte warten Sie, der Pop-up-Blocker wird erkannt"
	},
	noinst_special_prog: {
		message: "Um ein Benutzerskript verwendende können, benötigen Sie ein spezielles Programm, das Benutzerskripte ausführt."
	},
	noinst_subtitle: {
		message: "AdGuard Pop-up-Blocker Benutzerskript ist nicht installiert. Bitte beachten Sie die folgende Anleitung."
	},
	homepage: {
		message: "Startseite"
	},
	noinst_step_1: {
		message: "Schritt 1: Installieren Sie einen Benutzerskript-Manager"
	},
	noinst_step_2: {
		message: "Schritt 2: Benutzerskript"
	},
	extension_name: {
		message: "Pop-up-Blocker von AdGuard"
	},
	userscript_name: {
		message: "AdGuard Pop-up-Blocker",
		platform: [
			"userscript",
			"userscript_settings"
		]
	},
	extension_description: {
		message: "Blockiert Anzeige-Pop-ups auf Websites"
	},
	on_navigation_by_popunder: {
		message: "Diese Seiten-Navigation wird wahrscheinlich durch ein Pop-under verursacht. Möchten Sie fortfahren?",
		platform: [
			"userscript"
		]
	},
	aborted_popunder_execution: {
		message: "Pop-up-Blocker hat eine Skript-Ausführung abgebrochen, um eine Hintergrundumleitung zu verhindern",
		platform: [
			"userscript"
		]
	},
	ext_enabled: {
		message: "Pop-up-Blocker verrichtet seinen Dienst"
	},
	ext_disabled: {
		message: "Der Pop-up-Blocker ist für $DOMAIN$ deaktiviert",
		placeholders: {
			domain: {
				content: "$1"
			}
		}
	},
	ext_disabled_default: {
		message: "Pop-up-Blocker funktioniert auf dieser Domain nicht"
	},
	settings_saved: {
		message: "Einstellungen gespeichert"
	}
};
var el = {
	show_popup: {
		message: "Εμφάνιση %destUrl%"
	},
	continue_blocking: {
		message: "Συνέχεια αποκλεισμού"
	},
	allow_from: {
		message: "Να επιτρέπονται τα αναδυόμενα παράθυρα για το %origDomain%"
	},
	manage_pref: {
		message: "Διαχείριση προτιμήσεων..."
	},
	popup_text: {
		message: "Το AdGuard εμπόδισε αυτόν τον ιστότοπο να ανοίξει %numPopup% αναδυόμενα παράθυρα"
	},
	options: {
		message: "Επιλογές"
	},
	silence_noti: {
		message: "Να μην εμφανίζεται αυτό το μήνυμα στο %origDomain%"
	},
	site_input_ph: {
		message: "Εισαγάγετε όνομα ιστότοπου"
	},
	add_site: {
		message: "Προσθήκη ιστοσελίδας"
	},
	add: {
		message: "Προσθήκη"
	},
	allowed_empty: {
		message: "Η λίστα των επιτρεπόμενων ιστότοπων είναι κενή"
	},
	allowed: {
		message: "Επιτρέπεται"
	},
	silenced_empty: {
		message: "Η λίστα των ιστότοπων σε σίγαση είναι κενή"
	},
	silenced: {
		message: "Σίγαση"
	},
	allowed_tooltip: {
		message: "Τα αναδυόμενα παράθυρα θα επιτρέπονται στους τομείς που αναφέρονται εδώ."
	},
	silenced_tooltip: {
		message: "Οι ειδοποιήσεις για αποκλεισμένα αναδυόμενα παράθυρα δεν θα εμφανίζονται για τομείς που αναφέρονται εδώ."
	},
	installFrom: {
		message: "Εγκατάσταση από {$startLink}{$name}{$endLink}"
	},
	noinst_step_3: {
		message: "Βήμα 3: Ανανεώστε αυτήν τη σελίδα για να μεταβείτε στις ρυθμίσεις του userscript"
	},
	noinst_ignore_if_ag: {
		message: "Εάν εγκαταστήσατε το AdGuard για Windows, μπορείτε να αγνοήσετε αυτό το βήμα καθώς το userscript για αποκλεισμό αναδυόμενων παραθύρων είναι προεγκατεστημένο."
	},
	noinst_rec: {
		message: "(Συνιστάται)"
	},
	please_wait: {
		message: "Παρακαλώ περιμένετε, ανίχνευση για Αποκλεισμό αναδυόμενων παραθύρων"
	},
	noinst_special_prog: {
		message: "Πρώτα απ'όλα, για να χρησιμοποιήσετε ένα userscript χρειάζεστε ένα ειδικό πρόγραμμα ή επέκταση που εκτελεί userscripts."
	},
	noinst_subtitle: {
		message: "Το userscript αποκλεισμός αναδυόμενων παραθύρων AdGuard δεν είναι εγκατεστημένο. Ανατρέξτε στις παρακάτω οδηγίες."
	},
	homepage: {
		message: "Αρχική σελίδα"
	},
	noinst_step_1: {
		message: "Βήμα 1: Εγκαταστήστε έναν διαχειριστή userscript"
	},
	noinst_step_2: {
		message: "Βήμα 2: Userscript"
	},
	extension_name: {
		message: "Αποκλεισμός αναδυόμενων παραθύρων από το AdGuard"
	},
	userscript_name: {
		message: "Αποκλεισμός αναδυόμενων παραθύρων AdGuard",
		platform: [
			"userscript",
			"userscript_settings"
		]
	},
	extension_description: {
		message: "Αποκλείει αναδυόμενες διαφημίσεις σε ιστοσελίδες"
	},
	on_navigation_by_popunder: {
		message: "Αυτή η μετάβαση σε νέα σελίδα είναι πιθανό να προκαλείται από ένα αναδυόμενο παράθυρο. Θέλετε να συνεχίσετε;",
		platform: [
			"userscript"
		]
	},
	aborted_popunder_execution: {
		message: "Το Αποκλεισμός αναδυόμενων παραθύρων ακύρωσε μια εκτέλεση σεναρίου για να αποτρέψει την ανακατεύθυνση του φόντου",
		platform: [
			"userscript"
		]
	},
	ext_enabled: {
		message: "Το Αποκλεισμός αναδυόμενων παραθύρων είναι σε λειτουργία"
	},
	ext_disabled: {
		message: "Ο Αποκλεισμός αναδυόμενων παραθύρων είναι απενεργοποιημένος για το $DOMAIN$",
		placeholders: {
			domain: {
				content: "$1"
			}
		}
	},
	ext_disabled_default: {
		message: "Ο Αποκλεισμός αναδυόμενων παραθύρων είναι απενεργοποιημένος για αυτόν τον τομέα"
	},
	settings_saved: {
		message: "Οι ρυθμίσεις αποθηκεύτηκαν"
	}
};
var es = {
	show_popup: {
		message: "Mostrar %destUrl%"
	},
	continue_blocking: {
		message: "Continuar bloqueando"
	},
	allow_from: {
		message: "Permitir ventanas emergentes en %origDomain%"
	},
	manage_pref: {
		message: "Administrar preferencias..."
	},
	popup_text: {
		message: "AdGuard impidió que este sitio web abriera %numPopup% ventanas emergentes"
	},
	options: {
		message: "Opciones"
	},
	silence_noti: {
		message: "No mostrar este mensaje en %origDomain%"
	},
	site_input_ph: {
		message: "Ingrese el nombre del sitio"
	},
	add_site: {
		message: "Añadir un sitio"
	},
	add: {
		message: "Añadir"
	},
	allowed_empty: {
		message: "La lista de permitido está vacía"
	},
	allowed: {
		message: "Permitido"
	},
	silenced_empty: {
		message: "La lista de sitios con notificaciones silenciadas está vacía"
	},
	silenced: {
		message: "Silenciado"
	},
	allowed_tooltip: {
		message: "Las ventanas emergentes estarán permitidas en los sitios web enumerados aquí."
	},
	silenced_tooltip: {
		message: "Las notificaciones de ventanas emergentes bloqueadas no se mostrarán en los sitios web enumerados aquí."
	},
	installFrom: {
		message: "Instalar desde <a>%name%</a>"
	},
	noinst_step_3: {
		message: "Paso 3: Actualice esta página para acceder a la configuración del userscript"
	},
	noinst_ignore_if_ag: {
		message: "Si tienes instalado AdGuard para Windows, puedes ignorar este paso ya que el userscript Popup Blocker viene preinstalado."
	},
	noinst_rec: {
		message: "(recomendado)"
	},
	please_wait: {
		message: "Espere por favor, detectando Popup Blocker"
	},
	noinst_special_prog: {
		message: "En primer lugar, para usar un userscript necesitas un programa especial que ejecute el userscript."
	},
	noinst_subtitle: {
		message: "AdGuard Popup Blocker no es instalado. Por favor, vea el manual abajo."
	},
	homepage: {
		message: "Página de inicio"
	},
	noinst_step_1: {
		message: "Paso 1: Instale el gestor de userscript"
	},
	noinst_step_2: {
		message: "Paso 2: Userscript"
	},
	extension_name: {
		message: "Popup Blocker por AdGuard"
	},
	userscript_name: {
		message: "AdGuard Popup Blocker",
		platform: [
			"userscript",
			"userscript_settings"
		]
	},
	extension_description: {
		message: "Bloquea anuncios emergentes en sitios web"
	},
	on_navigation_by_popunder: {
		message: "Es probable que esta transición a la nueva página sea causada por un elemento emergente. ¿Deseas continuar?",
		platform: [
			"userscript"
		]
	},
	aborted_popunder_execution: {
		message: "Popup Blocker canceló la ejecución de un script para evitar la redirección en segundo plano",
		platform: [
			"userscript"
		]
	},
	ext_enabled: {
		message: "Popup Blocker está en servicio"
	},
	ext_disabled: {
		message: "Popup Blocker está deshabilitado para $DOMAIN$",
		placeholders: {
			domain: {
				content: "$1"
			}
		}
	},
	ext_disabled_default: {
		message: "Popup Blocker está deshabilitado para este dominio"
	},
	settings_saved: {
		message: "Ajustes guardados"
	}
};
var fa = {
	show_popup: {
		message: "نمایش %destUrl%"
	},
	continue_blocking: {
		message: "ادامه مسدودسازی"
	},
	allow_from: {
		message: "اجازه پاپ آپ ها در %origDomain%"
	},
	manage_pref: {
		message: "مدیریت اولویت ها..."
	},
	popup_text: {
		message: "AdGuard این وبسایت را از بازکردن %numPopup% پنجره پاپ آپ جلوگیری کرد"
	},
	options: {
		message: "گزینه ها"
	},
	silence_noti: {
		message: "این پیام را نشان نده در %origDomain%"
	},
	site_input_ph: {
		message: "نام سایت را وارد کنید"
	},
	add_site: {
		message: "افزودن یک سایت"
	},
	add: {
		message: "افزودن"
	},
	allowed_empty: {
		message: "لیست استثناها خالی است"
	},
	allowed: {
		message: "استثناها"
	},
	silenced_empty: {
		message: "لیست وبسایت ها با اطلاع رسانی خاموش شده،خالی است"
	},
	silenced: {
		message: "خاموش شده"
	},
	allowed_tooltip: {
		message: "پاپ آپ برای وبسایت هایی که در اینجا لیست شده،اجازه داده می شود."
	},
	silenced_tooltip: {
		message: "اطلاع رسانی پاپ آپ مسدود شده برای وبسایت های لیست شده در اینجا نمایش داده نمیشود."
	},
	installFrom: {
		message: "نصب از <a>%name%</a>"
	},
	noinst_step_3: {
		message: "گام 3:برای دریافت تنظیمات یوزراسکریپت این صفحه را تازه سازی کنید"
	},
	noinst_ignore_if_ag: {
		message: "اگر شما AdGuard for Windows را نصب کرده اید، شما میتوانید این گام را چشمپوشی کنید چون یوزراسکریپت مسدودساز پاپ آپ از پیش نصب شده است."
	},
	noinst_rec: {
		message: "(توصیه شده)"
	},
	please_wait: {
		message: "منتظر بمانید،درحال تشخیص مسدودساز پاپ آپ"
	},
	noinst_special_prog: {
		message: "اول از همه برای استفاده از یوزر اسکریپت نیاز به برنامه ویژه یا افزونه ای است که بتواند آن را اِجرا کند است."
	},
	noinst_subtitle: {
		message: "یوزراسکریپت مسدودساز پاپ آپ AdGuard نصب نشده است. لطفا دستور العمل را در زیر مشاهده کنید."
	},
	homepage: {
		message: "صفحه خانگی"
	},
	noinst_step_1: {
		message: "گام 1:نصب مدیر یوزر اسکریپت"
	},
	noinst_step_2: {
		message: "گام 2: یوزر اسکریپت"
	},
	extension_name: {
		message: "مسدودساز پاپ-آپ AdGuard"
	},
	userscript_name: {
		message: "مسدودساز پاپ-آپ AdGuard",
		platform: [
			"userscript",
			"userscript_settings"
		]
	},
	extension_description: {
		message: "مسدودسازی تبلیغات پاپ آپ در صفحات وب."
	},
	on_navigation_by_popunder: {
		message: "انتقال به این صفحه جدید احتمالا بخاطر یه پاپ-آندر انجام شده است. میخواهید ادامه دهید؟",
		platform: [
			"userscript"
		]
	},
	aborted_popunder_execution: {
		message: "مسدودساز پاپ-آپ اجرای کد را لغو کرده تا از ریدایرکت جبلوگیری شود",
		platform: [
			"userscript"
		]
	},
	ext_enabled: {
		message: "مسدودساز پاپ آپ در حال انجام وظیفه است"
	},
	ext_disabled: {
		message: "مسدودساز پاپ آپ برای $DOMAIN$ غیر فعال شده است",
		placeholders: {
			domain: {
				content: "$1"
			}
		}
	},
	ext_disabled_default: {
		message: "مسدودساز پاپ آپ نمیتواند در این دامنه اجرا شود"
	},
	settings_saved: {
		message: "تنظيمات ذخیره شد"
	}
};
var fi = {
	show_popup: {
		message: "Avaa %destUrl%"
	},
	continue_blocking: {
		message: "Jatka estoa"
	},
	allow_from: {
		message: "Salli ponnahdukset verkkotunnukselta %origDomain%"
	},
	manage_pref: {
		message: "Hallinnoi asetuksia..."
	},
	popup_text: {
		message: "AdGuard esti tätä verkkosivustoa avaamasta %numPopup% ponnahdusta"
	},
	options: {
		message: "Valinnat"
	},
	silence_noti: {
		message: "Älä näytä tätä viestiä sivustolla %origDomain%"
	},
	site_input_ph: {
		message: "Syötä sivuston nimi"
	},
	add_site: {
		message: "Lisää sivusto"
	},
	add: {
		message: "Lisää"
	},
	allowed_empty: {
		message: "Lista on tyhjä"
	},
	allowed: {
		message: "Sallitut"
	},
	silenced_empty: {
		message: "Lista on tyjä"
	},
	silenced: {
		message: "Mykistetty"
	},
	allowed_tooltip: {
		message: "Tässä listattujen verkkotunnusten ponnahdukset sallitaan."
	},
	silenced_tooltip: {
		message: "Tämän listan verkkotunnuksissa estetyistä ponnahduksista ei näytetä estoilmoituksia."
	},
	installFrom: {
		message: "Asenna kohteesta <a>%name%</a>"
	},
	noinst_step_3: {
		message: "Vaihe 3: Päivitä tämä sivu saadaksesi käyttäjäskriptin asetukset"
	},
	noinst_ignore_if_ag: {
		message: "Jos asensit AdGuardin Windowsille, voit ohittaa tämän vaiheen, koska Ponnahdusesto-käyttäjäskripti sisältyy siihen."
	},
	noinst_rec: {
		message: "(suositeltu)"
	},
	please_wait: {
		message: "Odota hetki, Ponnahdusestoa havaitaan"
	},
	noinst_special_prog: {
		message: "Käyttääksesi userscript-laajennuksia, tarvitset erityisesti niiden suorittamiseen tarkoitetun ohjelmiston tai laajennuksen."
	},
	noinst_subtitle: {
		message: "AdGuard Ponnahdusesto -käyttäjäskriptiä ei ole asennettu. Katso ohjeet alta."
	},
	homepage: {
		message: "Verkkosivusto"
	},
	noinst_step_1: {
		message: "Vaihe 1: Asenna käyttäjäskriptien hallintamanageri"
	},
	noinst_step_2: {
		message: "Vaihe 2: Käyttäjäskripti"
	},
	extension_name: {
		message: "Ponnahdusesto AdGuardilta"
	},
	userscript_name: {
		message: "AdGuard Ponnahdusesto",
		platform: [
			"userscript",
			"userscript_settings"
		]
	},
	extension_description: {
		message: "Estää verkkosivujen ponnahdusmainokset."
	},
	on_navigation_by_popunder: {
		message: "Siirtyminen toiselle sivulle johtui todennäköisesti taustalle piilottuneesta ponnahduksesta. Haluatko jatkaa?",
		platform: [
			"userscript"
		]
	},
	aborted_popunder_execution: {
		message: "Ponnahdusesto keskeytti komentosarjan estääkseen taustalla tapahtuvan uudelleenohjauksen",
		platform: [
			"userscript"
		]
	},
	ext_enabled: {
		message: "Ponnahdusesto on käytössä"
	},
	ext_disabled: {
		message: "Ponnahdusesto on poistettu käytöstä verkkotunnusessa $DOMAIN$",
		placeholders: {
			domain: {
				content: "$1"
			}
		}
	},
	ext_disabled_default: {
		message: "Ponnahdusesto on poistettu käytöstä tässä verkkotunnuksessa"
	},
	settings_saved: {
		message: "Asetukset tallennettiin"
	}
};
var fr = {
	show_popup: {
		message: "Afficher %destUrl%"
	},
	continue_blocking: {
		message: "Continuer le blocage"
	},
	allow_from: {
		message: "Autoriser fenêtres pop-up pour %origDomain%"
	},
	manage_pref: {
		message: "Administrer les préférences..."
	},
	popup_text: {
		message: "AdGuard a empêché ce site web d'afficher %numPopup% fenêtres pop-up"
	},
	options: {
		message: "Options"
	},
	silence_noti: {
		message: "Ne pas afficher ce message sur %origDomain%"
	},
	site_input_ph: {
		message: "Saisir le nom du site Web"
	},
	add_site: {
		message: "Ajouter un site Web"
	},
	add: {
		message: "Ajouter"
	},
	allowed_empty: {
		message: "La liste des exceptions est vide"
	},
	allowed: {
		message: "Autorisé"
	},
	silenced_empty: {
		message: "La liste des sites web aux notifications silencieuses est vide"
	},
	silenced: {
		message: "Silence imposé"
	},
	allowed_tooltip: {
		message: "Fenêtres pop-up pour les sites web sur la liste vont être autorisés."
	},
	silenced_tooltip: {
		message: "Les notifications pour les fenêtres pop-up bloquées depuis les sites web listés ci-dessous ne seront pas affichées."
	},
	installFrom: {
		message: "Installer de <a>%name%</a>"
	},
	noinst_step_3: {
		message: "Étape 3: actualisez cette page page pour accéder aux paramètres du script utilisateur"
	},
	noinst_ignore_if_ag: {
		message: "Si vous avez installé AdGuard pour Windows auparavant, vous pouvez passer cette étape car le script utilisateur Bloqueur de fenêtres pop-up y est déjà pré-installé."
	},
	noinst_rec: {
		message: "(Recommandé)"
	},
	please_wait: {
		message: "Veuillez patienter, recherche de bloqueur des fenêtres pop-up en cours"
	},
	noinst_special_prog: {
		message: "Tout d'abord, pour utiliser un script utilisateur vous avez besoin d'un programme spécial ou d'une extension qui gère les scripts utilisateur."
	},
	noinst_subtitle: {
		message: "Le script utilisateur bloqueur de fenêtres pop-up n'est pas installé. Veuillez consulter le manuel ci-dessous."
	},
	homepage: {
		message: "Page d'accueil"
	},
	noinst_step_1: {
		message: "Étape 1: installer un logiciel géstionnaire de scripts utilisateurs"
	},
	noinst_step_2: {
		message: "Étape 2: script utilisateur"
	},
	extension_name: {
		message: "Bloqueur de fenêtres pop-up de AdGuard"
	},
	userscript_name: {
		message: "Bloqueur de fenêtres pop-up de AdGuard",
		platform: [
			"userscript",
			"userscript_settings"
		]
	},
	extension_description: {
		message: "Bloque les fenêtres pop-up avec publicités intrusives sur les pages web"
	},
	on_navigation_by_popunder: {
		message: "Cette transition vers la nouvelle page est susceptible d'être causée par un pop-under. Désirez-vous continuer?",
		platform: [
			"userscript"
		]
	},
	aborted_popunder_execution: {
		message: "Le bloqueur de pop-ups a interrompu l'exécution d'un script pour empêcher une redirection en arrière-plan",
		platform: [
			"userscript"
		]
	},
	ext_enabled: {
		message: "Le bloqueur des fenêtres pop-up est en marche"
	},
	ext_disabled: {
		message: "Le bloqueur de fenêtres pop-up est désactivé pour $DOMAIN$",
		placeholders: {
			domain: {
				content: "$1"
			}
		}
	},
	ext_disabled_default: {
		message: "Le bloqueur de fenêtres pop-up ne marche pas sur ce domaine"
	},
	settings_saved: {
		message: "Paramètres sauvegardés"
	}
};
var he = {
	show_popup: {
		message: "הראה את %destUrl%"
	},
	continue_blocking: {
		message: "המשך לחסום"
	},
	allow_from: {
		message: "התר חלונות קופצים עבור %origDomain%"
	},
	manage_pref: {
		message: "נהל העדפות…"
	},
	popup_text: {
		message: "AdGuard מנע מאתר זה לפתוח %numPopup% חלונות קופצים"
	},
	options: {
		message: "אפשרויות"
	},
	silence_noti: {
		message: "אל תראה הודעה זו בתחום %origDomain%"
	},
	site_input_ph: {
		message: "הכנס שם אתר"
	},
	add_site: {
		message: "הוסף אתר"
	},
	add: {
		message: "הוסף"
	},
	allowed_empty: {
		message: "הרשימה של אתרים מותרים ריקה"
	},
	allowed: {
		message: "מותרים"
	},
	silenced_empty: {
		message: "הרשימה של אתרים מושתקים ריקה"
	},
	silenced: {
		message: "מושתקים"
	},
	allowed_tooltip: {
		message: "חלונות קופצים יותרו עבור תחומים שכתובים ברשימה כאן."
	},
	silenced_tooltip: {
		message: "התראות עבור חלונות קופצים חסומים לא ייראו עבור תחומים שכתובים ברשימה כאן."
	},
	installFrom: {
		message: "התקן מן <a>%name%</a>"
	},
	noinst_step_3: {
		message: "צעד 3: רענן דף זה כדי לעבור אל הגדרות תסריט המשתמש"
	},
	noinst_ignore_if_ag: {
		message: "במקרה שהתקנת את AdGuard עבור Windows, אתה יכול להתעלם מצעד זה הואיל ותסריט המשתמש של חוסם החלונות הקופצים מגיע מותקן מראש."
	},
	noinst_rec: {
		message: "(מומלץ)"
	},
	please_wait: {
		message: "אנא המתן בעת גילוי חוסם החלונות הקופצים"
	},
	noinst_special_prog: {
		message: "קודם כל, כדי להשתמש בתסריט משתמש אתה צריך תוכנה או הרחבה מיוחדות אשר מריצות תסריטי משתמש."
	},
	noinst_subtitle: {
		message: "תסריט משתמש של חוסם חלונות קופצים של AdGuard אינו מותקן. אנא ראה את ההוראות למטה."
	},
	homepage: {
		message: "דף הבית"
	},
	noinst_step_1: {
		message: "צעד 1: התקן מנהל תסריטי משתמש"
	},
	noinst_step_2: {
		message: "צעד 2: תסריט משתמש"
	},
	extension_name: {
		message: "חוסם חלונות קופצים מאת AdGuard"
	},
	userscript_name: {
		message: "חוסם חלונות קופצים של AdGuard",
		platform: [
			"userscript",
			"userscript_settings"
		]
	},
	extension_description: {
		message: "חוסם פרסומות קופצות בדפי רשת"
	},
	on_navigation_by_popunder: {
		message: "מעבר זה אל הדף החדש כנראה נגרם ע״י חלון קופץ מתחת. האם אתה רוצה להמשיך?",
		platform: [
			"userscript"
		]
	},
	aborted_popunder_execution: {
		message: "חוסם החלונות הקופצים ביטל ביצוע תסריט כדי למנוע הכוונה ברקע",
		platform: [
			"userscript"
		]
	},
	ext_enabled: {
		message: "חוסם החלונות הקופצים פעיל"
	},
	ext_disabled: {
		message: "חוסם החלונות הקופצים מושבת עבור $DOMAIN$",
		placeholders: {
			domain: {
				content: "$1"
			}
		}
	},
	ext_disabled_default: {
		message: "חוסם החלונות הקופצים מושבת עבור תחום זה"
	},
	settings_saved: {
		message: "הגדרות נשמרו"
	}
};
var hr = {
	show_popup: {
		message: "Prikaži %destUrl%"
	},
	continue_blocking: {
		message: "Nastavi blokirati"
	},
	allow_from: {
		message: "Dopusti skočne prozore za %origDomain%"
	},
	manage_pref: {
		message: "Upravljanje postavkama..."
	},
	popup_text: {
		message: "AdGuard je spriječio ovu web stranicu da otvori %numPopup% skočna prozora"
	},
	options: {
		message: "Opcije"
	},
	silence_noti: {
		message: "Ne pokazuj ovu poruku za %origDomain%"
	},
	site_input_ph: {
		message: "Unesite naziv web stranice"
	},
	add_site: {
		message: "Dodaj stranicu"
	},
	add: {
		message: "Dodaj"
	},
	allowed_empty: {
		message: "Lista dopuštenih stranica je prazna"
	},
	allowed: {
		message: "Dopušteno"
	},
	silenced_empty: {
		message: "Lista utišanih stranica je prazna"
	},
	silenced: {
		message: "Utišano"
	},
	allowed_tooltip: {
		message: "Popis domena na kojima su dopušteni skočni prozori."
	},
	silenced_tooltip: {
		message: "Obavijesti za blokirane skočne prozore neće biti prikazane za navedene domene."
	},
	installFrom: {
		message: "Instaliraj s {$startLink}{$name}{$endLink}"
	},
	noinst_step_3: {
		message: "Korak 3: Osvježite ovu stranicu kako biste dobili userscript postavke"
	},
	noinst_ignore_if_ag: {
		message: "Ako ste instalirali AdGuard za Windows, možete zanemariti ovaj korak jer je userscripta blokatora skočnih prozora, unaprijed instaliran."
	},
	noinst_rec: {
		message: "(Preporučeno)"
	},
	please_wait: {
		message: "Molimo pričekajte, otkrivamo bloker skočnih prozora"
	},
	noinst_special_prog: {
		message: "Prije svega, za upotrebu userscripta potreban vam je poseban program ili proširenje koje pokreće userscripte."
	},
	noinst_subtitle: {
		message: "Userscript od AdGuard Blokera skočnih prozora, nije uspješno instaliranja. Molimo pratite upute ispod."
	},
	homepage: {
		message: "Početna stranica"
	},
	noinst_step_1: {
		message: "Korak 1: Instalirajte userscript upravitelj"
	},
	noinst_step_2: {
		message: "Korak 2: Userscript"
	},
	extension_name: {
		message: "AdGuard Bloker skočnih prozora"
	},
	userscript_name: {
		message: "AdGuard Bloker skočnih prozora",
		platform: [
			"userscript",
			"userscript_settings"
		]
	},
	extension_description: {
		message: "Blokira skočne prozore na web stranicama"
	},
	on_navigation_by_popunder: {
		message: "Prijelaz na novu stranicu je najvjerojatnije uzrokovan skrivenim skočnim prozorom. Želite li nastaviti?",
		platform: [
			"userscript"
		]
	},
	aborted_popunder_execution: {
		message: "Bloker skočnih prozora prekinuo je izvršavanje skripte kako bi spriječio preusmjeravanje u pozadini",
		platform: [
			"userscript"
		]
	},
	ext_enabled: {
		message: "Bloker skočnih prozora je aktivan"
	},
	ext_disabled: {
		message: "Bloker skočnih prozora je onemogućen za $DOMAIN$",
		placeholders: {
			domain: {
				content: "$1"
			}
		}
	},
	ext_disabled_default: {
		message: "Bloker skočnih prozora je onemogućen za ovu domenu"
	},
	settings_saved: {
		message: "Postavke su spremljene"
	}
};
var hu = {
	show_popup: {
		message: "Mutasd %destUrl%"
	},
	continue_blocking: {
		message: "Blokkolás folytatása"
	},
	allow_from: {
		message: "Felugró ablakok engedélyezése itt: %origDomain%"
	},
	manage_pref: {
		message: "Beállítások kezelése..."
	},
	popup_text: {
		message: "Az AdGuard %numPopup% felugró ablak megjelenését akadályozta meg"
	},
	options: {
		message: "Beállítások"
	},
	silence_noti: {
		message: "Ne mutassa ezt az üzenetet itt: %origDomain%"
	},
	site_input_ph: {
		message: "Írja be a webhely nevét"
	},
	add_site: {
		message: "Webhely hozzáadása"
	},
	add: {
		message: "Hozzáadás"
	},
	allowed_empty: {
		message: "Az engedélyezett oldalak listája üres"
	},
	allowed: {
		message: "Engedélyezett"
	},
	silenced_empty: {
		message: "Az némított oldalak listája üres"
	},
	silenced: {
		message: "Némított"
	},
	allowed_tooltip: {
		message: "A felsorolt oldalakon engedélyezve lesznek a popup-ok."
	},
	silenced_tooltip: {
		message: "A blokkolt felugró ablakok értesitései nem fognak megjelenni a követketző oldalakon."
	},
	installFrom: {
		message: "Telepítés innen: <a>%name%</a>"
	},
	noinst_step_3: {
		message: "3. lépés: Töltse újra ezt az oldalt, hogy hozzáférjen a felhasználói szűrők beállitásaihoz"
	},
	noinst_ignore_if_ag: {
		message: "Ha telepítette az AdGuard for Windowst, hagyja ki ezt a lépést, mivel a Popup Blocker userscript abban előre van telepítve."
	},
	noinst_rec: {
		message: "(Ajánlott)"
	},
	please_wait: {
		message: "Kérjük várjon, Popup Blocker detektálása"
	},
	noinst_special_prog: {
		message: "Mindenekelőtt, szüksége van egy olyan speciális programra vagy kiegészítőre, ami képes userscripteket futtatni."
	},
	noinst_subtitle: {
		message: "Az AdGuard Popup Blocker userscript nincs telepítve. Kérem tekintse meg a lépéseket alább."
	},
	homepage: {
		message: "Kezdőlap"
	},
	noinst_step_1: {
		message: "1. lépés: Userscript kezelő telepítése"
	},
	noinst_step_2: {
		message: "2. lépés: Userscript"
	},
	extension_name: {
		message: "Popup Blocker by AdGuard"
	},
	userscript_name: {
		message: "AdGuard Popup Blocker",
		platform: [
			"userscript",
			"userscript_settings"
		]
	},
	extension_description: {
		message: "Blokkolja a felugró ablakban megjelenő reklámokat a webhelyeken"
	},
	on_navigation_by_popunder: {
		message: "Az új oldalra való áttérést valószínűleg egy előugró ablak okozza. Kívánja folytatni?",
		platform: [
			"userscript"
		]
	},
	aborted_popunder_execution: {
		message: "A Popup Blocker megszakította a szkript végrehajtását a háttérben történő átirányítás megakadályozása érdekében",
		platform: [
			"userscript"
		]
	},
	ext_enabled: {
		message: "A Popup Blocker működik"
	},
	ext_disabled: {
		message: "A Popup Blocker ki van kapcsolva itt: $DOMAIN$",
		placeholders: {
			domain: {
				content: "$1"
			}
		}
	},
	ext_disabled_default: {
		message: "A Popup Blocker ki van kapcsolva ezen a domainen"
	},
	settings_saved: {
		message: "Beállítások mentve"
	}
};
var id = {
	show_popup: {
		message: "Tampilkan %destUrl%"
	},
	continue_blocking: {
		message: "Lanjutkan pemblokiran"
	},
	allow_from: {
		message: "Izinkan popup di %origDomain%"
	},
	manage_pref: {
		message: "Kelola pengaturan..."
	},
	popup_text: {
		message: "AdGuard mencegah situs web ini membuka %numPopup% jendela popup"
	},
	options: {
		message: "Opsi"
	},
	silence_noti: {
		message: "Jangan tampilkan pesan ini di %origDomain%"
	},
	site_input_ph: {
		message: "Masukkan nama situs"
	},
	add_site: {
		message: "Tambah situs"
	},
	add: {
		message: "Tambah"
	},
	allowed_empty: {
		message: "Daftar pengecualian masih kosong"
	},
	allowed: {
		message: "Pengecualian"
	},
	silenced_empty: {
		message: "Daftar situs web dengan pemberitahuan yang diheningkan masih kosong"
	},
	silenced: {
		message: "Diheningkan"
	},
	allowed_tooltip: {
		message: "Popup akan diizinkan di situs web yang tercantum di sini."
	},
	silenced_tooltip: {
		message: "Notifikasi popup yang diblokir tidak akan ditampilkan di situs web yang tercantum di sini."
	},
	installFrom: {
		message: "Pasang dari <a>%name%</a>"
	},
	noinst_step_3: {
		message: "Tahap 3: Muat ulang halamana ini untuk masuk ke pengaturan userscript"
	},
	noinst_ignore_if_ag: {
		message: "Jika Anda telah memasang AdGuard untuk Windows, Anda dapat mengabaikan langkah ini karena Pemblokir Popup sudah terpasang."
	},
	noinst_rec: {
		message: "(Dianjurkan)"
	},
	please_wait: {
		message: "Mohon tunggu, mendeteksi Pemblokir Popup"
	},
	noinst_special_prog: {
		message: "Pertama-tama, untuk menggunakan userscript Anda memerlukan program atau ekstensi khusus yang dapat menjalankan userscript."
	},
	noinst_subtitle: {
		message: "Userscript Pemblokir Popup AdGuard belum terpasang. Silakan lihat instruksi di bawah ini."
	},
	homepage: {
		message: "Situs"
	},
	noinst_step_1: {
		message: "Langkah 1: Pasang pengelola userscript"
	},
	noinst_step_2: {
		message: "Langkah 2: Userscript"
	},
	extension_name: {
		message: "Pemblokir Popup oleh AdGuard"
	},
	userscript_name: {
		message: "Pemblokir Popup AdGuard",
		platform: [
			"userscript",
			"userscript_settings"
		]
	},
	extension_description: {
		message: "Blokir iklan popup di halaman web"
	},
	on_navigation_by_popunder: {
		message: "Transisi ke laman baru ini kemungkinan disebabkan oleh sebuah pop-up. Apakah Anda ingin melanjutkan?",
		platform: [
			"userscript"
		]
	},
	aborted_popunder_execution: {
		message: "Popup Blocker menghentikan eksekusi skrip untuk mencegah perubahan laman di latar belakang",
		platform: [
			"userscript"
		]
	},
	ext_enabled: {
		message: "Pemblokir Popup sedang bekerja"
	},
	ext_disabled: {
		message: "Pemblokir Popup dinonaktifkan untuk $DOMAIN$",
		placeholders: {
			domain: {
				content: "$1"
			}
		}
	},
	ext_disabled_default: {
		message: "Pemblokir Popup tidak dapat bekerja di domain ini"
	},
	settings_saved: {
		message: "Pengaturan disimpan"
	}
};
var it = {
	show_popup: {
		message: "Visualizza %destUrl%"
	},
	continue_blocking: {
		message: "Continua a bloccare"
	},
	allow_from: {
		message: "Consenti pop-up per %origDomain%"
	},
	manage_pref: {
		message: "Gestisci preferenze..."
	},
	popup_text: {
		message: "AdGuard ha impedito a questo sito web di aprire {$numPopup} finestre pop-up"
	},
	options: {
		message: "Opzioni"
	},
	silence_noti: {
		message: "Non mostrare questo messaggio su %origDomain%"
	},
	site_input_ph: {
		message: "Inserisci il nome del sito"
	},
	add_site: {
		message: "Aggiungi un sito"
	},
	add: {
		message: "Aggiungi"
	},
	allowed_empty: {
		message: "La lista dei siti consentiti è vuota"
	},
	allowed: {
		message: "Consentito"
	},
	silenced_empty: {
		message: "La lista dei siti silenziati è vuota"
	},
	silenced: {
		message: "Silenziato"
	},
	allowed_tooltip: {
		message: "I pop-up verranno consentiti per i domini qui elencati."
	},
	silenced_tooltip: {
		message: "Le notifiche dei pop-up bloccati non verranno mostrate nei domini qui indicati."
	},
	installFrom: {
		message: "Installa da <a>%name%</a>"
	},
	noinst_step_3: {
		message: "Passo 3: Ricarica questa pagina per ottenere le impostazioni dello script utente"
	},
	noinst_ignore_if_ag: {
		message: "Se hai installato AdGuard per Windows, puoi ignorare questo passaggio poiché lo script utente Popup Blocker è preinstallato."
	},
	noinst_rec: {
		message: "(Consigliato)"
	},
	please_wait: {
		message: "Si prega di attendere, rilevamento di Popup Blocker in corso"
	},
	noinst_special_prog: {
		message: "Prima di tutto, per utilizzare uno script utente è necessario un programma o un'estensione speciali per l'esecuzione di tali script."
	},
	noinst_subtitle: {
		message: "Lo script utente AdGuard Popup Blocker non è installato. Ti invitiamo a consultare le istruzioni di seguito."
	},
	homepage: {
		message: "Pagina principale"
	},
	noinst_step_1: {
		message: "Passo 1: Installa un gestore di script utente"
	},
	noinst_step_2: {
		message: "Passo 2: Script utente"
	},
	extension_name: {
		message: "Blocca-popup di AdGuard"
	},
	userscript_name: {
		message: "AdGuard Popup Blocker",
		platform: [
			"userscript",
			"userscript_settings"
		]
	},
	extension_description: {
		message: "Blocca gli annunci pop-up sulle pagine web"
	},
	on_navigation_by_popunder: {
		message: "È probabile che questa transizione alla nuova pagina sia causata da un pop-under. Desideri proseguire?",
		platform: [
			"userscript"
		]
	},
	aborted_popunder_execution: {
		message: "Popup Blocker ha interrotto l'esecuzione di uno script per impedire il reindirizzamento in secondo piano",
		platform: [
			"userscript"
		]
	},
	ext_enabled: {
		message: "Popup Blocker è in servizio"
	},
	ext_disabled: {
		message: "Popup Blocker è disattivato per $DOMAIN$",
		placeholders: {
			domain: {
				content: "$1"
			}
		}
	},
	ext_disabled_default: {
		message: "Popup Blocker è disattivato su questo dominio"
	},
	settings_saved: {
		message: "Impostazioni salvate"
	}
};
var ja = {
	show_popup: {
		message: "%destUrl%を表示する"
	},
	continue_blocking: {
		message: "ブロッキングを続ける"
	},
	allow_from: {
		message: "%origDomain%のポップアップを許可する"
	},
	manage_pref: {
		message: "設定を管理…"
	},
	popup_text: {
		message: "AdGuardはこのウェブサイトが%numPopup%のポップアップウィンドウを開くのを防ぎました"
	},
	options: {
		message: "オプション"
	},
	silence_noti: {
		message: "%origDomain%にこのメッセージを表示しない"
	},
	site_input_ph: {
		message: "サイト名を入力"
	},
	add_site: {
		message: "サイトを追加する"
	},
	add: {
		message: "追加"
	},
	allowed_empty: {
		message: "許可済みサイトのリストは空です"
	},
	allowed: {
		message: "例外"
	},
	silenced_empty: {
		message: "消音済みサイトのリストは空です"
	},
	silenced: {
		message: "消音済み"
	},
	allowed_tooltip: {
		message: "ポップアップはここに記載されているドメインにとって許可されます。"
	},
	silenced_tooltip: {
		message: "ブロックされたポップアップの通知は、ここにリストアップされているドメインでは表示されません。"
	},
	installFrom: {
		message: "<a>%name%</a>からインストールする"
	},
	noinst_step_3: {
		message: "ステップ3：このページを更新して、ユーザースクリプト設定を取得する"
	},
	noinst_ignore_if_ag: {
		message: "AdGuard for Windows をインストールした場合は、ポップアップブロッカーのユーザスクリプトがあらかじめインストールされているので、このステップを無視して結構です。"
	},
	noinst_rec: {
		message: "（推奨）"
	},
	please_wait: {
		message: "ポップアップブロッカーを検出するまでお待ちください"
	},
	noinst_special_prog: {
		message: "まず、ユーザスクリプトを使用するには、ユーザスクリプトを実行する特別なプログラムが必要です。"
	},
	noinst_subtitle: {
		message: "AdGuardポップアップブロッカー・ユーザスクリプトがインストールされていません。 下記の指示をご覧ください。"
	},
	homepage: {
		message: "ホームページ"
	},
	noinst_step_1: {
		message: "ステップ1：ユーザースクリプト・マネージャをインストールする"
	},
	noinst_step_2: {
		message: "ステップ２：ユーザスクリプト"
	},
	extension_name: {
		message: "ポップアップブロッカー by AdGuard"
	},
	userscript_name: {
		message: "AdGuard ポップアップブロッカー",
		platform: [
			"userscript",
			"userscript_settings"
		]
	},
	extension_description: {
		message: "Webページでポップアップ広告をブロックします。"
	},
	on_navigation_by_popunder: {
		message: "新しいページへの移動はポップアンダーによって生じた可能性があります。続行しますか？",
		platform: [
			"userscript"
		]
	},
	aborted_popunder_execution: {
		message: "ポップアップブロッカーはバックグラウンドリダイレクトを防ぐためにスクリプトの実行を中止しました",
		platform: [
			"userscript"
		]
	},
	ext_enabled: {
		message: "ポップアップブロッカー作動中"
	},
	ext_disabled: {
		message: "$DOMAIN$に対してポップアップブロッカーは無効になっています",
		placeholders: {
			domain: {
				content: "$1"
			}
		}
	},
	ext_disabled_default: {
		message: "このドメインではポップアップブロッカーは動作できません"
	},
	settings_saved: {
		message: "設定保存完了"
	}
};
var ko = {
	show_popup: {
		message: "%destUrl% 표시"
	},
	continue_blocking: {
		message: "계속 차단하기"
	},
	allow_from: {
		message: "%origDomain%의 팝업 허용하기"
	},
	manage_pref: {
		message: "환경 설정 관리..."
	},
	popup_text: {
		message: "AdGuard가 이 웹사이트에서 %numPopup%개의 팝업 창을 차단하였습니다"
	},
	options: {
		message: "옵션"
	},
	silence_noti: {
		message: "%origDomain%에서 이 메세지 표시하지 않기"
	},
	site_input_ph: {
		message: "웹 사이트 명을 입력하세요"
	},
	add_site: {
		message: "웹 사이트 추가"
	},
	add: {
		message: "추가"
	},
	allowed_empty: {
		message: "허용된 웹 사이트 목록이 비어 있습니다"
	},
	allowed: {
		message: "허용됨"
	},
	silenced_empty: {
		message: "침묵된 사이트 목록이 비어 있습니다"
	},
	silenced: {
		message: "침묵됨"
	},
	allowed_tooltip: {
		message: "이 목록에 있는 주소의 팝업들은 허용됩니다."
	},
	silenced_tooltip: {
		message: "이 목록에 있는 주소는 차단된 팝업 알림이 표시되지 않습니다."
	},
	installFrom: {
		message: "<a>%name%</a> 에서 설치"
	},
	noinst_step_3: {
		message: "3단계: 사용자 스크립트 설정을 받으려면 페이지를 새로고침하세요"
	},
	noinst_ignore_if_ag: {
		message: "이미 Windows용 AdGuard를 설치했다면, 팝업 차단기 사용자 스크립트도 같이 설치되기 때문에 이 단계를 건너뛰실 수 있습니다."
	},
	noinst_rec: {
		message: "(추천)"
	},
	please_wait: {
		message: "잠시만 기다려주세요, 팝업 차단기를 찾는 중입니다"
	},
	noinst_special_prog: {
		message: "제일 먼저, 유저스크립트를 사용하려면 유저스크립트를 실행하기 위한 특별한 프로그램 혹은 확장 프로그램이 필요합니다."
	},
	noinst_subtitle: {
		message: "AdGuard 팝업 차단기 사용자 스크립트가 설치되어 있지 않습니다. 아래의 설명을 봐 주세요."
	},
	homepage: {
		message: "홈페이지"
	},
	noinst_step_1: {
		message: "1 단계: 사용자 스크립트 관리자를 설치하기"
	},
	noinst_step_2: {
		message: "2 단계: 사용자 스크립트"
	},
	extension_name: {
		message: "팝업 차단기 by AdGuard"
	},
	userscript_name: {
		message: "AdGuard 팝업 차단기",
		platform: [
			"userscript",
			"userscript_settings"
		]
	},
	extension_description: {
		message: "웹 페이지에서 팝업 광고를 차단"
	},
	on_navigation_by_popunder: {
		message: "이 새 페이지로의 이동은 팝언더 광고에 의한 것일 수 있습니다. 계속 하시겠습니까?",
		platform: [
			"userscript"
		]
	},
	aborted_popunder_execution: {
		message: "팝업 차단기가 백그라운드 리디렉션을 방지하기 위해 스크립트 실행을 중단하였습니다",
		platform: [
			"userscript"
		]
	},
	ext_enabled: {
		message: "팝업 차단기는 임무를 수행 중 입니다"
	},
	ext_disabled: {
		message: "팝업 차단기의 $DOMAIN$에서의 동작이 비활성화 되었습니다",
		placeholders: {
			domain: {
				content: "$1"
			}
		}
	},
	ext_disabled_default: {
		message: "팝업 차단기의 이 도메인에서의 동작이 비활성화 되었습니다"
	},
	settings_saved: {
		message: "설정 저장됨"
	}
};
var lt = {
	show_popup: {
		message: "Rodyti %destUrl%"
	},
	continue_blocking: {
		message: "Tęsti blokavimą"
	},
	allow_from: {
		message: "Leisti iššokančius langus %origDomain%"
	},
	manage_pref: {
		message: "Tvarkyti nuostatas..."
	},
	popup_text: {
		message: "„AdGuard“ neleido šiai svetainei atidaryti %numPopup% iššokančius langus"
	},
	options: {
		message: "Parinktys"
	},
	silence_noti: {
		message: "Nerodyti šio pranešimo %origDomain%"
	},
	site_input_ph: {
		message: "Įveskite svetainės pavadinimą"
	},
	add_site: {
		message: "Pridėti svetainę"
	},
	add: {
		message: "Pridėti"
	},
	allowed_empty: {
		message: "Leidžiamų svetainių sąrašas tuščias"
	},
	allowed: {
		message: "Išimtys"
	},
	silenced_empty: {
		message: "Svetainių su atjungtais pranešimais sąrašas tuščias"
	},
	silenced: {
		message: "Be pranešimų"
	},
	allowed_tooltip: {
		message: "Iššokantys langai bus leidžiami domenuose, kurie išvardyti čia."
	},
	silenced_tooltip: {
		message: "Pranešimai apie užblokuotus iškylančiuosius langus nebus rodomi domenams, išvardytiems čia."
	},
	installFrom: {
		message: "Įdiegti iš {$startLink}{$name}{$endLink}"
	},
	noinst_step_3: {
		message: "3 žingsnis: Atnaujinkite šį puslapį, kad pasiektumėte naudotojo skripto nustatymus"
	},
	noinst_ignore_if_ag: {
		message: "Jei įdiegėte AdGuard, skirtą Windows, galite praleisti šį žingsnį, nes iškylančių langų blokavimo programa jau bus įdiegta."
	},
	noinst_rec: {
		message: "(Rekomenduojama)"
	},
	please_wait: {
		message: "Prašome palaukti, bandoma aptikti iškylančių langų blokatorių"
	},
	noinst_special_prog: {
		message: "Norint naudoti skriptus, jums reikia specialios programos arba plėtinio, kuris paleidžia skriptus."
	},
	noinst_subtitle: {
		message: "AdGuard iškylančių langų blokatorius neįdiegtas. Prašome perskaityti žemiau pateiktą instrukciją."
	},
	homepage: {
		message: "Pagrindinis puslapis"
	},
	noinst_step_1: {
		message: "1 žingnis: įdiekite naudotojo skriptų tvarkyklę"
	},
	noinst_step_2: {
		message: "2 žingsnis: naudotojo skriptas"
	},
	extension_name: {
		message: "AdGuard iššokančių langų blokatorius"
	},
	userscript_name: {
		message: "AdGuard iššokančiųjų langų blokatorius",
		platform: [
			"userscript",
			"userscript_settings"
		]
	},
	extension_description: {
		message: "Blokuoja iššokančius skelbimus tinklalapiuose"
	},
	on_navigation_by_popunder: {
		message: "Šis perėjimas į naują puslapį greičiausiai buvo įtakotas pop-under. Ar norite tęsti?",
		platform: [
			"userscript"
		]
	},
	aborted_popunder_execution: {
		message: "Iškylančių langų blokatorius nutraukė skripto vykdymą, kad būtų išvengta foninio peradresavimo",
		platform: [
			"userscript"
		]
	},
	ext_enabled: {
		message: "Iškylančių langų blokatorius yra paruoštas"
	},
	ext_disabled: {
		message: "Iškylančių langų blokatorius yra išjungtas domenui $DOMAIN$",
		placeholders: {
			domain: {
				content: "$1"
			}
		}
	},
	ext_disabled_default: {
		message: "Iškylančių langų blokatorius yra išjungtas šiam domenui"
	},
	settings_saved: {
		message: "Nustatymai išsaugoti"
	}
};
var ms = {
	show_popup: {
		message: "Tunjukkan %destUrl%"
	},
	continue_blocking: {
		message: "Terus menyekat"
	},
	allow_from: {
		message: "Benarkan pop-timbul untuk %origDomain%"
	},
	manage_pref: {
		message: "Urus keutamaan..."
	},
	popup_text: {
		message: "AdGuard menghalang laman web ini daripada membuka %numPopup% tetingkap pop-timbul"
	},
	options: {
		message: "Pilihan"
	},
	silence_noti: {
		message: "Jangan tunjuk mesej ini pada %origDomain%"
	},
	site_input_ph: {
		message: "Masukkan nama laman"
	},
	add_site: {
		message: "Tambah laman"
	},
	add: {
		message: "Tambah"
	},
	allowed_empty: {
		message: "Senarai laman dibenarkan adalah kosong"
	},
	allowed: {
		message: "Dibenarkan"
	},
	silenced_empty: {
		message: "Senarai laman disenyapkan adalah kosong"
	},
	silenced: {
		message: "Disenyapkan"
	},
	allowed_tooltip: {
		message: "Poptimbul akan dibenarkan untuk domain disenarai di sini."
	},
	silenced_tooltip: {
		message: "Pemberitahuan untuk poptimbul disekat tidak akan ditunjukkan untuk domain disenarai di sini."
	},
	installFrom: {
		message: "Pasang dari <a>%name%</a>"
	},
	noinst_step_3: {
		message: "Langkah 3: Segar semula laman ini untuk mendapat tetapan skrip pengguna"
	},
	noinst_ignore_if_ag: {
		message: "Jika anda telah memasang AdGuard untuk Windows, anda bole mengabaikan langkah ini kerana skrip pengguna Penyekat Pop Timbul diprapasangkan."
	},
	noinst_rec: {
		message: "(Disyorkan)"
	},
	please_wait: {
		message: "Sila tunggu, mengesan Penyekat Pop Timbul"
	},
	noinst_special_prog: {
		message: "Pertama sekali, untuk mengguna skrip pengguna anda perlu aturcara istimewa atau sambungan yang menjalankan skrip pengguna."
	},
	noinst_subtitle: {
		message: "Skrip pengguna Penyekat Pop Timbul AdGuard tidak dipasang. Sila lihat arahan di bawah."
	},
	homepage: {
		message: "Laman rumah"
	},
	noinst_step_1: {
		message: "Langkah 1: Pasang pengurus skrip pengguna"
	},
	noinst_step_2: {
		message: "Langkah 2: Skrip pengguna"
	},
	extension_name: {
		message: "Penyekat Pop Timbul oleh AdGuard"
	},
	userscript_name: {
		message: "AdGuard Penyekat Pop Timbul",
		platform: [
			"userscript",
			"userscript_settings"
		]
	},
	extension_description: {
		message: "Sekat pop timbul pada laman web"
	},
	on_navigation_by_popunder: {
		message: "Peralihan ke laman baru ini kemungkinan disebabkan oleh pop-bawah. Anda ingin meneruskan?",
		platform: [
			"userscript"
		]
	},
	aborted_popunder_execution: {
		message: "Penyekat Pop Timbul menggugurkan pelaksanaan skrip bagi mengelakkan arah semula latar belakang",
		platform: [
			"userscript"
		]
	},
	ext_enabled: {
		message: "Penyekat Pop Timbul sedang bertugas"
	},
	ext_disabled: {
		message: "Penyekat Pop Timbul dinyahdayakan untuk $DOMAIN$",
		placeholders: {
			domain: {
				content: "$1"
			}
		}
	},
	ext_disabled_default: {
		message: "Penyekat Pop Timbul dinyahdayakan untuk domain ini"
	},
	settings_saved: {
		message: "Tetapan disimpan"
	}
};
var no = {
	show_popup: {
		message: "Vis %destUrl%"
	},
	continue_blocking: {
		message: "Fortsett blokkering"
	},
	allow_from: {
		message: "Tillat popup-vinduer for %origDomain%"
	},
	manage_pref: {
		message: "Administrer preferanser…"
	},
	popup_text: {
		message: "AdGuard forhindret denne nettsiden i å åpne popup-vinduer for %numPopup%"
	},
	options: {
		message: "Alternativer"
	},
	silence_noti: {
		message: "Ikke vis denne meldingen for %origDomain%"
	},
	site_input_ph: {
		message: "Oppgi sidenavn"
	},
	add_site: {
		message: "Legg til en side"
	},
	add: {
		message: "Legg til"
	},
	allowed_empty: {
		message: "Lisen over unntak er tom"
	},
	allowed: {
		message: "Unntak"
	},
	silenced_empty: {
		message: "Liste over nettsider med dempede varsler er tom"
	},
	silenced: {
		message: "Dempet"
	},
	allowed_tooltip: {
		message: "Popup-vinduer vil bli tillatt for nettsider som er oppført her."
	},
	silenced_tooltip: {
		message: "Blokkerte popup-vinduer vil ikke vises for nettsider som er oppført her."
	},
	installFrom: {
		message: "Installer fra <a>%name%</a>"
	},
	noinst_step_3: {
		message: "Trinn 3: Oppdater denne siden for å komme til brukerskript-innstillingene"
	},
	noinst_ignore_if_ag: {
		message: "Hvis du har installert AdGuard for Windows, kan du ignorere dette trinnet, da brukerskript for popup-blokkering  kommer forhåndsinstallert."
	},
	noinst_rec: {
		message: "(Anbefalt)"
	},
	please_wait: {
		message: "Vennligst vent, oppdager popup-blokkereren"
	},
	noinst_special_prog: {
		message: "Først av alt, for å bruke et brukerskript trenger du et spesielt program eller en utvidelse som kan kjøre brukerskript."
	},
	noinst_subtitle: {
		message: "Brukerskript for AdGuards popup-blokkerer er ikke installert. Vennligst se instruksjonene nedenfor."
	},
	homepage: {
		message: "Hjemmeside"
	},
	noinst_step_1: {
		message: "Trinn 1: Installer en brukerskript-administerere"
	},
	noinst_step_2: {
		message: "Stinn 2: Brukerskript"
	},
	extension_name: {
		message: "Popup-blokkerer fra AdGuard"
	},
	userscript_name: {
		message: "AdGuards popup-blokkerer",
		platform: [
			"userscript",
			"userscript_settings"
		]
	},
	extension_description: {
		message: "Blokker popup-annonser på nettsider"
	},
	on_navigation_by_popunder: {
		message: "Omdirigeringen til den nye nettsiden er sannsynligvis forårsaket av en pop-under. Ønsker du å fortsette?",
		platform: [
			"userscript"
		]
	},
	aborted_popunder_execution: {
		message: "Popup Blocker avbrøt en skrift fra å kjøre for å hindre bakgrunnsomdirigering",
		platform: [
			"userscript"
		]
	},
	ext_enabled: {
		message: "Popup-blokkereren er på vakt"
	},
	ext_disabled: {
		message: "Popup-blokkereren er deaktivert for $DOMAIN$",
		placeholders: {
			domain: {
				content: "$1"
			}
		}
	},
	ext_disabled_default: {
		message: "Popup-blokkereren kan ikke kjøre på dette domenet"
	},
	settings_saved: {
		message: "Innstillinger lagret"
	}
};
var pl = {
	show_popup: {
		message: "Pokaż %destUrl%"
	},
	continue_blocking: {
		message: "Kontynuuj blokowanie"
	},
	allow_from: {
		message: "Zezwalaj na wyskakujące okienka dla %origDomain%"
	},
	manage_pref: {
		message: "Zarządzaj preferencjami..."
	},
	popup_text: {
		message: "AdGuard zapobiegł na tej stronie otwarcie  %numPopup% wyskakujacego okienka."
	},
	options: {
		message: "Opcje"
	},
	silence_noti: {
		message: "Nie pokazuj tej wiadomości w %origDomain%"
	},
	site_input_ph: {
		message: "Wprowadź nazwę witryny"
	},
	add_site: {
		message: "Dodaj stronę"
	},
	add: {
		message: "Dodaj"
	},
	allowed_empty: {
		message: "Lista dozwolonych stron jest pusta"
	},
	allowed: {
		message: "Dozwolona"
	},
	silenced_empty: {
		message: "Lista uciszonych stron jest pusta"
	},
	silenced: {
		message: "Uciszona"
	},
	allowed_tooltip: {
		message: "Dla wymienionych tutaj stron dozwolone będą wyskakujące okienka."
	},
	silenced_tooltip: {
		message: "Powiadomienia o zablokowanych wyskakujących okienkach nie będą wyświetlane dla stron tutaj wymienionych."
	},
	installFrom: {
		message: "Instaluj z <a>%name%</a>"
	},
	noinst_step_3: {
		message: "Krok 3: Odśwież tę stronę, aby przejść do ustawień skryptu użytkownika"
	},
	noinst_ignore_if_ag: {
		message: "Jeśli zainstalowałeś AdGuard dla systemu Windows, możesz zignorować ten krok, gdy instalator funkcji Bloker wyskakujących okienek zostanie zainstalowany fabrycznie."
	},
	noinst_rec: {
		message: "(Zalecane)"
	},
	please_wait: {
		message: "Proszę czekać, wykrywam, uruchamiam bloker wyskakujących okienek"
	},
	noinst_special_prog: {
		message: "Przede wszystkim, aby użyć skryptu użytkownika, potrzebujesz specjalnego programu, który uruchamia takie skrypty."
	},
	noinst_subtitle: {
		message: "Bloker wyskakujących okienek AdGuard skrypt użytkownika nie jest zainstalowany. Zobacz instrukcję poniżej."
	},
	homepage: {
		message: "Strona domowa"
	},
	noinst_step_1: {
		message: "Krok 1: Zainstaluj menedżera skryptów użytkownika"
	},
	noinst_step_2: {
		message: "Krok 2: Skrypty użytkownika"
	},
	extension_name: {
		message: "Bloker wyskakujących okienek przez AdGuard"
	},
	userscript_name: {
		message: "Bloker wyskakujących okienek przez AdGuard",
		platform: [
			"userscript",
			"userscript_settings"
		]
	},
	extension_description: {
		message: "Blokuje wyskakujące okienka na stronach internetowych"
	},
	on_navigation_by_popunder: {
		message: "To przejście na nową stronę może być spowodowane przez pop-under. Czy chcesz kontynuować?",
		platform: [
			"userscript"
		]
	},
	aborted_popunder_execution: {
		message: "Bloker wyskakujących okienek przerwał wykonywanie skryptu, aby zapobiec przekierowaniu w tle",
		platform: [
			"userscript"
		]
	},
	ext_enabled: {
		message: "Bloker wyskakujących okienek jest na służbie"
	},
	ext_disabled: {
		message: "Bloker wyskakujących okienek jest wyłączony dla $DOMAIN$",
		placeholders: {
			domain: {
				content: "$1"
			}
		}
	},
	ext_disabled_default: {
		message: "Bloker wyskakujących okienek nie może działać na tej domenie"
	},
	settings_saved: {
		message: "Ustawienia zapisane"
	}
};
var nl = {
	show_popup: {
		message: "Toon %destUrl%"
	},
	continue_blocking: {
		message: "Doorgaan"
	},
	allow_from: {
		message: "Pop-ups toestaan voor %origDomain%"
	},
	manage_pref: {
		message: "Voorkeuren beheren..."
	},
	popup_text: {
		message: "AdGuard heeft voorkomen dat deze website pop-upvensters van %numPopup% opende"
	},
	options: {
		message: "Opties"
	},
	silence_noti: {
		message: "Dit bericht niet weergeven voor %origDomain%"
	},
	site_input_ph: {
		message: "Voer site naam in"
	},
	add_site: {
		message: "Een site toevoegen"
	},
	add: {
		message: "Toevoegen"
	},
	allowed_empty: {
		message: "Lijst met toegestane sites is leeg"
	},
	allowed: {
		message: "Toegestaan"
	},
	silenced_empty: {
		message: "Lijst met sites waarvan de notificaties uit zijn gezet is leeg"
	},
	silenced: {
		message: "Zonder notificaties"
	},
	allowed_tooltip: {
		message: "Pop-ups worden toegestaan voor de domeinen in deze lijst."
	},
	silenced_tooltip: {
		message: "Meldingen voor geblokkeerde pop-ups worden niet weergegeven voor domeinen in deze lijst."
	},
	installFrom: {
		message: "Installeren vanaf <a>%name%</a>"
	},
	noinst_step_3: {
		message: "Stap 3: Deze pagina vernieuwen om naar instellingen voor gebruikerscripts te gaan"
	},
	noinst_ignore_if_ag: {
		message: "Als u AdGuard voor Windows heeft geïnstalleerd, kunt u deze stap negeren omdat het gebruikersscript voor pop-up blokkering vooraf is geïnstalleerd."
	},
	noinst_rec: {
		message: "(Aanbevolen)"
	},
	please_wait: {
		message: "Even geduld, detectie van de pop-up blokkering"
	},
	noinst_special_prog: {
		message: "Om een gebruikersscript te gebruiken, heb je eerst een speciaal programma of extensie nodig die gebruikersscript uitvoert."
	},
	noinst_subtitle: {
		message: "De AdGuard Popup Blocker-gebruikerscript is niet geïnstalleerd. Zie de onderstaande instructie."
	},
	homepage: {
		message: "Startpagina"
	},
	noinst_step_1: {
		message: "Stap 1: Een gebruikersscript beheerder installeren"
	},
	noinst_step_2: {
		message: "Stap 2: Gebruikersscript"
	},
	extension_name: {
		message: "Popup Blocker van AdGuard"
	},
	userscript_name: {
		message: "AdGuard Pop-up Blocker",
		platform: [
			"userscript",
			"userscript_settings"
		]
	},
	extension_description: {
		message: "Blokkeert pop-upadvertenties op webpagina's"
	},
	on_navigation_by_popunder: {
		message: "Deze overgang naar de nieuwe pagina wordt waarschijnlijk veroorzaakt door een onderliggend venster. Wil je doorgaan?",
		platform: [
			"userscript"
		]
	},
	aborted_popunder_execution: {
		message: "Pop-up Blocker heeft de uitvoering van een script afgebroken om een redirect in de achtergrond te voorkomen",
		platform: [
			"userscript"
		]
	},
	ext_enabled: {
		message: "Pop-up Blocker is actief"
	},
	ext_disabled: {
		message: "Pop-upblokkering is uitgeschakeld voor $DOMAIN$",
		placeholders: {
			domain: {
				content: "$1"
			}
		}
	},
	ext_disabled_default: {
		message: "Pop-upblokkering is uitgeschakeld voor dit domein"
	},
	settings_saved: {
		message: "Instellingen opgeslagen"
	}
};
var pt = {
	show_popup: {
		message: "Mostrar %destUrl%"
	},
	continue_blocking: {
		message: "Continuar bloqueando"
	},
	allow_from: {
		message: "Permitir pop-ups em %origDomain%"
	},
	manage_pref: {
		message: "Gerenciar preferências..."
	},
	popup_text: {
		message: "O AdGuard impediu este site de abrir %numPopup% pop-ups"
	},
	options: {
		message: "Opções"
	},
	silence_noti: {
		message: "Não mostrar essa mensagem no %origDomain%"
	},
	site_input_ph: {
		message: "Digite o nome do site"
	},
	add_site: {
		message: "Adicionar um site"
	},
	add: {
		message: "Adicionar"
	},
	allowed_empty: {
		message: "A lista de sites permitidos está vazia"
	},
	allowed: {
		message: "Exceções"
	},
	silenced_empty: {
		message: "Lista de sites com notificações silenciadas está vazia"
	},
	silenced: {
		message: "Silenciado"
	},
	allowed_tooltip: {
		message: "Os pop-ups serão permitidos para sites listados aqui."
	},
	silenced_tooltip: {
		message: "As notificações para pop-ups bloqueados não serão mostrados para sites listados aqui."
	},
	installFrom: {
		message: "Instale da <a>%name%</a>"
	},
	noinst_step_3: {
		message: "Passo 3: Atualize esta página para obter as configurações de script de usuário"
	},
	noinst_ignore_if_ag: {
		message: "Se você instalou o AdGuard para Windows, você pode ignorar esta etapa, porque o script de usuário do Bloqueador de Pop-ups já vem pré-instalado."
	},
	noinst_rec: {
		message: "(Recomendado)"
	},
	please_wait: {
		message: "Por favor, aguarde enquanto detectamos o Bloqueador de Pop-ups"
	},
	noinst_special_prog: {
		message: "Primeiro de tudo, para usar um script de usuário você precisa de um programa ou uma extensão especial para executar scripts de usuário."
	},
	noinst_subtitle: {
		message: "O script de usuário do Bloqueador de Pop-ups do AdGuard não está instalado. Por favor, siga as instruções abaixo."
	},
	homepage: {
		message: "Página Inicial"
	},
	noinst_step_1: {
		message: "Etapa 1: Instale um gerenciador de script de usuário"
	},
	noinst_step_2: {
		message: "Etapa 2: Script de Usuário"
	},
	extension_name: {
		message: "Bloqueador de Pop-ups por AdGuard"
	},
	userscript_name: {
		message: "AdGuard Bloqueador de Pop-ups",
		platform: [
			"userscript",
			"userscript_settings"
		]
	},
	extension_description: {
		message: "Bloqueia anúncios pop-ups dentro dos sites"
	},
	on_navigation_by_popunder: {
		message: "Essa transição para a nova página provavelmente será causada por um pop-under. Você deseja continuar?",
		platform: [
			"userscript"
		]
	},
	aborted_popunder_execution: {
		message: "O bloqueador de pop-ups interrompeu uma execução de script para evitar um redirecionamento em segundo plano",
		platform: [
			"userscript"
		]
	},
	ext_enabled: {
		message: "Bloqueador de Pop-ups está de plantão"
	},
	ext_disabled: {
		message: "Bloqueador de Pop-ups está desativado para $DOMAIN$",
		placeholders: {
			domain: {
				content: "$1"
			}
		}
	},
	ext_disabled_default: {
		message: "O bloqueador de pop-ups não pode ser executado neste domínio."
	},
	settings_saved: {
		message: "Configurações salvas"
	}
};
var ro = {
	show_popup: {
		message: "Arată %destUrl%"
	},
	continue_blocking: {
		message: "Continuați blocarea"
	},
	allow_from: {
		message: "Permiteți pop-up pentru %origDomain%"
	},
	manage_pref: {
		message: "Gestiune preferințe..."
	},
	popup_text: {
		message: "AdGuard a împiedicat acestui site să deschidă %numPopup% ferestre pop-up"
	},
	options: {
		message: "Opțiuni"
	},
	silence_noti: {
		message: "Nu afișați acest mesaj pe %origDomain%"
	},
	site_input_ph: {
		message: "Introduceți numele de site"
	},
	add_site: {
		message: "Adăugă site"
	},
	add: {
		message: "Adaugă"
	},
	allowed_empty: {
		message: "Lista de site-uri permise este goală"
	},
	allowed: {
		message: "Permis"
	},
	silenced_empty: {
		message: "Lista site-uri cu notificări amuțite este goală"
	},
	silenced: {
		message: "Amuțit"
	},
	allowed_tooltip: {
		message: "Popup-urile vor fi permise domeniilor enumerate aici."
	},
	silenced_tooltip: {
		message: "Notificările pentru pop-up-uri blocate nu vor fi afișate domeniilor enumerate aici."
	},
	installFrom: {
		message: "Instalați din <a>%name%</a>"
	},
	noinst_step_3: {
		message: "Pasul 3: Actualizați pagina pentru a ajunge la setări userscript"
	},
	noinst_ignore_if_ag: {
		message: "Dacă ați instalat AdGuard pentru Windows, ignorați acest pas, deoarece userscript-ul Blocant Pop-up vine preinstalat."
	},
	noinst_rec: {
		message: "(Recomandat)"
	},
	please_wait: {
		message: "Vă rugăm să așteptați, se detectează Blocantul Pop-up"
	},
	noinst_special_prog: {
		message: "Mai întâi, folosirea unui userscript cere un program sau o extensie specială care rulează userscript-uri."
	},
	noinst_subtitle: {
		message: "Blocantul Pop-up AdGuard nu este instalat. Vă rugăm să consultați instrucțiunea de mai jos."
	},
	homepage: {
		message: "Homepage"
	},
	noinst_step_1: {
		message: "Pasul 1: Instalați un manager userscript"
	},
	noinst_step_2: {
		message: "Pasul 2: Userscript"
	},
	extension_name: {
		message: "Blocant Pop-up de AdGuard"
	},
	userscript_name: {
		message: "Blocant Pop-up AdGuard",
		platform: [
			"userscript",
			"userscript_settings"
		]
	},
	extension_description: {
		message: "Blochează reclame pop-up pe pagini web"
	},
	on_navigation_by_popunder: {
		message: "Tranziția la această noua pagină este probabil cauzată de un pop-under. Vrei să continui?",
		platform: [
			"userscript"
		]
	},
	aborted_popunder_execution: {
		message: "Blocantul Pop-up a oprit o execuție de script ca să prevină redirecționare în fundal",
		platform: [
			"userscript"
		]
	},
	ext_enabled: {
		message: "Blocantul Pop-up lucrează"
	},
	ext_disabled: {
		message: "Blocantul Pop-up e dezactivat pentru $DOMAIN$",
		placeholders: {
			domain: {
				content: "$1"
			}
		}
	},
	ext_disabled_default: {
		message: "Blocantul Pop-up e dezactivat pentru acest domeniu"
	},
	settings_saved: {
		message: "Setări salvate"
	}
};
var ru = {
	show_popup: {
		message: "Показать %destUrl%"
	},
	continue_blocking: {
		message: "Продолжить блокировку"
	},
	allow_from: {
		message: "Разрешить всплывающие окна на %origDomain%"
	},
	manage_pref: {
		message: "Управлять настройками..."
	},
	popup_text: {
		message: "AdGuard предотвратил показ %numPopup% всплывающих окон на этом сайте"
	},
	options: {
		message: "Опции"
	},
	silence_noti: {
		message: "Не показывать это сообщение на %origDomain%"
	},
	site_input_ph: {
		message: "Введите имя сайта"
	},
	add_site: {
		message: "Добавить сайт"
	},
	add: {
		message: "Добавить"
	},
	allowed_empty: {
		message: "Список исключений пуст"
	},
	allowed: {
		message: "Исключения"
	},
	silenced_empty: {
		message: "Список сайтов с отключенными уведомлениями пуст"
	},
	silenced: {
		message: "Без уведомлений"
	},
	allowed_tooltip: {
		message: "Всплывающие окна будут разрешены на сайтах, перечисленных здесь."
	},
	silenced_tooltip: {
		message: "Уведомления о заблокированных всплывающих окнах не будут отображаться на сайтах, перечисленных здесь."
	},
	installFrom: {
		message: "Установить из <a>%name%</a>"
	},
	noinst_step_3: {
		message: "Шаг 3: Обновите эту страницу, чтобы перейти к настройкам пользовательского скрипта"
	},
	noinst_ignore_if_ag: {
		message: "Если вы установили AdGuard для Windows, вы можете проигнорировать этот шаг, так как Блокировщик всплывающей рекламы уже установлен."
	},
	noinst_rec: {
		message: "Рекомендуется"
	},
	please_wait: {
		message: "Пожалуйста, подождите, попытка обнаружить Блокировщик всплывающей рекламы"
	},
	noinst_special_prog: {
		message: "Для использования скрипта вам, прежде всего, необходима специальная программа (или расширение), которая может работать с пользовательскими скриптами."
	},
	noinst_subtitle: {
		message: "Блокировщик всплывающей рекламы AdGuard не установлен. Пожалуйста, обратитесь к инструкции ниже."
	},
	homepage: {
		message: "Домашняя страница"
	},
	noinst_step_1: {
		message: "Шаг 1: установите программу для управления пользовательскими скриптами"
	},
	noinst_step_2: {
		message: "Шаг 2: пользовательский скрипт"
	},
	extension_name: {
		message: "Блокировщик всплывающей рекламы от AdGuard"
	},
	userscript_name: {
		message: "Блокировщик всплывающей рекламы от AdGuard",
		platform: [
			"userscript",
			"userscript_settings"
		]
	},
	extension_description: {
		message: "Блокирует всплывающую рекламу на страницах"
	},
	on_navigation_by_popunder: {
		message: "Этот переход на новую страницу скорее всего вызван поп-андером. Всё равно продолжить?",
		platform: [
			"userscript"
		]
	},
	aborted_popunder_execution: {
		message: "Блокировщик всплывающей рекламы прервал исполнение скрипта, чтобы предотвратить фоновую переадресацию",
		platform: [
			"userscript"
		]
	},
	ext_enabled: {
		message: "Блокировщик всплывающей рекламы готов к работе"
	},
	ext_disabled: {
		message: "Блокировщик всплывающей рекламы отключен для $DOMAIN$",
		placeholders: {
			domain: {
				content: "$1"
			}
		}
	},
	ext_disabled_default: {
		message: "Блокировщик всплывающей рекламы не работает на этом домене."
	},
	settings_saved: {
		message: "Настройки сохранены"
	}
};
var sk = {
	show_popup: {
		message: "Zobraziť %destUrl%"
	},
	continue_blocking: {
		message: "Pokračovať v blokovaní"
	},
	allow_from: {
		message: "Povoliť vyskakovacie okná pre %origDomain%"
	},
	manage_pref: {
		message: "Spravovať preferencie..."
	},
	popup_text: {
		message: "AdGuard zabránil tejto stránke otvoriť %numPopup% vyskakovacích okien"
	},
	options: {
		message: "Voľby"
	},
	silence_noti: {
		message: "Neukazovať túto správu na %origDomain%"
	},
	site_input_ph: {
		message: "Zadajte meno stránky"
	},
	add_site: {
		message: "Pridať stránku"
	},
	add: {
		message: "Pridať"
	},
	allowed_empty: {
		message: "Zoznam povolených stránok je prázdny"
	},
	allowed: {
		message: "Povolené"
	},
	silenced_empty: {
		message: "Zoznam stíšených stránok je prázdny"
	},
	silenced: {
		message: "Stíšené"
	},
	allowed_tooltip: {
		message: "Vyskakovacie okná budú povolené pre domény tu uvedené."
	},
	silenced_tooltip: {
		message: "Upozornenia na blokované vyskakovacie okná sa nebudú zobrazovať pre domény tu uvedené."
	},
	installFrom: {
		message: "Inštalovať z <a>%name%</a>"
	},
	noinst_step_3: {
		message: "Krok 3: Obnovte túto stránku, aby ste sa dostali k nastaveniam používateľského skriptu"
	},
	noinst_ignore_if_ag: {
		message: "Ak ste nainštalovali AdGuard pre Windows, môžete tento krok ignorovať, pretože používateľský skript Popup Blocker je už predinštalovaný."
	},
	noinst_rec: {
		message: "(Odporúčané)"
	},
	please_wait: {
		message: "Počkajte, kým sa nezistí blokovanie vyskakovacích okien"
	},
	noinst_special_prog: {
		message: "V prvom rade je na používanie používateľského skriptu potrebný špeciálny program alebo rozšírenie, ktoré spúšťa používateľské skripty."
	},
	noinst_subtitle: {
		message: "Nie je nainštalovaný používateľský skript blokovania vyskakovacích okien AdGuard. Prečítajte si pokyny uvedené nižšie."
	},
	homepage: {
		message: "Domovská stránka"
	},
	noinst_step_1: {
		message: "Krok 1: Inštalovať manažéra používateľských skriptov"
	},
	noinst_step_2: {
		message: "Krok2: Používateľský skript"
	},
	extension_name: {
		message: "Blokovač vyskakovacích okien od AdGuard"
	},
	userscript_name: {
		message: "AdGuard blokovač vyskakovacích okien",
		platform: [
			"userscript",
			"userscript_settings"
		]
	},
	extension_description: {
		message: "Blokuje vyskakovacie reklamy na webových stránkach"
	},
	on_navigation_by_popunder: {
		message: "Tento prechod na novú stránku bude pravdepodobne spôsobený kontextovým oknom. Prajete si pokračovať?",
		platform: [
			"userscript"
		]
	},
	aborted_popunder_execution: {
		message: "Blokovanie vyskakovacích okien prerušilo vykonávanie skriptu, aby sa zabránilo presmerovaniu na pozadí",
		platform: [
			"userscript"
		]
	},
	ext_enabled: {
		message: "Blokovanie vyskakovacích okien je v činnosti"
	},
	ext_disabled: {
		message: "Blokovanie vyskakovacích okien je pre $DOMAIN$ vypnuté",
		placeholders: {
			domain: {
				content: "$1"
			}
		}
	},
	ext_disabled_default: {
		message: "Blokovanie vyskakovacích okien je pre túto doménu vypnuté"
	},
	settings_saved: {
		message: "Nastavenia boli uložené"
	}
};
var sl = {
	show_popup: {
		message: " Prikaži %destUrl%"
	},
	continue_blocking: {
		message: "Nadaljuj z zaviranjem"
	},
	allow_from: {
		message: "Dovoli pojavna okna na %origDomain%"
	},
	manage_pref: {
		message: "Upravljaj nastavitve..."
	},
	popup_text: {
		message: "AdGuard je tej spletni strani preprečil odpiranje %numPopup% pojavnih oken"
	},
	options: {
		message: "Možnosti"
	},
	silence_noti: {
		message: "Ne prikazuj tega sporočila na %origDomain%"
	},
	site_input_ph: {
		message: "Vnesite ime strani"
	},
	add_site: {
		message: "Dodaj stran"
	},
	add: {
		message: "Dodaj"
	},
	allowed_empty: {
		message: "Seznam dovoljenih strani je prazen"
	},
	allowed: {
		message: "Izjeme"
	},
	silenced_empty: {
		message: "Seznam utišanih strani je prazen"
	},
	silenced: {
		message: "Utišane strani"
	},
	allowed_tooltip: {
		message: "Za tukaj navedene domene bodo dovoljena pojavna okna."
	},
	silenced_tooltip: {
		message: "Obvestila o onemogočenih pojavnih oknih ne bodo prikazana za tukaj navedene domene."
	},
	installFrom: {
		message: "Namesti z <a>%name%</a>"
	},
	noinst_step_3: {
		message: "3. korak: Osvežite to stran, da pridete do nastavitev uporabniškega skripta"
	},
	noinst_ignore_if_ag: {
		message: "Če ste namestili AdGuard za Windows, lahko ta korak prezrete, saj je uporabniški skript za zaviranje pojavnih oken vnaprej nameščen."
	},
	noinst_rec: {
		message: "(Priporočeno)"
	},
	please_wait: {
		message: "Počakajte, zaznavanje Zaviralca pojavnih oken"
	},
	noinst_special_prog: {
		message: "Najprej, za uporabo uporabniškega skripta potrebujete poseben program ali razširitev, ki lahko zažene uporabniške skripte."
	},
	noinst_subtitle: {
		message: "AdGuard uporabniški skript Popup Blocker ni nameščen. Oglejte si spodnja navodila."
	},
	homepage: {
		message: "Domača stran"
	},
	noinst_step_1: {
		message: "1. korak: Namestite upravitelja uporabniških skriptov"
	},
	noinst_step_2: {
		message: "2. korak: Uporabniški skript"
	},
	extension_name: {
		message: "Zaviralec pojavnih oken z AdGuardom"
	},
	userscript_name: {
		message: "AdGuard Zaviralec pojavnih oken",
		platform: [
			"userscript",
			"userscript_settings"
		]
	},
	extension_description: {
		message: "Blokira pojavne oglase na spletnih straneh"
	},
	on_navigation_by_popunder: {
		message: "Ta prehod na novo stran je verjetno posledica pojavnega okna. Ali želite nadaljevati?",
		platform: [
			"userscript"
		]
	},
	aborted_popunder_execution: {
		message: "Zaviralec pojavnih oken je prekinil izvajanje skripta, da bi preprečil preusmerjanje v ozadju",
		platform: [
			"userscript"
		]
	},
	ext_enabled: {
		message: "Zaviralec pojavnih oken je na dolžnosti"
	},
	ext_disabled: {
		message: "Zaviralec pojavnih oken je onemogočen za $DOMAIN$",
		placeholders: {
			domain: {
				content: "$1"
			}
		}
	},
	ext_disabled_default: {
		message: "Zaviralec pojavnih oken je onemogočen za to domeno"
	},
	settings_saved: {
		message: "Nastavitve so shranjene"
	}
};
var ta = {
	show_popup: {
		message: "%destUrl% ஐக் காட்டு"
	},
	continue_blocking: {
		message: "தடுப்பதைத் தொடரவும்"
	},
	allow_from: {
		message: "%origDomain% க்கு பாப்-அப்களை அனுமதிக்கவும்"
	},
	manage_pref: {
		message: "விருப்பங்களை நிர்வகிக்கவும்..."
	},
	popup_text: {
		message: "AdGuard இந்த வலைத்தளத்தை %numPopup% பாப்-அப் திறப்பதைத் தடுத்தது"
	},
	options: {
		message: "விருப்பங்கள்"
	},
	silence_noti: {
		message: "இந்த செய்தியை %origDomain% இல் காட்ட வேண்டாம்"
	},
	site_input_ph: {
		message: "தளத்தின் பெயரை உள்ளிடவும்"
	},
	add_site: {
		message: "தளத்தைச் சேர்க்கவும்"
	},
	add: {
		message: "சேர்க்கவும்"
	},
	allowed_empty: {
		message: "அனுமதிக்கப்பட்ட தளங்களின் பட்டியல் காலியாக உள்ளது"
	},
	allowed: {
		message: "அனுமதிக்கப்பட்டது"
	},
	silenced_empty: {
		message: "அமைதியான தளங்களின் பட்டியல் காலியாக உள்ளது"
	},
	silenced: {
		message: "அமைதியான அறிவிப்புகள்"
	},
	allowed_tooltip: {
		message: "இங்கே பட்டியலிடப்பட்ட களங்களுக்கு பாப்அப்கள் அனுமதிக்கப்படும்."
	},
	silenced_tooltip: {
		message: "இங்கே பட்டியலிடப்பட்ட களங்களுக்கு தடுக்கப்பட்ட பாப்அப்களுக்கான அறிவிப்புகள் காண்பிக்கப்படாது."
	},
	installFrom: {
		message: "<a>%name%</a> இலிருந்து நிறுவவும்"
	},
	noinst_step_3: {
		message: "படி 3: பயனர் ஸ்கிரிப்ட் அமைப்புகளைப் பெற இந்தப் பக்கத்தைப் புதுப்பிக்கவும்"
	},
	noinst_ignore_if_ag: {
		message: "நீங்கள் விண்டோஸுக்கான AdGuard ஐ நிறுவியிருந்தால், பாப்அப் தடுப்பான் பயனர் ஸ்கிரிப்ட் முன்பே நிறுவப்பட்டிருப்பதால் இந்த படிநிலையை நீங்கள் புறக்கணிக்கலாம்."
	},
	noinst_rec: {
		message: "(பரிந்துரைக்கப்படுகிறது)"
	},
	please_wait: {
		message: "தயவுசெய்து காத்திருங்கள், பாப்அப் தடுப்பைக் கண்டறிகிறது"
	},
	noinst_special_prog: {
		message: "முதலாவதாக, ஒரு பயனர் ஸ்கிரிப்டைப் பயன்படுத்த உங்களுக்கு ஒரு சிறப்பு நிரல் அல்லது பயனர் ஸ்கிரிப்ட்களை இயக்கும் நீட்டிப்பு தேவை."
	},
	noinst_subtitle: {
		message: "AdGuard பாப்அப் தடுப்பான் பயனர் ஸ்கிரிப்ட் நிறுவப்படவில்லை. கீழே உள்ள வழிமுறைகளைப் பார்க்கவும்."
	},
	homepage: {
		message: "முகப்புப்பக்கம்"
	},
	noinst_step_1: {
		message: "படி 1: பயனர் ஸ்கிரிப்ட் மேலாளரை நிறுவவும்"
	},
	noinst_step_2: {
		message: "படி 2: பயனர் ஸ்கிரிப்ட்"
	},
	extension_name: {
		message: "AdGuard இன் பாப்அப் தடுப்பான்"
	},
	userscript_name: {
		message: "AdGuard பாப்அப் தடுப்பான்",
		platform: [
			"userscript",
			"userscript_settings"
		]
	},
	extension_description: {
		message: "வலைப்பக்கங்களில் பாப்அப் விளம்பரங்களைத் தடுக்கிறது"
	},
	on_navigation_by_popunder: {
		message: "புதிய பக்கத்திற்கான இந்த மாற்றம் ஒரு பாப்-அண்டர் காரணமாக ஏற்படக்கூடும். தொடர விரும்புகிறீர்களா?",
		platform: [
			"userscript"
		]
	},
	aborted_popunder_execution: {
		message: "பின்னணி திருப்பிவிடப்படுவதைத் தடுக்க பாப்அப் தடுப்பான் ஸ்கிரிப்ட் செயல்பாட்டை நிறுத்தியது",
		platform: [
			"userscript"
		]
	},
	ext_enabled: {
		message: "பாப்அப் தடுப்பான் செயலில் உள்ளது"
	},
	ext_disabled: {
		message: "$DOMAIN$ க்கு பாப்அப் தடுப்பான் முடக்கப்பட்டுள்ளது",
		placeholders: {
			domain: {
				content: "$1"
			}
		}
	},
	ext_disabled_default: {
		message: "இந்த களத்திற்கு பாப்அப் தடுப்பான் முடக்கப்பட்டுள்ளது"
	},
	settings_saved: {
		message: "அமைப்புகள் சேமிக்கப்பட்டன"
	}
};
var th = {
	show_popup: {
		message: "แสดง %destUrl%"
	},
	continue_blocking: {
		message: "ปิดกั้นต่อไป"
	},
	allow_from: {
		message: "อนุญาตป๊อปอัปสำหรับ %origDomain%"
	},
	manage_pref: {
		message: "จัดการค่ากำหนด..."
	},
	popup_text: {
		message: "AdGuard ป้องกันไม่ให้เว็บไซต์นี้เปิดหน้าต่างป๊อปอัพ %numPopup%"
	},
	options: {
		message: "ตัวเลือก"
	},
	silence_noti: {
		message: "อย่าแสดงข้อความนี้ใน %origDomain%"
	},
	site_input_ph: {
		message: "ใส่ชื่อเว็บไซต์"
	},
	add_site: {
		message: "เพิ่มเว็บไซต์"
	},
	add: {
		message: "เพิ่ม"
	},
	allowed_empty: {
		message: "รายการไซต์ที่อนุญาตว่างเปล่า"
	},
	allowed: {
		message: "อนุญาต"
	},
	silenced_empty: {
		message: "รายการไซต์ที่ถูกปิดกั้นว่างเปล่า"
	},
	silenced: {
		message: "ปิดกั้น"
	},
	allowed_tooltip: {
		message: "ป๊อปอัปจะได้รับอนุญาตสำหรับโดเมนที่แสดงที่นี่"
	},
	silenced_tooltip: {
		message: "การแจ้งเตือนสำหรับป๊อปอัปที่ถูกปิดกั้นจะไม่แสดงสำหรับโดเมนที่แสดงที่นี่"
	},
	installFrom: {
		message: "ติดตั้งจาก <a>%name%</a>"
	},
	noinst_step_3: {
		message: "ขั้นตอนที่ 3: รีเฟรชหน้านี้เพื่อไปที่การตั้งค่า userscript"
	},
	noinst_ignore_if_ag: {
		message: "หากคุณติดตั้ง AdGuard สำหรับ Windows คุณสามารถข้ามขั้นตอนนี้ได้เนื่องจากผู้ใช้ Popup Blocker มาติดตั้งล่วงหน้า"
	},
	noinst_rec: {
		message: "(แนะนำ)"
	},
	please_wait: {
		message: "โปรดรอสักครู่ กำลังตรวจหา Popup Blocker"
	},
	noinst_special_prog: {
		message: "ก่อนอื่น เพื่อใช้ userscript คุณต้องมีโปรแกรมหรือส่วนเสริมพิเศษที่รัน userscripts"
	},
	noinst_subtitle: {
		message: "Userscript ของ AdGuard Popup Blocker ไม่ได้รับการติดตั้ง โปรดดูคำแนะนำด้านล่าง"
	},
	homepage: {
		message: "หน้าหลัก"
	},
	noinst_step_1: {
		message: "ขั้นตอนที่ 1: ติดตั้งตัวจัดการ usrscript"
	},
	noinst_step_2: {
		message: "ขั้นตอนที่ 2: Userscript"
	},
	extension_name: {
		message: "Popup Blocker โดย AdGuard"
	},
	userscript_name: {
		message: "AdGuard Popup Blocker",
		platform: [
			"userscript",
			"userscript_settings"
		]
	},
	extension_description: {
		message: "ปิดกั้นโฆษณาป๊อปอัพในหน้าเว็บ"
	},
	on_navigation_by_popunder: {
		message: "การเปลี่ยนไปใช้หน้าใหม่นี้น่าจะเกิดจากป๊อปอันเดอร์ คุณต้องการทำต่อไปหรือไม่?",
		platform: [
			"userscript"
		]
	},
	aborted_popunder_execution: {
		message: "Popup Blocker ยกเลิกการทำงานของสคริปต์เพื่อป้องกันการเปลี่ยนพื้นหลัง",
		platform: [
			"userscript"
		]
	},
	ext_enabled: {
		message: "Popup Blocker ทำหน้าที่"
	},
	ext_disabled: {
		message: "Popup Blocker ถูกปิดใช้งานสำหรับ $DOMAIN$",
		placeholders: {
			domain: {
				content: "$1"
			}
		}
	},
	ext_disabled_default: {
		message: "Popup Blocker ถูกปิดการใช้งานสำหรับโดเมนนี้"
	},
	settings_saved: {
		message: "การตั้งค่าที่บันทึกไว้"
	}
};
var tr = {
	show_popup: {
		message: "%destUrl% sitesini göster"
	},
	continue_blocking: {
		message: "Engellemeye devam et"
	},
	allow_from: {
		message: "%origDomain% için açılır pencerelere izin ver"
	},
	manage_pref: {
		message: "Tercihleri yönet..."
	},
	popup_text: {
		message: "AdGuard bu sitenin %numPopup% açılır pencere açmasını önledi"
	},
	options: {
		message: "Ayarlar"
	},
	silence_noti: {
		message: "Bu mesajı %origDomain% üzerinde gösterme"
	},
	site_input_ph: {
		message: "Site adını girin"
	},
	add_site: {
		message: "Site ekle"
	},
	add: {
		message: "Ekle"
	},
	allowed_empty: {
		message: "İzin verilen sitelerin listesi boş"
	},
	allowed: {
		message: "İzin verilen"
	},
	silenced_empty: {
		message: "Sessize alınmış olan sitelerin listesi boş"
	},
	silenced: {
		message: "Sessize alınmış"
	},
	allowed_tooltip: {
		message: "Burada listelenen alan adları için açılır pencerelere izin verilecektir."
	},
	silenced_tooltip: {
		message: "Engellenen açılır pencerelere ilişkin bildirimler, burada listelenen alan adları için gösterilmeyecektir."
	},
	installFrom: {
		message: "<a>%name%</a>'dan yükle"
	},
	noinst_step_3: {
		message: "Adım 3: Kullanıcı betikleri ayarlarını almak için bu sayfayı yenile"
	},
	noinst_ignore_if_ag: {
		message: "Windows için AdGuard yüklediyseniz, Açılır Pencere Engelleyici betiği önceden yüklü olarak geldiği için bu adımı görmezden gelebilirsiniz."
	},
	noinst_rec: {
		message: "(Tavsiye edilen)"
	},
	please_wait: {
		message: "Lütfen bekleyin, Açılır Pencere Engelleyici tespit ediliyor"
	},
	noinst_special_prog: {
		message: "Bir kullanıcı betiği kullanmak için öncelikle kullanıcı betiği çalıştıran özel bir programa veya uzantıya ihtiyacınız var."
	},
	noinst_subtitle: {
		message: "AdGuard Açılır Pencere Engelleyicisi kullanıcı betiği yüklü değil. Lütfen aşağıdaki talimata bakın."
	},
	homepage: {
		message: "Ana sayfa"
	},
	noinst_step_1: {
		message: "1. Adım: Bir kullanıcı betiği yöneticisi yükle"
	},
	noinst_step_2: {
		message: "2. Adım: Kullanıcı betiği"
	},
	extension_name: {
		message: "AdGuard ile Açılır Pencere Engelleyici"
	},
	userscript_name: {
		message: "AdGuard Açılır Pencere Engelleyici",
		platform: [
			"userscript",
			"userscript_settings"
		]
	},
	extension_description: {
		message: "Web sayfalarında açılır pencere reklamlarını engeller"
	},
	on_navigation_by_popunder: {
		message: "Yeni sayfaya geçiş, bir gizli pencere nedeniyle meydana gelmiş olabilir. Devam etmek istiyor musunuz?",
		platform: [
			"userscript"
		]
	},
	aborted_popunder_execution: {
		message: "Açılır Pencere Engelleyici arka plan yönlendirmesini önlemek için bir komut dosyasının çalışmasını durdurdu",
		platform: [
			"userscript"
		]
	},
	ext_enabled: {
		message: "Açılır Pencere Engelleyici görevinin başında"
	},
	ext_disabled: {
		message: "Açılır Pencere Engelleyici $DOMAIN$ için devre dışı bırakıldı",
		placeholders: {
			domain: {
				content: "$1"
			}
		}
	},
	ext_disabled_default: {
		message: "Açılır Pencere Engelleyici bu alan adı için devre dışı bırakıldı"
	},
	settings_saved: {
		message: "Ayarlar kaydedildi"
	}
};
var uk = {
	show_popup: {
		message: "Показати %destUrl%"
	},
	continue_blocking: {
		message: "Продовжити блокування"
	},
	allow_from: {
		message: "Дозволити спливні вікна для %origDomain%"
	},
	manage_pref: {
		message: "Керувати налаштуваннями..."
	},
	popup_text: {
		message: "AdGuard запобіг показу спливних вікон %numPopup% на цьому сайті"
	},
	options: {
		message: "Параметри"
	},
	silence_noti: {
		message: "Не показувати це повідомлення на %origDomain%"
	},
	site_input_ph: {
		message: "Введіть назву сайту"
	},
	add_site: {
		message: "Додати сайт"
	},
	add: {
		message: "Додати"
	},
	allowed_empty: {
		message: "Список винятків порожній"
	},
	allowed: {
		message: "Винятки"
	},
	silenced_empty: {
		message: "Список сайтів з вимкненими сповіщеннями порожній"
	},
	silenced: {
		message: "Без повідомлень"
	},
	allowed_tooltip: {
		message: "Спливні вікна будуть дозволені на сайтах з цього списку."
	},
	silenced_tooltip: {
		message: "Повідомлення про заблоковані спливні вікна не відображатимуться на сайтах з цього списку."
	},
	installFrom: {
		message: "Встановити з <a>%name%</a>"
	},
	noinst_step_3: {
		message: "Крок 3: оновіть цю сторінку, щоб перейти до налаштувань розширення"
	},
	noinst_ignore_if_ag: {
		message: "Якщо ви встановили AdGuard для Windows, можете пропустити цей крок, оскільки розширення «Блокувальник спливних вікон» уже встановлено. Ймовірно, його необхідно увімкнути в налаштуваннях AdGuard."
	},
	noinst_rec: {
		message: "(Рекомендовано)"
	},
	please_wait: {
		message: "Будь ласка, зачекайте, спроба виявити Блокувальник спливних вікон"
	},
	noinst_special_prog: {
		message: "Щоб використовувати скрипт, потрібна спеціальна програма або браузерне розширення, що може працювати з користувацькими скриптами."
	},
	noinst_subtitle: {
		message: "Розширення «Блокувальник спливних вікон AdGuard» не встановлено. Будь ласка, виконайте наступні кроки."
	},
	homepage: {
		message: "Домашня сторінка"
	},
	noinst_step_1: {
		message: "Крок 1: встановіть програму для керування користувацькими скриптами"
	},
	noinst_step_2: {
		message: "Крок 2: користувацький скрипт"
	},
	extension_name: {
		message: "Блокувальник спливних вікон AdGuard"
	},
	userscript_name: {
		message: "Блокувальник спливних вікон AdGuard",
		platform: [
			"userscript",
			"userscript_settings"
		]
	},
	extension_description: {
		message: "Блокує спливну рекламу на вебсторінках"
	},
	on_navigation_by_popunder: {
		message: "Цей перехід на нову сторінку, ймовірно, міг бути викликаний «поп-андером». Бажаєте продовжити?",
		platform: [
			"userscript"
		]
	},
	aborted_popunder_execution: {
		message: "Блокувальник спливних вікон перервав виконання скрипта, щоб запобігти фоновому перенаправленню",
		platform: [
			"userscript"
		]
	},
	ext_enabled: {
		message: "Блокувальник спливних вікон готовий до роботи"
	},
	ext_disabled: {
		message: "Блокувальник спливних вікон вимкнено для $DOMAIN$",
		placeholders: {
			domain: {
				content: "$1"
			}
		}
	},
	ext_disabled_default: {
		message: "Блокувальник спливних вікон вимкнено для цього домена"
	},
	settings_saved: {
		message: "Налаштування збережено"
	}
};
var vi = {
	show_popup: {
		message: "Hiện %destUrl%"
	},
	continue_blocking: {
		message: "Tiếp tục chặn"
	},
	allow_from: {
		message: "Cho phép cửa sổ bật lên cho %origDomain%"
	},
	manage_pref: {
		message: "Quản lý tùy chọn..."
	},
	popup_text: {
		message: "AdGuard đã ngăn trang web này mở %numPopup% cửa sổ bật lên"
	},
	options: {
		message: "Tuỳ chọn"
	},
	silence_noti: {
		message: "Đừng hiển thị thông báo này trên %origDomain%"
	},
	site_input_ph: {
		message: "Nhập tên trang web"
	},
	add_site: {
		message: "Thêm một trang web"
	},
	add: {
		message: "Thêm"
	},
	allowed_empty: {
		message: "Danh sách các trang web được phép trống"
	},
	allowed: {
		message: "Được phép"
	},
	silenced_empty: {
		message: "Danh sách các trang im lặng trống"
	},
	silenced: {
		message: "Im lặng"
	},
	allowed_tooltip: {
		message: "Cửa sổ bật lên sẽ được phép cho các tên miền được liệt kê ở đây."
	},
	silenced_tooltip: {
		message: "Thông báo cho cửa sổ bật lên bị chặn sẽ không được hiển thị cho các tên miền được liệt kê ở đây."
	},
	installFrom: {
		message: "Cài đặt từ <a>%name%</a>"
	},
	noinst_step_3: {
		message: "Bước 3: Làm mới trang này để có được cài đặt usercript"
	},
	noinst_ignore_if_ag: {
		message: "Nếu bạn đã cài đặt AdGuard cho Windows, bạn có thể bỏ qua bước này vì bản mô tả người dùng Popup Blocker được cài đặt sẵn."
	},
	noinst_rec: {
		message: "(Khuyến nghị)"
	},
	please_wait: {
		message: "Xin vui lòng chờ, phát hiện Trình chặn Popup"
	},
	noinst_special_prog: {
		message: "Trước hết, để sử dụng một userscript bạn cần một chương trình đặc biệt hoặc tiện ích mở rộng chạy userscripts."
	},
	noinst_subtitle: {
		message: "Bản tin người dùng AdGuard Popup Blocker chưa được cài đặt. Xin vui lòng xem hướng dẫn dưới đây."
	},
	homepage: {
		message: "Trang chủ"
	},
	noinst_step_1: {
		message: "Bước 1: Cài đặt trình quản lý usrscript"
	},
	noinst_step_2: {
		message: "Bước 2: Userscript"
	},
	extension_name: {
		message: "Trình chặn Popup của AdGuard"
	},
	userscript_name: {
		message: "AdGuard Popup Blocker",
		platform: [
			"userscript",
			"userscript_settings"
		]
	},
	extension_description: {
		message: "Chặn quảng cáo bật lên trên các trang web"
	},
	on_navigation_by_popunder: {
		message: "Việc chuyển đổi sang trang mới này có thể được gây ra bởi một cửa sổ bật xuống. Bạn có muốn tiếp tục?",
		platform: [
			"userscript"
		]
	},
	aborted_popunder_execution: {
		message: "Trình chặn Popup đã hủy bỏ việc thực thi tập lệnh để ngăn chuyển hướng nền",
		platform: [
			"userscript"
		]
	},
	ext_enabled: {
		message: "Trình chặn Popup đang làm nhiệm vụ"
	},
	ext_disabled: {
		message: "Trình chặn Popup bị vô hiệu hóa cho $DOMAIN$",
		placeholders: {
			domain: {
				content: "$1"
			}
		}
	},
	ext_disabled_default: {
		message: "Trình chặn Popup bị vô hiệu hóa cho miền này"
	},
	settings_saved: {
		message: "Đã lưu cài đặt"
	}
};
var zh = {
	show_popup: {
		message: "显示 %destUrl%"
	},
	continue_blocking: {
		message: "继续拦截"
	},
	allow_from: {
		message: "允许 %origDomain% 弹窗"
	},
	manage_pref: {
		message: "管理首选项..."
	},
	popup_text: {
		message: "AdGuard 已防止此网站打开的 %numPopup%个弹窗"
	},
	options: {
		message: "选项"
	},
	silence_noti: {
		message: "在 %origDomain% 上不再显示此讯息"
	},
	site_input_ph: {
		message: "输入网站名称"
	},
	add_site: {
		message: "添加网站"
	},
	add: {
		message: "添加"
	},
	allowed_empty: {
		message: "允许的网站列表为空"
	},
	allowed: {
		message: "允许"
	},
	silenced_empty: {
		message: "禁止的网站列表"
	},
	silenced: {
		message: "禁止"
	},
	allowed_tooltip: {
		message: "此处列出的是允许弹窗的域。"
	},
	silenced_tooltip: {
		message: "此处列出的是禁止弹出的域。"
	},
	installFrom: {
		message: "安装从 <a>%name%</a>"
	},
	noinst_step_3: {
		message: "步骤3：刷新此页已获取用户脚本设置"
	},
	noinst_ignore_if_ag: {
		message: "如您已安装 AdGuard for Windows，则您可忽略此步骤，因为其已预安装弹窗拦截器用户脚本。"
	},
	noinst_rec: {
		message: "（推荐）"
	},
	please_wait: {
		message: "请稍后，正在检测弹窗拦截器"
	},
	noinst_special_prog: {
		message: "首先，要使用用户脚本，您需要特殊的程序的以运行用户脚本。"
	},
	noinst_subtitle: {
		message: "AdGuard Popup Blocker 用户脚本未安装。请查看以下指示说明。"
	},
	homepage: {
		message: "主页"
	},
	noinst_step_1: {
		message: "步骤 1：安装用户脚本管理器"
	},
	noinst_step_2: {
		message: "步骤 2：用户脚本"
	},
	extension_name: {
		message: "AdGuard 弹窗拦截器"
	},
	userscript_name: {
		message: "AdGuard 弹窗拦截器",
		platform: [
			"userscript",
			"userscript_settings"
		]
	},
	extension_description: {
		message: "拦截网页弹窗广告"
	},
	on_navigation_by_popunder: {
		message: "此网页导航可能导致弹窗。您要继续？",
		platform: [
			"userscript"
		]
	},
	aborted_popunder_execution: {
		message: "PopupBlocker 已中止脚本执行以防止后台重新定向",
		platform: [
			"userscript"
		]
	},
	ext_enabled: {
		message: "弹窗拦截器工作中"
	},
	ext_disabled: {
		message: "已在 $DOMAIN$ 上禁用弹窗拦截器",
		placeholders: {
			domain: {
				content: "$1"
			}
		}
	},
	ext_disabled_default: {
		message: "弹窗拦截器无法运行于此域之上"
	},
	settings_saved: {
		message: "设置已保存"
	}
};
var translations = {
	en: en$1,
	ar: ar,
	be: be,
	cs: cs,
	da: da,
	de: de,
	el: el,
	es: es,
	fa: fa,
	fi: fi,
	fr: fr,
	he: he,
	hr: hr,
	hu: hu,
	id: id,
	it: it,
	ja: ja,
	ko: ko,
	lt: lt,
	ms: ms,
	no: no,
	pl: pl,
	nl: nl,
	pt: pt,
	"pt-PT": {
	show_popup: {
		message: "Mostrar %destUrl%"
	},
	continue_blocking: {
		message: "Continuar a bloquear"
	},
	allow_from: {
		message: "Permitir popups em %origDomain%"
	},
	manage_pref: {
		message: "Gerir preferências..."
	},
	popup_text: {
		message: "O AdGuard impediu que este sítio abrisse janelas popup de %numPopup%"
	},
	options: {
		message: "Opções"
	},
	silence_noti: {
		message: "Não mostrar esta mensagem em %origDomain%"
	},
	site_input_ph: {
		message: "Insira o nome do sítio"
	},
	add_site: {
		message: "Adicionar um sítio"
	},
	add: {
		message: "Adicionar"
	},
	allowed_empty: {
		message: "A lista de sítios permitidos está vazia"
	},
	allowed: {
		message: "Excepções"
	},
	silenced_empty: {
		message: "A lista de sítios com notificações silenciadas está vazia"
	},
	silenced: {
		message: "Silenciado"
	},
	allowed_tooltip: {
		message: "Popups serão permitidos nos sítios listados aqui."
	},
	silenced_tooltip: {
		message: "As notificações de popups bloqueados não serão exibidas nos sítios listados aqui."
	},
	installFrom: {
		message: "Instalar a partir de <a>%name%</a>"
	},
	noinst_step_3: {
		message: "Passo 3: Atualize esta página para obter as configurações de script de utilizador"
	},
	noinst_ignore_if_ag: {
		message: "Se tiver instalado o AdGuard para Windows, ignore essa etapa, pois o userscript do Popup Blocker vem pré-instalado."
	},
	noinst_rec: {
		message: "(Recomendado)"
	},
	please_wait: {
		message: "Por favor, aguarde, a detectar o Bloqueador de Popups"
	},
	noinst_special_prog: {
		message: "Antes de tudo, para usar um userscript precisa de um programa ou extensão especial que possa executar scripts de utilizadores."
	},
	noinst_subtitle: {
		message: "O userscript do AdGuard Popup Blocker não está instalado. Por favor, veja as instruções abaixo."
	},
	homepage: {
		message: "Página Principal"
	},
	noinst_step_1: {
		message: "Etapa 1: Instalar um gestor de userscript"
	},
	noinst_step_2: {
		message: "Etapa 2: Script de utilizador"
	},
	extension_name: {
		message: "Bloqueador de Popup por AdGuard"
	},
	userscript_name: {
		message: "Bloqueador de Popup AdGuard",
		platform: [
			"userscript",
			"userscript_settings"
		]
	},
	extension_description: {
		message: "Bloqueia anúncios popup em páginas da web."
	},
	on_navigation_by_popunder: {
		message: "Esta transição para a nova página  será  provavelmente causada por um popunder. Deseja continuar?",
		platform: [
			"userscript"
		]
	},
	aborted_popunder_execution: {
		message: "PopupBlocker abortou uma execução de script para evitar o redireccionamento em segundo plano",
		platform: [
			"userscript"
		]
	},
	ext_enabled: {
		message: "O bloqueador de popups está em serviço"
	},
	ext_disabled: {
		message: "O bloqueador de popups está desativado para $DOMAIN$",
		placeholders: {
			domain: {
				content: "$1"
			}
		}
	},
	ext_disabled_default: {
		message: "O Bloqueador de popups não pode ser executado neste domínio"
	},
	settings_saved: {
		message: "As definições foram guardadas"
	}
},
	ro: ro,
	ru: ru,
	sk: sk,
	sl: sl,
	"sr-CS": {
	show_popup: {
		message: "Prikaži %destUrl%"
	},
	continue_blocking: {
		message: "Nastavi sa blokiranjem"
	},
	allow_from: {
		message: "Dozvoli iskačuće prozore za %origDomain%"
	},
	manage_pref: {
		message: "Upravljaj postavkama..."
	},
	popup_text: {
		message: "AdGuard je sprečio ovaj sajt da otvori %numPopup% iskačućih prozora"
	},
	options: {
		message: "Opcije"
	},
	silence_noti: {
		message: "Ne prikazuj ovu poruku na %origDomain%"
	},
	site_input_ph: {
		message: "Unesite ime sajta"
	},
	add_site: {
		message: "Dodaj sajt"
	},
	add: {
		message: "Dodaj"
	},
	allowed_empty: {
		message: "Lista dozvoljenih sajtova je prazna"
	},
	allowed: {
		message: "Dozvoljeno"
	},
	silenced_empty: {
		message: "Lista utišanih sajtova je prazna"
	},
	silenced: {
		message: "Utišano"
	},
	allowed_tooltip: {
		message: "Iskačući prozori će biti dozvoljeni za ovde prikazane domene."
	},
	silenced_tooltip: {
		message: "Obaveštenja o blokiranim iskačućim prozorima neće biti prikazivana za ovde prikazane domene."
	},
	installFrom: {
		message: "Instaliraj sa <a>%name%</a>"
	},
	noinst_step_3: {
		message: "Korak 3: Osvežite ovu stranicu da dođete do userscript postavki"
	},
	noinst_ignore_if_ag: {
		message: "Ako ste instalirali AdGuard za Windows, ovaj korak možete zanemariti jer je userscript za blokiranje iskačućih prozora preinstaliran."
	},
	noinst_rec: {
		message: "(preporučuje se)"
	},
	please_wait: {
		message: "Molim sačekajte, otkrivam blokatora iskačućih prozora"
	},
	noinst_special_prog: {
		message: "Pre svega, za kkorišćenje userscript vam je potreban poseban program ili proširenje koje pokreće userscripts."
	},
	noinst_subtitle: {
		message: "AdGuard userscript blokator iskačućih prozora nije instaliran. Pogledajte uputstva ispod."
	},
	homepage: {
		message: "Početna stranica"
	},
	noinst_step_1: {
		message: "Korak 1: Instalirajte usrscript upravljača"
	},
	noinst_step_2: {
		message: "Korak 2: Userscript"
	},
	extension_name: {
		message: "Blokator iskačućih prozora od AdGuard-a"
	},
	userscript_name: {
		message: "AdGuard blokator iskačućih prozora",
		platform: [
			"userscript",
			"userscript_settings"
		]
	},
	extension_description: {
		message: "Blokira iskačuće reklame na veb stranicama"
	},
	on_navigation_by_popunder: {
		message: "Ovo preusmerenje na novu stranicu je verovatno uzrokovano iskačućim prozorom. Želite li da nastavite?",
		platform: [
			"userscript"
		]
	},
	aborted_popunder_execution: {
		message: "Blokator iskačućih prozora je odbacio izvršenje skripte kako bi sprečio pozadinsko preusmerenje",
		platform: [
			"userscript"
		]
	},
	ext_enabled: {
		message: "Blokator iskačućih prozora je na dužnosti"
	},
	ext_disabled: {
		message: "Blokator iskačućih prozora je isključen za $DOMAIN$",
		placeholders: {
			domain: {
				content: "$1"
			}
		}
	},
	ext_disabled_default: {
		message: "Blokator iskačućih prozora je isključen za ovaj domen"
	},
	settings_saved: {
		message: "Postavke sačuvane"
	}
},
	ta: ta,
	th: th,
	tr: tr,
	uk: uk,
	vi: vi,
	zh: zh,
	"zh-HK": {
	show_popup: {
		message: "顯示 %destUrl%"
	},
	continue_blocking: {
		message: "繼續封鎖"
	},
	allow_from: {
		message: "允許 %origDomain% 的彈出式視窗"
	},
	manage_pref: {
		message: "管理偏好設定"
	},
	popup_text: {
		message: "AdGuard 已阻止此網站開啟 %numPopup% 個彈出式視窗"
	},
	options: {
		message: "選項"
	},
	silence_noti: {
		message: "不再 %origDomain% 上提示"
	},
	site_input_ph: {
		message: "輸入網站名稱"
	},
	add_site: {
		message: "新增網站"
	},
	add: {
		message: "新增"
	},
	allowed_empty: {
		message: "允許清單為空的"
	},
	allowed: {
		message: "已允許"
	},
	silenced_empty: {
		message: "已靜音清單為空的"
	},
	silenced: {
		message: "已靜音"
	},
	allowed_tooltip: {
		message: "允許彈出式視窗網域清單"
	},
	silenced_tooltip: {
		message: "已設定靜音不通知的網域清單"
	},
	installFrom: {
		message: "從 {$startLink}{$name}{$endLink} 安裝"
	},
	noinst_step_3: {
		message: "步驟 3：重新整理網頁來設定使用者腳本"
	},
	noinst_ignore_if_ag: {
		message: "如果您已安裝 AdGuard for Windows，您可以不必安裝這個使用者腳本，此功能已內建於 AdGuard for Windows 。"
	},
	noinst_rec: {
		message: "（推薦）"
	},
	please_wait: {
		message: "正在偵測彈出式視窗封鎖器，請稍候"
	},
	noinst_special_prog: {
		message: "首先，要使用一個使用者腳本您需要特殊的程式或瀏覽器的擴充套件。"
	},
	noinst_subtitle: {
		message: "彈出式視窗封鎖器腳本尚未安裝。請閱讀以下使用說明。"
	},
	homepage: {
		message: "首頁"
	},
	noinst_step_1: {
		message: "步驟 1：安裝使用者腳本管理器"
	},
	noinst_step_2: {
		message: "步驟 2：準備好使用者腳本"
	},
	extension_name: {
		message: "由 AdGuard 提供的彈出式視窗封鎖器"
	},
	userscript_name: {
		message: "AdGuard 彈出式視窗封鎖器",
		platform: [
			"userscript",
			"userscript_settings"
		]
	},
	extension_description: {
		message: "封鎖網頁上的彈出式視窗廣告"
	},
	on_navigation_by_popunder: {
		message: "頁面轉跳可能是由彈出式視窗進行的，您要繼續嗎？",
		platform: [
			"userscript"
		]
	},
	aborted_popunder_execution: {
		message: "彈出式視窗封鎖器已阻止網頁內的腳本運作避免網頁被重新導向",
		platform: [
			"userscript"
		]
	},
	ext_enabled: {
		message: "彈出式視窗封鎖器正在運作"
	},
	ext_disabled: {
		message: "彈出式視窗封鎖器已在 $DOMAIN$ 上停用",
		placeholders: {
			domain: {
				content: "$1"
			}
		}
	},
	ext_disabled_default: {
		message: "彈出式視窗封鎖器已在此網域上停用"
	},
	settings_saved: {
		message: "已儲存設定"
	}
},
	"zh-TW": {
	show_popup: {
		message: "顯示 %destUrl%"
	},
	continue_blocking: {
		message: "繼續封鎖"
	},
	allow_from: {
		message: "允許在 %origDomain% 的彈出式視窗"
	},
	manage_pref: {
		message: "管理偏好設定…"
	},
	popup_text: {
		message: "AdGuard 已防止此網站開啟 %numPopup% 個彈出式視窗"
	},
	options: {
		message: "選項"
	},
	silence_noti: {
		message: "不要於 %origDomain% 上顯示該訊息"
	},
	site_input_ph: {
		message: "輸入站名"
	},
	add_site: {
		message: "新增一個網站"
	},
	add: {
		message: "新增"
	},
	allowed_empty: {
		message: "已允許的網站之清單為空"
	},
	allowed: {
		message: "已允許的"
	},
	silenced_empty: {
		message: "已靜默的網站之清單為空"
	},
	silenced: {
		message: "已靜默的"
	},
	allowed_tooltip: {
		message: "在這裡被列出的網域，彈出式視窗將被允許。"
	},
	silenced_tooltip: {
		message: "在這裡被列出的網域，關於已封鎖的彈出式視窗之通知將不被顯示。"
	},
	installFrom: {
		message: "從 <a>%name%</a> 安裝"
	},
	noinst_step_3: {
		message: "步驟 3：重新整理此頁面以到達使用者腳本設定"
	},
	noinst_ignore_if_ag: {
		message: "如果您已安裝 AdGuard for Windows，您可忽略該步驟，因為彈出式視窗封鎖器使用者腳本變為已預安裝的。"
	},
	noinst_rec: {
		message: "（被建議的）"
	},
	please_wait: {
		message: "請稍候，正在檢測彈出式視窗封鎖器"
	},
	noinst_special_prog: {
		message: "首先，為使用一個使用者腳本，您需要執行使用者腳本之專門的程式或擴充功能。"
	},
	noinst_subtitle: {
		message: "AdGuard 彈出式視窗封鎖器使用者腳本未被安裝。請查看下面的用法說明。"
	},
	homepage: {
		message: "首頁"
	},
	noinst_step_1: {
		message: "步驟 1：安裝使用者腳本管理器"
	},
	noinst_step_2: {
		message: "步驟 2：使用者腳本"
	},
	extension_name: {
		message: "由 AdGuard 提供之彈出式視窗封鎖器"
	},
	userscript_name: {
		message: "AdGuard 彈出式視窗封鎖器",
		platform: [
			"userscript",
			"userscript_settings"
		]
	},
	extension_description: {
		message: "封鎖於網頁上之彈出式視窗廣告"
	},
	on_navigation_by_popunder: {
		message: "此至新的頁面之轉換很可能是由一個背彈式視窗引起。您想要繼續嗎？",
		platform: [
			"userscript"
		]
	},
	aborted_popunder_execution: {
		message: "彈出式視窗封鎖器已中止腳本執行以防止背景重新導向",
		platform: [
			"userscript"
		]
	},
	ext_enabled: {
		message: "彈出式視窗封鎖器執勤中"
	},
	ext_disabled: {
		message: "在 $DOMAIN$，彈出式視窗封鎖器被禁用",
		placeholders: {
			domain: {
				content: "$1"
			}
		}
	},
	ext_disabled_default: {
		message: "在此網域，彈出式視窗封鎖器被禁用"
	},
	settings_saved: {
		message: "設定被儲存"
	}
}
};

// TODO get this from twosky.config after Locales type get exported from @adguard/translate
const BASE_LOCALE = 'en';
const getLocale = (locale) => {
    if (locale in translations) {
        return locale;
    }
    const dashed = locale.replace('_', '-');
    if (dashed in translations) {
        return dashed;
    }
    const lowercased = locale.toLowerCase();
    if (lowercased in translations) {
        return lowercased;
    }
    const lowercaseddashed = dashed.toLowerCase();
    if (lowercaseddashed in translations) {
        return lowercaseddashed;
    }
    const splitted = lowercaseddashed.split('-')[0];
    if (splitted in translations) {
        return splitted;
    }
    return null;
};
const getBaseUILanguage = () => BASE_LOCALE;
// TODO replace any after export Locales from @adguard/translate
/**
 * Returns currently selected locale or base locale
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getUILanguage = () => {
    let language;
    if (window.navigator.languages) {
        // eslint-disable-next-line prefer-destructuring
        language = window.navigator.languages[0];
    }
    else {
        language = window.navigator.language;
    }
    const locale = getLocale(language);
    if (!locale) {
        return getBaseUILanguage();
    }
    return locale;
};
const getBaseMessage = (key) => {
    const baseLocale = getBaseUILanguage();
    const localeMessages = translations[baseLocale];
    let message;
    if (localeMessages && key in localeMessages) {
        message = localeMessages[key].message;
    }
    else {
        // eslint-disable-next-line max-len, no-console
        console.error(`[AdGuard PopUp Blocker] Couldn't find message by key "${key}" in base locale. Please report support`);
        message = key;
    }
    return message;
};
/**
 * Returns message by key
 */
const getMessage = (key) => {
    const locale = getUILanguage();
    const localeMessages = translations[locale];
    let message;
    if (localeMessages && key in localeMessages) {
        message = localeMessages[key].message;
    }
    else {
        message = getBaseMessage(key);
    }
    return message;
};
const i18n = {
    getMessage,
    getUILanguage,
    getBaseMessage: (key) => key,
    getBaseUILanguage,
};

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

var NODE_TYPES;

(function (NODE_TYPES) {
  NODE_TYPES["PLACEHOLDER"] = "placeholder";
  NODE_TYPES["TEXT"] = "text";
  NODE_TYPES["TAG"] = "tag";
  NODE_TYPES["VOID_TAG"] = "void_tag";
})(NODE_TYPES || (NODE_TYPES = {}));

var isTextNode = function isTextNode(node) {
  return node.type === NODE_TYPES.TEXT;
};
var isTagNode = function isTagNode(node) {
  return node.type === NODE_TYPES.TAG;
};
var isPlaceholderNode = function isPlaceholderNode(node) {
  return node.type === NODE_TYPES.PLACEHOLDER;
};
var isVoidTagNode = function isVoidTagNode(node) {
  return node.type === NODE_TYPES.VOID_TAG;
};
var placeholderNode = function placeholderNode(value) {
  return {
    type: NODE_TYPES.PLACEHOLDER,
    value: value
  };
};
var textNode = function textNode(str) {
  return {
    type: NODE_TYPES.TEXT,
    value: str
  };
};
var tagNode = function tagNode(tagName, children) {
  var value = tagName.trim();
  return {
    type: NODE_TYPES.TAG,
    value: value,
    children: children
  };
};
var voidTagNode = function voidTagNode(tagName) {
  var value = tagName.trim();
  return {
    type: NODE_TYPES.VOID_TAG,
    value: value
  };
};
/**
 * Checks if target is node
 * @param target
 */

var isNode = function isNode(target) {
  if (typeof target === 'string') {
    return false;
  }

  return !!target.type;
};

var STATE;

(function (STATE) {
  /**
   * Parser function switches to the text state when parses simple text,
   * or content between open and close tags
   */
  STATE["TEXT"] = "text";
  /**
   * Parser function switches to the tag state when meets open tag brace ("<"), and switches back,
   * when meets closing tag brace (">")
   */

  STATE["TAG"] = "tag";
  /**
   * Parser function switches to the placeholder state when meets in the text
   * open placeholders brace ("{") and switches back to the text state,
   * when meets close placeholder brace ("}")
   */

  STATE["PLACEHOLDER"] = "placeholder";
})(STATE || (STATE = {}));

var CONTROL_CHARS = {
  TAG_OPEN_BRACE: '<',
  TAG_CLOSE_BRACE: '>',
  CLOSING_TAG_MARK: '/',
  PLACEHOLDER_MARK: '%'
};
/**
 * Checks if text length is enough to create text node
 * If text node created, then if stack is not empty it is pushed into stack,
 * otherwise into result
 * @param context
 */

var createTextNodeIfPossible = function createTextNodeIfPossible(context) {
  var text = context.text;

  if (text.length > 0) {
    var node = textNode(text);

    if (context.stack.length > 0) {
      context.stack.push(node);
    } else {
      context.result.push(node);
    }
  }

  context.text = '';
};
/**
 * Checks if lastFromStack tag has any attributes
 * @param lastFromStack
 */


var hasAttributes = function hasAttributes(lastFromStack) {
  // e.g. "a class" or "a href='#'"
  var tagStrParts = lastFromStack.split(' ');
  return tagStrParts.length > 1;
};
/**
 * Handles text state
 */


var textStateHandler = function textStateHandler(context) {
  var currChar = context.currChar,
      currIdx = context.currIdx; // switches to the tag state

  if (currChar === CONTROL_CHARS.TAG_OPEN_BRACE) {
    context.lastTextStateChangeIdx = currIdx;
    return STATE.TAG;
  } // switches to the placeholder state


  if (currChar === CONTROL_CHARS.PLACEHOLDER_MARK) {
    context.lastTextStateChangeIdx = currIdx;
    return STATE.PLACEHOLDER;
  } // remains in the text state


  context.text += currChar;
  return STATE.TEXT;
};
/**
 * Handles placeholder state
 * @param context
 */


var placeholderStateHandler = function placeholderStateHandler(context) {
  var currChar = context.currChar,
      currIdx = context.currIdx,
      lastTextStateChangeIdx = context.lastTextStateChangeIdx,
      placeholder = context.placeholder,
      stack = context.stack,
      result = context.result,
      str = context.str;

  if (currChar === CONTROL_CHARS.PLACEHOLDER_MARK) {
    // if distance between current index and last state change equal to 1,
    // it means that placeholder mark was escaped by itself e.g. "%%",
    // so we return to the text state
    if (currIdx - lastTextStateChangeIdx === 1) {
      context.text += str.substring(lastTextStateChangeIdx, currIdx);
      return STATE.TEXT;
    }

    createTextNodeIfPossible(context);
    var node = placeholderNode(placeholder); // push node to the appropriate stack

    if (stack.length > 0) {
      stack.push(node);
    } else {
      result.push(node);
    }

    context.placeholder = '';
    return STATE.TEXT;
  }

  context.placeholder += currChar;
  return STATE.PLACEHOLDER;
};
/**
 * Switches current state to the tag state and returns tag state handler
 */


var tagStateHandler = function tagStateHandler(context) {
  var currChar = context.currChar,
      text = context.text,
      stack = context.stack,
      result = context.result,
      lastTextStateChangeIdx = context.lastTextStateChangeIdx,
      currIdx = context.currIdx,
      str = context.str;
  var tag = context.tag; // if found tag end ">"

  if (currChar === CONTROL_CHARS.TAG_CLOSE_BRACE) {
    // if the tag is close tag e.g. </a>
    if (tag.indexOf(CONTROL_CHARS.CLOSING_TAG_MARK) === 0) {
      // remove slash from tag
      tag = tag.substring(1);
      var children = [];

      if (text.length > 0) {
        children.push(textNode(text));
        context.text = '';
      }

      var pairTagFound = false; // looking for the pair to the close tag

      while (!pairTagFound && stack.length > 0) {
        var lastFromStack = stack.pop(); // if tag from stack equal to close tag

        if (lastFromStack === tag) {
          // create tag node
          var node = tagNode(tag, children); // and add it to the appropriate stack

          if (stack.length > 0) {
            stack.push(node);
          } else {
            result.push(node);
          }

          children = [];
          pairTagFound = true;
        } else if (isNode(lastFromStack)) {
          // add nodes between close tag and open tag to the children
          children.unshift(lastFromStack);
        } else {
          if (typeof lastFromStack === 'string' && hasAttributes(lastFromStack)) {
            throw new Error("Tags in string should not have attributes: ".concat(str));
          } else {
            throw new Error("String has unbalanced tags: ".concat(str));
          }
        }

        if (stack.length === 0 && children.length > 0) {
          throw new Error("String has unbalanced tags: ".concat(str));
        }
      }

      context.tag = '';
      return STATE.TEXT;
    } // if the tag is void tag e.g. <img/>


    if (tag.lastIndexOf(CONTROL_CHARS.CLOSING_TAG_MARK) === tag.length - 1) {
      tag = tag.substring(0, tag.length - 1);
      createTextNodeIfPossible(context);

      var _node = voidTagNode(tag); // add node to the appropriate stack


      if (stack.length > 0) {
        stack.push(_node);
      } else {
        result.push(_node);
      }

      context.tag = '';
      return STATE.TEXT;
    }

    createTextNodeIfPossible(context);
    stack.push(tag);
    context.tag = '';
    return STATE.TEXT;
  } // If we meet open tag "<" it means that we wrongly moved into tag state


  if (currChar === CONTROL_CHARS.TAG_OPEN_BRACE) {
    context.text += str.substring(lastTextStateChangeIdx, currIdx);
    context.lastTextStateChangeIdx = currIdx;
    context.tag = '';
    return STATE.TAG;
  }

  context.tag += currChar;
  return STATE.TAG;
};
/**
 * Parses string into AST (abstract syntax tree) and returns it
 * e.g.
 * parse("String to <a>translate</a>") ->
 * ```
 *      [
 *           { type: 'text', value: 'String to ' },
 *           { type: 'tag', value: 'a', children: [{ type: 'text', value: 'translate' }] }
 *      ];
 * ```
 * Empty string is parsed into empty AST (abstract syntax tree): "[]"
 * If founds unbalanced tags, it throws error about it
 *
 * @param {string} str - message in simplified ICU like syntax without plural support
 */


var parser = function parser() {
  var _STATE_HANDLERS;

  var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var context = {
    /**
     * Stack is used to keep and search nested tag nodes
     */
    stack: [],

    /**
     * Result is stack where function allocates nodes
     */
    result: [],

    /**
     * Current char index
     */
    currIdx: 0,

    /**
     * Saves index of the last state change from the text state,
     * used to restore parsed text if we moved into other state wrongly
     */
    lastTextStateChangeIdx: 0,

    /**
     * Accumulated tag value
     */
    tag: '',

    /**
     * Accumulated text value
     */
    text: '',

    /**
     * Accumulated placeholder value
     */
    placeholder: '',

    /**
     * Parsed string
     */
    str: str
  };
  var STATE_HANDLERS = (_STATE_HANDLERS = {}, _defineProperty(_STATE_HANDLERS, STATE.TEXT, textStateHandler), _defineProperty(_STATE_HANDLERS, STATE.PLACEHOLDER, placeholderStateHandler), _defineProperty(_STATE_HANDLERS, STATE.TAG, tagStateHandler), _STATE_HANDLERS); // Start from text state

  var currentState = STATE.TEXT;

  while (context.currIdx < str.length) {
    context.currChar = str[context.currIdx];
    var currentStateHandler = STATE_HANDLERS[currentState];
    currentState = currentStateHandler(context);
    context.currIdx += 1;
  }

  var result = context.result,
      text = context.text,
      stack = context.stack,
      lastTextStateChangeIdx = context.lastTextStateChangeIdx; // Means that tag or placeholder nodes were not closed, so we consider them as text

  if (currentState !== STATE.TEXT) {
    var restText = str.substring(lastTextStateChangeIdx);

    if ((restText + text).length > 0) {
      result.push(textNode(text + restText));
    }
  } else {
    // eslint-disable-next-line no-lonely-if
    if (text.length > 0) {
      result.push(textNode(text));
    }
  }

  if (stack.length > 0) {
    throw new Error("String has unbalanced tags: ".concat(context.str));
  }

  return result;
};

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
/**
 * Helper functions used by default to assemble strings from tag nodes
 * @param tagName
 * @param children
 */

var createStringElement = function createStringElement(tagName, children) {
  if (children) {
    return "<".concat(tagName, ">").concat(children, "</").concat(tagName, ">");
  }

  return "<".concat(tagName, "/>");
};
/**
 * Creates map with default values for tag converters
 */


var createDefaultValues = function createDefaultValues() {
  return {
    p: function p(children) {
      return createStringElement('p', children);
    },
    b: function b(children) {
      return createStringElement('b', children);
    },
    strong: function strong(children) {
      return createStringElement('strong', children);
    },
    tt: function tt(children) {
      return createStringElement('tt', children);
    },
    s: function s(children) {
      return createStringElement('s', children);
    },
    i: function i(children) {
      return createStringElement('i', children);
    }
  };
};
/**
 * This function accepts an AST (abstract syntax tree) which is a result
 * of the parser function call, and converts tree nodes into array of strings replacing node
 * values with provided values.
 * Values is a map with functions or strings, where each key is related to placeholder value
 * or tag value
 * e.g.
 * string "text <tag>tag text</tag> %placeholder%" is parsed into next AST
 *
 *      [
 *          { type: 'text', value: 'text ' },
 *          {
 *              type: 'tag',
 *              value: 'tag',
 *              children: [{ type: 'text', value: 'tag text' }],
 *          },
 *          { type: 'text', value: ' ' },
 *          { type: 'placeholder', value: 'placeholder' }
 *      ];
 *
 * this AST after format and next values
 *
 *      {
 *          // here used template strings, but it can be react components as well
 *          tag: (chunks) => `<b>${chunks}</b>`,
 *          placeholder: 'placeholder text'
 *      }
 *
 * will return next array
 *
 * [ 'text ', '<b>tag text</b>', ' ', 'placeholder text' ]
 *
 * as you can see, <tag> was replaced by <b>, and placeholder was replaced by placeholder text
 *
 * @param ast - AST (abstract syntax tree)
 * @param values
 */


var format = function format() {
  var ast = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var values = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var result = [];

  var tmplValues = _objectSpread(_objectSpread({}, createDefaultValues()), values);

  var i = 0;

  while (i < ast.length) {
    var currentNode = ast[i]; // if current node is text node, there is nothing to change, append value to the result

    if (isTextNode(currentNode)) {
      result.push(currentNode.value);
    } else if (isTagNode(currentNode)) {
      var children = _toConsumableArray(format(currentNode.children, tmplValues));

      var value = tmplValues[currentNode.value];

      if (value) {
        // TODO consider using strong typing
        if (typeof value === 'function') {
          result.push(value(children.join('')));
        } else {
          result.push(value);
        }
      } else {
        throw new Error("Value ".concat(currentNode.value, " wasn't provided"));
      }
    } else if (isVoidTagNode(currentNode)) {
      var _value = tmplValues[currentNode.value]; // TODO consider using strong typing

      if (_value && typeof _value === 'string') {
        result.push(_value);
      } else {
        throw new Error("Value ".concat(currentNode.value, " wasn't provided"));
      }
    } else if (isPlaceholderNode(currentNode)) {
      var _value2 = tmplValues[currentNode.value]; // TODO consider using strong typing

      if (_value2 && typeof _value2 === 'string') {
        result.push(_value2);
      } else {
        throw new Error("Value ".concat(currentNode.value, " wasn't provided"));
      }
    }

    i += 1;
  }

  return result;
};
/**
 * Function gets AST (abstract syntax tree) or string and formats messages,
 * replacing values accordingly
 * e.g.
 *      const message = formatter('<a>some text</a>', {
 *          a: (chunks) => `<a href="#">${chunks}</a>`,
 *      });
 *      console.log(message); // ['<a href="#">some text</a>']
 * @param message
 * @param [values]
 */


var formatter = function formatter(message, values) {
  var ast = parser(message);
  var preparedValues = {}; // convert values to strings if not a function

  if (values) {
    Object.keys(values).forEach(function (key) {
      var value = values[key]; // TODO consider using strong typing

      if (typeof value === 'function') {
        preparedValues[key] = value;
      } else {
        preparedValues[key] = String(value);
      }
    });
  }

  return format(ast, preparedValues);
};

var _pluralFormsCount;

var AvailableLocales;

(function (AvailableLocales) {
  AvailableLocales["az"] = "az";
  AvailableLocales["bo"] = "bo";
  AvailableLocales["dz"] = "dz";
  AvailableLocales["id"] = "id";
  AvailableLocales["ja"] = "ja";
  AvailableLocales["jv"] = "jv";
  AvailableLocales["ka"] = "ka";
  AvailableLocales["km"] = "km";
  AvailableLocales["kn"] = "kn";
  AvailableLocales["ko"] = "ko";
  AvailableLocales["ms"] = "ms";
  AvailableLocales["th"] = "th";
  AvailableLocales["tr"] = "tr";
  AvailableLocales["vi"] = "vi";
  AvailableLocales["zh"] = "zh";
  AvailableLocales["zh_cn"] = "zh_cn";
  AvailableLocales["zh_tw"] = "zh_tw";
  AvailableLocales["af"] = "af";
  AvailableLocales["bn"] = "bn";
  AvailableLocales["bg"] = "bg";
  AvailableLocales["ca"] = "ca";
  AvailableLocales["da"] = "da";
  AvailableLocales["de"] = "de";
  AvailableLocales["el"] = "el";
  AvailableLocales["en"] = "en";
  AvailableLocales["eo"] = "eo";
  AvailableLocales["es"] = "es";
  AvailableLocales["et"] = "et";
  AvailableLocales["eu"] = "eu";
  AvailableLocales["fa"] = "fa";
  AvailableLocales["fi"] = "fi";
  AvailableLocales["fo"] = "fo";
  AvailableLocales["fur"] = "fur";
  AvailableLocales["fy"] = "fy";
  AvailableLocales["gl"] = "gl";
  AvailableLocales["gu"] = "gu";
  AvailableLocales["ha"] = "ha";
  AvailableLocales["he"] = "he";
  AvailableLocales["hu"] = "hu";
  AvailableLocales["is"] = "is";
  AvailableLocales["it"] = "it";
  AvailableLocales["ku"] = "ku";
  AvailableLocales["lb"] = "lb";
  AvailableLocales["ml"] = "ml";
  AvailableLocales["mn"] = "mn";
  AvailableLocales["mr"] = "mr";
  AvailableLocales["nah"] = "nah";
  AvailableLocales["nb"] = "nb";
  AvailableLocales["ne"] = "ne";
  AvailableLocales["nl"] = "nl";
  AvailableLocales["nn"] = "nn";
  AvailableLocales["no"] = "no";
  AvailableLocales["oc"] = "oc";
  AvailableLocales["om"] = "om";
  AvailableLocales["or"] = "or";
  AvailableLocales["pa"] = "pa";
  AvailableLocales["pap"] = "pap";
  AvailableLocales["ps"] = "ps";
  AvailableLocales["pt"] = "pt";
  AvailableLocales["pt_pt"] = "pt_pt";
  AvailableLocales["pt_br"] = "pt_br";
  AvailableLocales["so"] = "so";
  AvailableLocales["sq"] = "sq";
  AvailableLocales["sv"] = "sv";
  AvailableLocales["sw"] = "sw";
  AvailableLocales["ta"] = "ta";
  AvailableLocales["te"] = "te";
  AvailableLocales["tk"] = "tk";
  AvailableLocales["ur"] = "ur";
  AvailableLocales["zu"] = "zu";
  AvailableLocales["am"] = "am";
  AvailableLocales["bh"] = "bh";
  AvailableLocales["fil"] = "fil";
  AvailableLocales["fr"] = "fr";
  AvailableLocales["gun"] = "gun";
  AvailableLocales["hi"] = "hi";
  AvailableLocales["hy"] = "hy";
  AvailableLocales["ln"] = "ln";
  AvailableLocales["mg"] = "mg";
  AvailableLocales["nso"] = "nso";
  AvailableLocales["xbr"] = "xbr";
  AvailableLocales["ti"] = "ti";
  AvailableLocales["wa"] = "wa";
  AvailableLocales["be"] = "be";
  AvailableLocales["bs"] = "bs";
  AvailableLocales["hr"] = "hr";
  AvailableLocales["ru"] = "ru";
  AvailableLocales["sr"] = "sr";
  AvailableLocales["uk"] = "uk";
  AvailableLocales["cs"] = "cs";
  AvailableLocales["sk"] = "sk";
  AvailableLocales["ga"] = "ga";
  AvailableLocales["lt"] = "lt";
  AvailableLocales["sl"] = "sl";
  AvailableLocales["mk"] = "mk";
  AvailableLocales["mt"] = "mt";
  AvailableLocales["lv"] = "lv";
  AvailableLocales["pl"] = "pl";
  AvailableLocales["cy"] = "cy";
  AvailableLocales["ro"] = "ro";
  AvailableLocales["ar"] = "ar";
})(AvailableLocales || (AvailableLocales = {}));

var getPluralFormId = function getPluralFormId(locale, number) {
  var _supportedForms;

  if (number === 0) {
    return 0;
  }

  var slavNum = number % 10 === 1 && number % 100 !== 11 ? 1 : number % 10 >= 2 && number % 10 <= 4 && (number % 100 < 10 || number % 100 >= 20) ? 2 : 3;
  var supportedForms = (_supportedForms = {}, _defineProperty(_supportedForms, AvailableLocales.az, 1), _defineProperty(_supportedForms, AvailableLocales.bo, 1), _defineProperty(_supportedForms, AvailableLocales.dz, 1), _defineProperty(_supportedForms, AvailableLocales.id, 1), _defineProperty(_supportedForms, AvailableLocales.ja, 1), _defineProperty(_supportedForms, AvailableLocales.jv, 1), _defineProperty(_supportedForms, AvailableLocales.ka, 1), _defineProperty(_supportedForms, AvailableLocales.km, 1), _defineProperty(_supportedForms, AvailableLocales.kn, 1), _defineProperty(_supportedForms, AvailableLocales.ko, 1), _defineProperty(_supportedForms, AvailableLocales.ms, 1), _defineProperty(_supportedForms, AvailableLocales.th, 1), _defineProperty(_supportedForms, AvailableLocales.tr, 1), _defineProperty(_supportedForms, AvailableLocales.vi, 1), _defineProperty(_supportedForms, AvailableLocales.zh, 1), _defineProperty(_supportedForms, AvailableLocales.zh_tw, 1), _defineProperty(_supportedForms, AvailableLocales.zh_cn, 1), _defineProperty(_supportedForms, AvailableLocales.af, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.bn, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.bg, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.ca, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.da, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.de, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.el, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.en, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.eo, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.es, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.et, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.eu, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.fa, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.fi, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.fo, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.fur, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.fy, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.gl, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.gu, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.ha, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.he, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.hu, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.is, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.it, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.ku, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.lb, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.ml, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.mn, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.mr, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.nah, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.nb, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.ne, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.nl, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.nn, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.no, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.oc, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.om, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.or, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.pa, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.pap, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.ps, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.pt, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.pt_pt, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.pt_br, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.so, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.sq, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.sv, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.sw, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.ta, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.te, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.tk, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.ur, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.zu, number === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.am, number === 0 || number === 1 ? 0 : 1), _defineProperty(_supportedForms, AvailableLocales.bh, number === 0 || number === 1 ? 0 : 1), _defineProperty(_supportedForms, AvailableLocales.fil, number === 0 || number === 1 ? 0 : 1), _defineProperty(_supportedForms, AvailableLocales.fr, number === 0 || number >= 2 ? 2 : 1), _defineProperty(_supportedForms, AvailableLocales.gun, number === 0 || number === 1 ? 0 : 1), _defineProperty(_supportedForms, AvailableLocales.hi, number === 0 || number === 1 ? 0 : 1), _defineProperty(_supportedForms, AvailableLocales.hy, number === 0 || number === 1 ? 0 : 1), _defineProperty(_supportedForms, AvailableLocales.ln, number === 0 || number === 1 ? 0 : 1), _defineProperty(_supportedForms, AvailableLocales.mg, number === 0 || number === 1 ? 0 : 1), _defineProperty(_supportedForms, AvailableLocales.nso, number === 0 || number === 1 ? 0 : 1), _defineProperty(_supportedForms, AvailableLocales.xbr, number === 0 || number === 1 ? 0 : 1), _defineProperty(_supportedForms, AvailableLocales.ti, number === 0 || number === 1 ? 0 : 1), _defineProperty(_supportedForms, AvailableLocales.wa, number === 0 || number === 1 ? 0 : 1), _defineProperty(_supportedForms, AvailableLocales.be, slavNum), _defineProperty(_supportedForms, AvailableLocales.bs, slavNum), _defineProperty(_supportedForms, AvailableLocales.hr, slavNum), _defineProperty(_supportedForms, AvailableLocales.ru, slavNum), _defineProperty(_supportedForms, AvailableLocales.sr, slavNum), _defineProperty(_supportedForms, AvailableLocales.uk, slavNum), _defineProperty(_supportedForms, AvailableLocales.cs, number === 1 ? 1 : number >= 2 && number <= 4 ? 2 : 3), _defineProperty(_supportedForms, AvailableLocales.sk, number === 1 ? 1 : number >= 2 && number <= 4 ? 2 : 3), _defineProperty(_supportedForms, AvailableLocales.ga, number === 1 ? 1 : number === 2 ? 2 : 3), _defineProperty(_supportedForms, AvailableLocales.lt, number % 10 === 1 && number % 100 !== 11 ? 1 : number % 10 >= 2 && (number % 100 < 10 || number % 100 >= 20) ? 2 : 3), _defineProperty(_supportedForms, AvailableLocales.sl, number % 100 === 1 ? 1 : number % 100 === 2 ? 2 : number % 100 === 3 || number % 100 === 4 ? 3 : 4), _defineProperty(_supportedForms, AvailableLocales.mk, number % 10 === 1 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.mt, number === 1 ? 1 : number === 0 || number % 100 > 1 && number % 100 < 11 ? 2 : number % 100 > 10 && number % 100 < 20 ? 3 : 4), _defineProperty(_supportedForms, AvailableLocales.lv, number === 0 ? 0 : number % 10 === 1 && number % 100 !== 11 ? 1 : 2), _defineProperty(_supportedForms, AvailableLocales.pl, number === 1 ? 1 : number % 10 >= 2 && number % 10 <= 4 && (number % 100 < 12 || number % 100 > 14) ? 2 : 3), _defineProperty(_supportedForms, AvailableLocales.cy, number === 1 ? 0 : number === 2 ? 1 : number === 8 || number === 11 ? 2 : 3), _defineProperty(_supportedForms, AvailableLocales.ro, number === 1 ? 1 : number === 1 || number % 100 > 0 && number % 100 < 20 ? 2 : 3), _defineProperty(_supportedForms, AvailableLocales.ar, number === 0 ? 0 : number === 1 ? 1 : number === 2 ? 2 : number % 100 >= 3 && number % 100 <= 10 ? 3 : number % 100 >= 11 && number % 100 <= 99 ? 4 : 5), _supportedForms);
  return supportedForms[locale];
};

var pluralFormsCount = (_pluralFormsCount = {}, _defineProperty(_pluralFormsCount, AvailableLocales.az, 2), _defineProperty(_pluralFormsCount, AvailableLocales.bo, 2), _defineProperty(_pluralFormsCount, AvailableLocales.dz, 2), _defineProperty(_pluralFormsCount, AvailableLocales.id, 2), _defineProperty(_pluralFormsCount, AvailableLocales.ja, 2), _defineProperty(_pluralFormsCount, AvailableLocales.jv, 2), _defineProperty(_pluralFormsCount, AvailableLocales.ka, 2), _defineProperty(_pluralFormsCount, AvailableLocales.km, 2), _defineProperty(_pluralFormsCount, AvailableLocales.kn, 2), _defineProperty(_pluralFormsCount, AvailableLocales.ko, 2), _defineProperty(_pluralFormsCount, AvailableLocales.ms, 2), _defineProperty(_pluralFormsCount, AvailableLocales.th, 2), _defineProperty(_pluralFormsCount, AvailableLocales.tr, 2), _defineProperty(_pluralFormsCount, AvailableLocales.vi, 2), _defineProperty(_pluralFormsCount, AvailableLocales.zh, 2), _defineProperty(_pluralFormsCount, AvailableLocales.zh_cn, 2), _defineProperty(_pluralFormsCount, AvailableLocales.zh_tw, 2), _defineProperty(_pluralFormsCount, AvailableLocales.af, 3), _defineProperty(_pluralFormsCount, AvailableLocales.bn, 3), _defineProperty(_pluralFormsCount, AvailableLocales.bg, 3), _defineProperty(_pluralFormsCount, AvailableLocales.ca, 3), _defineProperty(_pluralFormsCount, AvailableLocales.da, 3), _defineProperty(_pluralFormsCount, AvailableLocales.de, 3), _defineProperty(_pluralFormsCount, AvailableLocales.el, 3), _defineProperty(_pluralFormsCount, AvailableLocales.en, 3), _defineProperty(_pluralFormsCount, AvailableLocales.eo, 3), _defineProperty(_pluralFormsCount, AvailableLocales.es, 3), _defineProperty(_pluralFormsCount, AvailableLocales.et, 3), _defineProperty(_pluralFormsCount, AvailableLocales.eu, 3), _defineProperty(_pluralFormsCount, AvailableLocales.fa, 3), _defineProperty(_pluralFormsCount, AvailableLocales.fi, 3), _defineProperty(_pluralFormsCount, AvailableLocales.fo, 3), _defineProperty(_pluralFormsCount, AvailableLocales.fur, 3), _defineProperty(_pluralFormsCount, AvailableLocales.fy, 3), _defineProperty(_pluralFormsCount, AvailableLocales.gl, 3), _defineProperty(_pluralFormsCount, AvailableLocales.gu, 3), _defineProperty(_pluralFormsCount, AvailableLocales.ha, 3), _defineProperty(_pluralFormsCount, AvailableLocales.he, 3), _defineProperty(_pluralFormsCount, AvailableLocales.hu, 3), _defineProperty(_pluralFormsCount, AvailableLocales.is, 3), _defineProperty(_pluralFormsCount, AvailableLocales.it, 3), _defineProperty(_pluralFormsCount, AvailableLocales.ku, 3), _defineProperty(_pluralFormsCount, AvailableLocales.lb, 3), _defineProperty(_pluralFormsCount, AvailableLocales.ml, 3), _defineProperty(_pluralFormsCount, AvailableLocales.mn, 3), _defineProperty(_pluralFormsCount, AvailableLocales.mr, 3), _defineProperty(_pluralFormsCount, AvailableLocales.nah, 3), _defineProperty(_pluralFormsCount, AvailableLocales.nb, 3), _defineProperty(_pluralFormsCount, AvailableLocales.ne, 3), _defineProperty(_pluralFormsCount, AvailableLocales.nl, 3), _defineProperty(_pluralFormsCount, AvailableLocales.nn, 3), _defineProperty(_pluralFormsCount, AvailableLocales.no, 3), _defineProperty(_pluralFormsCount, AvailableLocales.oc, 3), _defineProperty(_pluralFormsCount, AvailableLocales.om, 3), _defineProperty(_pluralFormsCount, AvailableLocales.or, 3), _defineProperty(_pluralFormsCount, AvailableLocales.pa, 3), _defineProperty(_pluralFormsCount, AvailableLocales.pap, 3), _defineProperty(_pluralFormsCount, AvailableLocales.ps, 3), _defineProperty(_pluralFormsCount, AvailableLocales.pt, 3), _defineProperty(_pluralFormsCount, AvailableLocales.pt_pt, 3), _defineProperty(_pluralFormsCount, AvailableLocales.pt_br, 3), _defineProperty(_pluralFormsCount, AvailableLocales.so, 3), _defineProperty(_pluralFormsCount, AvailableLocales.sq, 3), _defineProperty(_pluralFormsCount, AvailableLocales.sv, 3), _defineProperty(_pluralFormsCount, AvailableLocales.sw, 3), _defineProperty(_pluralFormsCount, AvailableLocales.ta, 3), _defineProperty(_pluralFormsCount, AvailableLocales.te, 3), _defineProperty(_pluralFormsCount, AvailableLocales.tk, 3), _defineProperty(_pluralFormsCount, AvailableLocales.ur, 3), _defineProperty(_pluralFormsCount, AvailableLocales.zu, 3), _defineProperty(_pluralFormsCount, AvailableLocales.am, 2), _defineProperty(_pluralFormsCount, AvailableLocales.bh, 2), _defineProperty(_pluralFormsCount, AvailableLocales.fil, 2), _defineProperty(_pluralFormsCount, AvailableLocales.fr, 3), _defineProperty(_pluralFormsCount, AvailableLocales.gun, 2), _defineProperty(_pluralFormsCount, AvailableLocales.hi, 2), _defineProperty(_pluralFormsCount, AvailableLocales.hy, 2), _defineProperty(_pluralFormsCount, AvailableLocales.ln, 2), _defineProperty(_pluralFormsCount, AvailableLocales.mg, 2), _defineProperty(_pluralFormsCount, AvailableLocales.nso, 2), _defineProperty(_pluralFormsCount, AvailableLocales.xbr, 2), _defineProperty(_pluralFormsCount, AvailableLocales.ti, 2), _defineProperty(_pluralFormsCount, AvailableLocales.wa, 2), _defineProperty(_pluralFormsCount, AvailableLocales.be, 4), _defineProperty(_pluralFormsCount, AvailableLocales.bs, 4), _defineProperty(_pluralFormsCount, AvailableLocales.hr, 4), _defineProperty(_pluralFormsCount, AvailableLocales.ru, 4), _defineProperty(_pluralFormsCount, AvailableLocales.sr, 4), _defineProperty(_pluralFormsCount, AvailableLocales.uk, 4), _defineProperty(_pluralFormsCount, AvailableLocales.cs, 4), _defineProperty(_pluralFormsCount, AvailableLocales.sk, 4), _defineProperty(_pluralFormsCount, AvailableLocales.ga, 4), _defineProperty(_pluralFormsCount, AvailableLocales.lt, 4), _defineProperty(_pluralFormsCount, AvailableLocales.sl, 5), _defineProperty(_pluralFormsCount, AvailableLocales.mk, 3), _defineProperty(_pluralFormsCount, AvailableLocales.mt, 5), _defineProperty(_pluralFormsCount, AvailableLocales.lv, 3), _defineProperty(_pluralFormsCount, AvailableLocales.pl, 4), _defineProperty(_pluralFormsCount, AvailableLocales.cy, 4), _defineProperty(_pluralFormsCount, AvailableLocales.ro, 4), _defineProperty(_pluralFormsCount, AvailableLocales.ar, 6), _pluralFormsCount);
var PLURAL_STRING_DELIMITER = '|';

var checkForms = function checkForms(str, locale, key) {
  var forms = str.split(PLURAL_STRING_DELIMITER);

  if (forms.length !== pluralFormsCount[locale]) {
    throw new Error("Invalid plural string \"".concat(key, "\" for locale ").concat(locale, ": ").concat(forms.length, " given; need: ").concat(pluralFormsCount[locale]));
  }
};
/**
 * Returns plural form corresponding to number
 * @param str
 * @param number
 * @param locale - current locale
 * @param key - message key
 */

var getForm = function getForm(str, number, locale, key) {
  checkForms(str, locale, key);
  var forms = str.split(PLURAL_STRING_DELIMITER);
  var currentForm = getPluralFormId(locale, number);
  return forms[currentForm].trim();
};

function ownKeys$1(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$1(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$1(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$1(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var defaultMessageConstructor = function defaultMessageConstructor(formatted) {
  return formatted.join('');
};

var Translator = /*#__PURE__*/function () {
  function Translator(i18n, messageConstructor, values) {
    _classCallCheck(this, Translator);

    this.i18n = i18n;
    this.messageConstructor = messageConstructor || defaultMessageConstructor;
    this.values = values || {};
  }
  /**
   * Retrieves message and translates it, substituting parameters where necessary
   * @param key - translation message key
   * @param params - values used to substitute placeholders and tags
   */


  _createClass(Translator, [{
    key: "getMessage",
    value: function getMessage(key) {
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var message = this.i18n.getMessage(key);

      if (!message) {
        message = this.i18n.getBaseMessage(key);

        if (!message) {
          throw new Error("Was unable to find message for key: \"".concat(key, "\""));
        }
      }

      var formatted = formatter(message, _objectSpread$1(_objectSpread$1({}, this.values), params));
      return this.messageConstructor(formatted);
    }
    /**
     * Retrieves correct plural form and translates it
     * @param key - translation message key
     * @param number - plural form number
     * @param params - values used to substitute placeholders or tags if necessary,
     * if params has "count" property it will be overridden by number (plural form number)
     */

  }, {
    key: "getPlural",
    value: function getPlural(key, number) {
      var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var message = this.i18n.getMessage(key);
      var language = this.i18n.getUILanguage();

      if (!message) {
        message = this.i18n.getBaseMessage(key);

        if (!message) {
          throw new Error("Was unable to find message for key: \"".concat(key, "\""));
        }

        language = this.i18n.getBaseUILanguage();
      }

      var form = getForm(message, number, language, key);
      var formatted = formatter(form, _objectSpread$1(_objectSpread$1(_objectSpread$1({}, this.values), params), {}, {
        count: number
      }));
      return this.messageConstructor(formatted);
    }
  }]);

  return Translator;
}();

function ownKeys$2(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$2(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$2(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$2(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
/**
 * Creates translation function for strings used in the React components
 * We do not import React directly, because translator module can be used
 * in the modules without React too
 *
 * e.g.
 * const translateReact = createReactTranslator(getMessage, React);
 * in locales folder you should have messages.json file
 * ```
 * message:
 *     "popup_auth_agreement_consent": {
 *          "message": "You agree to our <eula>EULA</eula>",
 *      },
 * ```
 *
 * this message can be retrieved and translated into react components next way:
 *
 * const component = translateReact('popup_auth_agreement_consent', {
 *          eula: (chunks) => (
 *              <button
 *                  className="auth__privacy-link"
 *                  onClick={handleEulaClick}
 *              >
 *                  {chunks}
 *              </button>
 *          ),
 *       });
 *
 * Note how functions in the values argument can be used with handlers
 *
 * @param i18n - object with methods which get translated message by key and return current locale
 * @param React - instance of react library
 */

var createReactTranslator = function createReactTranslator(i18n, react, defaults) {
  /**
   * Helps to build nodes without values
   *
   * @param tagName
   * @param children
   */
  var createReactElement = function createReactElement(tagName, children) {
    if (children) {
      return react.createElement(tagName, null, react.Children.toArray(children));
    }

    return react.createElement(tagName, null);
  };
  /**
   * Function creates default values to be used if user didn't provide function values for tags
   */


  var createDefaultValues = function createDefaultValues() {
    var externalDefaults = {};

    if (defaults) {
      defaults.tags.forEach(function (t) {
        externalDefaults[t.key] = function (children) {
          return createReactElement(t.createdTag, children);
        };
      });
    }

    if (defaults !== null && defaults !== void 0 && defaults.override) {
      return externalDefaults;
    }

    return _objectSpread$2({
      p: function p(children) {
        return createReactElement('p', children);
      },
      b: function b(children) {
        return createReactElement('b', children);
      },
      strong: function strong(children) {
        return createReactElement('strong', children);
      },
      tt: function tt(children) {
        return createReactElement('tt', children);
      },
      s: function s(children) {
        return createReactElement('s', children);
      },
      i: function i(children) {
        return createReactElement('i', children);
      }
    }, externalDefaults);
  };

  var reactMessageConstructor = function reactMessageConstructor(formatted) {
    var reactChildren = react.Children.toArray(formatted); // if there is only strings in the array we join them

    if (reactChildren.every(function (child) {
      return typeof child === 'string';
    })) {
      return reactChildren.join('');
    }

    return reactChildren;
  };

  var defaultValues = createDefaultValues();
  return new Translator(i18n, reactMessageConstructor, defaultValues);
};

function A(n, l) {
  return l = l || [], null == n || "boolean" == typeof n || (Array.isArray(n) ? n.some(function (n) {
    A(n, l);
  }) : l.push(n)), l;
}

"function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout;

function ownKeys$3(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$3(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$3(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$3(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
/**
 * Creates translation function for strings used in the Preact components
 * We do not import Preact directly, because translator module can be used
 * in the modules without Preact too
 *
 * e.g.
 * const translatePreact = createPreactTranslator(getMessage, Preact);
 * in locales folder you should have messages.json file
 * ```
 * message:
 *     "popup_auth_agreement_consent": {
 *          "message": "You agree to our <eula>EULA</eula>",
 *      },
 * ```
 *
 * this message can be retrieved and translated into preact components next way:
 *
 * const component = translatePreact('popup_auth_agreement_consent', {
 *          eula: (chunks) => (
 *              <button
 *                  className="auth__privacy-link"
 *                  onClick={handleEulaClick}
 *              >
 *                  {chunks}
 *              </button>
 *          ),
 *       });
 *
 * Note how functions in the values argument can be used with handlers
 *
 * @param i18n - object with methods which get translated message by key and return current locale
 * @param Preact - instance of preact library
 */

var createPreactTranslator = function createPreactTranslator(i18n, preact, defaults) {
  /**
   * Helps to build nodes without values
   *
   * @param tagName
   * @param children
   */
  var createPreactElement = function createPreactElement(tagName, children) {
    if (children) {
      return preact.createElement(tagName, null, A(children));
    }

    return preact.createElement(tagName, null);
  };
  /**
   * Function creates default values to be used if user didn't provide function values for tags
   */


  var createDefaultValues = function createDefaultValues() {
    var externalDefaults = {};

    if (defaults) {
      defaults.tags.forEach(function (t) {
        externalDefaults[t.key] = function (children) {
          return createPreactElement(t.createdTag, children);
        };
      });
    }

    if (defaults !== null && defaults !== void 0 && defaults.override) {
      return externalDefaults;
    }

    return _objectSpread$3({
      p: function p(children) {
        return createPreactElement('p', children);
      },
      b: function b(children) {
        return createPreactElement('b', children);
      },
      strong: function strong(children) {
        return createPreactElement('strong', children);
      },
      tt: function tt(children) {
        return createPreactElement('tt', children);
      },
      s: function s(children) {
        return createPreactElement('s', children);
      },
      i: function i(children) {
        return createPreactElement('i', children);
      }
    }, externalDefaults);
  };

  var preactMessageConstructor = function preactMessageConstructor(formatted) {
    var preactChildren = A(formatted); // if there is only strings in the array we join them

    if (preactChildren.every(function (child) {
      return typeof child === 'string';
    })) {
      return preactChildren.join('');
    }

    return preactChildren;
  };

  var defaultValues = createDefaultValues();
  return new Translator(i18n, preactMessageConstructor, defaultValues);
};

/**
 * Creates translator instance strings, by default for simple strings
 * @param i18n - function which returns translated message by key
 * @param messageConstructor - function that will collect messages
 * @param values - map with default values for tag converters
 */

var createTranslator = function createTranslator(i18n, messageConstructor, values) {
  return new Translator(i18n, messageConstructor, values);
};

var translate = {
  createTranslator: createTranslator,
  createReactTranslator: createReactTranslator,
  createPreactTranslator: createPreactTranslator
};

/**
 * Retrieves localized messages by key, formats and converts into react components or string
 */
const preactTranslator = translate.createPreactTranslator(i18n, {
    createElement: y,
});

/**
 * Retrieves localized messages by key, formats and converts into react components or string
 */
const translator = translate.createTranslator(i18n);

var t,r,u,i,o=0,f=[],c=[],e=l$1.__b,a=l$1.__r,v=l$1.diffed,l=l$1.__c,m=l$1.unmount;function d(t,u){l$1.__h&&l$1.__h(r,t,o||u),o=0;var i=r.__H||(r.__H={__:[],__h:[]});return t>=i.__.length&&i.__.push({__V:c}),i.__[t]}function h(n){return o=1,s(B$1,n)}function s(n,u,i){var o=d(t++,2);if(o.t=n,!o.__c&&(o.__=[i?i(u):B$1(void 0,u),function(n){var t=o.__N?o.__N[0]:o.__[0],r=o.t(t,n);t!==r&&(o.__N=[r,o.__[1]],o.__c.setState({}));}],o.__c=r,!r.u)){var f=function(n,t,r){if(!o.__c.__H)return !0;var u=o.__c.__H.__.filter(function(n){return n.__c});if(u.every(function(n){return !n.__N}))return !c||c.call(this,n,t,r);var i=!1;return u.forEach(function(n){if(n.__N){var t=n.__[0];n.__=n.__N,n.__N=void 0,t!==n.__[0]&&(i=!0);}}),!(!i&&o.__c.props===n)&&(!c||c.call(this,n,t,r))};r.u=!0;var c=r.shouldComponentUpdate,e=r.componentWillUpdate;r.componentWillUpdate=function(n,t,r){if(this.__e){var u=c;c=void 0,f(n,t,r),c=u;}e&&e.call(this,n,t,r);},r.shouldComponentUpdate=f;}return o.__N||o.__}function p(u,i){var o=d(t++,3);!l$1.__s&&z$1(o.__H,i)&&(o.__=u,o.i=i,r.__H.__h.push(o));}function F$1(n,r){var u=d(t++,7);return z$1(u.__H,r)?(u.__V=n(),u.i=r,u.__h=n,u.__V):u.__}function T$1(n,t){return o=8,F$1(function(){return n},t)}function b(){for(var t;t=f.shift();)if(t.__P&&t.__H)try{t.__H.__h.forEach(k),t.__H.__h.forEach(w$1),t.__H.__h=[];}catch(r){t.__H.__h=[],l$1.__e(r,t.__v);}}l$1.__b=function(n){r=null,e&&e(n);},l$1.__r=function(n){a&&a(n),t=0;var i=(r=n.__c).__H;i&&(u===r?(i.__h=[],r.__h=[],i.__.forEach(function(n){n.__N&&(n.__=n.__N),n.__V=c,n.__N=n.i=void 0;})):(i.__h.forEach(k),i.__h.forEach(w$1),i.__h=[])),u=r;},l$1.diffed=function(t){v&&v(t);var o=t.__c;o&&o.__H&&(o.__H.__h.length&&(1!==f.push(o)&&i===l$1.requestAnimationFrame||((i=l$1.requestAnimationFrame)||j$1)(b)),o.__H.__.forEach(function(n){n.i&&(n.__H=n.i),n.__V!==c&&(n.__=n.__V),n.i=void 0,n.__V=c;})),u=r=null;},l$1.__c=function(t,r){r.some(function(t){try{t.__h.forEach(k),t.__h=t.__h.filter(function(n){return !n.__||w$1(n)});}catch(u){r.some(function(n){n.__h&&(n.__h=[]);}),r=[],l$1.__e(u,t.__v);}}),l&&l(t,r);},l$1.unmount=function(t){m&&m(t);var r,u=t.__c;u&&u.__H&&(u.__H.__.forEach(function(n){try{k(n);}catch(n){r=n;}}),u.__H=void 0,r&&l$1.__e(r,u.__v));};var g$1="function"==typeof requestAnimationFrame;function j$1(n){var t,r=function(){clearTimeout(u),g$1&&cancelAnimationFrame(t),setTimeout(n);},u=setTimeout(r,100);g$1&&(t=requestAnimationFrame(r));}function k(n){var t=r,u=n.__c;"function"==typeof u&&(n.__c=void 0,u()),r=t;}function w$1(n){var t=r;n.__c=n.__(),r=t;}function z$1(n,t){return !n||n.length!==t.length||t.some(function(t,r){return t!==n[r]})}function B$1(n,t){return "function"==typeof t?t(n):t}

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z$1 = ".footer {\n    border-top: 1px solid rgba(197, 197, 197, .47);\n}\n\n    .footer__in {\n        margin: 0 auto;\n        width: 540px;\n        padding: 30px 40px;\n        background-color: var(--white-color);\n    }\n\n    .footer__link {\n        text-decoration: none;\n        max-width: 80px;\n        cursor: pointer;\n        color: var(--green5B);\n    }\n\n    .footer__link:last-child {\n            margin-left: 25px;\n        }\n";
styleInject(css_248z$1);

const Footer = () => (o$1("div", Object.assign({ class: "footer" }, { children: o$1("div", Object.assign({ class: "footer__in" }, { children: o$1("div", Object.assign({ class: "footer__links-list" }, { children: [o$1("a", Object.assign({ target: "_blank", href: "https://link.adtidy.org/forward.html?action=adguard_site&from=popup_blocker_options&app=popup_blocker" /* ResourceUrl.AdGuard */, class: "footer__link", rel: "noreferrer" }, { children: "\u00A9 AdGuard.com" })), o$1("a", Object.assign({ target: "_blank", href: "https://github.com/AdguardTeam/PopupBlocker" /* ResourceUrl.Popupblocker */, class: "footer__link", rel: "noreferrer" }, { children: preactTranslator.getMessage('homepage') }))] })) })) })));

const LoadingSubtitle = () => (o$1("div", Object.assign({ class: "settings__subtitle settings__subtitle--margin" }, { children: preactTranslator.getMessage('please_wait') })));

var ScriptManagerUrl;
(function (ScriptManagerUrl) {
    ScriptManagerUrl["AdGuard"] = "https://link.adtidy.org/forward.html?action=adguard_site&from=popup_blocker_options&app=popup_blocker";
    ScriptManagerUrl["GreaseMonkey"] = "https://www.greasespot.net/";
    ScriptManagerUrl["ViolentMonkey"] = "https://violentmonkey.github.io/";
    ScriptManagerUrl["TamperMonkey"] = "https://tampermonkey.net/";
})(ScriptManagerUrl || (ScriptManagerUrl = {}));
var InstallSource;
(function (InstallSource) {
    InstallSource["GitHub"] = "https://github.com/AdguardTeam/PopupBlocker";
    InstallSource["Greasyfork"] = "https://greasyfork.org/en/scripts/436537-adguard-popup-blocker-dev";
    InstallSource["OpenUserJS"] = "https://openuserjs.org/scripts/AdGuard/Adguard_Popup_Blocker";
})(InstallSource || (InstallSource = {}));

const VALID_DOMAIN_REGEX = /^((?=[a-z0-9-]{1,63}\.)(xn--)?[a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,63}(?::[\d]{0,5})?$/;
// Checks if given input is a valid domain
const isValidDomain = (domain) => VALID_DOMAIN_REGEX.test(domain);
const getOwnScriptManagerName = (manager) => {
    const isAdGuard = manager === 'AdGuard';
    if (!isAdGuard) {
        return manager;
    }
    const MAC_OS = 'Mac';
    const WIN_OS = 'Windows';
    const os = window.navigator.userAgent.includes(MAC_OS) ? MAC_OS : WIN_OS;
    const recommendedMessage = translator.getMessage('noinst_rec');
    return `AdGuard for ${os} ${recommendedMessage}`;
};

const ScriptManagerItems = () => (o$1(_$1, { children: Object.keys(ScriptManagerUrl)
        .map((manager) => (o$1("li", Object.assign({ class: "settings__list-item" }, { children: o$1("a", Object.assign({ target: "_blank", href: ScriptManagerUrl[manager], class: "settings__list-link", rel: "noreferrer" }, { children: getOwnScriptManagerName(manager) })) }), manager))) }));

const InstallSourceItems = () => (o$1(_$1, { children: Object.keys(InstallSource)
        .map((source) => (o$1("li", Object.assign({ class: "settings__list-item" }, { children: preactTranslator.getMessage('installFrom', {
            name: source,
            a: (chunk) => (o$1("a", Object.assign({ target: "_blank", href: InstallSource[source], class: "settings__list-link", rel: "noreferrer" }, { children: chunk }))),
        }) }), source))) }));

const NotInstalled = () => (o$1(_$1, { children: [o$1("div", Object.assign({ class: "settings__subtitle settings__subtitle--margin" }, { children: preactTranslator.getMessage('noinst_subtitle') })), o$1("div", Object.assign({ class: "settings__list" }, { children: [o$1("div", Object.assign({ class: "settings__list-title" }, { children: preactTranslator.getMessage('noinst_step_1') })), o$1("div", Object.assign({ class: "settings__list-subtitle" }, { children: preactTranslator.getMessage('noinst_special_prog') })), o$1("div", Object.assign({ class: "settings__list-in" }, { children: o$1(ScriptManagerItems, {}) })), o$1("div", Object.assign({ class: "settings__list-title" }, { children: preactTranslator.getMessage('noinst_step_2') })), o$1("div", Object.assign({ class: "settings__list-subtitle" }, { children: preactTranslator.getMessage('noinst_ignore_if_ag') })), o$1("div", Object.assign({ class: "settings__list-in" }, { children: o$1(InstallSourceItems, {}) })), o$1("div", Object.assign({ class: "settings__list-title" }, { children: preactTranslator.getMessage('noinst_step_3') }))] }))] }));

const Tooltip = ({ tooltip, }) => (o$1("div", { class: "tooltip", "data-tooltip": tooltip }));

const SettingHeader = ({ messages, showModal, }) => {
    const { subtitle, tooltip, controlItem, emptyRow, } = messages;
    return (o$1("div", Object.assign({ class: "settings__row" }, { children: [o$1("div", Object.assign({ class: "tooltip-container" }, { children: [o$1("div", Object.assign({ class: "settings__subtitle" }, { children: subtitle })), o$1(Tooltip, { tooltip: tooltip })] })), o$1("div", Object.assign({ class: "settings__control" }, { children: o$1("button", Object.assign({ class: "settings__control-item", onClick: showModal }, { children: controlItem })) })), o$1("div", Object.assign({ class: "settings__row-empty" }, { children: emptyRow }))] })));
};

const SettingItem = ({ item, removeItem, }) => {
    const clickHandler = T$1(() => removeItem(item), [item, removeItem]);
    return (o$1("div", Object.assign({ class: "settings__row" }, { children: [o$1("div", Object.assign({ class: "settings__name" }, { children: item })), o$1("button", { onClick: clickHandler, class: "settings__del" })] })));
};

const Modal = ({ hideModal, addItem, }) => {
    const [inputValue, setInputValue] = h('');
    const handleChange = T$1((event) => {
        const inputElement = event.target;
        setInputValue(inputElement.value);
    }, []);
    const handleSubmit = T$1((event) => {
        event.preventDefault();
        if (isValidDomain(inputValue)) {
            addItem(inputValue);
            hideModal();
        }
    }, [hideModal, addItem, inputValue]);
    return (o$1("div", Object.assign({ class: "settings settings-modal" }, { children: o$1("div", Object.assign({ class: "settings__in settings__in--popup" }, { children: [o$1("div", { class: "settings__close", onClick: hideModal }), o$1("div", Object.assign({ class: "settings__title" }, { children: preactTranslator.getMessage('add_site') })), o$1("form", Object.assign({ onSubmit: handleSubmit }, { children: [o$1("input", { onInput: handleChange, class: "settings__input", type: "text", placeholder: translator.getMessage('site_input_ph') }), o$1("button", Object.assign({ class: "settings__submit", type: "submit" }, { children: preactTranslator.getMessage('add_site') }))] }))] })) })));
};

function g(n,t){for(var e in t)n[e]=t[e];return n}function C(n,t){for(var e in n)if("__source"!==e&&!(e in t))return !0;for(var r in t)if("__source"!==r&&n[r]!==t[r])return !0;return !1}function w(n){this.props=n;}(w.prototype=new k$1).isPureReactComponent=!0,w.prototype.shouldComponentUpdate=function(n,t){return C(this.props,n)||C(this.state,t)};var R=l$1.__b;l$1.__b=function(n){n.type&&n.type.__f&&n.ref&&(n.props.ref=n.ref,n.ref=null),R&&R(n);};var T=l$1.__e;l$1.__e=function(n,t,e,r){if(n.then)for(var u,o=t;o=o.__;)if((u=o.__c)&&u.__c)return null==t.__e&&(t.__e=e.__e,t.__k=e.__k),u.__c(n,t);T(n,t,e,r);};var I=l$1.unmount;function L(n,t,e){return n&&(n.__c&&n.__c.__H&&(n.__c.__H.__.forEach(function(n){"function"==typeof n.__c&&n.__c();}),n.__c.__H=null),null!=(n=g({},n)).__c&&(n.__c.__P===e&&(n.__c.__P=t),n.__c=null),n.__k=n.__k&&n.__k.map(function(n){return L(n,t,e)})),n}function U(n,t,e){return n&&(n.__v=null,n.__k=n.__k&&n.__k.map(function(n){return U(n,t,e)}),n.__c&&n.__c.__P===t&&(n.__e&&e.insertBefore(n.__e,n.__d),n.__c.__e=!0,n.__c.__P=e)),n}function D(){this.__u=0,this.t=null,this.__b=null;}function F(n){var t=n.__.__c;return t&&t.__a&&t.__a(n)}function V(){this.u=null,this.o=null;}l$1.unmount=function(n){var t=n.__c;t&&t.__R&&t.__R(),t&&!0===n.__h&&(n.type=null),I&&I(n);},(D.prototype=new k$1).__c=function(n,t){var e=t.__c,r=this;null==r.t&&(r.t=[]),r.t.push(e);var u=F(r.__v),o=!1,i=function(){o||(o=!0,e.__R=null,u?u(l):l());};e.__R=i;var l=function(){if(!--r.__u){if(r.state.__a){var n=r.state.__a;r.__v.__k[0]=U(n,n.__c.__P,n.__c.__O);}var t;for(r.setState({__a:r.__b=null});t=r.t.pop();)t.forceUpdate();}},c=!0===t.__h;r.__u++||c||r.setState({__a:r.__b=r.__v.__k[0]}),n.then(i,i);},D.prototype.componentWillUnmount=function(){this.t=[];},D.prototype.render=function(n,e){if(this.__b){if(this.__v.__k){var r=document.createElement("div"),o=this.__v.__k[0].__c;this.__v.__k[0]=L(this.__b,r,o.__O=o.__P);}this.__b=null;}var i=e.__a&&y(_$1,null,n.fallback);return i&&(i.__h=null),[y(_$1,null,e.__a?null:n.children),i]};var W=function(n,t,e){if(++e[1]===e[0]&&n.o.delete(t),n.props.revealOrder&&("t"!==n.props.revealOrder[0]||!n.o.size))for(e=n.u;e;){for(;e.length>3;)e.pop()();if(e[1]<e[0])break;n.u=e=e[2];}};function P(n){return this.getChildContext=function(){return n.context},n.children}function j(n){var e=this,r=n.i;e.componentWillUnmount=function(){B$2(null,e.l),e.l=null,e.i=null;},e.i&&e.i!==r&&e.componentWillUnmount(),n.__v?(e.l||(e.i=r,e.l={nodeType:1,parentNode:r,childNodes:[],appendChild:function(n){this.childNodes.push(n),e.i.appendChild(n);},insertBefore:function(n,t){this.childNodes.push(n),e.i.appendChild(n);},removeChild:function(n){this.childNodes.splice(this.childNodes.indexOf(n)>>>1,1),e.i.removeChild(n);}}),B$2(y(P,{context:e.context},n.__v),e.l)):e.l&&e.componentWillUnmount();}function z(n,e){var r=y(j,{__v:n,i:e});return r.containerInfo=e,r}(V.prototype=new k$1).__a=function(n){var t=this,e=F(t.__v),r=t.o.get(n);return r[0]++,function(u){var o=function(){t.props.revealOrder?(r.push(u),W(t,n,r)):u();};e?e(o):o();}},V.prototype.render=function(n){this.u=null,this.o=new Map;var t=P$1(n.children);n.revealOrder&&"b"===n.revealOrder[0]&&t.reverse();for(var e=t.length;e--;)this.o.set(t[e],this.u=[1,0,this.u]);return n.children},V.prototype.componentDidUpdate=V.prototype.componentDidMount=function(){var n=this;this.o.forEach(function(t,e){W(n,e,t);});};var B="undefined"!=typeof Symbol&&Symbol.for&&Symbol.for("react.element")||60103,H=/^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|dominant|fill|flood|font|glyph(?!R)|horiz|image|letter|lighting|marker(?!H|W|U)|overline|paint|pointer|shape|stop|strikethrough|stroke|text(?!L)|transform|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/,Z=/^on(Ani|Tra|Tou|BeforeInp|Compo)/,Y=/[A-Z0-9]/g,$="undefined"!=typeof document,q=function(n){return ("undefined"!=typeof Symbol&&"symbol"==typeof Symbol()?/fil|che|rad/:/fil|che|ra/).test(n)};k$1.prototype.isReactComponent={},["componentWillMount","componentWillReceiveProps","componentWillUpdate"].forEach(function(t){Object.defineProperty(k$1.prototype,t,{configurable:!0,get:function(){return this["UNSAFE_"+t]},set:function(n){Object.defineProperty(this,t,{configurable:!0,writable:!0,value:n});}});});var K=l$1.event;function Q(){}function X(){return this.cancelBubble}function nn(){return this.defaultPrevented}l$1.event=function(n){return K&&(n=K(n)),n.persist=Q,n.isPropagationStopped=X,n.isDefaultPrevented=nn,n.nativeEvent=n};var en={configurable:!0,get:function(){return this.class}},rn=l$1.vnode;l$1.vnode=function(n){var t=n.type,e=n.props,u=e;if("string"==typeof t){for(var o in u={},e){var i=e[o];if(!("value"===o&&"defaultValue"in e&&null==i||$&&"children"===o&&"noscript"===t)){var l=o.toLowerCase();"defaultValue"===o&&"value"in e&&null==e.value?o="value":"download"===o&&!0===i?i="":"ondoubleclick"===l?o="ondblclick":"onchange"!==l||"input"!==t&&"textarea"!==t||q(e.type)?"onfocus"===l?o="onfocusin":"onblur"===l?o="onfocusout":Z.test(o)?o=l:-1===t.indexOf("-")&&H.test(o)?o=o.replace(Y,"-$&").toLowerCase():null===i&&(i=void 0):l=o="oninput","oninput"===l&&u[o=l]&&(o="oninputCapture"),u[o]=i;}}"select"==t&&u.multiple&&Array.isArray(u.value)&&(u.value=P$1(e.children).forEach(function(n){n.props.selected=-1!=u.value.indexOf(n.props.value);})),"select"==t&&null!=u.defaultValue&&(u.value=P$1(e.children).forEach(function(n){n.props.selected=u.multiple?-1!=u.defaultValue.indexOf(n.props.value):u.defaultValue==n.props.value;})),n.props=u,e.class!=e.className&&(en.enumerable="className"in e,null!=e.className&&(u.class=e.className),Object.defineProperty(u,"className",en));}n.$$typeof=B,rn&&rn(n);};var un=l$1.__r;l$1.__r=function(n){un&&un(n),n.__c;};var on=l$1.diffed;l$1.diffed=function(n){on&&on(n);var t=n.props,e=n.__e;null!=e&&"textarea"===n.type&&"value"in t&&t.value!==e.value&&(e.value=null==t.value?"":t.value);};

const Portal = ({ children }) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const portalRoot = document.getElementById('portal');
    return z(children, portalRoot);
};

const reducer = (state, action) => {
    const { type, item } = action;
    let nextState = [...state];
    if (type === "add" /* ActionType.Add */ && !state.includes(item)) {
        nextState.push(item);
    }
    if (type === "remove" /* ActionType.Remove */ && state.includes(item)) {
        nextState = nextState.filter((domain) => domain !== item);
    }
    return nextState;
};
/**
 * Manages userscript's settings storage (allowed/silenced domains)
 */
const SettingBlock = ({ messages, option, }) => {
    const [isModalOpen, setIsModalOpen] = h(false);
    const [domains, dispatch] = s(reducer, [], option.getList);
    const showModal = T$1(() => setIsModalOpen(true), []);
    const hideModal = T$1(() => setIsModalOpen(false), []);
    const addItem = T$1((item) => {
        dispatch({ type: "add" /* ActionType.Add */, item });
        option.addItem(item);
    }, [option]);
    const removeItem = T$1((item) => {
        dispatch({ type: "remove" /* ActionType.Remove */, item });
        option.removeItem(item);
    }, [option]);
    return (o$1(_$1, { children: [isModalOpen && (o$1(Portal, { children: o$1(Modal, { hideModal: hideModal, addItem: addItem }) })), o$1("div", Object.assign({ class: "settings__block" }, { children: [o$1(SettingHeader, { messages: messages, showModal: showModal }), domains.map((item) => (o$1(SettingItem, { item: item, removeItem: removeItem }, item)))] }))] }));
};

// userscript options api methods,
// also used to detect userscript on options page
const OPTIONS_API_PROP = 'optionsApi';

const Options = () => (o$1(_$1, { children: [o$1(SettingBlock, { messages: {
                subtitle: translator.getMessage('silenced'),
                tooltip: translator.getMessage('silenced_tooltip'),
                controlItem: translator.getMessage('add'),
                emptyRow: translator.getMessage('silenced_empty'),
            }, option: window[OPTIONS_API_PROP]["allowed" /* OptionName.Allowed */] }), o$1(SettingBlock, { messages: {
                subtitle: translator.getMessage('allowed'),
                tooltip: translator.getMessage('allowed_tooltip'),
                controlItem: translator.getMessage('add'),
                emptyRow: translator.getMessage('allowed_empty'),
            }, option: window[OPTIONS_API_PROP]["silenced" /* OptionName.Silenced */] })] }));

const USERSCRIPT_DETECT_TIMEOUT_MS = 1000;
const USERSCRIPT_DETECT_INTERVAL_MS = 250;
const isUserscriptLoaded = () => typeof window[OPTIONS_API_PROP] !== 'undefined';
/**
 * Checks if popupblocker userscript is present on a page
 * by looking for options api on window
 * These are put into global scope on options page only
 */
const useDetectUserscript = (detectSetter) => {
    p(() => {
        let intervalId;
        let timeoutId;
        const stopWith = (detected) => {
            clearInterval(intervalId);
            clearTimeout(timeoutId);
            detectSetter(detected);
        };
        // Wait until userscript is detected
        intervalId = window.setInterval(() => {
            if (isUserscriptLoaded()) {
                stopWith(2 /* AppState.Installed */);
            }
        }, USERSCRIPT_DETECT_INTERVAL_MS);
        // or until time is out
        timeoutId = window.setTimeout(() => stopWith(1 /* AppState.NotInstalled */), USERSCRIPT_DETECT_TIMEOUT_MS);
        return () => stopWith(1 /* AppState.NotInstalled */);
    }, [detectSetter]);
};

var css_248z = ":root {\n    --white-color: #ffffff;\n    --t3: 0.3s ease;\n    --greenc1: #bde5c1;\n    --green5B: #66B574;\n    --green72: #68bc72;\n    --green74: #66B574;\n    --green02: rgba(104, 188, 113, 0.2);\n    --gray-base: #282828;\n    --gray66: #666666;\n    --graycc: #cccccc;\n    --grayf1: #f1f1f1;\n    --grayc5: rgba(197, 197, 197, 0.47);\n    --grey-shadow: 0 0 10px 3px rgba(162, 161, 161, 0.3);\n    --grey92: #929292;\n    --grey151: rgba(155, 155, 155, 0.22);\n}\n* {\n    box-sizing: border-box;\n}\nhtml {\n    font-size: 10px;\n    height: 100%;\n}\nbody {\n    height: 100%;\n    margin: 0;\n    font-size: 1.3rem;\n    line-height: 1.428571429;\n    color: #282828;\n    color: var(--gray-base);\n    font-family: \"Open Sans\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Ubuntu, \"Helvetica Neue\", Arial, sans-serif;\n    font-weight: 400;\n}\nbody.body--overflow {\n        overflow: hidden;\n    }\nul {\n    list-style: none;\n}\ninput {\n    outline: none;\n}\nbutton {\n    font-size: inherit;\n    color: inherit;\n    border: 0;\n    outline: none;\n    background-color: transparent;\n}\nselect::-ms-expand {\n    display: none;\n}\n.radio {\n    display: none;\n}\n.radio-label {\n        padding-left: 30px;\n        position: relative;\n    }\n.radio-label:after {\n            content: '';\n            cursor: pointer;\n            position: absolute;\n            left: 0;\n            top: 0;\n            width: 18px;\n            height: 18px;\n            border-radius: 100%;\n            box-shadow: 0 0 0 1px #cccccc;\n            box-shadow: 0 0 0 1px var(--graycc);\n            transition: 0.3s ease box-shadow;\n            transition: var(--t3) box-shadow;\n        }\n.radio-label:hover:after {\n                box-shadow: 0 0 0 1px #66B574;\n                box-shadow: 0 0 0 1px var(--green74);\n            }\n.radio:checked + .radio-label:before {\n            content: '';\n            position: absolute;\n            top: 4px;\n            left: 4px;\n            width: 10px;\n            height: 10px;\n            border-radius: 100%;\n            background-color: #66B574;\n            background-color: var(--green74);\n        }\n.radio:disabled + .radio-label:after {\n                background-color: #f1f1f1;\n                background-color: var(--grayf1);\n                cursor: default;\n            }\n.radio:disabled + .radio-label:hover:after {\n                    box-shadow: 0 0 0 1px #cccccc;\n                    box-shadow: 0 0 0 1px var(--graycc);\n                }\n.checkbox {\n    display: none;\n}\n.checkbox-label {\n        padding-left: 30px;\n        position: relative;\n    }\n.checkbox-label:after {\n            content: '';\n            cursor: pointer;\n            position: absolute;\n            left: 0;\n            top: -1px;\n            width: 19px;\n            height: 19px;\n            border-radius: 3px;\n            box-shadow: 0 0 0 1px #cccccc;\n            box-shadow: 0 0 0 1px var(--graycc);\n            transition: 0.3s ease box-shadow, 0.3s ease background-color;\n            transition: var(--t3) box-shadow, var(--t3) background-color;\n        }\n.checkbox-label:hover:after {\n                box-shadow: 0 0 0 1px #66B574;\n                box-shadow: 0 0 0 1px var(--green74);\n            }\n.checkbox:checked + .checkbox-label:after {\n                background-color: #66B574;\n                background-color: var(--green74);\n                box-shadow: 0 0 0 1px #66B574;\n                box-shadow: 0 0 0 1px var(--green74);\n            }\n.checkbox:checked + .checkbox-label:before {\n                content: '';\n                cursor: pointer;\n                position: absolute;\n                z-index: 1;\n                top: 5px;\n                left: 4px;\n                width: 11px;\n                height: 9px;\n                background-image: url(\"data:image/svg+xml;charset=utf-8,%3Csvg width='11' height='9' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='m.91 4.059 3.41 3.408L9.684.597' stroke='%23FFF' stroke-width='1.2' fill='none' fill-rule='evenodd' stroke-linecap='round'/%3E%3C/svg%3E\");\n            }\n.checkbox:checked + .checkbox-label:hover:after {\n                    background-color: #66B574;\n                    background-color: var(--green5B);\n                }\n.checkbox:disabled + .checkbox-label:after {\n                background-color: #f1f1f1;\n                background-color: var(--grayf1);\n                cursor: default;\n            }\n.checkbox:disabled + .checkbox-label:hover:after {\n                    box-shadow: 0 0 0 1px #cccccc;\n                    box-shadow: 0 0 0 1px var(--graycc);\n                }\n.userscript-options-page {\n    background-color: #e6e6e6;\n}\n.userscript-options-page .settings {\n        justify-content: center;\n    }\n@font-face {\n    font-family: \"Open Sans\";\n    src: url(\"./assets/fonts/regular/OpenSans-Regular.woff2\") format(\"woff2\"), url(\"./assets/fonts/regular/OpenSans-Regular.woff\") format(\"woff\");\n    font-weight: 400;\n    font-style: normal;\n}\n@font-face {\n    font-family: \"Open Sans\";\n    src: url(\"./assets/fonts/semibold/OpenSans-Semibold.woff2\") format(\"woff2\"), url(\"./assets/fonts/semibold/OpenSans-Semibold.woff\") format(\"woff\");\n    font-weight: 600;\n    font-style: normal;\n}\n@font-face {\n    font-family: \"Open Sans\";\n    src: url(\"./assets/fonts/bold/OpenSans-Bold.woff2\") format(\"woff2\"), url(\"./assets/fonts/bold/OpenSans-Bold.woff\") format(\"woff\");\n    font-weight: 700;\n    font-style: normal;\n}\n.settings {\n    display: flex;\n    margin: 40px auto;\n    width: 540px;\n    flex-direction: column;\n}\n.settings-modal {\n        position: fixed;\n        top: 0;\n        left: 0;\n        width: 100vw;\n        height: 100vh;\n        align-items: center;\n        justify-content: center;\n        flex-direction: column;\n    }\n.settings__in {\n        position: relative;\n        padding: 30px 40px;\n        background-color: #ffffff;\n        background-color: var(--white-color);\n    }\n.settings__in--popup {\n            width: 400px;\n            min-height: 0;\n            box-shadow: 0 0 10px 0px rgba(0, 0, 0, 0.15);\n        }\n.settings__close {\n        display: block;\n        position: absolute;\n        background-image: url(\"data:image/svg+xml;charset=utf-8,%3Csvg viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'%3E%3Cg stroke='%23979797' stroke-width='1.5' fill='none' fill-rule='evenodd' opacity='.661' stroke-linecap='square'%3E%3Cpath d='m1.473 1.273 13 13M1.473 14.273l13-13'/%3E%3C/g%3E%3C/svg%3E\");\n        cursor: pointer;\n        top: 20px;\n        right: 20px;\n        width: 15px;\n        height: 15px;\n    }\n.settings__title {\n        font-size: 2.3rem;\n        margin-bottom: 25px;\n    }\n.settings__subtitle {\n        max-width: 270px;\n        font-size: 1.6rem;\n        white-space: nowrap;\n        overflow: hidden;\n        text-overflow: ellipsis;\n    }\n.settings__subtitle--margin {\n            margin-bottom: 15px;\n            max-width: 100%;\n            white-space: normal;\n        }\n.settings__block {\n        margin-bottom: 60px;\n    }\n.settings__row {\n        position: relative;\n        display: flex;\n        justify-content: space-between;\n        box-shadow: inset 0 1px 0 0 rgba(197, 197, 197, 0.47);\n        box-shadow: inset 0 1px 0 0 var(--grayc5);\n        padding: 20px 0;\n        background-color: #ffffff;\n        background-color: var(--white-color);\n    }\n.settings__row:first-child {\n            box-shadow: none;\n        }\n.settings__row-empty {\n            position: absolute;\n            width: 100%;\n            padding: 20px 20px;\n            color: rgba(197, 197, 197, 0.47);\n            color: var(--grayc5);\n            left: 0;\n            bottom: -100%;\n            text-align: center;\n        }\n.settings__name {\n        max-width: 340px;\n        white-space: nowrap;\n        overflow: hidden;\n        text-overflow: ellipsis;\n    }\n.settings__control {\n        display: flex;\n    }\n.settings__control-item {\n            max-width: 80px;\n            display: block;\n            cursor: pointer;\n            padding: 0;\n            white-space: nowrap;\n            overflow: hidden;\n            text-overflow: ellipsis;\n\n            color: #66B574;\n\n            color: var(--green5B);\n        }\n.settings__control-item:last-child {\n                margin-left: 25px;\n            }\n.settings__del {\n        display: block;\n        width: 15px;\n        height: 16px;\n        background-repeat: no-repeat;\n        background-image: url(\"data:image/svg+xml;charset=utf-8,%3Csvg width='15' height='16' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd' opacity='.6'%3E%3Cpath d='M12.593 13.042c0 .64-.435 1.163-.969 1.163H3.962c-.536 0-.969-.52-.969-1.163V3.805h9.6v9.237ZM2.193 3.005v9.994c0 1.109.839 2.006 1.875 2.006h7.45c1.033 0 1.875-.898 1.875-2.006V3.005h-11.2Z' fill='%23868686'/%3E%3Cpath d='M11.393 3.405v-1.2a1.2 1.2 0 0 0-1.2-1.2h-4.8a1.2 1.2 0 0 0-1.2 1.2v1.2h7.2Z' stroke='%23868686' stroke-width='.8'/%3E%3Cpath d='M6.593 5.805v6.4M8.993 5.805v6.4M.993 3.405h13.6' stroke='%23868686' stroke-width='.8' stroke-linecap='round'/%3E%3C/g%3E%3C/svg%3E\");\n        cursor: pointer;\n        padding: 0;\n    }\n.settings__input {\n        display: block;\n        font-size: 1.3rem;\n        width: 100%;\n        border: 0;\n        padding: 10px 0;\n        margin-bottom: 25px;\n        box-shadow: inset 0 -1px 0 0 rgba(197, 197, 197, 0.47);\n        box-shadow: inset 0 -1px 0 0 var(--grayc5);\n        font-family: \"Open Sans\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Ubuntu, \"Helvetica Neue\", Arial, sans-serif;\n        font-weight: 400;\n    }\n.settings__submit {\n        cursor: pointer;\n        width: 100%;\n        height: 40px;\n        padding: 10px;\n        font-size: 1.5rem;\n        color: #ffffff;\n        color: var(--white-color);\n        border: 0;\n        background-color: #66B574;\n        background-color: var(--green74);\n        transition: 0.3s ease background-color;\n        transition: var(--t3) background-color;\n        white-space: nowrap;\n        overflow: hidden;\n        text-overflow: ellipsis;\n\n        font-family: \"Open Sans\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Ubuntu, \"Helvetica Neue\", Arial, sans-serif;\n\n        font-weight: 400;\n    }\n.settings__submit:hover {\n            background-color: #58a273;\n        }\n.settings__list-title {\n            font-size: 1.6rem;\n            margin-bottom: 15px;\n            font-family: \"Open Sans\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Ubuntu, \"Helvetica Neue\", Arial, sans-serif;\n            font-weight: 700;\n        }\n.settings__list-subtitle {\n            margin-bottom: 15px;\n        }\n.settings__list-in {\n            list-style: none;\n            margin-bottom: 15px;\n        }\n.settings__list-link {\n            text-decoration: none;\n            max-width: 80px;\n            cursor: pointer;\n            color: #66B574;\n        }\n.settings__list-link:hover {\n                text-decoration: underline;\n            }\n.tooltip {\n    cursor: pointer;\n    display: inline-block;\n    vertical-align: middle;\n    width: 15px;\n    height: 14px;\n    background-size: cover;\n    position: relative;\n    margin-left: 10px;\n    background-image: url(\"data:image/svg+xml;charset=utf-8,%3Csvg width='17' height='16' xmlns='http://www.w3.org/2000/svg'%3E%3Cg transform='translate(1)' fill='none' fill-rule='evenodd'%3E%3Cpath d='M6.596 9.116v-.35c0-.303.065-.566.194-.79.13-.224.366-.462.71-.715.331-.236.55-.429.655-.577a.836.836 0 0 0 .159-.497.538.538 0 0 0-.227-.469c-.152-.107-.363-.16-.634-.16-.474 0-1.013.154-1.619.463l-.516-1.036a4.509 4.509 0 0 1 2.239-.592c.65 0 1.166.156 1.55.469.383.312.575.729.575 1.25 0 .346-.08.646-.237.898-.158.253-.457.537-.9.852-.302.224-.494.395-.574.511a.794.794 0 0 0-.12.46v.283H6.595Zm-.151 1.619c0-.265.07-.465.213-.601.142-.136.348-.204.62-.204.261 0 .464.07.608.209.143.138.215.337.215.596 0 .25-.073.446-.218.59-.145.143-.347.214-.605.214-.265 0-.47-.07-.616-.21-.145-.14-.217-.339-.217-.594Z' fill='%23979797'/%3E%3Ccircle stroke='%23979797' stroke-width='1.077' cx='7.5' cy='7.966' r='7'/%3E%3C/g%3E%3C/svg%3E\");\n}\n.tooltip-container {\n        display: flex;\n        align-items: center;\n    }\n.tooltip:before {\n        display: block;\n        position: absolute;\n        width: 200px;\n        top: -100%;\n        z-index: 1;\n        left: calc(100% + 15px);\n        visibility: hidden;\n        text-align: left;\n        opacity: 0;\n        content: attr(data-tooltip);\n        border-radius: 3px;\n        padding: 10px 15px;\n        color: #282828;\n        color: var(--gray-base);\n        background-color: #ffffff;\n        background-color: var(--white-color);\n        transition: 0.3s ease opacity;\n        transition: var(--t3) opacity;\n        box-shadow: 0 0 10px 3px rgba(162, 161, 161, 0.3);\n        box-shadow: var(--grey-shadow);\n    }\n.tooltip:after {\n        content: \"\";\n        position: relative;\n        top: 0;\n        right: -22px;\n        z-index: 1;\n        display: block;\n        visibility: hidden;\n        opacity: 0;\n        width: 0;\n        height: 0;\n        border-top: 8px solid transparent;\n        border-right: 8px solid #ffffff;\n        border-right: 8px solid var(--white-color);\n        border-bottom: 8px solid transparent;\n        transition: 0.3s ease opacity;\n        transition: var(--t3) opacity;\n    }\n.tooltip:hover:before {\n            visibility: visible;\n            opacity: 1;\n        }\n.tooltip:hover:after {\n            visibility: visible;\n            opacity: 1;\n        }\n";
styleInject(css_248z);

const App = () => {
    const [state, setState] = h(0 /* AppState.Detecting */);
    useDetectUserscript(setState);
    return (o$1(_$1, { children: [o$1("div", Object.assign({ class: "settings" }, { children: [o$1("div", Object.assign({ class: "settings__in" }, { children: [o$1("div", Object.assign({ class: "settings__title" }, { children: translator.getMessage('userscript_name') })), state === 0 /* AppState.Detecting */ && o$1(LoadingSubtitle, {}), state === 1 /* AppState.NotInstalled */ && o$1(NotInstalled, {}), state === 2 /* AppState.Installed */ && o$1(Options, {})] })), o$1(Footer, {})] })), o$1("div", { id: "portal" })] }));
};

const DEFAULT_PAGE_TITLE = 'AdGuard Popup Blocker';
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = document.getElementById('root');
document.documentElement.lang = i18n.getUILanguage();
document.title = translator.getMessage('userscript_name') || DEFAULT_PAGE_TITLE;
B$2(o$1(App, {}), root);
