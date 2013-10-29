/*!
* Aloha Editor
* Author & Copyright (c) 2010 Gentics Software GmbH
* aloha-sales@gentics.com
* Licensed unter the terms of http://www.aloha-editor.com/license.html
*/
/**
 * The dom-to-xhtml plugin extends the serialization method of the
 * Aloha.Editable.getContent() instance method to generate valid XHTML
 * (in so far as the DOM of the editables itself is valid).
 */
define(["aloha","aloha/jquery","aloha/plugin","dom-to-xhtml/dom-to-xhtml"],function(e,t,n,r){return n.create("dom-to-xhtml",{init:function(){e.Editable.setContentSerializer(function(e){return r.contentsToXhtml(e)})}})});