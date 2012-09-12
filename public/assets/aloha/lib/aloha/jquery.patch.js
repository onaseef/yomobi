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
// use specified jQuery or load jQuery
define(["aloha/jquery"],function(e){e.data=function(e){return function(t,n,r,i){if(!e.acceptData(t))return;var s=e.expando,o=typeof n=="string",u,a=t.nodeType,f=a?e.cache:t,l=a?t[e.expando]:t[e.expando]&&e.expando;if((!l||i&&l&&(!f[l]||!f[l][s]))&&o&&r===undefined)return;l||(a?t[e.expando]=l=++e.uuid:l=e.expando),f[l]||(f[l]={},a||(f[l].toJSON=e.noop));if(typeof n=="object"||typeof n=="function")i?f[l][s]=e.extend(f[l][s],n):f[l]=e.extend(f[l],n);return u=f[l],i&&(u[s]||(u[s]={}),u=u[s]),r!==undefined&&(u[e.camelCase(n)]=r),n==="events"&&!u[n]?u[s]&&u[s].events:o?u[e.camelCase(n)]:u}}(e)});