export function performanceLink(options?: {
    debug?: boolean;
    targetDuration?: number;
    verbose?: boolean;
    onRequestStart?: ({ operation, startTime }: {
        operation: Operation;
        startTime: number;
    }) => void;
    onRequestComplete?: ({ data, dataSize, operation, time }: {
        data: any;
        dataSize: number;
        operation: Operation;
        time: number;
    }) => void;
}): ApolloLink;
import { Operation } from "@apollo/client/link/core/types";
import { ApolloLink } from "@apollo/client/link/core";
