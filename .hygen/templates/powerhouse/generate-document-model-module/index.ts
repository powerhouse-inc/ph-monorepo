import { DocumentModelState } from '@powerhouse/document-model/document-model';

export default {
    params: ({ args }: { args: { documentModel: string; module: string } }) => {
        const documentModel = JSON.parse(
            args.documentModel,
        ) as DocumentModelState;
        const latestSpec =
            documentModel.specifications[
                documentModel.specifications.length - 1
            ];
        const filteredModules = latestSpec.modules.filter(
            m => m.name === args.module,
        );
        return {
            documentType: documentModel.name,
            module: args.module,
            actions:
                filteredModules.length > 0
                    ? filteredModules[0].operations.map(a => ({
                          name: a.name,
                          hasInput: a.schema !== null,
                          hasAttachment: a.schema?.includes(': Attachment'),
                      }))
                    : [],
        };
    },
};
