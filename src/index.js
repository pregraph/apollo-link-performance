import { ApolloLink, Operation } from '@apollo/client'

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

  let log = console.log
  let prettyBytes = null
  let quiktime = null

  if (debug) {
    log = require('ololog')
    prettyBytes = require('pretty-bytes')
    quiktime = require('quiktime')
  }

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
        if (time > targetDuration) {
          log('  Time: '.black + quiktime(time).red)
        } else {
          log('  Time: '.black + quiktime(time).green)
        }

        // Data Size
        log('  Size: ' + prettyBytes(dataSize))

        // Data
        log('  Data: ', data)

        // Operation
        log('  Operation: ', operation)

        console.groupEnd()
      }

      onRequestComplete && onRequestComplete({ data, dataSize, operation, time })

      return data
    })
  })
}
