/**
 * editor_plugin_src.js
 *
 * Copyright 2009, Moxiecode Systems AB
 * Released under LGPL License.
 *
 * License: http://tinymce.moxiecode.com/license
 * Contributing: http://tinymce.moxiecode.com/contributing
 *
 * Adds auto-save capability to the TinyMCE text editor to rescue content
 * inadvertently lost. This plugin was originally developed by Speednet
 * and that project can be found here: http://code.google.com/p/tinyautosave/
 *
 * TECHNOLOGY DISCUSSION:
 * 
 * The plugin attempts to use the most advanced features available in the current browser to save
 * as much content as possible.  There are a total of four different methods used to autosave the
 * content.  In order of preference, they are:
 * 
 * 1. localStorage - A new feature of HTML 5, localStorage can store megabytes of data per domain
 * on the client computer. Data stored in the localStorage area has no expiration date, so we must
 * manage expiring the data ourselves.  localStorage is fully supported by IE8, and it is supposed
 * to be working in Firefox 3 and Safari 3.2, but in reality is is flaky in those browsers.  As
 * HTML 5 gets wider support, the AutoSave plugin will use it automatically. In Windows Vista/7,
 * localStorage is stored in the following folder:
 * C:\Users\[username]\AppData\Local\Microsoft\Internet Explorer\DOMStore\[tempFolder]
 * 
 * 2. sessionStorage - A new feature of HTML 5, sessionStorage works similarly to localStorage,
 * except it is designed to expire after a certain amount of time.  Because the specification
 * around expiration date/time is very loosely-described, it is preferrable to use locaStorage and
 * manage the expiration ourselves.  sessionStorage has similar storage characteristics to
 * localStorage, although it seems to have better support by Firefox 3 at the moment.  (That will
 * certainly change as Firefox continues getting better at HTML 5 adoption.)
 * 
 * 3. UserData - A very under-exploited feature of Microsoft Internet Explorer, UserData is a
 * way to store up to 128K of data per "document", or up to 1MB of data per domain, on the client
 * computer.  The feature is available for IE 5+, which makes it available for every version of IE
 * supported by TinyMCE.  The content is persistent across browser restarts and expires on the
 * date/time specified, just like a cookie.  However, the data is not cleared when the user clears
 * cookies on the browser, which makes it well-suited for rescuing autosaved content.  UserData,
 * like other Microsoft IE browser technologies, is implemented as a behavior attached to a
 * specific DOM object, so in this case we attach the behavior to the same DOM element that the
 * TinyMCE editor instance is attached to.
 */
(function(e){var t="autosave",n="restoredraft",r=!0,i,s,o=e.util.Dispatcher;e.create("tinymce.plugins.AutoSave",{init:function(u,a){function c(e){var t={s:1e3,m:6e4};return e=/^(\d+)([ms]?)$/.exec(""+e),(e[2]?t[e[2]]:1)*parseInt(e)}var f=this,l=u.settings;f.editor=u,e.each({ask_before_unload:r,interval:"30s",retention:"20m",minlength:50},function(e,n){n=t+"_"+n,l[n]===i&&(l[n]=e)}),l.autosave_interval=c(l.autosave_interval),l.autosave_retention=c(l.autosave_retention),u.addButton(n,{title:t+".restore_content",onclick:function(){u.getContent({draft:!0}).replace(/\s|&nbsp;|<\/?p[^>]*>|<br[^>]*>/gi,"").length>0?u.windowManager.confirm(t+".warning_message",function(e){e&&f.restoreDraft()}):f.restoreDraft()}}),u.onNodeChange.add(function(){var e=u.controlManager;e.get(n)&&e.setDisabled(n,!f.hasDraft())}),u.onInit.add(function(){u.controlManager.get(n)&&(f.setupStorage(u),setInterval(function(){f.storeDraft(),u.nodeChanged()},l.autosave_interval))}),f.onStoreDraft=new o(f),f.onRestoreDraft=new o(f),f.onRemoveDraft=new o(f),s||(window.onbeforeunload=e.plugins.AutoSave._beforeUnloadHandler,s=r)},getInfo:function(){return{longname:"Auto save",author:"Moxiecode Systems AB",authorurl:"http://tinymce.moxiecode.com",infourl:"http://wiki.moxiecode.com/index.php/TinyMCE:Plugins/autosave",version:e.majorVersion+"."+e.minorVersion}},getExpDate:function(){return(new Date((new Date).getTime()+this.editor.settings.autosave_retention)).toUTCString()},setupStorage:function(n){var i=this,s=t+"_test",o="OK";i.key=t+n.id,e.each([function(){if(localStorage){localStorage.setItem(s,o);if(localStorage.getItem(s)===o)return localStorage.removeItem(s),localStorage}},function(){if(sessionStorage){sessionStorage.setItem(s,o);if(sessionStorage.getItem(s)===o)return sessionStorage.removeItem(s),sessionStorage}},function(){if(e.isIE)return n.getElement().style.behavior="url('#default#userData')",{autoExpires:r,setItem:function(e,t){var r=n.getElement();r.setAttribute(e,t),r.expires=i.getExpDate();try{r.save("TinyMCE")}catch(s){}},getItem:function(e){var t=n.getElement();try{return t.load("TinyMCE"),t.getAttribute(e)}catch(r){return null}},removeItem:function(e){n.getElement().removeAttribute(e)}}}],function(e){try{i.storage=e();if(i.storage)return!1}catch(t){}})},storeDraft:function(){var e=this,t=e.storage,n=e.editor,r,i;if(t){if(!t.getItem(e.key)&&!n.isDirty())return;i=n.getContent({draft:!0}),i.length>n.settings.autosave_minlength&&(r=e.getExpDate(),e.storage.autoExpires||e.storage.setItem(e.key+"_expires",r),e.storage.setItem(e.key,i),e.onStoreDraft.dispatch(e,{expires:r,content:i}))}},restoreDraft:function(){var e=this,t=e.storage,n;t&&(n=t.getItem(e.key),n&&(e.editor.setContent(n),e.onRestoreDraft.dispatch(e,{content:n})))},hasDraft:function(){var e=this,t=e.storage,n,i;if(t){i=!!t.getItem(e.key);if(i){if(!!e.storage.autoExpires)return r;n=new Date(t.getItem(e.key+"_expires"));if((new Date).getTime()<n.getTime())return r;e.removeDraft()}}return!1},removeDraft:function(){var e=this,t=e.storage,n=e.key,r;t&&(r=t.getItem(n),t.removeItem(n),t.removeItem(n+"_expires"),r&&e.onRemoveDraft.dispatch(e,{content:r}))},"static":{_beforeUnloadHandler:function(t){var n;return e.each(tinyMCE.editors,function(e){e.plugins.autosave&&e.plugins.autosave.storeDraft();if(e.getParam("fullscreen_is_enabled"))return;!n&&e.isDirty()&&e.getParam("autosave_ask_before_unload")&&(n=e.getLang("autosave.unload_msg"))}),n}}}),e.PluginManager.add("autosave",e.plugins.AutoSave)})(tinymce);