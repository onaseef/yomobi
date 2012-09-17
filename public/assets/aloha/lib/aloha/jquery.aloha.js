/*!
* This file is part of Aloha Editor Project http://aloha-editor.org
* Copyright Â© 2010-2011 Gentics Software GmbH, aloha@gentics.com
* Contributors http://aloha-editor.org/contribution.php 
* Licensed unter the terms of http://www.aloha-editor.org/license.html
*/
/*
* Aloha Editor is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.*
*
* Aloha Editor is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
* GNU Affero General Public License for more details.
*
* You should have received a copy of the GNU Affero General Public License
* along with this program. If not, see <http://www.gnu.org/licenses/>.
*/
define(["aloha/core","aloha/selection","aloha/jquery","aloha/console"],function(e,t,n,r){var i=window.XMLSerializer;n.fn.between=function(e,t){var n,r;this[0].nodeType!==3?(n=this.children().size(),t>n&&(t=n),t<=0?this.prepend(e):this.children().eq(t-1).after(e)):t<=0?this.before(e):t>=this[0].length?this.after(e):(r=this[0].data,this[0].data=r.substring(0,t),this.after(r.substring(t,r.length)),this.after(e))},n.fn.contentEditable=function(e){var t=n(this),i="contenteditable";return n.browser.msie&&parseInt(n.browser.version,10)==7&&(i="contentEditable"),typeof e=="undefined"?typeof t[0]=="undefined"?(r.error("The jquery object did not contain any valid elements."),undefined):typeof t[0].isContentEditable=="undefined"?(r.warn("Could not determine whether the is editable or not. I assume it is."),!0):t[0].isContentEditable:(e===""?t.removeAttr(i):(e&&e!=="false"?e="true":e="false",t.attr(i,e)),t)},n.fn.aloha=function(){var t=n(this);return e.bind("aloha-ready",function(){t.each(function(){e.isEditable(this)||new e.Editable(n(this))})}),t},n.fn.mahalo=function(){return this.each(function(){e.isEditable(this)&&e.getEditableById(n(this).attr("id")).destroy()})},n.fn.contentEditableSelectionChange=function(e){var r=this;return this.keyup(function(n){var r=t.getRangeObject();e(n)}),this.dblclick(function(t){e(t)}),this.mousedown(function(e){r.selectionStarted=!0}),n(document).mouseup(function(n){t.eventOriginalTarget=r,r.selectionStarted&&e(n),t.eventOriginalTarget=!1,r.selectionStarted=!1}),this},n.fn.outerHtml=n.fn.outerHtml||function(){var e=n(this),t=e.get(0);if(typeof t.outerHTML!="undefined")return t.outerHTML;try{return(new i).serializeToString(t)}catch(r){try{return t.xml}catch(r){}}},n.fn.zap=function(){return this.each(function(){n(this.childNodes).insertBefore(this)}).remove()},n.fn.textNodes=function(e,t){var r=[],i=function(s){if(s.nodeType===3&&n.trim(s.data)&&!t||s.nodeType===3&&t||s.nodeName=="BR"&&!e)r.push(s);else for(var o=0,u=s.childNodes.length;o<u;++o)i(s.childNodes[o])};return i(this[0]),n(r)},n.extendObjects=n.fn.extendObjects=function(){var e,t,r,i,s,o,u=arguments[0]||{},a=1,f=arguments.length,l=!1;typeof u=="boolean"&&(l=u,u=arguments[1]||{},a=2),typeof u!="object"&&!n.isFunction(u)&&(u={}),f===a&&(u=this,--a);for(;a<f;a++)if((e=arguments[a])!=null)for(t in e){r=u[t],i=e[t];if(u===i)continue;l&&i&&(n.isPlainObject(i)||(s=n.isArray(i)))?(s?(s=!1,o=r&&n.isArray(r)?r:[]):o=r&&n.isPlainObject(r)?r:{},n.isArray(i)?u[t]=i:u[t]=n.extendObjects(l,o,i)):i!==undefined&&(u[t]=i)}return u},n.isBoolean=function(e){return e===!0||e===!1},n.isNumeric=function(e){return!isNaN(e-0)}});