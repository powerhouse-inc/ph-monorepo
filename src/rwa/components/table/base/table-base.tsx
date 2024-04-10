import { Icon, fixedForwardRef, mergeClassNameProps } from '@/powerhouse';
import { SortDirection, TableBaseProps, TableColumn, TableItem } from '@/rwa';
import { Order } from 'natural-orderby';
import React, { useState } from 'react';
import { twMerge } from 'tailwind-merge';

/**
 * Base table component
 *
 * @type TItem - Table item type, any record with an "id" field and any string keys
 * @type TableColumn - Specifies how to render a column. Must have a `key` which is a key of TItem, and a `label` which is the column header
 * @param tableData - Array of data to display, data must satisfy TItem
 * @param columns - Array of columns to display, column must satisfy TableColumn. The columns will be displayed in the order they are provided. Use the `useColumnPriority` hook to handle dropping columns for smaller screens.
 * @param children - Content to render above the table rows
 * @param footer - Content to render below the table rows
 * @param renderRow - Function to render a row, must return a React element
 * @param onClickSort - Function to handle sorting, called with key and direction
 * @param hasExpandedRow - Whether the table has an expanded row
 * @param specialFirstRow - Function to render a special first row (like the cash asset for instance), must return a React element
 */
export const TableBase = fixedForwardRef(function TableBase<
    TItem extends TableItem,
>(props: TableBaseProps<TItem>, ref: React.ForwardedRef<HTMLDivElement>) {
    const {
        children,
        tableData,
        columns,
        footer,
        renderRow,
        onClickSort,
        hasExpandedRow,
        specialFirstRow,
        ...containerProps
    } = props;

    const [sortDirection, setSortDirection] = useState<SortDirection | null>(
        null,
    );
    const [sortKey, setSortKey] = useState<string | null>(null);

    const rowHeight = 34;
    const headerHeight = 42;
    const bottomPadding = 8;
    const heightOf20Rows = rowHeight * 20;
    const maxHeight = hasExpandedRow
        ? 'max-content'
        : `${headerHeight + heightOf20Rows + bottomPadding}px`;

    return (
        <>
            <div
                {...mergeClassNameProps(
                    containerProps,
                    'relative overflow-auto rounded-lg border border-gray-300 bg-white',
                )}
                ref={ref}
                style={{ maxHeight }}
            >
                <table className="w-full">
                    <thead className="sticky top-0 z-10 select-none text-nowrap border-b border-gray-300 bg-gray-100">
                        <tr>
                            {columns.map(column => (
                                <th
                                    className={twMerge(
                                        'group border-l border-gray-300 py-3 pl-3 text-start text-xs font-medium text-gray-600 first:border-l-0',
                                        column.allowSorting &&
                                            'cursor-pointer hover:text-gray-900',
                                    )}
                                    onClick={() => {
                                        if (!column.allowSorting) return;
                                        let sortDir: Order = 'asc';

                                        if (
                                            sortKey === column.key &&
                                            sortDirection === 'asc'
                                        ) {
                                            sortDir = 'desc';
                                        }

                                        setSortDirection(sortDir);
                                        setSortKey(column.key);

                                        onClickSort(column.key, sortDir);
                                    }}
                                    key={column.key}
                                >
                                    <div
                                        className={twMerge(
                                            'group flex items-center',
                                            column.isNumberColumn &&
                                                'justify-end',
                                        )}
                                    >
                                        {column.label}
                                        {column.allowSorting && (
                                            <Icon
                                                name="arrow-filled-right"
                                                size={6}
                                                className={twMerge(
                                                    'invisible ml-1 rotate-90',
                                                    sortKey === column.key &&
                                                        'group-hover:visible',
                                                    sortDirection === 'asc' &&
                                                        'rotate-[270deg]',
                                                )}
                                            />
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {children}
                        {specialFirstRow?.(columns as TableColumn<TableItem>[])}
                        {tableData?.map((item, index) =>
                            renderRow(item, columns, index),
                        )}
                    </tbody>
                </table>
            </div>
            {footer}
        </>
    );
});
