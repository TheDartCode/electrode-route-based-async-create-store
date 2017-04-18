import _ from 'underscore';

const replyJson = (reply, data) => {
  const response = reply(null, JSON.stringify(data));
  response.type('application/json');
};

const createHandler = (fetcher) => {
  return (request, reply) => {
    fetcher(request.url.query)
    .then((data) => replyJson(reply, data));
  };
};

const delayedPromise = (timeout, response) =>
  () => new Promise(resolve => _.delay(resolve, timeout, response));

const register = (server, options, next) => {
  server.expose('key', 'value');
  server.route({
    method: 'GET',
    path: '/custom-data',
    handler: createHandler(delayedPromise(3000, 'Async Data has been fetched! Yay!'))
  });
  next();
};

register.attributes = {
  name: 'custom-data',
  version: '1.0.0'
};

export default {
  register
};
