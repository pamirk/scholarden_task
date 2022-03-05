import {Select, Spin} from 'antd';
import React from 'react';
import debounce from 'lodash/debounce';

export function DebounceSelect({
                                   error,
                                   fetchOptions,
                                   setValues,
                                   debounceTimeout = 800,
                                   ...props
                               }: any) {
    const [fetching, setFetching] = React.useState(false);
    const [options, setOptions] = React.useState([]);
    const fetchRef = React.useRef(0);
    const debounceFetcher = React.useMemo(() => {
        setOptions([]);
        const loadOptions = (value) => {
            fetchRef.current += 1;
            const fetchId = fetchRef.current;
            setOptions([]);
            setFetching(true);
            fetchOptions(value).then((newOptions) => {
                if (fetchId !== fetchRef.current) {
                    // for fetch callback order
                    setValues([])
                    setOptions([])
                    return;
                }

                setOptions(newOptions);
                setFetching(false);
            });
        };

        return debounce(loadOptions, debounceTimeout);
    }, [fetchOptions, debounceTimeout]);
    return (
        <Select
            onClear={() => setOptions([])}
            labelInValue
            filterOption={false}
            onSearch={debounceFetcher}
            notFoundContent={fetching ? <Spin size="small"/> : error ? error : ''}
            {...props}
            options={options}
        />
    );
}
