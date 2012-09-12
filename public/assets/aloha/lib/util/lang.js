/*!
 * This file is part of Aloha Editor
 * Author & Copyright (c) 2010 Gentics Software GmbH, aloha@gentics.com
 * Licensed unter the terms of http://www.aloha-editor.com/license.html
 */
// Ensure GENTICS Namespace
GENTICS=window.GENTICS||{},GENTICS.Utils=GENTICS.Utils||{},define("util/lang",[],function(){}),function(e,t){var n=e.alohaQuery||e.jQuery,r=n,i=e.GENTICS,s=e.Class,o=e.console;i.Utils.applyProperties=function(e,t){var n;for(n in t)t.hasOwnProperty(n)&&(e[n]=t[n])},i.Utils.uniqeString4=function(){return((1+Math.random())*65536|0).toString(16).substring(1)},i.Utils.guid=function(){var e=i.Utils.uniqeString4;return e()+e()+"-"+e()+"-"+e()+"-"+e()+"-"+e()+e()+e()}}(window);