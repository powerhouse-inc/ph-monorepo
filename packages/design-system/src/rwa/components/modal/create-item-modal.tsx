import { Icon, Modal } from '@/powerhouse';
import { RealWorldAssetsState } from '@/rwa/types';
import { ComponentPropsWithoutRef } from 'react';
import { FieldValues, UseFormReset } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';
import { ModalFormInputs } from './modal-form-inputs';

export type RWACreateItemModalProps<TFieldValues extends FieldValues> =
    ComponentPropsWithoutRef<typeof Modal> & {
        readonly state: RealWorldAssetsState;
        readonly open: boolean;
        readonly itemName: string;
        readonly inputs: {
            label: string;
            Input: () => string | React.JSX.Element;
        }[];
        readonly onOpenChange: (open: boolean) => void;
        readonly submit: (e?: React.BaseSyntheticEvent) => Promise<void>;
        readonly reset: UseFormReset<TFieldValues>;
    };

export function RWACreateItemModal<TFieldValues extends FieldValues>(
    props: RWACreateItemModalProps<TFieldValues>,
) {
    const {
        itemName,
        open,
        state,
        inputs,
        onOpenChange,
        reset,
        submit,
        ...restProps
    } = props;

    function handleCancel() {
        reset();
        onOpenChange(false);
    }

    const buttonStyles =
        'min-h-[48px] min-w-[142px] text-base font-semibold py-3 px-6 rounded-xl outline-none active:opacity-75 hover:scale-105 transform transition-all';

    return (
        <Modal
            contentProps={{
                className: 'rounded-3xl',
            }}
            onOpenChange={onOpenChange}
            open={open}
            overlayProps={{
                className: 'top-10',
            }}
            {...restProps}
        >
            <div className="w-[400px] p-6 text-slate-300">
                <div className="mb-6 flex justify-between">
                    <h1 className="text-xl font-bold">Create {itemName}</h1>
                    <button
                        className="flex size-8 items-center justify-center rounded-md bg-gray-100 text-gray-500 outline-none hover:text-gray-900"
                        onClick={handleCancel}
                        tabIndex={-1}
                    >
                        <Icon name="XmarkLight" size={24} />
                    </button>
                </div>
                <ModalFormInputs inputs={inputs} />
                <div className="mt-8 flex justify-between gap-3">
                    <button
                        className={twMerge(
                            buttonStyles,
                            'flex-1 bg-slate-50 text-slate-800',
                        )}
                        onClick={handleCancel}
                    >
                        Cancel
                    </button>
                    <button
                        className={twMerge(
                            buttonStyles,
                            'flex-1 bg-gray-800 text-gray-50',
                        )}
                        onClick={submit}
                    >
                        Save
                    </button>
                </div>
            </div>
        </Modal>
    );
}
