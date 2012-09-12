/*!
* Aloha Editor
* Author & Copyright (c) 2010 Gentics Software GmbH
* aloha-sales@gentics.com
* Licensed unter the terms of http://www.aloha-editor.com/license.html
*/
/**
 * Paste Plugin
 * ------------
 * The paste plugin intercepts all browser paste events that target aloha-
 * editables, and redirects the events into a hidden div. Once pasting is done
 * into this div, its contents will be processed by registered content handlers
 * before being copied into the active editable, at the current range.
 */
define(["aloha/core","aloha/plugin","aloha/jquery","aloha/command","aloha/console"],function(e,t,n,r,i){function l(){u=e.getSelection().getRangeAt(0),a=e.activeEditable,f.css({top:o.scrollTop(),left:o.scrollLeft()-200}),f.contents().remove(),a&&a.obj.blur(),s.Utils.Dom.setCursorInto(f.get(0)),f.focus()}function c(){var t=this,r;if(u&&a){a.obj.click(),r=f.html(),n.browser.msie&&/^&nbsp;/.test(r)&&(r=r.substring(6));var s=u.startContainer;s.nodeType==3&&s.parentNode.nodeName=="P"&&s.parentNode.childNodes.length==1&&/^(\s|%A0)$/.test(escape(s.data))&&(s.data="",u.startOffset=0,u.endContainer==s&&(u.endOffset=0)),e.queryCommandSupported("insertHTML")?e.execCommand("insertHTML",!1,r,u):i.error("Common.Paste",'Command "insertHTML" not available. Enable the plugin "common/commands".')}u=void 0,a=void 0,f.contents().remove()}var s=window.GENTICS,o=n(window),u=null,a=null,f=n('<div id="pasteContainer" style="position:absolute; clip:rect(0px, 0px, 0px, 0px); width: 1px; height: 1px;"></div>').contentEditable(!0);return t.create("paste",{settings:{},init:function(){var t=this;n("body").append(f),e.bind("aloha-editable-created",function(r,i){n.browser.msie?t.settings.noclipboardaccess?i.obj.bind("beforepaste",function(e){l(),e.stopPropagation()}):i.obj.bind("paste",function(t){l();var n=document.selection.createRange();return n.execCommand("paste"),c(),t.metaKey=void 0,e.activeEditable.smartContentChange(t),t.stopPropagation(),!1}):i.obj.bind("paste",function(t){l(),window.setTimeout(function(){c(),e.activeEditable.smartContentChange(t)},10),t.stopPropagation()})}),n.browser.msie&&t.settings.noclipboardaccess&&f.bind("paste",function(t){window.setTimeout(function(){c(),e.activeEditable.smartContentChange(t),t.stopPropagation()},10)})},register:function(e){i.deprecated("Plugins.Paste","register() for pasteHandler is deprecated. Use the ContentHandler Plugin instead.")}})});