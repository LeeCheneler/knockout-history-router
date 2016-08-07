/***** History is always pulled from root as it only defines the global 'History' *****/
(function(root, factory) {


    if (typeof define === "function" && define.amd) {
        // Define for AMD (RequireJs for example) 
        define(["knockout", "history"], function(ko) {
            return (root.koHistoryRouter = factory(ko, History));
        });
    }
    else if (typeof module === "object" && module.exports) {
        // Export for CommonJs (Node.js for example) 
        require("./history.js");
        module.exports = (root.koHistoryRouter = factory(require("knockout"), History));
    }
    else {
        if (!root.History) {
            throw "'History' is  not defined! knockout-router depends on History.js (npm: historyjs), preferably native.history.js. Available at: https://github.com/browserstate/history.js/.";
        }
        if (!root.ko) {
            throw "'ko' is not defined! knockout-history-router depends on knockout.js. Available at: https://github.com/knockout/knockout."
        }
        // Define on root (this would be 'window' in a browser environment for example)
        root.koHistoryRouter = factory(root.ko, root.History);
    }
}(this, function(ko, history) {
    /* config definition
            {
                defaultRoute: string,
                defaultTitle: string.
                <route>Title: string // you can override titles for specific routes by adding a property like so
            }
        */
    var router = function(config) {
        var self = this;

        /*
        * PUBLIC PROPERTIES
        */
        this.state = ko.observable("");
        this.config = config;

        /*
        * CONSTRUCTION
        */

        // Validate config
        if (!config.defaultRoute) {
            throw "No default route set! ('config.defaultRoute')";
        }

        if (!config.defaultTitle) {
            throw "No default title set! ('config.defaultTitle')";
        }

        // Start listening to state changes in URL to trigger navigation
        history.Adapter.bind(window, "statechange", function () {
            setStateFromUrl();
        });

        // Register knockout bindings for routing (route, goto)
        ko.bindingHandlers.route = {
            init: function (element, valueAccessor) {
                var route = ko.unwrap(valueAccessor());
                self.state.subscribe(function (newState) {
                    if (route == newState) {
                        element.style.display = 'block';
                    }
                    else {
                        element.style.display = 'none';
                    }
                });
            }
        };

        ko.bindingHandlers.goto = {
            init: function (element, valueAccessor) {
                var route = ko.unwrap(valueAccessor());
                element.onclick = function () {
                    self.goto(route);
                    return false;
                }
            }
        };

        /*
        * PUBLIC METHODS
        */

        // Start the router, navigates to a route, the default one if one doesn't exist in URL
        this.start = function () {
            setStateFromUrl();
        }

        // Get a URL parameter by name from the URL
        this.getUrlParameter = function (name) {
            var param = getUrlParameterFromUrl(name);
            return param;
        }

        // Navigate to a route
        this.goto = function (route) {
            history.pushState({ state: route }, getTitle(route), "?state=" + route);
        };
        
        /*
        * PRIVATE METHODS
        */

        // Get title for a route
        function getTitle(route) {
            if (self.config[route + "Title"]) {
                return self.config[route + "Title"];
            }

            return self.config.defaultTitle;
        }

        // Set the state property in this object to the state in the URL
        function setStateFromUrl() {
            var urlState = getUrlParameterFromUrl("state");
            // If no state, then push to default state
            if (urlState == null) {
                self.goto(self.config.defaultRoute);
            }
            else {
                self.state(urlState);
            }
        }

        // Get a named URL parameter from a provided URL
        function getUrlParameterFromUrl(name) {
            var stateObj = history.getState();
            name = name.replace(/[\[\]]/g, "\\$&");
            var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
                results = regex.exec(stateObj.hash);
            if (!results) return null;
            if (!results[2]) return '';
            return decodeURIComponent(results[2].replace(/\+/g, " "));
        }

    };
        
    return router;
}));
