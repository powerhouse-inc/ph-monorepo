import { ListenerFilter } from 'document-model-libs/document-drive';
import { OperationScope } from 'document-model/document';
import { gql, requestGraphql } from '../../../utils/graphql';
import {
    BaseDocumentDriveServer,
    Listener,
    ListenerRevision,
    OperationUpdate,
    StrandUpdate
} from '../../types';
import { ListenerManager } from '../manager';
import { ITransmitter } from './types';

export type OperationUpdateGraphQL = Omit<OperationUpdate, 'input'> & {
    input: string;
};

export type StrandUpdateGraphQL = Omit<StrandUpdate, 'operations'> & {
    operations: OperationUpdateGraphQL[];
};

export class PullResponderTransmitter implements ITransmitter {
    private drive: BaseDocumentDriveServer;
    private listener: Listener;
    private manager: ListenerManager;

    constructor(
        listener: Listener,
        drive: BaseDocumentDriveServer,
        manager: ListenerManager
    ) {
        this.listener = listener;
        this.drive = drive;
        this.manager = manager;
    }

    async transmit(): Promise<ListenerRevision[]> {
        return [];
    }

    async getStrands(
        listenerId: string,
        since?: string
    ): Promise<StrandUpdate[]> {
        // fetch listenerState from listenerManager
        const entries = this.manager.getListener(
            this.listener.driveId,
            listenerId
        );

        // fetch operations from drive  and prepare strands
        const strands: StrandUpdate[] = [];

        for (const entry of entries.syncUnits) {
            if (entry.listenerRev >= entry.syncRev) {
                continue;
            }

            const { documentId, driveId, scope, branch } = entry;
            const operations = await this.drive.getOperationData(
                entry.driveId,
                entry.syncId,
                {
                    since,
                    fromRevision: entry.listenerRev
                }
            );
            strands.push({
                driveId,
                documentId,
                scope: scope as OperationScope,
                branch,
                operations
            });
        }

        return strands;
    }

    async processAcknowledge(
        driveId: string,
        listenerId: string,
        revisions: ListenerRevision[]
    ): Promise<boolean> {
        const listener = this.manager.getListener(driveId, listenerId);
        let success = true;
        for (const revision of revisions) {
            const syncId = listener.syncUnits.find(
                s => s.scope === revision.scope && s.branch === revision.branch
            )?.syncId;
            if (!syncId) {
                success = false;
                continue;
            }

            await this.manager.updateListenerRevision(
                listenerId,
                driveId,
                syncId,
                revision.revision
            );
        }

        return success;
    }

    static async registerPullResponder(
        driveId: string,
        remoteUrl: string,
        filter: ListenerFilter
    ): Promise<Listener['listenerId']> {
        // graphql request to switchboard
        const { registerPullResponderListener } = await requestGraphql<{
            registerPullResponderListener: {
                listenerId: Listener['listenerId'];
            };
        }>(
            `${remoteUrl}/${driveId}`,
            gql`
                mutation registerPullResponderListener(
                    $filter: InputListenerFilter!
                ) {
                    registerPullResponderListener(filter: $filter) {
                        listenerId
                    }
                }
            `,
            { filter }
        );
        return registerPullResponderListener.listenerId;
    }

    static async pullStrands(
        driveId: string,
        remoteUrl: string,
        listenerId: string,
        since?: string // TODO add support for since
    ): Promise<StrandUpdate[]> {
        const { strands } = await requestGraphql<{
            strands: StrandUpdateGraphQL[];
        }>(
            `${remoteUrl}/${driveId}/graphql`,
            gql`
                query strands($listenerId: ID!) {
                    strands(listenerId: $listenerId) {
                        driveId
                        documentId
                        scope
                        branch
                        operations {
                            timestamp
                            skip
                            type
                            input
                            hash
                            index
                        }
                    }
                }
            `,
            { listenerId }
        );
        return strands.map(s => ({
            ...s,
            operations: s.operations.map(o => ({
                ...o,
                input: JSON.parse(o.input)
            }))
        }));
    }

    static async acknowledgeStrands(
        driveId: string,
        remoteUrl: string,
        listenerId: string,
        revisions: ListenerRevision[]
    ): Promise<boolean> {
        const result = await requestGraphql<boolean>(
            `${remoteUrl}/${driveId}`,
            gql`
                mutation acknowledge(
                    $listenerId: String!
                    $revisions: [ListenerRevisionInput]
                ) {
                    acknowledge(listenerId: $listenerId, revisions: $revisions)
                }
            `,
            { listenerId, revisions }
        );
        return result;
    }
}
