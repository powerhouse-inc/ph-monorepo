import { actions } from 'document-model-libs/document-drive';
import * as DocumentModelsLibs from 'document-model-libs/document-models';
import { DocumentModel } from 'document-model/document';
import { describe, beforeAll, it } from 'vitest';
import { DocumentDriveServer } from '../src';
import { PrismaClient } from '@prisma/client';
import { PrismaStorage } from '../src/storage/prisma';

const prismaClient = new PrismaClient();

describe('Document operations', () => {
    const documentModels = [
        ...Object.values(DocumentModelsLibs)
    ] as DocumentModel[];

    const storage = new PrismaStorage(prismaClient);
    let server: DocumentDriveServer;

    beforeAll(async () => {
        server = new DocumentDriveServer(documentModels, storage);
        await server.initialize();
        if ((await server.getDrives()).includes("test")) {
            await server.deleteDrive("test");
        }
        await server.addDrive({ global: { id: "test" } });
        return () => server.deleteDrive("test");
    });

    it("should store resultingState", async ({ expect }) => {
        const result = await server.addDriveAction("test", actions.addFolder({
            id: "folder1",
            name: 'folder1'
        }));
        expect(result.error).toBeUndefined();
        const driveStorage = await storage.getDrive("test");
        expect(JSON.parse(driveStorage.operations.global.at(-1)?.resultingState as string)).toStrictEqual({
            "icon": null,
            "id": "test",
            "name": "",
            "nodes": [
                {
                    "id": "folder1",
                    "kind": "folder",
                    "name": "folder1",
                    "parentFolder": null,
                },
            ],
            "slug": null,
        })
    })

    it("should retrieve only the last resultingState", async ({ expect }) => {
        await server.addDriveAction("test", actions.addFolder({
            id: "folder2",
            name: 'folder2'
        }));

        const driveStorage = await storage.getDrive("test");
        expect(JSON.parse(driveStorage.operations.global.at(-1)?.resultingState as string)).toStrictEqual({
            "icon": null,
            "id": "test",
            "name": "",
            "nodes": [
                {
                    "id": "folder1",
                    "kind": "folder",
                    "name": "folder1",
                    "parentFolder": null,
                },
                {
                    "id": "folder2",
                    "kind": "folder",
                    "name": "folder2",
                    "parentFolder": null,
                },
            ],
            "slug": null,
        })

        expect(driveStorage.operations.global.at(0)?.resultingState).toBeUndefined();
    })

    it("should retrieve only the last resultingState", async ({ expect }) => {
        const drive = await server.getDrive("test");
        expect(drive.state.global).toStrictEqual({
            "icon": null,
            "id": "test",
            "name": "",
            "nodes": [
                {
                    "id": "folder1",
                    "kind": "folder",
                    "name": "folder1",
                    "parentFolder": null,
                },
                {
                    "id": "folder2",
                    "kind": "folder",
                    "name": "folder2",
                    "parentFolder": null,
                },
            ],
            "slug": null,
        });
    })

    it("should retrieve operation attachment", async ({ expect }) => {
        const result = await server.addDriveAction("test", {
            ...actions.addFolder({
                id: "folder3",
                name: 'folder3'
            }), attachments: [{ data: "test", mimeType: "text", hash: "123" }]
        });
        expect(result.error?.message).toBeUndefined();
        const driveStorage = await storage.getDrive("test");
        expect(driveStorage.operations.global.at(-1)?.attachments)
            .toMatchObject([{
                data: "test",
                mimeType: "text",
                hash: "123",
                extension: null,
                filename: null
            }])
    })
});