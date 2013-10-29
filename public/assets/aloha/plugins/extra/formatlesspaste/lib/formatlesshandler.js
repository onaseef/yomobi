/*!
* Aloha Editor
* Author & Copyright (c) 2010 Gentics Software GmbH
* aloha-sales@gentics.com
* Licensed unter the terms of http://www.aloha-editor.com/license.html
*/
define(["aloha","aloha/jquery","aloha/contenthandlermanager"],function(e,t,n){var r=window.GENTICS,i=n.createHandler({enabled:!1,handleContent:function(e){typeof e=="string"?e=t("<div>"+e+"</div>"):e instanceof t&&(e=t("<div>").append(e));if(e.find(".aloha-block").length>0)return;return this.enabled&&this.removeFormatting(e),e.html()},removeFormatting:function(e){var n=this.strippedElements;e.find(n.join(",")).each(function(){t(this).contents().unwrap()})}});return i});