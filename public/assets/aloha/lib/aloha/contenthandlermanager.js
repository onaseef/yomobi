/*!
 * Aloha Editor
 * Author & Copyright (c) 2010 Gentics Software GmbH
 * aloha-sales@gentics.com
 * Licensed unter the terms of http://www.aloha-editor.com/license.html
 */
define(["aloha/jquery","aloha/registry"],function(e,t){return new(t.extend({createHandler:function(e){if(typeof e.handleContent!="function")throw"ContentHandler has no function handleContent().";var t=Class.extend({handleContent:function(e){}},e);return new t},handleContent:function(t,n){var r,i=this.getEntries();if(typeof n.contenthandler=="undefined"){n.contenthandler=[];for(r in i)i.hasOwnProperty(r)&&n.contenthandler.push(r)}for(r in i)if(i.hasOwnProperty(r)){if(e.inArray(r,n.contenthandler)<0)continue;typeof i[r].handleContent=="function"?t=i[r].handleContent(t,n):console.error("A valid content handler needs the method handleContent.")}return t}}))});