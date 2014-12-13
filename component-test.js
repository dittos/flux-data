var StoreQueryMixin = require('./src/StoreQueryMixin');

var MessageList = React.createClass({
    mixins: [StoreQueryMixin],

    getInitialState() {
        return {
            limit: this.props.perPage
        };
    },

    getQueryRequests: function() {
        return {
            messages: {
                store: MessageStore,
                orderBy: 'id',
                orderByDesc: true,
                limit: this.state.limit
            }
        };
    },

    componentDidMount: function() {
        this.queries.messages.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
        this.queries.messages.removeChangeListener(this._onChange);
    },

    render: function() {
        return <div>
            <ul>
                {this.state.messages.map(function(m) {
                    return <li>{m.content}</li>
                })}
            </ul>
            <button onClick={this._loadMore}>Load More</button>
        </div>;
    },

    _onChange: function() {
        this.setState({messages: this.queries.messages.toArray()});
    },

    _loadMore: function() {
        this.setState({
            limit: this.state.limit + this.props.perPage
        }, this.requery);
        $.get('/messages', {
            untilId: this.state.messages[this.state.messages.length - 1].id,
            limit: this.props.perPage
        }).then(function(result) {
            StoreActions.push('message', result.messages);
        });
    }
});
