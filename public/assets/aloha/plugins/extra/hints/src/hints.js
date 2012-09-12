/*!
* Aloha Editor
* Author & Copyright (c) 2010 Gentics Software GmbH
* aloha-sales@gentics.com
* Licensed unter the terms of http://www.aloha-editor.com/license.html
*/
// Start Closure
(function(e,t){var n=e.alohaQuery,r=n,i=e.GENTICS,s=e.Aloha;s.Hints=new(s.Plugin.extend({_constructor:function(){this._super("hints")},languages:["en","de"],init:function(){r("body").bind("aloha",function(e){s.editables[0].obj.poshytip({content:"Move your mouse and click in the yellow outlined areas to start editing.",className:"tip-twitter",showTimeout:1,alignTo:"target",alignX:"left",alignY:"center",offsetX:15}).poshytip("show")})}}))})(window);