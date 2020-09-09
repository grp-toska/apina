# DIY boilerplate remover #

Consists of 4 parts:
 
**getMiddleware**

getMiddleware is a function that will create a middleware. It takes one parameter which is an object passed to axios as default values. See <https://github.com/axios/axios#request-config> for request config.

Usage:

```js
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'

import { middleware as simpleApi } from '@toska/apina'
import combinedReducers from './redux'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const store = createStore(
  combinedReducers,
  composeEnhancers(applyMiddleware(thunk, simpleApi({ baseURL: '/api' }))),
```

**apiReducer and errorReducer**

You can write your own reducers, but apiReducer will work for a restful api (?). It's written with convention over configuration in mind so if you want anything different I suggest writing your own.

ErrorReducer is also optional and will offer all request errors so you can push changes to a toast or notification.

Usage:

```js
import { combineReducers } from 'redux'

import { apiReducer as api } from '@toska/apina'
import { errorReducer as errors } from '@toska/apina'

export default combineReducers({
  api,
  errors
})
```

**buildAction**

buildAction will return an action for you to dispatch. You can await the dispatch at it will return the data (or error), the promise is resolved with the request.

Usage:

```js
import { buildAction } from '@toska/apina'

/**
 * The first parameter will be the resource in redux store
 */

export const getMessagesAction = () =>
  buildAction('messages', { url: '/messages' })

/**
 * Second parameter accepts anything axios would accept
 */
export const postMessageAction = (message) =>
  buildAction('messages', { url: '/messages', method: 'post', data: message })

/**
 * Since a DELETE request will only receive a 200 OK message we need to pass the id as the 3rd parameter.
 */
export const deleteMessageAction = (id) =>
  buildAction('messages', { url: `/messages/${id}`, method: 'delete' }, id)
```

## Convention ##

Your API should return objects with `id` field. If they do not have an id field or if the response is not an object (or in case of GET /collection requests, an array) the middleware and/or reducer will not work.