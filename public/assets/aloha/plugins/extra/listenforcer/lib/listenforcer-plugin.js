/*!
 * Aloha Editor
 * Author & Copyright (c) 2010 Gentics Software GmbH
 * aloha-sales@gentics.com
 * Licensed unter the terms of http://www.aloha-editor.com/license.html
 *
 *
 * Aloha List Enforcer
 * -------------------
 * Enforces a one top-level list per editable policy ;-)
 * This plugin will register editables and enforce lists in them. List enforced
 * editables will be permitted to contain, exactly one top-level element which
 * must be a (OL or a UL) list element.
 */
define(["aloha","aloha/jquery","aloha/plugin","aloha/floatingmenu","aloha/console"],function(e,t,n,r,i){function o(e,n){if(t.inArray(e[0],s)===-1)return;e.find(".GENTICS_temporary").remove();var r=!1;e.find("li").each(function(){if(t.trim(t(this).text())!=="")return r=!0,!1}),r||e.html(n);var i=e.find(">ul,>ol"),o=i.length,u;if(o>1){var a=t(i[0]);for(u=1;u<o;++u)a.append(t(i[u]).find(">li")),t(i[u]).remove()}e.find(">*:not(ul,ol)").remove()}var s=[];return n.create("listenforcer",{languages:["en","de"],_constructor:function(){this._super("listenforcer")},init:function(){var n=this,r=this.settings.editables||[],s,u,a=r.length;for(u=0;u<a;u++)s=r[u],typeof s=="string"||s.nodeName||s instanceof t?this.addEditableToEnforcementList(t(s)[0]):i.warn("Aloha List Enforcer Plugin",'Object "'+s.toString()+'" can not '+"be used as a jQuery selector with which to register"+" an editable to be list enforced.");e.bind("aloha-editable-activated",function(e,t){o(t.editable.obj,'<ul><li><br class="GENTICS_temporary" /></li></ul>')}),e.bind("aloha-editable-deactivated",function(e,t){o(t.editable.obj,"")}),e.bind("aloha-smart-content-changed",function(e,t){o(t.editable.obj,'<ul><li><br class="GENTICS_temporary" /></li></ul>')})},addEditableToEnforcementList:function(e){e&&s.push(e)}})});