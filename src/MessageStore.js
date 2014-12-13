var _ = require('lodash-node');
var events = require('events');
var Dispatcher = require('./StoreDispatcher');

var CHANGE_EVENT = 'change';

var _objects = {};
var _queries = [];

function Query(request) {
    this._events = new events.EventEmitter();
    this.request = request;
}

Query.prototype.emitChange = function() {
    this._events.emit(CHANGE_EVENT);
};

Query.prototype.addChangeListener = function(listener) {
    this._events.on(CHANGE_EVENT, listener);
};

Query.prototype.removeChangeListener = function(listener) {
    this._events.removeListener(CHANGE_EVENT, listener);
};

Query.prototype.toArray = function() {
    var result = _(_objects)
        .filter(this.request.where)
        .sortBy(this.request.orderBy);
    if (this.request.orderByDesc) {
        result = result.reverse();
    }
    if (this.request.offset) {
        result = result.slice(this.request.offset);
    }
    if (this.request.limit) {
        result = result.slice(0, this.request.limit);
    }
    return result.value();
};

Query.prototype.release = function() {
    _queries = _.without(_queries, this);
};

exports.query = function(request) {
    var query = new Query(request);
    _queries.push(query);
    return query;
};

Dispatcher.register(function(payload) {
    if (payload.action == 'STORE_PUSH' && payload.objectType == 'message') {
        payload.objects.forEach(function(object) {
            _objects[object.id] = object;
        });
        _queries.forEach(function(query) {
            query.emitChange();
        });
    }
});
