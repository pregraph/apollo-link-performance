# ⏱ apollo-link-performance

Easily tap into Apollo Client requests and log those in your performance tracking tool of choice.

## Install

Via [npm](https://npmjs.com/package/apollo-link-performance)

```sh
npm install apollo-link-performance
```

Via [Yarn](https://yarn.pm/apollo-link-performance)

```sh
yarn add apollo-link-performance
```

## How to use

```
import { ApolloClient, from, HTTPLink } from '@apollo/client'
import { performanceLink } from 'apollo-link-performance'
import analytics from '../libs/analytics'

const httpLink = new HttpLink({
  uri: https://mygraphqlapi.com,
})

const client = new ApolloClient({
  link: from([
    performanceLink({
      onRequestComplete: ({ data, dataSize, operation, time }) => {
        analytics.track(`GraphQL Request - Performance`, {
          dataSize,
          operationName: operation.operationName,
          operationType: operation.query.definitions[0].operation,
          time,
        })
      }
    })
    httpLink,
  ])
})

```

## License

[MIT](LICENSE) © [Pregraph](https://www.pregraph.com)
