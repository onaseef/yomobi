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
define(["aloha/jquery","aloha/ext","aloha/repositorymanager","aloha/console","i18n!aloha/nls/i18n"],function(e,t,n,r){t.data.AlohaProxy=function(){var e={};e[t.data.Api.actions.read]=!0,t.data.AlohaProxy.superclass.constructor.call(this,{api:e}),this.params={queryString:null,objectTypeFilter:null,filter:null,inFolderId:null,orderBy:null,maxItems:null,skipCount:null,renditionFilter:null,repositoryId:null}};var i=Aloha.require("i18n!aloha/nls/i18n");t.extend(t.data.AlohaProxy,t.data.DataProxy,{doRequest:function(t,i,s,o,u,a,f){e.extend(this.params,s);try{n.query(this.params,function(e){u.call(a,o.readRecords(e),f,!0)})}catch(l){return r.error("Ext.data.AlohaProxy","An error occured while querying repositories."),this.fireEvent("loadexception",this,null,f,l),this.fireEvent("exception",this,"response",t,f,null,l),!1}},setObjectTypeFilter:function(e){this.params.objectTypeFilter=e},getObjectTypeFilter:function(){return this.params.objectTypeFilter},setParams:function(t){e.extend(this.params,t)}})});