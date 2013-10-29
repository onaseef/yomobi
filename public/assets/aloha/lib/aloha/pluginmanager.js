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
// Do not add dependencies that require depend on aloha/core
define(["aloha/jquery","util/class"],function(e,t){return new(t.extend({plugins:{},init:function(e,t){var n=this,r=Aloha&&Aloha.settings?Aloha.settings.plugins||{}:{},i,s,o;for(o in r)r.hasOwnProperty(o)&&(s=this.plugins[o]||!1,s&&(s.settings=r[o]||{}));if(!t.length)for(o in this.plugins)this.plugins.hasOwnProperty(o)&&t.push(o);for(i=0;i<t.length;++i)o=t[i],s=this.plugins[o]||!1,s&&(s.settings=s.settings||{},typeof s.settings.enabled=="undefined"&&(s.settings.enabled=!0),s.settings.enabled&&s.checkDependencies()&&s.init());e()},register:function(e){if(!e.name)throw new Error("Plugin does not have an name.");if(this.plugins[e.name])throw new Error('Already registered the plugin "'+e.name+'"!');this.plugins[e.name]=e},makeClean:function(e){var t,n;for(n in this.plugins)this.plugins.hasOwnProperty(n)&&(Aloha.Log.isDebugEnabled()&&Aloha.Log.debug(this,"Passing contents of HTML Element with id { "+e.attr("id")+" } for cleaning to plugin { "+n+" }"),this.plugins[n].makeClean(e))},toString:function(){return"pluginmanager"}}))});