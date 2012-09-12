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
define(["aloha/core","util/class","aloha/jquery"],function(e,t,n){var r=window.console,i=t.extend({init:function(){if(typeof e.settings.logLevels=="undefined"||!e.settings.logLevels)e.settings.logLevels={error:!0,warn:!0};if(typeof e.settings.logHistory=="undefined"||!e.settings.logHistory)e.settings.logHistory={};e.settings.logHistory.maxEntries||(e.settings.logHistory.maxEntries=100),e.settings.logHistory.highWaterMark||(e.settings.logHistory.highWaterMark=90),e.settings.logHistory.levels||(e.settings.logHistory.levels={error:!0,warn:!0}),this.flushLogHistory(),e.trigger("aloha-logger-ready")},logHistory:[],highWaterMarkReached:!1,log:function(t,n,i){typeof n=="undefined"&&(i=t),typeof n!="string"&&n&&n.toString&&(n=n.toString()),typeof i=="undefined"&&(i=n,n=undefined);if(typeof t=="undefined"||!t)t="log";t=t.toLowerCase();if(typeof e.settings.logLevels=="undefined")return;if(!e.settings.logLevels[t])return;n=n||"Unkown Aloha Component",this.addToLogHistory({level:t,component:n,message:i,date:new Date});switch(t){case"error":window.console&&r.error&&(!n&&!i?r.error("Error occured without message and component"):r.error(n+": "+i));break;case"warn":window.console&&r.warn&&r.warn(n+": "+i);break;case"info":window.console&&r.info&&r.info(n+": "+i);break;case"debug":window.console&&r.log&&r.log(n+" ["+t+"]: "+i);break;default:window.console&&r.log&&r.log(n+" ["+t+"]: "+i)}},error:function(e,t){this.log("error",e,t)},warn:function(e,t){this.log("warn",e,t)},info:function(e,t){this.log("info",e,t)},debug:function(e,t){this.log("debug",e,t)},deprecated:function(t,n){this.log("warn",t,n);if(e.settings.logLevels.deprecated)throw new Error(n)},isLogLevelEnabled:function(t){return e.settings&&e.settings.logLevels&&e.settings.logLevels[t]},isErrorEnabled:function(){return this.isLogLevelEnabled("error")},isWarnEnabled:function(){return this.isLogLevelEnabled("warn")},isInfoEnabled:function(){return this.isLogLevelEnabled("info")},isDebugEnabled:function(){return this.isLogLevelEnabled("debug")},addToLogHistory:function(t){e.settings.logHistory||this.init();if(e.settings.logHistory.maxEntries<=0||!e.settings.logHistory.levels[t.level])return;this.logHistory.push(t),this.highWaterMarkReached||this.logHistory.length>=e.settings.logHistory.maxEntries*e.settings.logHistory.highWaterMark/100&&(e.trigger("aloha-log-full"),this.highWaterMarkReached=!0);while(this.logHistory.length>e.settings.logHistory.maxEntries)this.logHistory.shift()},getLogHistory:function(){return this.logHistory},flushLogHistory:function(){this.logHistory=[],this.highWaterMarkReached=!1}});return i=new i,e.Log=e.Console=i});