var MessageStore = require('./src/MessageStore');
var StoreActions = require('./index').Actions;

var query = MessageStore.query({
    where: function(message) { return message.userId == 2; },
    orderBy: 'id',
    orderByDesc: true
});
query.addChangeListener(function() {
    console.log('change');
});

StoreActions.push('message', [{
    id: 1,
    userId: 2,
    content: 'Hello'
}, {
    id: 2,
    userId: 1,
    content: 'Hi'
}, {
    id: 3,
    userId: 2,
    content: 'Nice'
}]);

console.log(query.toArray());

query.release();
