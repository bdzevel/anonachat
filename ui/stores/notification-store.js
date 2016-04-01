var EventEmitter = require("events").EventEmitter;
var constants = require("../../resources/constants.js").Notification;

function NotificationStore()
{
	this.enabled = true;
	this.requestPermission();
	
	this.dispatcher = require("../dispatcher/dispatcher.js");
	this.dispatcher.register(onAction);
}
NotificationStore.prototype = new EventEmitter();

NotificationStore.prototype.send = function(message)
{
	if (!this.enabled || !this.permissionGranted())
		return;
	let notification = new Notification(message);
	this.emit(constants.Actions.Send, this.message);
}

NotificationStore.prototype.toggle = function(bool)
{
	this.enabled = bool;
	this.emit(constants.Actions.Toggle, this.enabled);
}

NotificationStore.prototype.requestPermission = function()
{
	if (!("Notification" in window))
		return;
	if (Notification.permission === "granted" || Notification.permission === "denied")
		return;
	Notification.requestPermission();
}

NotificationStore.prototype.permissionGranted = function()
{
	if (!("Notification" in window))
		return false;
	if (Notification.permission === "granted")
		return true;
	return false;
}

NotificationStore.prototype.IsEnabled = function()
{
	return this.enabled;
}

NotificationStore.prototype.addSendNotificationListener = function(callback)
{
	this.on(constants.Actions.Send, callback);
}
NotificationStore.prototype.removeSendNotificationListener = function(callback)
{
	this.removeListener(constants.Actions.Send, callback);
}

NotificationStore.prototype.addToggleListener = function(callback)
{
	this.on(constants.Actions.Toggle, callback);
}
NotificationStore.prototype.removeToggleListener = function(callback)
{
	this.removeListener(constants.Actions.Toggle, callback);
}

var store = new NotificationStore();

function onAction(action)
{
	if (action.Type == constants.Actions.Send)
	{
		store.send(action.Payload);
	}
	else if (action.Type == constants.Actions.Toggle)
	{
		store.toggle(action.Payload);
	}
}

module.exports = store;