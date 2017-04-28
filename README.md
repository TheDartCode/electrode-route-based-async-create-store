# electrode-route-based-async-create-store [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]
> An electrode app sample architecture for easy declarative route-based SSR store creation supporting async pre-fetch

## Description

This repo aims to suggest a way to manage store creation in an [electrode](https://github.com/electrode-io/electrode) app.
Two problems are tackled in this approach:
1. clean and declarative route-based store creation.
2. correctly pre-fetching data when server side rendering components that need data that is fetched asynchronously. When that data originates from the server of our app, it is a waste of time to not pre-fetch them and leave an extra request for the browser. Furthermore, it ruins SSR, as the page does not come fully rendered.

Let's elaborate on these:

### Clean and declarative route-based store creation

Up to now, electrode does not offer/propose a way to handle creation of the initial state.
In the sample app that the `generator-electrode` creates, the initial state is created in a demo-ish way that cannot be used in a complex application:
```
function createReduxStore(req, match) {
  const initialState = {
    checkBox: {checked: false},
    number: {value: 999}
  };

  const store = createStore(rootReducer, initialState);
  return Promise.resolve(store);
}
```
So, we need a clean way to create different initial states for different pages.

Luckily, electrode gives us access to the currently active route inside `createReduxStore` and we can access it like this:
```
function createReduxStore(req, match) { // eslint-disable-line
  const route = match.renderProps.routes[0];
}
```
This way, if we enrich our routes a bit, we can have a clean and nice solution to our problem:
```
import {getData} from './actions';

const homeInitialState = {
  checkBox: {checked: false},
  number: {value: 999}
};

const staticInitialState = {
  staticData: 'Some non-async data here'
};

export const routes = [
  <Route path="/" component={Home} initialState={homeInitialState} />, // objects are welcome
  <Route path="/async(/:option)" component={Async} initialState={getData} />, // actions are welcome, too!
  <Route path="/static" component={Static} initialState={staticInitialState} />
];
```
and
```
function createReduxStore(req, match) { // eslint-disable-line
  const route = match.renderProps.routes[0];
  const params = match.renderProps.params;

  let initialState = route.initialState;
  let initialStateLoader = noopAction;

  if (isFunction(initialState)) {
    initialStateLoader = initialState;
    initialState = {};
  }

  const storePromise = createStorePromise(initialState);

  return storePromise
    .then(store =>
      store.dispatch(initialStateLoader(params))
      .then(() => store)
    );
}
```


### Correct pre-fetching of async data in SSR

This was a pretty puzzling issue, as I have not found any way to do internal pre-fetching (without performing an HTTP request, but just fetching the data internally from the server) for SSR in electrode.

What I came up with, was a library, [electrode-hybrid-fetch](https://github.com/TheDartCode/electrode-hybrid-fetch).
This library is an abstraction layer between your app and automatic execution of either HAPI.js pre-fetching (for SSR) or regular universal-fetch (for use in client side).
It gives us two methods, `fetch` and `ssrFetch`.
The first one is the regular `fetch` that will be used client-side.
The latter is the fetch method that will be used when pre-fetching for SSR.
Essentially, what it does is that it uses the [inject](https://hapijs.com/api#serverinjectoptions-callback) method of the HAPI.js server to simulate the fetch action internally, and get the data.

Only three simple modifications are needed for this to work:

Firstly, the `setServer` method that `electrode-hybrid-fetch` exposes needs to be called from `server/index.js`, passing a reference to the HAPI.js server instance to it.

Respective diff [here](https://github.com/TheDartCode/electrode-route-based-async-create-store/commit/f1d0ab5bf8bbf9312ea03598301c03446a4df3e8#diff-6e0d62f54b853b53af874f5965d7adf2)

The next modification that is needed, is to use the `redux-thunk` middleware in our redux store and in particular use its `withExtraArgument` method.
We just need to supply the `ssrFetch` and the `fetch` methods of `electrode-hybrid-fetch` to it in the SSR and client side store creation respectively.

Respective diffs [here](https://github.com/TheDartCode/electrode-route-based-async-create-store/commit/f1d0ab5bf8bbf9312ea03598301c03446a4df3e8#diff-6db36c80e6c69073d1acbaf17ecb7520) and [here](https://github.com/TheDartCode/electrode-route-based-async-create-store/commit/f1d0ab5bf8bbf9312ea03598301c03446a4df3e8#diff-2062c74ac5e30b94954d494194083669)

Lastly, we need to perform all our fetch operations within our actions by using the fetch argument the the thunk middleware is passing us (which, effectively, is either `ssrFetch` or regular `fetch`).

Respective diff [here](https://github.com/TheDartCode/electrode-route-based-async-create-store/commit/f1d0ab5bf8bbf9312ea03598301c03446a4df3e8#diff-37c7e078b21b132634cf357859e22da2)

Note that `electrode-hybrid-fetch` is currently just a proof of concept for the scheme to work. However, it will be fully implemented in the near future.

## Conclusion

If you are facing the same problems as me, I would really like your feedback on the solutions I propose.

Do you find that something is wrong?
Perhaps something is missing?
Or some detail that I have failed to foresee?
Open an issue and I'd be happy to discuss it with you!

I hope that my solution has helped you/offered some insight on solving the said problems.

Another Note: I have tried to make the commits as expressive and straight-forward as possible, I hope that by inspecting them you get a taste of the changes that were made.




## License

Apache-2.0 © [TheDartCode](http://www.thedartcode.com)


[npm-image]: https://badge.fury.io/js/electrode-route-based-async-create-store.svg
[npm-url]: https://npmjs.org/package/electrode-route-based-async-create-store
[travis-image]: https://travis-ci.org/thedartcode/electrode-route-based-async-create-store.svg?branch=master
[travis-url]: https://travis-ci.org/thedartcode/electrode-route-based-async-create-store
[daviddm-image]: https://david-dm.org/thedartcode/electrode-route-based-async-create-store.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/thedartcode/electrode-route-based-async-create-store
