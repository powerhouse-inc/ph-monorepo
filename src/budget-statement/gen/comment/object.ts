import { BaseDocument } from '../../../document/object';

import {
    AddCommentInput,
    UpdateCommentInput,
    DeleteCommentInput,
    BudgetStatementState
} from '../types';
import {
    addComment,
    updateComment,
    deleteComment,
} from './creators';
import { BudgetStatementAction } from '../actions';

export default class BudgetStatement_Comment extends BaseDocument<
    BudgetStatementState, BudgetStatementAction
> {
    public addComment(input: AddCommentInput) {
        return this.dispatch(addComment(input));
    }
    
    public updateComment(input: UpdateCommentInput) {
        return this.dispatch(updateComment(input));
    }
    
    public deleteComment(input: DeleteCommentInput) {
        return this.dispatch(deleteComment(input));
    }
    
}