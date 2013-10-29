/*!
 * Aloha Editor
 * Author & Copyright (c) 2010 Gentics Software GmbH
 * aloha-sales@gentics.com
 * Licensed unter the terms of http://www.aloha-editor.com/license.html
 */
define(["aloha/registry"],function(e){return new(e.extend({createEditor:function(e){if(!this.has(e.type))throw'Editor for type "'+e.type+'" not found.';var t=this.get(e.type);return new t(e)}}))});