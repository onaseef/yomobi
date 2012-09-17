/*!
 * Aloha Editor
 * Author & Copyright (c) 2010 Gentics Software GmbH
 * aloha-sales@gentics.com
 * Licensed unter the terms of http://www.aloha-editor.com/license.html
*/
define(["aloha/jquery","block/blockmanager","aloha/sidebar","block/editormanager"],function(e,t,n,r){return new(Class.extend({_sidebar:null,init:function(){this._sidebar=n.right.show(),t.bind("block-selection-change",this._onBlockSelectionChange,this)},_onBlockSelectionChange:function(t){var n=this;if(!this._sidebar)return;n._sidebar.container.find(".aloha-sidebar-panels").children().remove(),n._sidebar.panels={},e.each(t,function(){var t=this.getSchema(),i=this,s=[];if(!t)return;n._sidebar.addPanel({title:i.getTitle(),expanded:!0,onInit:function(){var n=e("<form />");n.submit(function(){return!1}),e.each(t,function(e,t){var o=r.createEditor(t);o.bind("change",function(t){i.attr(e,t)}),i.bind("change",function(){o.setValue(i.attr(e))}),n.append(o.render()),o.setValue(i.attr(e)),s.push(o)}),this.setContent(n)},deactivate:function(){e.each(s,function(e,t){t._deactivate()}),this.isActive=!1,this.content.parent("li").hide(),this.effectiveElement=null}})})}}))});