import type {
    DocumentDriveAction,
    DocumentDriveDocument,
    DocumentDriveLocalState,
    DocumentDriveState,
    ListenerCallInfo,
    ListenerFilter
} from 'document-model-libs/document-drive';
import type {
    BaseAction,
    CreateChildDocumentInput,
    Document,
    Operation,
    OperationScope,
    Signal,
    State
} from 'document-model/document';
import { ITransmitter } from './listener/transmitter/types';

export type DriveInput = State<
    Omit<DocumentDriveState, '__typename' | 'id' | 'nodes'> & { id?: string },
    DocumentDriveLocalState
>;

export type RemoteDriveOptions = DocumentDriveLocalState & {
    // TODO make local state optional
    pullFilter?: ListenerFilter;
    pullInterval?: number;
};

export type CreateDocumentInput = CreateChildDocumentInput;

export type SignalResult = {
    signal: Signal;
    result: unknown; // infer from return types on document-model
};

export type IOperationResult<T extends Document = Document> = {
    success: boolean;
    error?: Error;
    operations: Operation[];
    document: T | undefined;
    signals: SignalResult[];
};

export type SynchronizationUnit = {
    syncId: string;
    driveId: string;
    documentId: string;
    documentType: string;
    scope: string;
    branch: string;
    lastUpdated: string;
    revision: number;
};

export type Listener = {
    driveId: string;
    listenerId: string;
    label?: string;
    block: boolean;
    system: boolean;
    filter: ListenerFilter;
    callInfo?: ListenerCallInfo;
};

export type CreateListenerInput = {
    driveId: string;
    label?: string;
    block: boolean;
    system: boolean;
    filter: ListenerFilter;
    callInfo?: ListenerCallInfo;
};

export enum TransmitterType {
    Internal,
    SwitchboardPush,
    PullResponder,
    SecureConnect,
    MatrixConnect,
    RESTWebhook
}

export type ListenerRevision = {
    driveId: string;
    documentId: string;
    scope: string;
    branch: string;
    status: UpdateStatus;
    revision: number;
};

export enum UpdateStatus {
    SUCCESS = 'SUCCESS',
    MISSING = 'MISSING',
    CONFLICT = 'CONFLICT',
    ERROR = 'ERROR'
}

export type OperationUpdate = {
    timestamp: string;
    index: number;
    skip: number;
    type: string;
    input: object;
    hash: string;
};

export type StrandUpdate = {
    driveId: string;
    documentId: string;
    scope: OperationScope;
    branch: string;
    operations: OperationUpdate[];
};

export type SyncStatus = 'SYNCING' | 'SUCCESS' | 'ERROR';

export abstract class BaseDocumentDriveServer {
    /** Public methods **/
    abstract getDrives(): Promise<string[]>;
    abstract addDrive(drive: DriveInput): Promise<void>;
    abstract addRemoteDrive(
        url: string,
        options: RemoteDriveOptions
    ): Promise<void>;
    abstract deleteDrive(id: string): Promise<void>;
    abstract getDrive(id: string): Promise<DocumentDriveDocument>;

    abstract getDocuments(drive: string): Promise<string[]>;
    abstract getDocument(drive: string, id: string): Promise<Document>;

    abstract addOperation(
        drive: string,
        id: string,
        operation: Operation
    ): Promise<IOperationResult<Document>>;
    abstract addOperations(
        drive: string,
        id: string,
        operations: Operation[]
    ): Promise<IOperationResult<Document>>;

    abstract addDriveOperation(
        drive: string,
        operation: Operation<DocumentDriveAction | BaseAction>
    ): Promise<IOperationResult<DocumentDriveDocument>>;
    abstract addDriveOperations(
        drive: string,
        operations: Operation<DocumentDriveAction | BaseAction>[]
    ): Promise<IOperationResult<DocumentDriveDocument>>;

    abstract getSyncStatus(drive: string): SyncStatus;

    /** Synchronization methods */
    abstract getSynchronizationUnits(
        driveId: string,
        documentId?: string[],
        scope?: string[],
        branch?: string[]
    ): Promise<SynchronizationUnit[]>;

    abstract getSynchronizationUnit(
        driveId: string,
        syncId: string
    ): Promise<SynchronizationUnit>;

    abstract getOperationData(
        driveId: string,
        syncId: string,
        filter: {
            since?: string;
            fromRevision?: number;
        }
    ): Promise<OperationUpdate[]>;

    /** Internal methods **/
    protected abstract createDocument(
        drive: string,
        document: CreateDocumentInput
    ): Promise<Document>;
    protected abstract deleteDocument(drive: string, id: string): Promise<void>;

    abstract getTransmitter(
        driveId: string,
        listenerId: string
    ): Promise<ITransmitter | undefined>;
}

export abstract class BaseListenerManager {
    protected drive: BaseDocumentDriveServer;
    protected listenerState: Map<string, Map<string, ListenerState>> =
        new Map();
    protected transmitters: Record<
        DocumentDriveState['id'],
        Record<Listener['listenerId'], ITransmitter>
    > = {};

    constructor(
        drive: BaseDocumentDriveServer,
        listenerState: Map<string, Map<string, ListenerState>> = new Map()
    ) {
        this.drive = drive;
        this.listenerState = listenerState;
    }

    abstract init(): Promise<void>;
    abstract addListener(listener: Listener): Promise<ITransmitter>;
    abstract removeListener(
        driveId: string,
        listenerId: string
    ): Promise<boolean>;
    abstract getTransmitter(
        driveId: string,
        listenerId: string
    ): Promise<ITransmitter | undefined>;
    abstract updateSynchronizationRevision(
        driveId: string,
        syncId: string,
        syncRev: number,
        lastUpdated: string
    ): Promise<void>;

    abstract updateListenerRevision(
        listenerId: string,
        driveId: string,
        syncId: string,
        listenerRev: number
    ): Promise<void>;
}

export type IDocumentDriveServer = Pick<
    BaseDocumentDriveServer,
    keyof BaseDocumentDriveServer
>;

export enum ListenerStatus {
    CREATED,
    PENDING,
    SUCCESS,
    MISSING,
    CONFLICT,
    ERROR
}

export interface ListenerState {
    driveId: string;
    block: boolean;
    pendingTimeout: string;
    listener: Listener;
    syncUnits: SyncronizationUnitState[];
    listenerStatus: ListenerStatus;
}

export interface SyncronizationUnitState extends SynchronizationUnit {
    listenerRev: number;
    syncRev: number;
}
