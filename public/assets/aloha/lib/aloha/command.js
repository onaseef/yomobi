/*!
* CommandManager file is part of Aloha Editor Project http://aloha-editor.org
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
* along with CommandManager program. If not, see <http://www.gnu.org/licenses/>.
*/
define(["aloha/core","aloha/registry","aloha/engine","util/dom","aloha/contenthandlermanager"],function(e,t,n,r,i){var s={execCommand:function(t,s,o,u){if(!u){if(!e.getSelection().getRangeCount())return;u=e.getSelection().getRangeAt(0)}t=="insertHTML"&&(o=i.handleContent(o,{contenthandler:e.settings.contentHandler.insertHtml})),n.execCommand(t,s,o,u);if(e.getSelection().getRangeCount()){u=e.getSelection().getRangeAt(0);var a=u.commonAncestorContainer.parentNode,f=new window.GENTICS.Utils.RangeObject;f.startContainer=u.startContainer,f.startOffset=u.startOffset,f.endContainer=u.endContainer,f.endOffset=u.endOffset,r.doCleanup({merge:!0,removeempty:!1},f,a),f.select()}e.trigger("aloha-command-executed",t)},queryCommandEnabled:function(t,r){if(!r){if(!e.getSelection().getRangeCount())return;r=e.getSelection().getRangeAt(0)}return n.queryCommandEnabled(t,r)},queryCommandIndeterm:function(t,r){if(!r){if(!e.getSelection().getRangeCount())return;r=e.getSelection().getRangeAt(0)}return n.queryCommandIndeterm(t,r)},queryCommandState:function(t,r){if(!r){if(!e.getSelection().getRangeCount())return;r=e.getSelection().getRangeAt(0)}return n.queryCommandState(t,r)},queryCommandSupported:function(e){return n.queryCommandSupported(e)},queryCommandValue:function(t,r){if(!r){if(!e.getSelection().getRangeCount())return;r=e.getSelection().getRangeAt(0)}return n.queryCommandValue(t,r)},querySupportedCommands:function(){var e=[],t;for(t in n.commands)e.push(t);return e}};return s=new(t.extend(s)),e.execCommand=s.execCommand,e.queryCommandEnabled=s.queryCommandEnabled,e.queryCommandIndeterm=s.queryCommandIndeterm,e.queryCommandState=s.queryCommandState,e.queryCommandSupported=s.queryCommandSupported,e.queryCommandValue=s.queryCommandValue,e.querySupportedCommands=s.querySupportedCommands,s});