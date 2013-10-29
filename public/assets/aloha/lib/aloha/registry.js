/*!
 * This file is part of Aloha Editor
 * Author & Copyright (c) 2010 Gentics Software GmbH, aloha@gentics.com
 * Licensed unter the terms of http://www.aloha-editor.com/license.html
 */
/**
 * Registry base class.
 * TODO: document that it also contains Observable.
 *
 */
define(["aloha/jquery","aloha/observable"],function(e,t){return Class.extend(t,{_entries:null,_constructor:function(){this._entries={}},register:function(e,t){this._entries[e]=t,this.trigger("register",t,e)},unregister:function(e){var t=this._entries[e];delete this._entries[e],this.trigger("unregister",t,e)},get:function(e){return this._entries[e]},has:function(e){return this._entries[e]?!0:!1},getEntries:function(){return e.extend({},this._entries)}})});