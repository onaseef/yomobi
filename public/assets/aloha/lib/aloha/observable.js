/*!
* This file is part of Aloha Editor Project http://aloha-editor.org
* Copyright ï¿½ 2010-2011 Gentics Software GmbH, aloha@gentics.com
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
define(["aloha/jquery"],function(e,t){var n=e;return{_eventHandlers:null,bind:function(e,t,n){this._eventHandlers=this._eventHandlers||{},this._eventHandlers[e]||(this._eventHandlers[e]=[]),this._eventHandlers[e].push({handler:t,scope:n?n:window})},unbind:function(e,t){this._eventHandlers=this._eventHandlers||{};if(!this._eventHandlers[e])return;t?this._eventHandlers[e]=n.grep(this._eventHandlers[e],function(e){return e.handler===t?!1:!0}):this._eventHandlers[e]=[]},trigger:function(e){this._eventHandlers=this._eventHandlers||{};if(!this._eventHandlers[e])return;var t=[];n.each(arguments,function(e,n){e>0&&t.push(n)}),n.each(this._eventHandlers[e],function(e,n){n.handler.apply(n.scope,t)})},unbindAll:function(){this._eventHandlers=null}}});