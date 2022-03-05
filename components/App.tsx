import React from 'react';
import styled from 'styled-components';
import { DebounceSelect } from './DebounceSelect';
import { Button, Input, Modal, Popconfirm, Table, Typography } from 'antd';
import { apiGet } from '../hooks/api';
import { DataType } from '../Types';
import { formatNumber } from '../utils/formatNumber';
import useColumnSearch from './ColumnSearch';

const initialData: DataType[] = [
    {
        key: 'USD',
        officialName: 'United States of America',
        population: 329484123,
        currency: 'USD',
    },
    {
        key: 'PKR',
        officialName: 'Islamic Republic of Pakistan',
        population: 220892331,
        currency: 'PKR',
    },
];

export const App = () => {
    const [values, setValues] = React.useState<DataType[]>([]);
    const [baseCurrencyRate, setBaseCurrencyRate] = React.useState<any>(null);
    const [amount, setAmount] = React.useState<number>(1);
    const [total, setTotal] = React.useState<string | null>(null);
    const [error, setError] = React.useState(null);
    const [isModalVisible, setIsModalVisible] = React.useState(false);
    const [dataSource, setDataSource] = React.useState(initialData);
    const [nameSearchHook] = useColumnSearch();

    const handleDelete = (key: React.Key) => {
        setDataSource(dataSource.filter((item) => item.key !== key));
    };

    const Convert = async (record: DataType) => {
        let currentEURate: any = await apiGet(
            `/api/rate?rate=${record.currency}`
        );

        setBaseCurrencyRate({
            rate: currentEURate.rate,
            currency: record.currency,
        });
        setIsModalVisible(true);
    };
    let columns = [
        {
            title: 'Name',
            dataIndex: 'officialName',
            width: '30%',
            ...nameSearchHook('officialName', null),
            editable: true,
        },
        {
            title: 'Population',
            dataIndex: 'population',
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.population - b.population,
            render: (_, record: { population: string }) => (
                <span>{formatNumber(record.population)}</span>
            ),
        },
        {
            title: 'Currency',
            dataIndex: 'currency',
            ...nameSearchHook('currency', null),
        },
        {
            title: 'operation',
            dataIndex: 'operation',
            render: (_, record: DataType) =>
                dataSource.length >= 1 ? (
                    <span>
                        <Typography.Link
                            onClick={() => Convert(record)}
                            style={{ marginRight: 8 }}
                        >
                            Convert
                        </Typography.Link>
                        <Popconfirm
                            title="Sure to delete?"
                            onConfirm={() => handleDelete(record.key)}
                        >
                            <Typography.Link>Remove</Typography.Link>
                        </Popconfirm>
                    </span>
                ) : null,
        },
    ];

    const handleAdd = () => {
        let newData: DataType[] = [];
        if (values) {
            let uniqueValues;
            for (const v of values) {
                uniqueValues = dataSource.filter((item) => item.key !== v.key);
            }

            values.map((i: any) =>
                newData.push({
                    key: i.key,
                    officialName: i.label,
                    currency: i.key,
                    population: i.value,
                })
            );
            setDataSource([...uniqueValues, ...newData]);
        }
        setValues([]);
    };
    const handleCancel = () => {
        setBaseCurrencyRate(null);
        setAmount(0);
        setIsModalVisible(false);
    };
    const handleAmountChange = (e) => {
        let amount = Number(e.target.value);
        if (amount < 0) return;
        setAmount(amount);
        baseCurrencyRate &&
            setTotal((amount * baseCurrencyRate.rate).toFixed(2));
    };

    const fetchUserList = (value) => {
        return apiGet(`/api/name?name=${value}`)
            .then((res: any) =>
                !res.data
                    ? []
                    : res.data.map((c: any) => ({
                          key: c.currency,
                          label: c.officialName,
                          value: c.population,
                      }))
            )
            .catch((e) => setError(e.message));
    };
    return (
        <>
            <Modal
                title="Converter"
                visible={isModalVisible}
                footer={null}
                onCancel={handleCancel}
            >
                <Input
                    allowClear
                    minLength={0}
                    placeholder="Amount in EUR"
                    type="number"
                    onChange={handleAmountChange}
                />
                <div>
                    {amount && total && baseCurrencyRate && (
                        <Typography.Text>
                            {amount} EUR is equal to{' '}
                            <strong>
                                {total} {baseCurrencyRate.currency}
                            </strong>
                        </Typography.Text>
                    )}
                </div>
            </Modal>
            <Wrapper>
                <DebounceSelect
                    error={error ? error : ''}
                    allowClear
                    mode="multiple"
                    value={values}
                    placeholder="Search Country"
                    fetchOptions={fetchUserList}
                    onChange={(newValue) => setValues(newValue)}
                />
                <Button
                    disabled={values.length < 1}
                    onClick={handleAdd}
                    type="primary"
                >
                    Add
                </Button>
            </Wrapper>
            <Table
                bordered
                pagination={false}
                dataSource={dataSource}
                // @ts-ignore
                columns={columns}
            />
        </>
    );
};

const Wrapper = styled.div`
    position: relative;
    height: 100%;
    display: grid;
    gap: 5px;
    grid-template-columns: 1fr auto;
`;
