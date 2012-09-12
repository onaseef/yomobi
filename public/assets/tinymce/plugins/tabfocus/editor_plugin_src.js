/**
 * editor_plugin_src.js
 *
 * Copyright 2009, Moxiecode Systems AB
 * Released under LGPL License.
 *
 * License: http://tinymce.moxiecode.com/license
 * Contributing: http://tinymce.moxiecode.com/contributing
 */
(function(){var e=tinymce.DOM,t=tinymce.dom.Event,n=tinymce.each,r=tinymce.explode;tinymce.create("tinymce.plugins.TabFocusPlugin",{init:function(i,s){function o(e,n){if(n.keyCode===9)return t.cancel(n)}function u(i,s){function c(t){function r(e){return e.nodeName==="BODY"||e.type!="hidden"&&e.style.display!="none"&&e.style.visibility!="hidden"&&r(e.parentNode)}function s(e){return e.attributes.tabIndex.specified||e.nodeName=="INPUT"||e.nodeName=="TEXTAREA"}function a(){return tinymce.isIE6||tinymce.isIE7}function l(e){return(!a()||s(e))&&e.getAttribute("tabindex")!="-1"&&r(e)}f=e.select(":input:enabled,*[tabindex]"),n(f,function(e,t){if(e.id==i.id)return o=t,!1});if(t>0){for(u=o+1;u<f.length;u++)if(l(f[u]))return f[u]}else for(u=o-1;u>=0;u--)if(l(f[u]))return f[u];return null}var o,u,a,f,l;if(s.keyCode===9){l=r(i.getParam("tab_focus",i.getParam("tabfocus_elements",":prev,:next"))),l.length==1&&(l[1]=l[0],l[0]=":prev"),s.shiftKey?l[0]==":prev"?f=c(-1):f=e.get(l[0]):l[1]==":next"?f=c(1):f=e.get(l[1]);if(f)return f.id&&(i=tinymce.get(f.id||f.name))?i.focus():window.setTimeout(function(){tinymce.isWebKit||window.focus(),f.focus()},10),t.cancel(s)}}i.onKeyUp.add(o),tinymce.isGecko?(i.onKeyPress.add(u),i.onKeyDown.add(o)):i.onKeyDown.add(u)},getInfo:function(){return{longname:"Tabfocus",author:"Moxiecode Systems AB",authorurl:"http://tinymce.moxiecode.com",infourl:"http://wiki.moxiecode.com/index.php/TinyMCE:Plugins/tabfocus",version:tinymce.majorVersion+"."+tinymce.minorVersion}}}),tinymce.PluginManager.add("tabfocus",tinymce.plugins.TabFocusPlugin)})();