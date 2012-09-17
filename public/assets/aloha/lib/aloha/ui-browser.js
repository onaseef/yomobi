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
define(["aloha/ext","aloha/ui"],function(e,t){var n=window.Class;t.Browser=n.extend({_constructor:function(){this.onSelect=null;var t=this;this.grid=new e.grid.GridPanel({region:"center",autoScroll:!0,store:new e.data.Store({proxy:new e.data.AlohaProxy,reader:new e.data.AlohaObjectReader}),columns:[{id:"name",header:"Name",width:100,sortable:!0,dataIndex:"name"},{header:"URL",renderer:function(e){return e},width:300,sortable:!0,dataIndex:"url"}],stripeRows:!0,autoExpandColumn:"name",height:350,width:600,title:"Objectlist",stateful:!0,stateId:"grid",selModel:new e.grid.RowSelectionModel({singleSelect:!0}),listeners:{dblclick:function(e){t.onItemSelect()}}}),this.grid.getSelectionModel().on({selectionchange:function(e,n,r){var i=t.grid.getSelectionModel().getSelected();i?this.win.buttons[1].enable():this.win.buttons[1].disable()},scope:this}),this.tree=new e.tree.TreePanel({region:"center",useArrows:!0,autoScroll:!0,animate:!0,enableDD:!0,containerScroll:!0,border:!1,loader:new e.tree.AlohaTreeLoader,root:{nodeType:"async",text:"Aloha Repositories",draggable:!1,id:"aloha"},rootVisible:!1,listeners:{beforeload:function(e){this.loader.baseParams={node:e.attributes}}}}),this.tree.getSelectionModel().on({selectionchange:function(e,n){if(n){var r=n.attributes;t.grid.store.load({params:{inFolderId:r.id,objectTypeFilter:t.objectTypeFilter,repositoryId:r.repositoryId}})}},scope:this}),this.nav=new e.Panel({title:"Navigation",region:"west",width:300,layout:"fit",collapsible:!0,items:[this.tree]}),this.win=new e.Window({title:"Resource Selector",layout:"border",width:800,height:300,closeAction:"hide",onEsc:function(){this.hide()},defaultButton:this.nav,plain:!0,initHidden:!0,items:[this.nav,this.grid],buttons:[{text:"Close",handler:function(){t.win.hide()}},{text:"Select",disabled:!0,handler:function(){t.onItemSelect()}}],toFront:function(t){return this.manager=this.manager||e.WindowMgr,this.manager.bringToFront(this),this.setZIndex(9999999999),this}}),this.onItemSelect=function(){var e=this.grid.getSelectionModel(),t=e?e.getSelected():null,n=t?t.data:null;this.win.hide(),typeof this.onSelect=="function"&&this.onSelect.call(this,n)}},setObjectTypeFilter:function(e){this.objectTypeFilter=e},getObjectTypeFilter:function(){return this.objectTypeFilter},show:function(){this.win.show(),this.win.toFront(!0),this.win.focus()}})});