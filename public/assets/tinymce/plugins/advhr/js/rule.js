var AdvHRDialog={init:function(e){var t=e.dom,n=document.forms[0],r=e.selection.getNode(),i;i=t.getAttrib(r,"width"),n.width.value=i?parseInt(i):t.getStyle("width")||"",n.size.value=t.getAttrib(r,"size")||parseInt(t.getStyle("height"))||"",n.noshade.checked=!!t.getAttrib(r,"noshade")||!!t.getStyle("border-width"),selectByValue(n,"width2",i.indexOf("%")!=-1?"%":"px")},update:function(){var e=tinyMCEPopup.editor,t,n=document.forms[0],r="";t="<hr",n.size.value&&(t+=' size="'+n.size.value+'"',r+=" height:"+n.size.value+"px;"),n.width.value&&(t+=' width="'+n.width.value+(n.width2.value=="%"?"%":"")+'"',r+=" width:"+n.width.value+(n.width2.value=="%"?"%":"px")+";"),n.noshade.checked&&(t+=' noshade="noshade"',r+=" border-width: 1px; border-style: solid; border-color: #CCCCCC; color: #ffffff;"),e.settings.inline_styles&&(t+=' style="'+tinymce.trim(r)+'"'),t+=" />",e.execCommand("mceInsertContent",!1,t),tinyMCEPopup.close()}};tinyMCEPopup.requireLangPack(),tinyMCEPopup.onInit.add(AdvHRDialog.init,AdvHRDialog);