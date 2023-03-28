import produce, { castDraft } from 'immer';
import {
    loadStateOperation,
    pruneOperation,
    redoOperation,
    setNameOperation,
    undoOperation,
} from './actions';
import {
    BaseAction,
    isBaseAction,
    LOAD_STATE,
    PRUNE,
    REDO,
    SET_NAME,
    UNDO,
} from './actions/types';
import { Action, Document, ImmutableReducer } from './types';
import { hashDocument } from './utils';

/**
 * Gets the next revision number based on the provided action.
 *
 * @param state The current state of the document.
 * @param action The action being applied to the document.
 * @returns The next revision number.
 */
function getNextRevision(state: Document, action: Action): number {
    // UNDO, REDO and PRUNE alter the revision themselves
    return [UNDO, REDO, PRUNE].includes(action.type)
        ? state.revision
        : state.revision + 1;
}

/**
 * Updates the document header with the latest revision number and
 * date of last modification.
 *
 * @param state The current state of the document.
 * @param action The action being applied to the document.
 * @returns The updated document state.
 */
function updateHeader<T, A extends Action>(
    state: Document<T, A>,
    action: A
): Document<T, A> {
    return {
        ...state,
        revision: getNextRevision(state, action),
        lastModified: new Date().toISOString(),
    };
}

/**
 * Updates the operations history of the document based on the provided action.
 *
 * @param state The current state of the document.
 * @param action The action being applied to the document.
 * @returns The updated document state.
 */
function updateOperations<T, A extends Action>(
    state: Document<T, A>,
    action: A
): Document<T, A> {
    // UNDO, REDO and PRUNE are meta operations
    // that alter the operations history themselves
    if ([UNDO, REDO, PRUNE, PRUNE].includes(action.type)) {
        return state;
    }

    // removes undone operations from history if there
    // is a new operation after an UNDO
    const operations = state.operations.slice(0, state.revision);

    // adds the action to the operations history with
    // the latest index and current timestamp
    return {
        ...state,
        operations: [
            ...operations,
            {
                ...action,
                index: operations.length,
                timestamp: new Date().toISOString(),
                hash: '',
            },
        ],
    };
}

/**
 * Updates the document state based on the provided action.
 *
 * @param state The current state of the document.
 * @param action The action being applied to the document.
 * @returns The updated document state.
 */
function updateDocument<T, A extends Action>(
    state: Document<T, A>,
    action: A | BaseAction
): Document<T, A> {
    let newState = updateOperations(state, action);
    newState = updateHeader(newState, action);
    return newState;
}

/**
 * The base document reducer function that wraps a custom reducer function.
 *
 * @param state The current state of the document.
 * @param action The action being applied to the document.
 * @param wrappedReducer The custom reducer function being wrapped by the base reducer.
 * @returns The updated document state.
 */
function _baseReducer<T, A extends Action>(
    state: Document<T, A>,
    action: BaseAction,
    wrappedReducer: ImmutableReducer<T, A>
): Document<T, A> {
    switch (action.type) {
        case SET_NAME:
            return setNameOperation(state, action.input);
        case UNDO:
            return undoOperation(state, action.input, wrappedReducer);
        case REDO:
            return redoOperation(state, action.input, wrappedReducer);
        case PRUNE:
            return pruneOperation(
                state,
                action.input.start,
                action.input.end,
                wrappedReducer
            );
        case LOAD_STATE:
            return loadStateOperation(state, action.input.state);
        default:
            return state;
    }
}

/**
 * Base document reducer that wraps a custom document reducer and handles
 * document-level actions such as undo, redo, prune, and set name.
 *
 * @template T - The type of the state of the custom reducer.
 * @template A - The type of the actions of the custom reducer.
 * @param state - The current state of the document.
 * @param action - The action object to apply to the state.
 * @param customReducer - The custom reducer that implements the application logic
 * specific to the document's state.
 * @returns The new state of the document.
 */
export function baseReducer<T, A extends Action>(
    state: Document<T, A>,
    action: A | BaseAction,
    customReducer: ImmutableReducer<T, A>
) {
    // if the action is one the base document actions (SET_NAME, UNDO, REDO, PRUNE)
    // then runs the base reducer first
    let newState = state;
    if (isBaseAction(action)) {
        newState = _baseReducer(newState, action, customReducer);
    }

    // updates the document revision number, last modified date
    // and operation history
    newState = updateDocument(newState, action);

    // wraps the custom reducer with Immer to avoid
    // mutation bugs and allow writing reducers with
    // mutating code
    newState = produce(newState, draft => {
        // the reducer runs on a immutable version of
        // provided state
        const returnedDraft = customReducer(draft, action as A);

        // if the reducer creates a new state object instead
        // of mutating the draft then returns the new state
        if (returnedDraft) {
            // casts new state as draft to comply with typescript
            return castDraft(returnedDraft);
        }
    });

    // updates the last operation with the hash of the resulting state
    return produce(newState, draft => {
        draft.operations[draft.operations.length - 1].hash =
            hashDocument(draft);
    });
}
