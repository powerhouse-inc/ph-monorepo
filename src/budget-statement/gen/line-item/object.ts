import { BaseDocument } from '../../../document/object';


import {
    AddLineItemInput,
    UpdateLineItemInput,
    DeleteLineItemInput,
    SortLineItemsInput,
} from '@acaldas/document-model-graphql/budget-statement';

import {
    addLineItem,
    updateLineItem,
    deleteLineItem,
    sortLineItems,
} from './creators';

import { BudgetStatementAction } from '../actions';
import { BudgetStatementState } from '@acaldas/document-model-graphql/budget-statement';

export default class BudgetStatement_LineItem extends BaseDocument<
    BudgetStatementState, BudgetStatementAction
> {
    public addLineItem(input: AddLineItemInput) {
        return this.dispatch(addLineItem(input));
    }
    
    public updateLineItem(input: UpdateLineItemInput) {
        return this.dispatch(updateLineItem(input));
    }
    
    public deleteLineItem(input: DeleteLineItemInput) {
        return this.dispatch(deleteLineItem(input));
    }
    
    public sortLineItems(input: SortLineItemsInput) {
        return this.dispatch(sortLineItems(input));
    }
    
}