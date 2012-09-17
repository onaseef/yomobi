/**
 * editor_plugin_src.js
 *
 * Copyright 2009, Moxiecode Systems AB
 * Released under LGPL License.
 *
 * License: http://tinymce.moxiecode.com/license
 * Contributing: http://tinymce.moxiecode.com/contributing
 *
 * This plugin will force TinyMCE to produce deprecated legacy output such as font elements, u elements, align
 * attributes and so forth. There are a few cases where these old items might be needed for example in email applications or with Flash
 *
 * However you should NOT use this plugin if you are building some system that produces web contents such as a CMS. All these elements are
 * not apart of the newer specifications for HTML and XHTML.
 */
(function(e){e.onAddEditor.addToTop(function(e,t){t.settings.inline_styles=!1}),e.create("tinymce.plugins.LegacyOutput",{init:function(t){t.onInit.add(function(){var n="p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img",r=e.explode(t.settings.font_size_style_values),i=t.schema;t.formatter.register({alignleft:{selector:n,attributes:{align:"left"}},aligncenter:{selector:n,attributes:{align:"center"}},alignright:{selector:n,attributes:{align:"right"}},alignfull:{selector:n,attributes:{align:"justify"}},bold:[{inline:"b",remove:"all"},{inline:"strong",remove:"all"},{inline:"span",styles:{fontWeight:"bold"}}],italic:[{inline:"i",remove:"all"},{inline:"em",remove:"all"},{inline:"span",styles:{fontStyle:"italic"}}],underline:[{inline:"u",remove:"all"},{inline:"span",styles:{textDecoration:"underline"},exact:!0}],strikethrough:[{inline:"strike",remove:"all"},{inline:"span",styles:{textDecoration:"line-through"},exact:!0}],fontname:{inline:"font",attributes:{face:"%value"}},fontsize:{inline:"font",attributes:{size:function(t){return e.inArray(r,t.value)+1}}},forecolor:{inline:"font",styles:{color:"%value"}},hilitecolor:{inline:"font",styles:{backgroundColor:"%value"}}}),e.each("b,i,u,strike".split(","),function(e){i.addValidElements(e+"[*]")}),i.getElementRule("font")||i.addValidElements("font[face|size|color|style]"),e.each(n.split(","),function(e){var t=i.getElementRule(e),n;t&&(t.attributes.align||(t.attributes.align={},t.attributesOrder.push("align")))}),t.onNodeChange.add(function(t,n){var i,s,o,u;s=t.dom.getParent(t.selection.getNode(),"font"),s&&(o=s.face,u=s.size),(i=n.get("fontselect"))&&i.select(function(e){return e==o}),(i=n.get("fontsizeselect"))&&i.select(function(t){var n=e.inArray(r,t.fontSize);return n+1==u})})})},getInfo:function(){return{longname:"LegacyOutput",author:"Moxiecode Systems AB",authorurl:"http://tinymce.moxiecode.com",infourl:"http://wiki.moxiecode.com/index.php/TinyMCE:Plugins/legacyoutput",version:e.majorVersion+"."+e.minorVersion}}}),e.PluginManager.add("legacyoutput",e.plugins.LegacyOutput)})(tinymce);