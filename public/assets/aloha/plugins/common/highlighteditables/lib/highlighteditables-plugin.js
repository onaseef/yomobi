/*!
* Aloha Editor
* Author & Copyright (c) 2010 Gentics Software GmbH
* aloha-sales@gentics.com
* Licensed unter the terms of http://www.aloha-editor.com/license.html
*/
define(["aloha","aloha/jquery","aloha/plugin","css!highlighteditables/css/highlighteditables.css"],function(e,t,n){var r=window.GENTICS;return n.create("highlighteditables",{init:function(){var t=this;r.Utils.Position.addMouseMoveCallback(function(){var t,n;for(t=0;t<e.editables.length;t++)n=e.editables[t],!e.activeEditable&&!n.isDisabled()&&n.obj.addClass("aloha-editable-highlight")}),r.Utils.Position.addMouseStopCallback(function(){t.fade()}),e.bind("aloha-editable-activated",function(e,n){t.fade()})},fade:function(){var n,r,i=function(){t(this).css("outline","")};for(n=0;n<e.editables.length;n++)r=e.editables[n].obj,r.hasClass("aloha-editable-highlight")&&r.css("outline",r.css("outlineColor")+" "+r.css("outlineStyle")+" "+r.css("outlineWidth")).removeClass("aloha-editable-highlight").animate({outlineWidth:"0px"},300,"swing",i)}})});