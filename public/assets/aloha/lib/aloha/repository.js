/*!
* This file is part of Aloha Editor Project http://aloha-editor.org
* Copyright (c) 2010-2011 Gentics Software GmbH, aloha@gentics.com
* Contributors http://aloha-editor.org/contribution.php 
* Licensed unter the terms of http://www.aloha-editor.org/license.html
*
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
define(["aloha/core","util/class","aloha/repositorymanager"],function(e,t,n){var r=t.extend({_constructor:function(e,t){this.repositoryId=e,this.settings={},this.repositoryName=t?t:e,n.register(this)},init:function(){},query:null,getChildren:null,makeClean:function(e){},markObject:function(e,t){},setTemplate:function(e){e?this.template=e:this.template=null},hasTemplate:function(){return this.template?!0:!1},getTemplate:function(){return this.template},getObjectById:function(e,t){return!0}});return e.AbstractRepository=r,r});