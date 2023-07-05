---
to: "./src/<%= h.changeCase.param(documentType) %>/gen/object.ts"
force: true
---
import { BaseDocument, applyMixins } from '../../document/object';
import { Document } from '../../document/types';
import { <%= h.changeCase.pascal(documentType) %>State } from '@acaldas/document-model-graphql/<%= h.changeCase.param(documentType) %>';
import { <%= h.changeCase.pascal(documentType) %>Action } from './actions';
import { createEmptyExtendedDocumentModelState } from '../custom/utils';
import { reducer } from './reducer';

<% modules.forEach(module => { _%>
import <%= h.changeCase.pascal(documentType) %>_<%= h.changeCase.pascal(module.name) %> from './<%= module.name %>/object'
<% }); _%>;

<% modules.forEach(module => { _%>
export * from './<%= module.name %>/object'
<% }); _%>;

type Extended<%= h.changeCase.pascal(documentType) %>State = Document<<%= h.changeCase.pascal(documentType) %>State, <%= h.changeCase.pascal(documentType) %>Action>;

interface <%= h.changeCase.pascal(documentType) %> extends 
<%= modules.map(m => '    ' + h.changeCase.pascal(documentType) + '_' + h.changeCase.pascal(m.name)).join(',\n') %> {}

class <%= h.changeCase.pascal(documentType) %> extends BaseDocument<<%= h.changeCase.pascal(documentType) %>State, <%= h.changeCase.pascal(documentType) %>Action> {
    static fileExtension = '<%= extension %>';

    public get state() { return this._state.data; }

    constructor(initialState?: Extended<%= h.changeCase.pascal(documentType) %>State) {
        super(reducer, initialState || createEmptyExtendedDocumentModelState());
    }

    public saveToFile(path: string, name?: string) {
        return super.saveToFile(path, <%= h.changeCase.pascal(documentType) %>.fileExtension, name);
    }

    public loadFromFile(path: string) {
        return super.loadFromFile(path);
    }

    static async fromFile(path: string) {
        const document = new this();
        await document.loadFromFile(path);
        return document;
    }
}

applyMixins(<%= h.changeCase.pascal(documentType) %>, [
<%= modules.map(m => '    ' + h.changeCase.pascal(documentType) + '_' + h.changeCase.pascal(m.name)).join(',\n') %>
]);

export { <%= h.changeCase.pascal(documentType) %>, Extended<%= h.changeCase.pascal(documentType) %>State };