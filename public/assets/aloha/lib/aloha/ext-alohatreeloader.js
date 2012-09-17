/*!
* This file is part of Aloha Editor Project http://aloha-editor.org
* Copyright (c) 2010-2011 Gentics Software GmbH, aloha@gentics.com
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
define(["aloha/ext","aloha/repositorymanager"],function(e,t){e.tree.AlohaTreeLoader=function(t){e.apply(this,t),e.tree.AlohaTreeLoader.superclass.constructor.call(this)},e.extend(e.tree.AlohaTreeLoader,e.tree.TreeLoader,{paramOrder:["node","id"],nodeParameter:"id",directFn:function(e,n,r){var i={inFolderId:e.id,objectTypeFilter:this.objectTypeFilter,repositoryId:e.repositoryId};t.getChildren(i,function(t){var n={};n={status:!0,scope:this,argument:{callback:r,node:e}},typeof r=="function"&&r(t,n)})},createNode:function(t){return t.name&&(t.text=t.name),t.hasMoreItems&&(t.leaf=!t.hasMoreItems),t.objectType&&(t.cls=t.objectType),e.tree.TreeLoader.prototype.createNode.call(this,t)},objectTypeFilter:null,setObjectTypeFilter:function(e){this.objectTypeFilter=e},getObjectTypeFilter:function(){return this.objectTypeFilter}})});