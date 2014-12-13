var Dispatcher = require('./StoreDispatcher');

exports.push = function(objectType, objects) {
    Dispatcher.dispatch({
        action: 'STORE_PUSH',
        objectType: objectType,
        objects: objects
    });
};
