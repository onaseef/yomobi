/**
 * editor_plugin_src.js
 *
 * Copyright 2009, Moxiecode Systems AB
 * Released under LGPL License.
 *
 * License: http://tinymce.moxiecode.com/license
 * Contributing: http://tinymce.moxiecode.com/contributing
 */
(function(){tinymce.PluginManager.requireLangPack("example"),tinymce.create("tinymce.plugins.ExamplePlugin",{init:function(e,t){e.addCommand("mceExample",function(){e.windowManager.open({file:t+"/dialog.htm",width:320+parseInt(e.getLang("example.delta_width",0)),height:120+parseInt(e.getLang("example.delta_height",0)),inline:1},{plugin_url:t,some_custom_arg:"custom arg"})}),e.addButton("example",{title:"example.desc",cmd:"mceExample",image:t+"/img/example.gif"}),e.onNodeChange.add(function(e,t,n){t.setActive("example",n.nodeName=="IMG")})},createControl:function(e,t){return null},getInfo:function(){return{longname:"Example plugin",author:"Some author",authorurl:"http://tinymce.moxiecode.com",infourl:"http://wiki.moxiecode.com/index.php/TinyMCE:Plugins/example",version:"1.0"}}}),tinymce.PluginManager.add("example",tinymce.plugins.ExamplePlugin)})();