# knockout-history-router
 
 Knockout-history-router makes SPA routing with [knockout](http://knockoutjs.com) super simple! It is powered by 2 custom bindings provided by this library, **goto** and **route**. Behind the scenes **[History.js](https://github.com/browserstate/history.js)** is used to handle the current Url state and push new states to the Url.
 
## Dependencies

Knockout-history-router depends on History.js. All you need to do is ensure that History.js is included in your webpage before this. If you're using Require.js then you just need to ensure History.js is in the same directory as knockout-history-router when compiling your application. It uses HTML 5 Url state to route on the local webpage without posting back to the web server.

## Usage

```
<a href="#" data-bind="goto: 'home'">Home</a>
<a href="#" data-bind="goto: 'contactus'"><Contact Us</a>

<div data-bind="route: 'home'">
  This the home page!!
</div>
<div data-bind="route: 'contact'">
  This the contact us page!!
</div>

<script src="../../bower_components/knockout/dist/knockout.js"></script>
<script src="../../bower_components/history.js/scripts/bundled/html5/native.history.js"></script>
<script src="../../koHistoryRouter.js"></script>
<script>
  koHistoryRouter.init({
      defaultRoute: "home",
      defaultTitle: "Home!",
      contactTitle: "Contact!"
  });
  ko.applyBindings({});
  koHistoryRouter.start();
</script>
```

## The Url 

Knockout-history-router uses History.js to listen to new states being pushed to the Url. A Url with a pushed state looks like the following:

```
http://www.example.com/?state=home
```

## Router Methods

#### init(config:object)

The init method sets up the router. It registers the *goto* and *route* knockout bindings, sets up History.js and takes a config object that **must** at least match the following:

```
{
  defaultRoute: "home",
  defaultTitle: "My Website!"
}
```

You can override the default title for certain routes by adding that routes title to the config object like so:

```
{
  defaultRoute: "home",
  defaultTitle: "My Website!",
  // [route]Title: "some value",
  homeTitle: "Home page!!"
}
```

#### start()

The start method starts the router and routes to the correct route. This is the default route configured if no state exists in the Url.

#### getUrlParameter(name:string)

Due to History.js being awesome and having a good API, this router will maintain any Url parameters in the Url as you transition between pages. You can grab any parameter from the url by name using this method.

Given the Url:

```
http://www.example.com/?state=home&id=1000
```

You can get the value of a parameter in the Url like so:

```
// id = 1000
var id = koHistoryRouter.getUrlParameter("id");
```

#### goto(route:string)

This method will push a state to the Url, that the router will pick up on and route to.

So when on page:

```
http://www.example.com/?state=home
```

And you call:

```
koHistoryRouter.goto("contactus");
```

Knockout-history-router will push the state 'contactus' and the Url will look like so:

```
http://www.example.com/?state=contactus
```

#### subscribeToRouteChanged(subscriber:function(event:string, data:string))

Subscribe to the route changed event. Returns a token to use to unsubscribe.

The library [PubSubJs](https://github.com/mroderick/PubSubJS) is used to serve the events. 

#### UnsubscribeFromRouteChanged(token:object)

Unsubscribe from the route changed event using the token gained from when subscribing.

The library [PubSubJs](https://github.com/mroderick/PubSubJS) is used to serve the events. 
