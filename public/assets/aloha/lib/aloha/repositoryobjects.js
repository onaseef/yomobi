/*!
 * This file is part of Aloha Editor
 * Author & Copyright (c) 2010 Gentics Software GmbH, aloha@gentics.com
 * Licensed unter the terms of http://www.aloha-editor.com/license.html
 */
define(["aloha/core","util/class"],function(e,t){var n=window.GENTICS;e.RepositoryObject=function(){},e.RepositoryDocument=t.extend({_constructor:function(e){var t=e;this.type="document";if(!t.id||!t.name||!t.repositoryId)return;n.Utils.applyProperties(this,e),this.baseType="document"}}),e.RepositoryFolder=t.extend({_constructor:function(e){var t=e;this.type="folder";if(!t.id||!t.name||!t.repositoryId)return;n.Utils.applyProperties(this,e),this.baseType="folder"}})});