import { DocumentModel } from 'document-model';
import fs from 'fs';
import { Logger, runner } from 'hygen';
import path from 'path';
import { loadDocumentModel } from './utils';

const logger = new Logger(console.log.bind(console));
const defaultTemplates = path.join(__dirname, '.hygen', 'templates');

async function run(args: string[], { watch = false, format = false } = {}) {
    const result = await runner(args, {
        templates: defaultTemplates,
        cwd: process.cwd(),
        logger,
        createPrompter: () => {
            return require('enquirer');
        },
        exec: (action, body) => {
            const opts = body && body.length > 0 ? { input: body } : {};
            return require('execa').shell(action, opts);
        },
        debug: !!process.env.DEBUG,
    });
    if (format) {
        const execa = await import('execa');
        result.actions
            .filter(action => ['added', 'inject'].includes(action.status))
            .forEach(action => {
                execa.$`prettier --ignore-path --write ${action.subject.replace(
                    '.',
                    process.cwd(),
                )}`;
            });
    }

    return result;
}

export async function generateAll(
    dir: string,
    { watch = false, format = false } = {},
) {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    for (const directory of files.filter(f => f.isDirectory())) {
        const documentModelPath = path.join(
            dir,
            directory.name,
            `${directory.name}.json`,
        );
        if (!fs.existsSync(documentModelPath)) {
            continue;
        }

        try {
            const documentModel = await loadDocumentModel(documentModelPath);
            await generateDocumentModel(documentModel, dir, { watch, format });
        } catch (error) {
            console.error(directory.name, error);
        }
    }
}

export async function generateDocumentModel(
    documentModel: DocumentModel.DocumentModelState,
    dir: string,
    { watch = false, format = false } = {},
) {
    const latestSpec =
        documentModel.specifications[documentModel.specifications.length - 1];
    const hasLocalSchema = latestSpec.state.local.schema !== '';

    // Generate the singular files for the document model logic
    await run(
        [
            'powerhouse',
            'generate-document-model',
            '--document-model',
            JSON.stringify(documentModel),
            '--root-dir',
            dir,
            '--has-local-schema',
            hasLocalSchema.toString(),
        ],
        { watch, format },
    );

    // Generate the module-specific files for the document model logic

    for (const module of latestSpec.modules) {
        await run(
            [
                'powerhouse',
                'generate-document-model-module',
                '--document-model',
                JSON.stringify(documentModel),
                '--root-dir',
                dir,
                '--module',
                module.name,
            ],
            { watch, format },
        );
    }
}

export async function generateEditor(
    name: string,
    documentTypes: string[],
    documentTypesMap: Record<string, string>,
    dir: string,
    documentModelsDir: string,
    { format = false } = {},
) {
    // Generate the singular files for the document model logic
    await run(
        [
            'powerhouse',
            'generate-editor',
            '--name',
            name,
            '--root-dir',
            dir,
            '--document-types',
            documentTypes.join(','),
            '--document-types-map',
            JSON.stringify(documentTypesMap),
            '--document-models-dir',
            documentModelsDir,
        ],
        { format },
    );
}
