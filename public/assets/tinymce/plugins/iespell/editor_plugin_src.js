/**
 * editor_plugin_src.js
 *
 * Copyright 2009, Moxiecode Systems AB
 * Released under LGPL License.
 *
 * License: http://tinymce.moxiecode.com/license
 * Contributing: http://tinymce.moxiecode.com/contributing
 */
(function(){tinymce.create("tinymce.plugins.IESpell",{init:function(e,t){var n=this,r;if(!tinymce.isIE)return;n.editor=e,e.addCommand("mceIESpell",function(){try{r=new ActiveXObject("ieSpell.ieSpellExtension"),r.CheckDocumentNode(e.getDoc().documentElement)}catch(t){t.number==-2146827859?e.windowManager.confirm(e.getLang("iespell.download"),function(e){e&&window.open("http://www.iespell.com/download.php","ieSpellDownload","")}):e.windowManager.alert("Error Loading ieSpell: Exception "+t.number)}}),e.addButton("iespell",{title:"iespell.iespell_desc",cmd:"mceIESpell"})},getInfo:function(){return{longname:"IESpell (IE Only)",author:"Moxiecode Systems AB",authorurl:"http://tinymce.moxiecode.com",infourl:"http://wiki.moxiecode.com/index.php/TinyMCE:Plugins/iespell",version:tinymce.majorVersion+"."+tinymce.minorVersion}}}),tinymce.PluginManager.add("iespell",tinymce.plugins.IESpell)})();