import { reducer } from '../../src/budget-statement';
import { createBudgetStatement } from '../../src/budget-statement/custom/utils';
import {
    addVesting,
    deleteVesting,
    updateVesting,
} from '../../src/budget-statement/gen';

describe('Budget Statement Vesting reducer', () => {
    it('should start as empty array', async () => {
        const document = createBudgetStatement();
        expect(document.extendedState.state.vesting).toStrictEqual([]);
    });

    it('should add comment', async () => {
        const document = createBudgetStatement();
        const newDocument = reducer(
            document,
            addVesting([
                {
                    amount: '100',
                    amountOld: '40',
                    comment: 'New FTEs',
                    currency: 'MKR',
                    date: '2023-03-15',
                    key: '123',
                    vested: false,
                },
            ])
        );
        expect(newDocument.extendedState.state.vesting).toStrictEqual([
            {
                amount: '100',
                amountOld: '40',
                comment: 'New FTEs',
                currency: 'MKR',
                date: '2023-03-15',
                key: '123',
                vested: false,
            },
        ]);
        expect(document.extendedState.state.vesting).toStrictEqual([]);
    });

    it('should update vesting', async () => {
        let document = createBudgetStatement();
        document = reducer(
            document,
            addVesting([
                {
                    amount: '100',
                    amountOld: '40',
                    comment: 'New FTEs',
                    currency: 'MKR',
                    date: '2023-03-15',
                    key: '123',
                    vested: false,
                },
            ])
        );
        document = reducer(
            document,
            updateVesting([{ key: '123', amount: '300' }])
        );
        expect(document.extendedState.state.vesting[0]).toStrictEqual({
            amount: '300',
            amountOld: '40',
            comment: 'New FTEs',
            currency: 'MKR',
            date: '2023-03-15',
            key: '123',
            vested: false,
        });
    });

    it('should delete vesting', async () => {
        let document = createBudgetStatement();
        document = reducer(
            document,
            addVesting([
                {
                    key: '123',
                },
            ])
        );

        document = reducer(document, deleteVesting(['123']));
        expect(document.extendedState.state.vesting.length).toBe(0);
    });

    it('should generate vesting key if undefined', async () => {
        jest.useFakeTimers({ now: new Date('2023-03-16') });
        const document = createBudgetStatement();
        const newDocument = reducer(
            document,
            addVesting([
                {
                    date: '2023-03-16',
                },
            ])
        );
        expect(newDocument.extendedState.state.vesting[0].key.length).toBe(28);
        expect(newDocument.extendedState.state.vesting[0].amount).toBe('');
    });

    it('should sort vestings by date', async () => {
        const document = createBudgetStatement();
        const newDocument = reducer(
            document,
            addVesting([
                {
                    date: '2023-03-11',
                },
                {
                    date: '2023-03-15',
                },
                {
                    date: '2023-03-13',
                },
            ])
        );
        expect(newDocument.extendedState.state.vesting[0].date).toBe(
            '2023-03-11'
        );
        expect(newDocument.extendedState.state.vesting[1].date).toBe(
            '2023-03-13'
        );
        expect(newDocument.extendedState.state.vesting[2].date).toBe(
            '2023-03-15'
        );
    });

    it('should throw if vesting key already exists', async () => {
        const document = createBudgetStatement();
        expect(() =>
            reducer(
                document,
                addVesting([
                    {
                        key: '123',
                        date: '2023-03-15',
                    },
                    {
                        key: '123',
                        date: '2023-03-13',
                    },
                ])
            )
        ).toThrow();
    });

    it('should ignore non existing keys on update', async () => {
        let document = createBudgetStatement();
        document = reducer(
            document,
            addVesting([
                {
                    key: '123',
                    amount: '100',
                },
            ])
        );

        document = reducer(
            document,
            updateVesting([
                {
                    key: '123',
                    amount: '200',
                },
                {
                    key: '456',
                    amount: '300',
                },
            ])
        );

        expect(document.extendedState.state.vesting).toStrictEqual([
            {
                amount: '200',
                amountOld: '100',
                comment: '',
                currency: '',
                date: '',
                key: '123',
                vested: false,
            },
        ]);
    });
});
