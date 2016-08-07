require(["knockout", "../../koHistoryRouter"], function(ko, Router) {
    var router = new Router({
        defaultRoute: "home",
        defaultTitle: "Default title buddy"
    });

    ko.applyBindings({});

    router.start();
});