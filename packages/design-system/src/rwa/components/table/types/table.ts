import { DivProps } from '@/powerhouse';
import {
    FixedIncome,
    GroupTransaction,
    RealWorldAssetsState,
    ServiceProviderFeeType,
} from '@/rwa';
import React, { ReactNode, RefObject } from 'react';
import { FieldValues } from 'react-hook-form';

export type ColumnCountByTableWidth = Record<number, number>;

export type SortDirection = 'asc' | 'desc';

export type ItemData = string | number | Date | null | undefined;

export type Item = Record<string, any>;

export type TableItem<TItem extends Item> = TItem & {
    id: string;
    itemNumber: number;
    customTransform?: (
        itemData: ItemData,
        columnKey: string,
    ) => React.JSX.Element | ReactNode | undefined;
    moreDetails?: null;
};

export interface TableColumn<
    TItem extends Item,
    TTableData extends TableItem<TItem>,
> {
    key: keyof TTableData & string;
    label: ReactNode | null; // Allows JSX or string labels, null for no header
    allowSorting?: boolean;
    isSpecialColumn?: boolean; // Used to identify index or more details columns
    isNumberColumn?: boolean; // Used to right-align numbers
    decimalScale?: number; // Used to format numbers
    displayTime?: boolean; // Used to format dates (true for datetime-local)
}

export type TableBaseProps<
    TItem extends Item,
    TTableData extends TableItem<TItem>,
> = DivProps & {
    columns: TableColumn<TItem, TTableData>[];
    tableData: TTableData[] | undefined;
    renderRow: (
        item: TTableData,
        columns: TableColumn<TItem, TTableData>[],
        index: number,
    ) => JSX.Element;
    onClickSort: (key: string, direction: SortDirection) => void;
    children?: ReactNode;
    footer?: ReactNode;
    headerRef: RefObject<HTMLTableSectionElement>;
    maxHeight?: string;
    hasSelectedItem?: boolean;
    specialFirstRow?: (
        columns: TableColumn<TItem, TTableData>[],
    ) => JSX.Element;
    specialLastRow?: (columns: TableColumn<TItem, TTableData>[]) => JSX.Element;
};

export type TableProps<
    TItem extends Item,
    TTableData extends TableItem<TItem>,
    TFieldValues extends FieldValues = FieldValues,
> = TableWrapperProps<TFieldValues> & {
    columns: TableColumn<TItem, TTableData>[];
    tableData: TTableData[] | undefined;
    itemName: string;
    columnCountByTableWidth?: ColumnCountByTableWidth;
    selectedTableItem: TTableData | undefined;
    operation: Operation;
    setOperation: (operation: Operation) => void;
    setSelectedTableItem: (item: TTableData | undefined) => void;
    specialFirstRow?: (
        columns: TableColumn<TItem, TTableData>[],
    ) => JSX.Element;
    specialLastRow?: (columns: TableColumn<TItem, TTableData>[]) => JSX.Element;
};

export type TableWrapperProps<TFormInputs extends FieldValues> = {
    state: RealWorldAssetsState;
    isAllowedToCreateDocuments: boolean;
    isAllowedToEditDocuments: boolean;
    onSubmitCreate: (data: TFormInputs) => void;
    onSubmitEdit: (data: TFormInputs) => void;
    onSubmitDelete: (itemId: string) => void;
};

export type Operation = 'view' | 'create' | 'edit' | null;

export type GroupTransactionsTableItem = GroupTransaction & {
    typeLabel: string;
    asset: string | undefined;
    quantity: number | undefined;
    cashAmount: number | undefined;
    totalFees: number;
    cashBalanceChange: number;
};

export type ServiceProviderFeeTypeTableItem = ServiceProviderFeeType & {
    accountName: string | undefined;
    accountReference: string | undefined;
};
export type AssetsTableItem = FixedIncome & {
    currentValue: number | null;
};
