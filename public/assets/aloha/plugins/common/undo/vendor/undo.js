/*
 * Undo.js - A undo/redo framework for JavaScript
 * 
 * http://jzaefferer.github.com/undo
 *
 * Copyright (c) 2011 JÃ¶rn Zaefferer
 * MIT licensed.
 */
(function(){function n(e,t){for(name in t){var n=t[name];n!==undefined&&(e[name]=n)}return e}var e=function(){},t=function(t,r){var i;return r&&r.hasOwnProperty("constructor")?i=r.constructor:i=function(){return t.apply(this,arguments)},e.prototype=t.prototype,i.prototype=new e,r&&n(i.prototype,r),i.prototype.constructor=i,i.__super__=t.prototype,i},r;typeof exports!="undefined"?r=exports:r=this.Undo={},r.Stack=function(){this.commands=[],this.stackPosition=-1,this.savePosition=-1},n(r.Stack.prototype,{execute:function(e){this._clearRedo(),e.execute(),this.commands.push(e),this.stackPosition++,this.changed()},undo:function(){this.commands[this.stackPosition].undo(),this.stackPosition--,this.changed()},canUndo:function(){return this.stackPosition>=0},redo:function(){this.stackPosition++,this.commands[this.stackPosition].redo(),this.changed()},canRedo:function(){return this.stackPosition<this.commands.length-1},save:function(){this.savePosition=this.stackPosition,this.changed()},dirty:function(){return this.stackPosition!=this.savePosition},_clearRedo:function(){this.commands=this.commands.slice(0,this.stackPosition+1)},changed:function(){}}),r.Command=function(e){this.name=e};var i=new Error("override me!");n(r.Command.prototype,{execute:function(){throw i},undo:function(){throw i},redo:function(){this.execute()}}),r.Command.extend=function(e){var n=t(this,e);return n.extend=r.Command.extend,n}}).call(this);