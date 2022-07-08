import { ApolloLink, Operation } from '@apollo/client'
import quiktime from 'quiktime'
import prettyBytes from 'pretty-bytes'

const DEFAULT_OPTIONS = {
  debug: false,
  targetDuration: 500,
  verbose: false,
}

/**
 * performanceLink
 * Easily log and report on the performance of your GraphQL queries.
 *
 * @param {{ debug?: boolean, targetDuration?: number, verbose?: boolean, onRequestStart?: ({ operation, startTime }: { operation: Operation, startTime: number }) => void, onRequestComplete?: ({ data, dataSize, operation, time }: { data: any, dataSize: number, operation: Operation, time: number }) => void }} [options=]
 * @returns ApolloLink
 */
export const performanceLink = (options = {}) => {
  const {
    debug,
    targetDuration,
    verbose,
    onRequestStart,
    onRequestComplete,
  } = { ...DEFAULT_OPTIONS, ...options }

  return new ApolloLink((operation, forward) => {
    const startTime = Date.now()

    onRequestStart && onRequestStart({ operation, startTime })

    return forward(operation).map((data) => {
      const time = Date.now() - startTime
      const dataSize = new TextEncoder().encode(JSON.stringify(data)).length
      const operationType = operation.query.definitions[0].operation

      if (debug) {
        const groupLabel = `[PerformanceLink] : ${operationType} : ${operation.operationName} - ${quiktime(time)}`
        verbose ? console.group(groupLabel) : console.groupCollapsed(groupLabel)

        // Duration
        console.log(`  Time: ${quiktime(time)}`)

        // Data Size
        console.log(`  Size: ${prettyBytes(dataSize)}`)

        // Data
        console.log('  Data: ', data)

        // Operation
        console.log('  Operation: ', operation)

        console.groupEnd()
      }

      onRequestComplete && onRequestComplete({ data, dataSize, operation, time })

      return data
    })
  })
}
