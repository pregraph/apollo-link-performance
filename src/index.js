import { ApolloLink } from '@apollo/client'
import prettyBytes from 'pretty-bytes'
import quiktime from 'quiktime'
import { map } from 'rxjs'

const isClient = () => typeof window !== 'undefined'

const DEFAULT_OPTIONS = {
  debug: false,
  targetDuration: 500,
  verbose: false,
}

/**
 * performanceLink
 * Easily log and report on the performance of your GraphQL queries.
 *
 * @param {{ debug?: boolean, targetDuration?: number, verbose?: boolean, onRequestStart?: ({ operation, startTime }: { operation: Operation, startTime: number }) => void, onRequestComplete?: ({ data, dataSize, duration, operation }: { data: any, dataSize: number, duration: number, operation: Operation }) => void }} [options=]
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

    return forward(operation).pipe(map((data) => {
      const duration = Date.now() - startTime
      const dataSize = new TextEncoder().encode(JSON.stringify(data)).length

      if (isClient() && debug) {
        try {
          const operationType = operation.query.definitions[0].operation
          const groupLabel = `[PerformanceLink] : ${operationType} : ${operation.operationName} - ${quiktime(duration)}`
          verbose ? console.group(groupLabel) : console.groupCollapsed(groupLabel)

          // Duration
          console.log('  Duration: ' + quiktime(duration))

          // Data Size
          console.log(`  Size: ${prettyBytes(dataSize)}`)

          // Data
          console.log('  Data: ', data)

          // Operation
          console.log('  Operation: ', operation)

          console.groupEnd()
        } catch (err) {
          console.error(err)
        }
      }

      onRequestComplete && onRequestComplete({ data, dataSize, duration, operation })

      return data
    }))
  })
}
