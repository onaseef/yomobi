(function(e){e.fn.vieSemanticAloha=function(t){var n={beforeEditing:null};e.extend(n,t),this.each(function(){var e=VIE.ContainerManager.getInstanceForContainer(jQuery(this));typeof e.editables=="undefined"&&(e.editables={}),VIE.ContainerManager.findContainerProperties(this,!1).each(function(){var t=jQuery(this);n.beforeEditing!=null&&n.beforeEditing(t);var r=t.attr("property");if(e.get(r)instanceof Array)return!0;e.editables[r]=new GENTICS.Aloha.Editable(t),e.editables[r].vieContainerInstance=e})})}})(jQuery),typeof VIE=="undefined"&&(VIE={}),VIE.AlohaEditable={refreshFromEditables:function(e){var t={};return jQuery.each(e.editables,function(e,n){if(!n.isModified())return!0;jQuery("[typeof][about]",n.obj).each(function(){var e=VIE.ContainerManager.getInstanceForContainer(jQuery(this))}),t[e]=n.getContents()}),jQuery.isEmptyObject(t)?!1:(e.set(t),!0)}};