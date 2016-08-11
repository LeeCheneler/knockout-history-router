require(["./knockout", "./koHistoryRouter"], function(ko, router) {
    router.init({
        defaultRoute: "home",
        defaultTitle: "Default title buddy"
    });

    ko.applyBindings({});

    router.start();
});