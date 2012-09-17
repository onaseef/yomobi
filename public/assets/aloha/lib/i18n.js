/**
 * @license RequireJS i18n 0.24.0 Copyright (c) 2010-2011, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/requirejs for details
 */
/*jslint regexp: false, nomen: false, plusplus: false, strict: false */
/*global require: false, navigator: false, define: false */
/**
 * This plugin handles i18n! prefixed modules. It does the following:
 *
 * 1) A regular module can have a dependency on an i18n bundle, but the regular
 * module does not want to specify what locale to load. So it just specifies
 * the top-level bundle, like "i18n!nls/colors".
 *
 * This plugin will load the i18n bundle at nls/colors, see that it is a root/master
 * bundle since it does not have a locale in its name. It will then try to find
 * the best match locale available in that master bundle, then request all the
 * locale pieces for that best match locale. For instance, if the locale is "en-us",
 * then the plugin will ask for the "en-us", "en" and "root" bundles to be loaded
 * (but only if they are specified on the master bundle).
 *
 * Once all the bundles for the locale pieces load, then it mixes in all those
 * locale pieces into each other, then finally sets the context.defined value
 * for the nls/colors bundle to be that mixed in locale.
 *
 * 2) A regular module specifies a specific locale to load. For instance,
 * i18n!nls/fr-fr/colors. In this case, the plugin needs to load the master bundle
 * first, at nls/colors, then figure out what the best match locale is for fr-fr,
 * since maybe only fr or just root is defined for that locale. Once that best
 * fit is found, all of its locale pieces need to have their bundles loaded.
 *
 * Once all the bundles for the locale pieces load, then it mixes in all those
 * locale pieces into each other, then finally sets the context.defined value
 * for the nls/fr-fr/colors bundle to be that mixed in locale.
 */
(function(){function t(e,t,n,r,i,s){t[e]&&(n.push(e),(t[e]===!0||t[e]===1)&&r.push(i+e+"/"+s))}function n(e,t,n,r,i){var s=r+t+"/"+i;require._fileExists(e.nameToUrl(s,null))&&n.push(s)}var e=/(^.*(^|\/)nls(\/|$))([^\/]*)\/?([^\/]*)/;define({version:"0.24.0",load:function(r,i,s,o){o=o||{};var u,a=e.exec(r),f=a[1],l=a[4],c=a[5],h=l.split("-"),p=[],d={},v,m,g="";a[5]?(f=a[1],u=f+c):(u=r,c=a[4],l=o.locale||(o.locale=typeof navigator=="undefined"?"root":(navigator.language||navigator.userLanguage||"root").toLowerCase()),h=l.split("-"));if(o.isBuild){p.push(u),n(i,"root",p,f,c);for(v=0;m=h[v];v++)g+=(g?"-":"")+m,n(i,g,p,f,c);i(p),s()}else i([u],function(e){var n=[];t("root",e,n,p,f,c);for(v=0;m=h[v];v++)g+=(g?"-":"")+m,t(g,e,n,p,f,c);i(p,function(){var t,r;for(t=n.length-1;t>-1&&(m=n[t]);t--){r=e[m];if(r===!0||r===1)r=i(f+m+"/"+c);require.mixin(d,r)}d.t=function(e){return this[e]?this[e]:e},s(d)})})}})})();