import type { Operation } from 'document-model/document';
import type { ErrorStatus } from './types';

export class OperationError extends Error {
    status: ErrorStatus;
    operation: Operation | undefined;

    constructor(
        status: ErrorStatus,
        operation?: Operation,
        message?: string,
        cause?: unknown
    ) {
        super(message, { cause: cause ?? operation });
        this.status = status;
        this.operation = operation;
    }
}

export class ConflictOperationError extends OperationError {
    constructor(existingOperation: Operation, newOperation: Operation) {
        super(
            'CONFLICT',
            newOperation,
            `Conflicting operation on index ${newOperation.index}`,
            { existingOperation, newOperation }
        );
    }
}

export class MissingOperationError extends OperationError {
    constructor(index: number, operation: Operation) {
        super('MISSING', operation, `Missing operation on index ${index}`);
    }
}
