export function performanceLink(options?: {
    debug?: boolean;
    targetDuration?: number;
    verbose?: boolean;
    onRequestStart?: ({ operation, startTime }: {
        operation: Operation;
        startTime: number;
    }) => void;
    onRequestComplete?: ({ data, dataSize, duration, operation }: {
        data: any;
        dataSize: number;
        duration: number;
        operation: Operation;
    }) => void;
}): ApolloLink;
import { Operation } from "@apollo/client/link/core/types";
import { ApolloLink } from "@apollo/client/link/core";
