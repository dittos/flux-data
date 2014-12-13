var StoreQueryMixin = {
    componentWillMount: function() {
        this.requery();
    },

    requery: function() {
        if (this.queries) {
            for (var key in this.queries) {
                this.queries[key].release();
            }
        }
        this.queries = {};
        var requests = this.getQueryRequests();
        for (var key in requests) {
            if (requests.hasOwnProperty(key)) {
                this.queries[key] = request.store.query(request);
            }
        }
    }
};

module.exports = StoreQueryMixin;
