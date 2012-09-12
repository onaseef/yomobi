/*!
* This file is part of Aloha Editor Project http://aloha-editor.org
* Copyright Â© 2010-2011 Gentics Software GmbH, aloha@gentics.com
* Contributors http://aloha-editor.org/contribution.php 
* Licensed unter the terms of http://www.aloha-editor.org/license.html
*/
/*
* Aloha Editor is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.*
*
* Aloha Editor is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
* GNU Affero General Public License for more details.
*
* You should have received a copy of the GNU Affero General Public License
* along with this program. If not, see <http://www.gnu.org/licenses/>.
*/
define(["aloha/core","aloha/jquery","util/class","aloha/pluginmanager","aloha/console"],function(e,t,n,r,i){var s=n.extend({name:null,defaults:{},settings:{},dependencies:[],_constructor:function(e){typeof e!="string"?i.error("Cannot initialise unnamed plugin, skipping"):this.name=e},checkDependencies:function(){var n=!0,r=this;return t.each(this.dependencies,function(){e.isPluginLoaded(this)||(n=!1,i.error("plugin."+r.name,'Required plugin "'+this+'" not found.'))}),n},init:function(){},getEditableConfig:function(e){var n=null,r=!1,i=this;return this.settings.editables&&t.each(this.settings.editables,function(s,o){if(e.is(s)){r=!0;if(o instanceof Array)n=[],n=t.merge(n,o);else if(typeof o=="object"){n={};for(var u in o)o.hasOwnProperty(u)&&(o[u]instanceof Array||(typeof o[u]=="object"?(n[u]={},n[u]=t.extend(!0,n[u],i.config[u],o[u])):n[u]=o[u]))}else n=o}}),r||(typeof this.settings.config=="undefined"||!this.settings.config?n=this.config:n=this.settings.config),n},makeClean:function(e){},getUID:function(e){return i.deprecated("plugin","getUID() is deprecated. Use plugin.name instead."),this.name},i18n:function(t,n){return i.deprecated("plugin","i18n() is deprecated. Use plugin.t() instead."),e.i18n(this,t,n)},toString:function(){return this.name},log:function(e,t){i.deprecated("plugin","log() is deprecated. Use Aloha.console instead."),i.log(e,this,t)}});return s.create=function(n,i){var o=new(s.extend(i))(n);return o.settings=t.extendObjects(!0,o.defaults,e.settings[n]),r.register(o),o},s});