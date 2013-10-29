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
define(["aloha/core","util/class","aloha/jquery"],function(e,t,n){var r=window.GENTICS;e.Message=t.extend({_constructor:function(e){this.title=e.title,this.text=e.text,this.type=e.type,this.callback=e.callback},toString:function(){return this.type+": "+this.message}}),e.Message.Type={CONFIRM:"confirm",ALERT:"alert",WAIT:"wait"},e.MessageLine=t.extend({messages:[],add:function(e){var t="",r=this.messages.length,i;this.messages[r]=e;while(r>4)this.messages.shift(),--r;for(i=0;i<r;i++)t+=this.messages[i].toString()+"<br/>";n("#gtx_aloha_messageline").html(t)}}),e.MessageLine=new e.MessageLine});