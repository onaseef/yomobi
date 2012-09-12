/*
* Aloha Editor
* Author & Copyright (c) 2010 Gentics Software GmbH
* aloha-sales@gentics.com
* Licensed unter the terms of http://www.aloha-editor.com/license.html
*/
define(["aloha","aloha/jquery","aloha/plugin","aloha/floatingmenu","i18n!horizontalruler/nls/i18n","i18n!aloha/nls/i18n","css!horizontalruler/css/horizontalruler.css"],function(e,t,n,r,i,s){var o=window.GENTICS;return n.create("horizontalruler",{_constructor:function(){this._super("horizontalruler")},languages:["en"],config:["hr"],init:function(){var n=this;this.insertButton=new e.ui.Button({name:"hr",iconClass:"aloha-button-horizontalruler",size:"small",onclick:function(e,t){n.insertHR()},tooltip:i.t("button.addhr.tooltip"),toggle:!1}),r.addButton("Aloha.continuoustext",this.insertButton,s.t("floatingmenu.tab.insert"),1),e.bind("aloha-editable-activated",function(r,i){if(e.activeEditable){n.cfg=n.getEditableConfig(e.activeEditable.obj);if(t.inArray("hr",n.cfg)==-1){n.insertButton.hide();return}n.insertButton.show()}})},insertHR:function(n){var r=this,i=e.Selection.getRangeObject();if(e.activeEditable){var s=t("<hr>");o.Utils.Dom.insertIntoDOM(s,i,t(e.activeEditable.obj),!0),i.select()}}})});