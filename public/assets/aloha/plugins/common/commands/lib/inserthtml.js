/*!
* Aloha Editor
* Author & Copyright (c) 2010 Gentics Software GmbH
* aloha-sales@gentics.com
* Licensed unter the terms of http://www.aloha-editor.com/license.html
*/
define(["aloha/core","aloha/jquery","aloha/command","aloha/selection","util/dom","aloha/contenthandlermanager","aloha/console"],function(e,t,n,r,i,s,o){n.register("inserthtml",{action:function(n,r){function h(e){var n=t(e),s;if(!i.insertIntoDOM(n,r,u,!1)){s=n.contents(),(i.isBlockLevelElement(e)||i.isListElement(e))&&h(t("<br/>").get(0));for(f=s.length-1;f>=0;--f)h(s[f])}}var u=t(i.getEditingHostOf(r.startContainer)),a=r.commonAncestorContainer,f,l,c=[];n=s.handleContent(n,{contenthandler:e.settings.contentHandler.insertHtml});if(typeof n=="string")n=t("<div>"+n+"</div>");else{if(!(n instanceof t))throw"INVALID_VALUE_ERR";n=t("<div>").append(n)}c=n.contents(),i.removeRange(r);for(f=c.length-1;f>=0;--f)h(c[f]);c.length>0?r=i.setCursorAfter(c.get(c.length-1)):r.select(),i.doCleanup({merge:!0,removeempty:!0},r,a);try{r.select()}catch(p){o.warn("Error:",p)}}})});