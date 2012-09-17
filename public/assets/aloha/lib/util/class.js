/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */
// Inspired by base2 and Prototype
/*
 * MODIFICATIONS: 
 * * The name of the "constructor" method was changed from "init" to "_constructor"
 * * Mixin Support using https://gist.github.com/1006243
 * * Modified to be a require.js module
 */
define([],function(){var e=!1,t=/xyz/.test(function(){xyz})?/\b_super\b/:/.*/;return this.Class=function(){},Class.extend=function(){function u(){!e&&this._constructor&&this._constructor.apply(this,arguments)}var n=this.prototype;e=!0;var r=new this;e=!1;for(var i=0;i<arguments.length;i++){var s=arguments[i];for(var o in s)r[o]=typeof s[o]=="function"&&typeof n[o]=="function"&&t.test(s[o])?function(e,t){return function(){var r=this._super;this._super=n[e];var i=t.apply(this,arguments);return this._super=r,i}}(o,s[o]):s[o]}return u.prototype=r,u.constructor=u,u.extend=arguments.callee,u},this.Class});