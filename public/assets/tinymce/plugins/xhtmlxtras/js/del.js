/**
 * del.js
 *
 * Copyright 2009, Moxiecode Systems AB
 * Released under LGPL License.
 *
 * License: http://tinymce.moxiecode.com/license
 * Contributing: http://tinymce.moxiecode.com/contributing
 */
function init(){SXE.initElementDialog("del"),SXE.currentAction=="update"&&(setFormValue("datetime",tinyMCEPopup.editor.dom.getAttrib(SXE.updateElement,"datetime")),setFormValue("cite",tinyMCEPopup.editor.dom.getAttrib(SXE.updateElement,"cite")),SXE.showRemoveButton())}function setElementAttribs(e){setAllCommonAttribs(e),setAttrib(e,"datetime"),setAttrib(e,"cite"),e.removeAttribute("data-mce-new")}function insertDel(){var e=tinyMCEPopup.editor.dom.getParent(SXE.focusElement,"DEL");if(e==null){var t=SXE.inst.selection.getContent();if(t.length>0){insertInlineElement("del");var n=SXE.inst.dom.select("del[data-mce-new]");for(var r=0;r<n.length;r++){var e=n[r];setElementAttribs(e)}}}else setElementAttribs(e);tinyMCEPopup.editor.nodeChanged(),tinyMCEPopup.execCommand("mceEndUndoLevel"),tinyMCEPopup.close()}function removeDel(){SXE.removeElement("del"),tinyMCEPopup.close()}tinyMCEPopup.onInit.add(init);