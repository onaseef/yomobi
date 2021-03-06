/**
 * editor_plugin_src.js
 *
 * Copyright 2009, Moxiecode Systems AB
 * Released under LGPL License.
 *
 * License: http://tinymce.moxiecode.com/license
 * Contributing: http://tinymce.moxiecode.com/contributing
 */
(function(){tinymce.create("tinymce.plugins.StylePlugin",{init:function(t,n){t.addCommand("mceStyleProps",function(){t.windowManager.open({file:n+"/props.htm",width:480+parseInt(t.getLang("style.delta_width",0)),height:320+parseInt(t.getLang("style.delta_height",0)),inline:1},{plugin_url:n,style_text:t.selection.getNode().style.cssText})}),t.addCommand("mceSetElementStyle",function(n,r){if(e=t.selection.getNode())t.dom.setAttrib(e,"style",r),t.execCommand("mceRepaint")}),t.onNodeChange.add(function(e,t,n){t.setDisabled("styleprops",n.nodeName==="BODY")}),t.addButton("styleprops",{title:"style.desc",cmd:"mceStyleProps"})},getInfo:function(){return{longname:"Style",author:"Moxiecode Systems AB",authorurl:"http://tinymce.moxiecode.com",infourl:"http://wiki.moxiecode.com/index.php/TinyMCE:Plugins/style",version:tinymce.majorVersion+"."+tinymce.minorVersion}}}),tinymce.PluginManager.add("style",tinymce.plugins.StylePlugin)})();