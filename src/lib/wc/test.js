this.window = window;
this.lightspeed = new UCF_LS();
this.commands = new SAPWD_OPCode(this);
this.mainApplication = null;
this.listeners = [];
this.pendingRequest = null;
this.pendingRequestListeners = 0;
this.focus = "";
if (this.prefix) {
  id = this.prefix + "_environment_";
  this.environment = document.getElementById(id).value;
  id = this.prefix + "_external_session_";
  this.external_session = document.getElementById(id).value;
} else {
  if (document.getElementById("_environment_"))
    this.environment = document.getElementById("_environment_").value;
  if (document.getElementById("_external_session_"))
    this.external_session = document.getElementById("_external_session_").value;
}
UCF_DomUtil.attachEvent(window, "unload", wdaOnUnload);
if (!UCF_UserAgent.bIsTablet() && !UCF_UserAgent.bIsPhone()) {
  UCF_DomUtil.attachEvent(window, "pagehide", wdaOnUnload);
}
// };
SAPWD_AbstractApplication.prototype.exec = function (commandName, parameters) {
  if (!this.commands[commandName]) {
    SAPWD_pluginLoader.oGetPlugin(parameters.pluginId);
  }
  this.commands[commandName](parameters);
};
SAPWD_AbstractApplication.prototype.exit = function (sessionState) {
  this.exitApplication(sessionState);
  UCF_DomUtil.detachEvent(window, "unload", wdaOnUnload);
  UCF_DomUtil.detachEvent(window, "load", wdaOnMainLoad);
  UCF_DomUtil.detachEvent(window, "pagehide", wdaOnUnload);
  for (var i = 0; i < this.listeners.length; i++) {
    if (
      this.listeners[i].destroy &&
      typeof this.listeners[i].destroy == "function"
    ) {
      this.listeners[i].destroy();
    }
  }
  this.listeners = null;
  this.lightspeed.destroy();
  this.window = null;
  this.lightspeed = null;
  this.commands = null;
  this.mainApplication = null;
  this.pendingRequest = null;
  this.pendingRequestListeners = null;
  this.environment = null;
  this.external_session = null;
};
SAPWD_AbstractApplication.prototype.exitApplication = function (
  sessionState
) {};
SAPWD_AbstractApplication.prototype.onSubmit = function (oPendingRequest) {
  this.pendingRequest = oPendingRequest;
  this.focus = this.lightspeed.sGetFocusedElementId();
  this.pendingRequestListeners = 0;
  for (var i = 0; i < this.listeners.length; i++) {
    if (
      this.listeners[i].onSubmit &&
      typeof this.listeners[i].onSubmit == "function"
    ) {
      ++this.pendingRequestListeners;
    }
  }
  if (0 == this.pendingRequestListeners) {
    this.pendingRequest = null;
    return;
  }
  oPendingRequest.suspend("SAPWD");
  for (var i = 0; i < this.listeners.length; i++) {
    if (
      this.listeners[i].onSubmit &&
      typeof this.listeners[i].onSubmit == "function"
    ) {
      this.listeners[i].onSubmit(this);
    }
  }
};
SAPWD_AbstractApplication.prototype.registerListener = function (listener) {
  this.listeners[this.listeners.length] = listener;
};
SAPWD_AbstractApplication.prototype.unregisterListener = function (listener) {
  for (var i = 0; i < this.listeners.length; i++) {
    if (this.listeners[i] == listener) {
      this.listeners.splice(i, 1);
      return;
    }
  }
};
SAPWD_AbstractApplication.prototype.addToPendingRequest = function (oEvent) {
  this.pendingRequest.addSemanticEvent(oEvent);
};
SAPWD_AbstractApplication.prototype.resume = function () {
  if (0 == --this.pendingRequestListeners) {
    this.pendingRequest.resume("SAPWD");
    this.pendingRequest = null;
  }
};
SAPWD_AbstractApplication.prototype.setFocus = function (controlId) {
  if (controlId) {
    var tokens = controlId.split("@iFbA:");
    this.lightspeed.focusElement(tokens[0]);
    if (tokens[1]) {
      this.lightspeed.oGetControlById(tokens[0]).setFocusInternal(tokens[1]);
    }
  } else if (this.focus) {
    this.lightspeed.focusElement(this.focus);
  }
};
SAPWD_AbstractApplication.prototype.setFocusGridBinding = function (path) {
  var aBoundControls = application.lightspeed.getBoundControls(path);
  if (aBoundControls && aBoundControls.length > 0) {
    if (aBoundControls[0].focus) {
      aBoundControls[0].focus();
    }
  }
};
SAPWD_AbstractApplication.prototype.setMessageFocusToggleInfo = function (
  sMessageAreaId,
  sFocusedMessageId,
  sTargetFocusElementId
) {
  if (this.lightspeed.setMessageFocusToggleInfo) {
    var sId;
    if (sTargetFocusElementId) {
      sId = sTargetFocusElementId;
    } else {
      sId = this.focus;
    }
    this.lightspeed.setMessageFocusToggleInfo(
      sMessageAreaId,
      sFocusedMessageId,
      sId,
      this,
      "setFocus"
    );
  }
};
SAPWD_AbstractApplication.prototype.unlock = function () {
  for (var i = 0; i < this.listeners.length; i++) {
    if (
      this.listeners[i].onUnlock &&
      typeof this.listeners[i].onUnlock == "function"
    ) {
      this.listeners[i].onUnlock();
    }
  }
};
SAPWD_AbstractApplication.prototype.setPadding = function (
  windowId,
  padding
) {};
function SAPWD_PopupApplication(prefix) {
  this.init();
  this.mainApplication = this.lightspeed
    .oGetPopupManager()
    .oGetOpenerWindow(this.window).application.mainApplication;
  this.windowId = this.lightspeed
    .oGetPopupManager()
    .sGetPopupIdByWindow(this.window);
  this.mainApplication.registerPopup(this);
}
SAPWD_PopupApplication.prototype = new SAPWD_AbstractApplication();
SAPWD_PopupApplication.prototype.setPadding = function (windowId, padding) {
  var controlId = windowId + "_root_";
  this.lightspeed.oGetControlById(controlId);
};
function SAPWD_MainApplication(prefix) {
  this.prefix = prefix;
  this.init();
  if (this.prefix) {
    this.windowId = document.getElementById(
      this.prefix + "_main_window_id_"
    ).value;
    this.targetURL = document.getElementById(
      this.prefix + "sap.client.SsrClient.form"
    ).action;
    this.popupURL = document.getElementById(this.prefix + "_popup_url_").value;
  } else {
    this.windowId = document.getElementById("_main_window_id_").value;
    this.targetURL = document.getElementById(
      "sap.client.SsrClient.form"
    ).action;
    this.popupURL = document.getElementById("_popup_url_").value;
  }
  this.mainApplication = this;
  this.applicationStack = [this];
  this.lightspeed.setMainWindowId(this.windowId);
  this.lightspeed.setPendingRequestHandler(this, "onLightspeedSubmit");
  this.lightspeed.setApplicationExitHandler(this, "onLightspeedExit");
  if (typeof window["__debugger__"] != "undefined")
    this.lightspeed.addDebugHandler(
      UCF_KeyCodes.B,
      this,
      "Turn on/off js debugger"
    );
  if (this.targetURL.indexOf(";sap-ext-sid=") < 0) {
    if (this.targetURL.search("\\?") >= 0) {
      this.lightspeed
        .oGetPage()
        .setUnloadUrl(this.targetURL + "&sap-sessioncmd=USR_LOGOFF");
    } else {
      this.lightspeed
        .oGetPage()
        .setUnloadUrl(this.targetURL + "?sap-sessioncmd=USR_LOGOFF");
    }
  }
}
SAPWD_MainApplication.prototype = new SAPWD_AbstractApplication();
SAPWD_MainApplication.prototype.registerPopup = function (popupApplication) {
  this.applicationStack.push(popupApplication);
};
SAPWD_MainApplication.prototype.unregisterPopup = function (windowId) {
  for (var i = 0; i < this.applicationStack.length; ++i)
    if (this.applicationStack[i].windowId == windowId) {
      this.applicationStack.splice(i, 1);
      return;
    }
};
SAPWD_MainApplication.prototype.onLightspeedExit = function () {
  UCF_DomUtil.detachEvent(window, "unload", wdaOnUnload);
  UCF_DomUtil.detachEvent(window, "pagehide", wdaOnUnload);
  UCF_DomUtil.detachEvent(window, "load", wdaOnMainLoad);
};
SAPWD_MainApplication.prototype.onLightspeedSubmit = function (
  oPendingRequest
) {
  this.applicationStack[this.applicationStack.length - 1].onSubmit(
    oPendingRequest
  );
};
SAPWD_AbstractApplication.prototype.trigger = function () {
  __debugger__ = !__debugger__;
};
SAPWD_MainApplication.prototype.exitApplication = function (sessionState) {
  if (sessionState == "SUSPENDED") {
    application.lightspeed.oGetPage().setUnloadUrl("");
  }
  for (var i = this.applicationStack.length - 1; i > 0; --i) {
    this.applicationStack[i].exitApplication(sessionState);
    this.applicationStack[i] = null;
  }
  this.targetURL = null;
  this.popupURL = null;
  this.applicationStack = null;
};
SAPWD_MainApplication.prototype.onBeforeUnload = function (evt) {
  if (this.environment != "1") return;
  evt = evt || window.event;
  var strTextUnsavedData = "";
  if (this.lightspeed.bLocked() == true) {
    if (document.getElementById("_textUnsaveData_")) {
      strTextUnsavedData = document.getElementById("_textUnsaveData_").value;
    }
    if (
      typeof strTextUnsavedData != "string" ||
      strTextUnsavedData.length == 0
    ) {
      strTextUnsavedData = "You have unsaved data";
    }
    evt.returnValue = strTextUnsavedData;
    if (evt.preventDefault) {
      evt.preventDefault();
    }
    if (evt.stopPropagation) {
      evt.stopPropagation();
    }
    return strTextUnsavedData;
  }
};
SAPWD_MainApplication.prototype.setPadding = function (windowId, padding) {
  var controlId = windowId + "_root_";
  var cont = this.lightspeed.oGetControlById(controlId);
  if (cont) cont.setHasMargin(padding);
};
SAPWD_MainApplication.prototype.formPutHiddenField = function (
  formId,
  fieldName,
  value
) {
  this.lightspeed.oGetControlById(formId).putHiddenField(fieldName, value);
};
SAPWD_MainApplication.prototype.formSubmit = function (formId) {
  this.lightspeed.oGetControlById(formId).submit();
};
SAPWD_MainApplication.prototype.clientListAccess = function (
  windowId,
  controlId,
  formFieldName,
  formFields,
  oSemanticEvent,
  oLS
) {
  var fieldValue;
  var dataForm;
  var id;
  var name;
  if (formFields) {
    for (var i = 0; i < formFields.length; i++) {
      id = formFields[i].id;
      name = formFields[i].name;
      dataform = document.getElementById(id);
      if (dataform && dataform[name]) {
        fieldValue = dataform[name];
        oSemanticEvent.setCustomParameter(formFields[i].name, fieldValue.value);
      }
    }
  }
  oSemanticEvent.setCustomParameter(
    "ValueSuggest_FormFieldName",
    formFieldName
  );
};
function SAPWD_OPCode(application) {
  this.application = application;
}
SAPWD_OPCode.prototype.openPopup = function (param) {
  var mainApplication = this.application.mainApplication;
  var topWindow =
    mainApplication.applicationStack[
      mainApplication.applicationStack.length - 1
    ].window;
  var popupManager = topWindow.application.lightspeed.oGetPopupManager();
  popupManager.createPopupWindow(
    topWindow,
    mainApplication.popupURL +
      "&" +
      param.childWindowParam +
      "=" +
      param.childWindowId,
    param.childWindowId
  );
  var popupWindow = popupManager.oGetWindowByPopupId(param.childWindowId);
  if (!popupWindow);
};
SAPWD_OPCode.prototype.closePopup = function (param) {
  if (param.childWindowId == "close_all") {
    this.application.mainApplication.lightspeed
      .oGetPopupManager()
      .closeAllPopups();
    var l_length = this.application.applicationStack.length - 1;
    var l_index = -(this.application.applicationStack.length - 1);
    this.application.applicationStack.splice(l_index, l_length);
  } else {
    this.application.mainApplication.lightspeed
      .oGetPopupManager()
      .closePopup(param.childWindowId);
    this.application.mainApplication.unregisterPopup(param.childWindowId);
  }
};
SAPWD_OPCode.prototype.openPopupMenu = function (param) {
  this.application.lightspeed
    .oGetControlById(param.controlId)
    .openAtPosition(parseInt(param.posx), parseInt(param.posy));
};
SAPWD_OPCode.prototype.openPopupTrigger = function (param) {
  this.application.lightspeed
    .oGetControlById(param.controlId)
    .openOnRequest(param.popupMenuId, param.withKeyboard);
};
SAPWD_OPCode.prototype.openMenu = function (param) {
  this.application.lightspeed.oGetControlById(param.controlId).openMenu();
};
SAPWD_OPCode.prototype.openComboBox = function (param) {
  this.application.lightspeed.oGetControlById(param.controlId).open();
};
SAPWD_OPCode.prototype.setSuggestFilterCondition = function (param) {
  this.application.lightspeed
    .oGetControlById(param.controlId)
    .setSuggestFilterCondition(param.filterCondition);
};
SAPWD_OPCode.prototype.openHeaderActionMenu = function (param) {
  var withKeyboard = false;
  if (param.withKeyboard.toUpperCase() == "TRUE") withKeyboard = true;
  if (param.popupMenuId)
    this.application.lightspeed
      .oGetControlById(param.popupMenuId)
      .setRemoveOnClose(true);
  this.application.lightspeed
    .oGetControlById(param.controlId)
    .openHeaderActionMenu(param.cellId, withKeyboard);
};
SAPWD_OPCode.prototype.setFocus = function (param) {
  this.application.setFocus(param.controlId);
};
SAPWD_OPCode.prototype.setFocusGridBinding = function (param) {
  this.application.setFocusGridBinding(param.path);
};
SAPWD_OPCode.prototype.setMessageFocusToggleInfo = function (param) {
  this.application.setMessageFocusToggleInfo(
    param.messageAreaId,
    param.focusedMessageId,
    param.targetFocusElementId
  );
};
SAPWD_OPCode.prototype.setDataTipGridBinding = function (param) {
  if (!param.path || !param.input_state || !param.message_text) {
    return;
  }
  var aBoundControls = application.lightspeed.getBoundControls(param.path);
  for (var i = 0, max = aBoundControls.length; i < max; i++) {
    if (aBoundControls[i].createDataTip) {
      aBoundControls[i].createDataTip(param.input_state, param.message_text);
    }
  }
};
SAPWD_OPCode.prototype.applyCustomStyles = function (param) {
  var oPage = this.application.lightspeed.oGetPage();
  if (oPage && oPage.applyCustomStyles) {
    oPage.applyCustomStyles(param.styleBlockId, param.customStyle);
  } else {
  }
};
SAPWD_OPCode.prototype.setURControlProperty = function (param) {
  if (
    typeof this.application.lightspeed != "object" ||
    typeof param.controlId != "string" ||
    typeof param.method != "string"
  ) {
    return;
  }
  var oURControl = this.application.lightspeed.oGetControlById(param.controlId),
    aParameters = [];
  if (!oURControl || typeof oURControl[param.method] != "function") {
    return;
  }
  if (typeof param.methodParameters === "string") {
    aParameters = UCF_JsUtil.oParseJSON(param.methodParameters);
  }
  oURControl[param.method].apply(this, aParameters);
};
SAPWD_OPCode.prototype.addPageCustomStyleClass = function (param) {
  var oPage = this.application.lightspeed.oGetPage();
  if (oPage && oPage.addCustomStyleClass) {
    oPage.addCustomStyleClass(param.customStyleClass);
  } else {
  }
};
SAPWD_OPCode.prototype.removePageCustomStyleClass = function (param) {
  var oPage = this.application.lightspeed.oGetPage();
  if (oPage && oPage.removeCustomStyleClass) {
    oPage.removeCustomStyleClass(param.customStyleClass);
  } else {
  }
};
SAPWD_OPCode.prototype.setConditionalRules = function (param) {
  var oPage = this.application.lightspeed.oGetPage();
  if (oPage && oPage.setConditionalRules) {
    oPage.setConditionalRules(JSON.parse(param.RuleMap));
  } else {
  }
};
SAPWD_OPCode.prototype.setConditionalControlMapping = function (param) {
  var oPage = this.application.lightspeed.oGetPage();
  if (oPage && oPage.setConditionalControlMapping) {
    oPage.setConditionalControlMapping(JSON.parse(param.ControlIdRuleMap));
  } else {
  }
};
SAPWD_OPCode.prototype.applyConditionalRules = function (param) {
  var oPage = this.application.lightspeed.oGetPage();
  if (oPage && oPage.applyConditionalRules) {
    oPage.applyConditionalRules();
  } else {
  }
};
SAPWD_OPCode.prototype.submit = function (param) {
  var control = this.application.lightspeed.oGetControlById(param.controlId);
  control.setTarget(param.target);
  control.setSubmitMethod(param.method);
  control.setActionMethod(param.url);
  control.putHiddenField(param.name, param.value);
  control.submit();
};
SAPWD_OPCode.prototype.valueChanged = function (param) {
  var control = this.application.lightspeed.oGetControlById(param.controlId);
  control.putHiddenField(param.name, param.value);
};
SAPWD_OPCode.prototype.highlightTexts = function (param) {
  var control = this.application.lightspeed.oGetControlById(param.controlId);
  if (control && control.setHighlightTexts) {
    control.setHighlightTexts(UCF_JsUtil.oParseJSON(param.jsonTextsInfo), 1);
  } else {
  }
};
function SAPWD_Util_absoluteTextPosition(text, line, position) {
  var absolutePosition = 0;
  text = String(text);
  if (!text.match(/\r/)) text = text.replace(/\n/g, "\r\n");
  if (!text.match(/\n/)) text = text.replace(/\r/g, "\r\n");
  var lines = text.split(/\n/);
  if (line < 0) line = lines.length + line + 1;
  line--;
  for (i = 0; i < line && i < lines.length; i++) {
    absolutePosition += lines[i].length;
  }
  var lineLength;
  if (line < lines.length - 1) lineLength = lines[line].length - 1;
  else if (line == lines.length - 1) lineLength = lines[line].length;
  else lineLength = 0;
  if (position > lineLength) position = -1;
  if (position < 0) {
    position = lineLength + 1 + position;
    if (position < 0) position = 0;
  }
  return absolutePosition + position;
}
SAPWD_OPCode.prototype.setFocus_Cursor = function (param) {
  var control = this.application.lightspeed.oGetControlById(param.controlId);
  if (control.getText) {
    control.setCursorPosition(parseInt(param.cursorPosition));
  } else {
    control.setCursorPosition(
      SAPWD_Util_absoluteTextPosition(
        control.getValue(),
        parseInt(param.cursorLine),
        parseInt(param.cursorPosition)
      )
    );
  }
};
SAPWD_OPCode.prototype.setFocus_Selection = function (param) {
  var text;
  var control = this.application.lightspeed.oGetControlById(param.controlId);
  if (control.getText) {
    text = control.getText();
  } else {
    text = control.getValue();
  }
  control.setSelection(
    SAPWD_Util_absoluteTextPosition(
      text,
      parseInt(param.fromLine),
      parseInt(param.fromPosition)
    ),
    SAPWD_Util_absoluteTextPosition(
      text,
      parseInt(param.toLine),
      parseInt(param.toPosition)
    )
  );
};
SAPWD_OPCode.prototype.scrollIntoView = function (param) {
  this.application.lightspeed.scrollIntoView(param.controlId, param.alignToTop);
};
SAPWD_OPCode.prototype.unlock = function (param) {
  this.application.unlock();
};
SAPWD_OPCode.prototype.addHiddenControl = function (param) {
  var hiddenAreaId = "";
  if (this.application.mainApplication.prefix)
    hiddenAreaId = this.application.mainApplication.prefix + "hiddenArea";
  else hiddenAreaId = "hiddenArea";
  var hiddenArea =
    this.application.mainApplication.document.getElementById(hiddenAreaId);
  if (hiddenArea) {
    hiddenArea.innerHTML = hiddenArea.innerHTML + param.hiddenControlHTML;
  }
};
SAPWD_OPCode.prototype.attachFile = function (param) {
  var mainDocument = this.application.mainApplication.window.document;
  var pathLen = mainDocument.location.pathname.length - 1;
  var url = "";
  if (param.target == "_self") {
    url = UCF_JsUtil.sGetResolvedUrl(param.url, document.location.href);
    if (param.attachedFileMethod == "location") {
      document.location.href = url;
    } else {
      UCF_JsUtil.downloadFile(url);
    }
  } else if (param.target == "_blob") {
    var _html = "<html><script>                                              ";
    _html = _html + "var url ='" + window.location.origin + param.url + "'; ";
    _html = _html + "function loadIFrame(){                                  ";
    _html = _html + "   var oFrameRef = document.createElement('a');  ";
    _html = _html + "   oFrameRef.href = url;                                 ";
    _html = _html + "   oFrameRef.style.display = 'none';                  ";
    _html = _html + "   document.body.appendChild(oFrameRef);                ";
    _html = _html + "   oFrameRef.click();                                   ";
    _html = _html + "}";
    _html = _html + "</script>";
    _html = _html + "<body onload='loadIFrame();'>";
    _html = _html + "</body></html>";
    var fileAttach = UCF_DomUtil.sGetIframeJSSource(_html);
    window.open(fileAttach);
  } else {
    var fileForm = application.lightspeed.oGetControlById(param.attachedFileId);
    if (fileForm) {
      fileForm.submit();
    } else {
      param["attachedFileId"] = "";
      param["usePost"] = "1";
      param["menubar"] = "1";
      param["scrollbars"] = "1";
      param["location"] = "1";
      param["resizable"] = "1";
      param["status"] = "1";
      param["toolbar"] = "1";
      param["postParameters"] = "";
      this.openExternalWindow(param);
    }
  }
};
SAPWD_OPCode.prototype.openExternalWindow = function (param) {
  var newWindowId = param.target;
  var url = param.url;
  var left = parseInt(param.left);
  var top = parseInt(param.top);
  var height = param.height;
  var width = param.width;
  var hasAdressbar = parseInt(param.location) ? true : false;
  var hasMenubar = parseInt(param.menubar) ? true : false;
  var resizable = parseInt(param.resizable) ? true : false;
  var scrollbars = parseInt(param.scrollbars) ? true : false;
  var hasStatusBar = parseInt(param.status) ? true : false;
  var hasToolbar = parseInt(param.toolbar) ? true : false;
  var usePost = parseInt(param.usePost) ? true : false;
  var postParams = param.postParameters;
  try {
    if (usePost) {
      this.application.lightspeed
        .oGetPage()
        .openExternalWindowByPost(
          newWindowId,
          url,
          postParams,
          top,
          left,
          width,
          height,
          hasMenubar,
          hasStatusBar,
          hasToolbar,
          hasAdressbar
        );
    } else {
      this.application.lightspeed
        .oGetPage()
        .openExternalWindow(
          newWindowId,
          url,
          top,
          left,
          width,
          height,
          hasMenubar,
          hasStatusBar,
          hasToolbar,
          hasAdressbar
        );
    }
  } catch (ex) {}
};
SAPWD_OPCode.prototype.openTab = function (param) {
  var sURL = param.url;
  var bShift = param.shift;
  var bCtrl = param.ctrl;
  var oPage = application.lightspeed.oGetPage();
  if (oPage) {
    if (bCtrl) {
      UCF_RequestUtil.sendFormRequest("GET", sURL, null, "_blank");
      return;
    } else if (bShift) {
      oPage.openExternalWindow(
        "_blank",
        sURL,
        10,
        10,
        null,
        null,
        true,
        true,
        true,
        true
      );
      return;
    }
  }
};
SAPWD_OPCode.prototype.redirect = function (param) {
  this.application.lightspeed
    .oGetPage()
    .redirect(param.method, param.url, param.postParameters);
  this.application.exit(param.sessionState);
};
SAPWD_OPCode.prototype.redirect2 = function (param) {
  if (param.trace1) {
  }
  if (param.trace2) {
  }
  this.application.lightspeed
    .oGetPage()
    .redirect(param.method, param.url, param.postParameters);
  this.application.exit(param.sessionState);
};
SAPWD_OPCode.prototype.fireSemanticEvent = function (param) {
  var parameters = {};
  parameters["Id"] = param.Id;
  for (var para in param) {
    if (para == "Id" || para == "eventName" || para == "action") continue;
    parameters[para] = param[para];
  }
  var oEvent = application.lightspeed.oCreateSemanticEvent(
    param.eventName,
    parameters,
    {}
  );
  oEvent.setClientAction(param.action);
  oEvent.setResponseData("delta");
  application.lightspeed.fireSemanticEvent(oEvent);
};
SAPWD_OPCode.prototype.addDebugHandler = function (param) {
  var handler = new Object();
  handler.trigger = new Function(param.script);
  application.lightspeed.addDebugHandler(
    UCF_KeyCodes[param.keyCode],
    handler,
    param.description
  );
};
SAPWD_OPCode.prototype.closeWindow = function (param) {
  this.application.lightspeed.oGetPage().closeWindow();
};
SAPWD_OPCode.prototype.setTitle = function (param) {
  this.application.lightspeed.oGetPage().setTitle(param.title);
};
SAPWD_OPCode.prototype.setPadding = function (param) {
  if (param.windowId == this.application.mainApplication.windowId)
    this.application.mainApplication.setPadding(param.windowId, param.padding);
  else {
    var win = this.application.lightspeed
      .oGetPopupManager()
      .oGetWindowByPopupId(param.windowId);
    win.application.setPadding(param.windowId, param.padding);
  }
};
SAPWD_OPCode.prototype.registerMapDataType = function (param) {
  this.application.lightspeed.registerMapDataType(
    param.data_type_name,
    param.json_map
  );
};
SAPWD_OPCode.prototype.setScrollingMode = function (param) {
  this.application.lightspeed.oGetPage().setScrollingMode(param.scrollingMode);
};
SAPWD_OPCode.prototype.setDefaultButton = function (param) {
  var control = this.application.lightspeed.oGetControlById(param.controlId);
  if (control.setDefaultButtonId)
    control.setDefaultButtonId(param.defaultButtonId);
};
SAPWD_OPCode.prototype.getClientInfos = function (param) {
  var parameters = {};
  parameters["Id"] = param.Id;
  try {
    parameters["WindowOpenerExists"] = window.top.opener ? "true" : "false";
  } catch (e) {
    parameters["WindowOpenerExists"] = window.opener ? "true" : "false";
  }
  parameters["ClientURL"] = document.location.href;
  parameters["ClientWidth"] = document.body.clientWidth;
  parameters["ClientHeight"] = document.body.clientHeight;
  parameters["DocumentDomain"] = document.domain;
  if (window == top) parameters["IsTopWindow"] = "true";
  else parameters["IsTopWindow"] = "false";
  var test;
  try {
    test = window["parent"].name;
    parameters["ParentAccessible"] = "true";
  } catch (e) {
    parameters["ParentAccessible"] = "false";
  }
  var oEvent = application.lightspeed.oCreateSemanticEvent(
    "ClientInfos",
    parameters,
    {}
  );
  oEvent.setClientAction("enqueue");
  oEvent.setResponseData("delta");
  application.lightspeed.fireSemanticEvent(oEvent);
};
SAPWD_OPCode.prototype.setHashChangedNotification = function (param) {
  if (param.hashChangedActive == "true")
    this.application.lightspeed.oGetPage().setHashChangedNotification(true);
  else this.application.lightspeed.oGetPage().setHashChangedNotification(false);
};
SAPWD_OPCode.prototype.setHash = function (param) {
  var page = application.lightspeed.oGetPage().setHash(param.hash, true);
};
SAPWD_OPCode.prototype.setKeepAliveActiveComponent = function (param) {
  var control = this.application.lightspeed.oGetControlById(param.controlId);
  if (!control) return;
  if (param.keepAlive == "X") {
    control.setKeepAlive(true);
  } else {
    control.setKeepAlive(false);
  }
};
var pendingHash = null;
SAPWD_OPCode.prototype.sendPendingHashEvent = function (param) {
  if (pendingHash) {
    var parameters = {};
    parameters["Id"] = pendingHash.mGetParameters()["Id"];
    var oEvent = application.lightspeed.oCreateSemanticEvent(
      pendingHash.sGetName(),
      parameters,
      {}
    );
    oEvent.setClientAction("submit");
    oEvent.setResponseData("delta");
    application.lightspeed.fireSemanticEvent(oEvent);
  }
};
SAPWD_OPCode.prototype.openQuickview = function (param) {
  if (param.method == "immediately")
    this.application.lightspeed.oGetControlById(param.controlId).show(true);
  else
    this.application.lightspeed.oGetControlById(param.controlId).contentReady();
};
SAPWD_OPCode.prototype.openPopover = function (param) {
  this.application.lightspeed
    .oGetControlById(param.controlId)
    .openAtControl(
      param.atControlId,
      param.bWithKeyboard == "X" ? true : false
    );
};
SAPWD_OPCode.prototype.startAnimation = function (param) {
  SAPWD_AnimationHandler.animate(param.controlId);
};
function SAPWD_hashPrepareScript(oSemanticEvent, oLS) {
  if (document.getElementById("_loadingPlaceholder_")) {
    pendingHash = oSemanticEvent;
    oSemanticEvent.setClientAction("none");
  } else {
  }
}
function SAPWD_PluginLoader() {}
SAPWD_PluginLoader.sBaseUrl = null;
SAPWD_PluginLoader.sVersion = null;
SAPWD_PluginLoader.bDebugLibs = false;
SAPWD_PluginLoader.prototype.createBaseUrl = function () {
  var aScriptTags = document.getElementsByTagName("script"),
    sScriptUrl,
    iFilePos,
    iQueryPos;
  for (var i = 0; i < aScriptTags.length; i++) {
    sScriptUrl = aScriptTags[i].getAttribute("src");
    if (!sScriptUrl) continue;
    iFilePos = sScriptUrl.indexOf("/wda_ls_main.js");
    iQueryPos = sScriptUrl.lastIndexOf("?");
    if (iFilePos >= 0) break;
  }
  this.sBaseUrl = sScriptUrl.substr(0, iFilePos);
  if (iQueryPos > 0) {
    this.sVersion = sScriptUrl.substr(iQueryPos + 1);
  }
  this.bDebugLibs = this.sBaseUrl.indexOf("/js/dbg") > 0;
};
SAPWD_PluginLoader.prototype.loadPlugin = function (sPluginName) {
  if (!this.sBaseUrl) this.createBaseUrl();
  var sFileName = "wda_ls_" + sPluginName + "_plugin.js",
    sUrl = this.sBaseUrl + "/" + sFileName;
  if (this.sVersion) {
    sUrl += "?" + this.sVersion;
  }
  var oResponse = UCF_RequestUtil.sendSyncRequest(sUrl);
  if (window.execScript) {
    window.execScript(oResponse.sText);
  } else {
    window.eval(oResponse.sText);
  }
  window[sPluginName] = true;
};
SAPWD_PluginLoader.prototype.oGetPlugin = function (sPluginName) {
  var oPlugin = window[sPluginName];
  if (!oPlugin) {
    this.loadPlugin(sPluginName);
    oPlugin = window[sPluginName];
  }
};
SAPWD_pluginLoader = new SAPWD_PluginLoader();
function SAPWD_ClassLoader() {}
SAPWD_ClassLoader.sBaseUrl = null;
SAPWD_ClassLoader.sVersion = null;
SAPWD_ClassLoader.bDebugLibs = false;
SAPWD_classLoader = new SAPWD_ClassLoader();
SAPWD_ClassLoader.prototype.createBaseUrl = function () {
  var aScriptTags = document.getElementsByTagName("script"),
    sScriptUrl,
    iFilePos,
    iQueryPos;
  for (var i = 0; i < aScriptTags.length; i++) {
    sScriptUrl = aScriptTags[i].getAttribute("src");
    if (!sScriptUrl) continue;
    iFilePos = sScriptUrl.indexOf("/wda_ls_main.js");
    iQueryPos = sScriptUrl.lastIndexOf("?");
    if (iFilePos >= 0) break;
  }
  this.sBaseUrl = sScriptUrl.substr(0, iFilePos);
  if (iQueryPos > 0) {
    this.sVersion = sScriptUrl.substr(iQueryPos + 1);
  }
  this.bDebugLibs = this.sBaseUrl.indexOf("/js/dbg") > 0;
};
SAPWD_ClassLoader.prototype.loadClass = function (sClassName) {
  if (!this.sBaseUrl) this.createBaseUrl();
  var sFileName = "wda_ls_" + sClassName.substr(6) + ".js",
    sUrl = this.sBaseUrl + "/" + sFileName;
  if (this.sVersion) {
    sUrl += "?" + this.sVersion;
  }
  var oResponse = UCF_RequestUtil.sendSyncRequest(sUrl);
  if (window.execScript) {
    window.execScript(oResponse.sText);
  } else {
    window.eval(oResponse.sText);
  }
  if (!window[sClassName]) {
    window[sClassName] = eval(sClassName);
  }
};
SAPWD_ClassLoader.prototype.oGetClass = function (sClassName) {
  try {
    window;
  } catch (e) {
    return Object;
  }
  var oClass = window[sClassName];
  if (!oClass || typeof oClass != "function") {
    this.loadClass(sClassName);
    oClass = window[sClassName];
  }
  return oClass;
};
var wdaOnMainLoad = function () {
  application = new SAPWD_MainApplication("");
};
var wdaOnPopupLoad = function () {
  application = new SAPWD_PopupApplication("");
};
var wdaOnUnload = function () {
  application.exit();
  application = null;
};
sapWD_select_List_Entry = function (Index, List) {
  for (var i = 0; i < List.length; i++)
    if (List[i][0] == Index) return List[i][1];
};
sapWD_to_ABAPbool = function (JSbool) {
  if (JSbool == true) return "X";
  else return "";
};
ABAPBool_to_sapWD = function (ABAPbool) {
  if (ABAPbool == "X") return true;
  else return false;
};
var SAPWD_AnimationHandler = {
  animate: function (controlId, animationStep) {
    var control = document.getElementById(controlId);
    if (!control) return;
    var animationList = window.JSON
      ? JSON.parse(control.getAttribute("animation"))
      : eval("(" + control.getAttribute("animation") + ")");
    animationStep = animationStep || 0;
    if (animationList.length == 0 || animationStep >= animationList.length)
      return;
    var animation = animationList[animationStep];
    control.style.transform = animation["transform"];
    control.style.MozTransform = animation["transform"];
    control.style.webkitTransform = animation["transform"];
    control.style.msTransform = animation["transform"];
    var transformOrigin = animation["transformOrigin"] || "center";
    control.style.transformOrigin = transformOrigin;
    control.style.MozTransformOrigin = transformOrigin;
    control.style.webkitTransformOrigin = transformOrigin;
    control.style.msTransformOrigin = transformOrigin;
    var transitionDurationMS = animation["transitionDuration"]
      ? Number(animation["transitionDuration"])
      : 0;
    var transitionDuration = Number(transitionDurationMS / 1000) + "s";
    control.style.transitionDuration = transitionDuration;
    control.style.MozTransitionDuration = transitionDuration;
    control.style.webkitTransitionDuration = transitionDuration;
    control.style.msTransitionDuration = transitionDuration;
    var transitionDelayMS = animation["transitionDelay"]
      ? Number(animation["transitionDelay"])
      : 0;
    var transitionDelay = Number(transitionDelayMS / 1000) + "s";
    control.style.transitionDelay = transitionDelay;
    control.style.MozTransitionDelay = transitionDelay;
    control.style.webkitTransitionDelay = transitionDelay;
    control.style.msTransitionDelay = transitionDelay;
    if (animationStep != animationList.length - 1)
      window.setTimeout(
        'SAPWD_AnimationHandler.animate("' +
          controlId +
          '", ' +
          Number(animationStep + 1) +
          ");",
        transitionDelayMS + transitionDurationMS
      );
  },
};
var myTagPrefix = "";
var dragSessionId = "";
var start = null;
var max = 100;
var ghostControlType = "";
var myDragData = "";
var myGhost = new Object();
var sapwdSelectedElements;
SAPWD_OPCode.prototype.eclipseSetGhost = function (param) {
  myGhost[param.ghostControlType] = {
    html: document.getElementById("WDEclipseGhost-" + param.ghostControlType)
      .outerHTML,
    dragTags: param.dragTags.replace(/(\w+)/g, ":" + myTagPrefix + ":$1"),
  };
  document
    .getElementById("WDEclipseGhost-" + param.ghostControlType)
    .parentNode.removeChild(
      document.getElementById("WDEclipseGhost-" + param.ghostControlType)
    );
};
var testDragEnter = false;
var SAPWD_EclipseHandler = {
  sDragSessionId: "",
  update: function (updateData) {
    var parameters = {};
    parameters["Id"] = application.windowId + "_root_";
    parameters["message"] = "update";
    parameters["params"] = updateData;
    var oEvent = application.lightspeed.oCreateSemanticEvent(
      "EclipseEvent",
      parameters,
      {}
    );
    oEvent.setClientAction("submit");
    oEvent.setResponseData("delta");
    application.lightspeed.fireSemanticEvent(oEvent);
  },
  select: function (controlIds) {
    var parameters = {};
    parameters["Id"] = application.windowId + "_root_";
    parameters["message"] = "select";
    parameters["params"] = controlIds;
    var oEvent = application.lightspeed.oCreateSemanticEvent(
      "EclipseEvent",
      parameters,
      {}
    );
    oEvent.setClientAction("submit");
    oEvent.setResponseData("delta");
    application.lightspeed.fireSemanticEvent(oEvent);
    sapwdSelectedElements = controlIds;
  },
  toggleOutline: function (visible) {
    var parameters = {};
    parameters["Id"] = application.windowId + "_root_";
    parameters["message"] = "toggle_outline";
    parameters["params"] = visible;
    var oEvent = application.lightspeed.oCreateSemanticEvent(
      "EclipseEvent",
      parameters,
      {}
    );
    oEvent.setClientAction("submit");
    oEvent.setResponseData("delta");
    application.lightspeed.fireSemanticEvent(oEvent);
    sapwdSelectedElements = controlIds;
  },
  onDragEnter: function (oSemanticEvent) {
    if (!myGhost[ghostControlType]) {
      testDragEnter = true;
      return;
    }
    var dragSessionData = {
      sDragTags: myGhost[ghostControlType].dragTags,
      sDragData: sDragData,
      sControlId: "FROM_ECLIPSE",
      sGhostHtml: myGhost[ghostControlType].html,
      sMimeType: "text/plain",
      bSubscribeDragEvents: true,
    };
    this.sDragSessionId =
      application.lightspeed.sCreateDragSession(dragSessionData);
  },
  onDragLeave: function (oSemanticEvent) {
    if (this.sDragSessionId) {
      application.lightspeed.destroyDragSession(this.sDragSessionId);
      this.sDragSessionId = "";
    }
  },
  drag: function (context, data) {
    if (context == "UIELEMENT") {
      myDragData = data;
      sDragData = data;
      var token = data.split(":");
      ghostControlType = token[1];
      if (!myGhost[ghostControlType]) {
        var parameters = {};
        parameters["Id"] = application.windowId + "_root_";
        parameters["message"] = "drag";
        parameters["params"] = token[1];
        var oEvent = application.lightspeed.oCreateSemanticEvent(
          "EclipseEvent",
          parameters,
          {}
        );
        oEvent.setClientAction("submit");
        oEvent.setResponseData("delta");
        application.lightspeed.fireSemanticEvent(oEvent);
      }
    }
  },
};
SAPWD_OPCode.prototype.wda2eclipse = function (param) {
  try {
    switch (param.message) {
      case "initialize":
        myTagPrefix = param.tagPrefix;
        window.initializePreview();
        break;
      case "selectUIElement":
        sapwdSelectedElements = param.params;
        window.selectElement(sapwdSelectedElements);
        break;
      case "drop":
        dragSessionId = null;
        var oParms = eval("(" + param.params + ")");
        if (oParms.source.indexOf(":") == -1) {
          oParms.source = sapwdSelectedElements.replace(/,/g, "#");
        }
        window.eclipseDrop(
          oParms.context +
            "," +
            oParms.source +
            "," +
            oParms.target +
            "," +
            oParms.position
        );
        break;
      case "contextMenu":
        window.eclipseContextMenu(sapwdSelectedElements);
        break;
      case "setGhost":
        myGhost[param.ghostControlType] = {
          html: document.getElementById(
            "WDEclipseGhost-" + param.ghostControlType
          ).outerHTML,
          dragTags:
            param.dragTags.replace(/(\w+)/g, ":" + myTagPrefix + ":$1") +
            " _PALETTE_",
        };
        document
          .getElementById("WDEclipseGhost-" + param.ghostControlType)
          .parentNode.removeChild(
            document.getElementById("WDEclipseGhost-" + param.ghostControlType)
          );
        if (testDragEnter == true) {
          testDragEnter = false;
          SAPWD_EclipseHandler.onDragEnter();
        }
      case "selftest":
        break;
    }
  } catch (ex) {}
};
var SAPWD_TestAutomation = {
  oMessages: {},
  setMessages: function (oMessages) {
    this.oMessages = oMessages;
  },
  getMessages: function () {
    return this.oMessages;
  },
};
SAPWD_OPCode.prototype.setMessagesAsJson = function (param) {
  SAPWD_TestAutomation.setMessages(param.messages);
};
var SAPWD_cancelFramework = null;
SAPWD_OPCode.prototype.cancelFrameworkAttach = function (param) {
  SAPWD_cancelFramework = new SAPWD_CancelFramework(param.cancelSessionTarget);
};
function SAPWD_CancelFramework(url) {
  this.cancelURL = url;
  application.registerListener(this);
  if (application.targetURL.indexOf(";sap-ext-sid=") < 0) {
    UCF_DomUtil.attachEvent(window, "beforeunload", this.onBeforeUnload);
  }
}
SAPWD_CancelFramework.prototype.onBeforeUnload = function (evt) {
  var oPage = application.lightspeed.oGetPage();
  oPage.sendPreunloadRequest(SAPWD_cancelFramework.cancelURL);
  UCF_DomUtil.detachEvent(window, "beforeunload", this.onBeforeUnload);
};
SAPWD_CancelFramework.prototype.onSubmit = function (pendingRequestHandler) {
  application.mainApplication.lightspeed
    .oGetPage()
    .setPreunloadUrl("cancelOn", this.cancelURL, "IHUB_EVENTING_CANCEL");
  application.mainApplication.lightspeed
    .oGetPage()
    .setSessionState("cancelOn", "ROUNDTRIP");
  pendingRequestHandler.resume();
};
SAPWD_CancelFramework.prototype.destroy = function () {
  application.unregisterListener(this);
};
