/**
 * editor_plugin_src.js
 *
 * Copyright 2009, Moxiecode Systems AB
 * Released under LGPL License.
 *
 * License: http://tinymce.moxiecode.com/license
 * Contributing: http://tinymce.moxiecode.com/contributing
 */
(function(){var e=tinymce.dom.Event;tinymce.create("tinymce.plugins.NonEditablePlugin",{init:function(e,t){var n=this,r,i,s;n.editor=e,r=e.getParam("noneditable_editable_class","mceEditable"),i=e.getParam("noneditable_noneditable_class","mceNonEditable"),e.onNodeChange.addToTop(function(e,t,r){var o,u;o=e.dom.getParent(e.selection.getStart(),function(t){return e.dom.hasClass(t,i)}),u=e.dom.getParent(e.selection.getEnd(),function(t){return e.dom.hasClass(t,i)});if(o||u)return s=1,n._setDisabled(1),!1;s==1&&(n._setDisabled(0),s=0)})},getInfo:function(){return{longname:"Non editable elements",author:"Moxiecode Systems AB",authorurl:"http://tinymce.moxiecode.com",infourl:"http://wiki.moxiecode.com/index.php/TinyMCE:Plugins/noneditable",version:tinymce.majorVersion+"."+tinymce.minorVersion}},_block:function(t,n){var r=n.keyCode;if(r>32&&r<41||r>111&&r<124)return;return e.cancel(n)},_setDisabled:function(e){var t=this,n=t.editor;tinymce.each(n.controlManager.controls,function(t){t.setDisabled(e)}),e!==t.disabled&&(e?(n.onKeyDown.addToTop(t._block),n.onKeyPress.addToTop(t._block),n.onKeyUp.addToTop(t._block),n.onPaste.addToTop(t._block),n.onContextMenu.addToTop(t._block)):(n.onKeyDown.remove(t._block),n.onKeyPress.remove(t._block),n.onKeyUp.remove(t._block),n.onPaste.remove(t._block),n.onContextMenu.remove(t._block)),t.disabled=e)}}),tinymce.PluginManager.add("noneditable",tinymce.plugins.NonEditablePlugin)})();