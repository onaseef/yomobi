/*!
* Aloha Editor
* Author & Copyright (c) 2010 Gentics Software GmbH
* aloha-sales@gentics.com
* Licensed unter the terms of http://www.aloha-editor.com/license.html
*/
/**
 * @name block
 * @namespace Block plugin
 */
define(["aloha","aloha/plugin","aloha/jquery","aloha/contenthandlermanager","block/blockmanager","block/sidebarattributeeditor","block/block","block/editormanager","block/blockcontenthandler","block/editor","css!block/css/block.css","block/jquery-ui-1.8.16.custom.min"],function(e,t,n,r,i,s,o,u,a,f){var l=t.create("block",{settings:{},init:function(){var t=this;i.registerBlockType("DebugBlock",o.DebugBlock),i.registerBlockType("DefaultBlock",o.DefaultBlock),u.register("string",f.StringEditor),u.register("number",f.NumberEditor),u.register("url",f.UrlEditor),u.register("email",f.EmailEditor),u.register("select",f.SelectEditor),u.register("button",f.ButtonEditor),r.register("block",a),i.registerEventHandlers(),i.initializeBlockLevelDragDrop(),e.bind("aloha-ready",function(){t._createBlocks(),t.settings.sidebarAttributeEditor!==!1&&s.init()})},_createBlocks:function(){this.settings.defaults||(this.settings.defaults={}),n.each(this.settings.defaults,function(e,t){n(e).alohaBlock(t)})}});return n.fn.alohaBlock=function(e){return e=e||{},n(this).each(function(t,n){i._blockify(n,e)}),n(this)},l});