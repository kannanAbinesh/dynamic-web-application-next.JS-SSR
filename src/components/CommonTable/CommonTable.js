"use client";

/* Plugins. */
import { useState, useEffect, useRef } from 'react';
import { BsSearch } from 'react-icons/bs';
import { useRouter, useSearchParams } from 'next/navigation';

/* Helpers. */
import { maskMail } from '@/helpers/maskMail';

/* Style. */
import './commonTable.css';

export default function CommonTable(props) {

    /* Props. */
    const { data, tableType, tableHeader, currentPage, search } = props;

    /* Hooks. */
    const router = useRouter();
    const searchParams = useSearchParams();

    /* State declarations. */
    const [inputValue, setInputValue] = useState(search);

    /* Search functionalities. */
    const debounceTimeout = useRef(null);

    const debounce = (callback, delay) => {
        return (...args) => {
            if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
            debounceTimeout.current = setTimeout(() => { callback(...args) }, delay);
        };
    };

    const handleSearchData = (searchValue) => {
        const params = new URLSearchParams(searchParams.toString());

        if (!searchValue.trim()) params.delete('search');
        else params.set('search', searchValue);

        router.push(`?${params.toString()}`, { scroll: false });
    };

    const debounceSearch = debounce((value) => { handleSearchData(value) }, 500);

    const handleQueryChange = (e) => {
        const value = e.target.value;
        setInputValue(value);
        debounceSearch(value);
    };

    // Sync input value with URL search params
    useEffect(() => {
        const urlSearch = search;
        setInputValue(urlSearch);
    }, [searchParams]);

    return (
        <div>

            {/* Search field for the table. */}
            <div className='common-table-search-bar-container'>
                <div className='common-table-search-bar-input-container'>
                    <div className='common-table-search-bar-icon-container'>
                        <BsSearch size={20} className='common-table-search-bar-icon' />
                    </div>
                    <input
                        className='common-table-search-input-field'
                        type='text'
                        placeholder='Search . . .'
                        value={inputValue}
                        onChange={handleQueryChange}
                    />
                </div>
            </div>

            {/* Common table. */}
            <div className="common-table-container">
                <div className="common-table-wrapper">
                    <table className='common-table'>
                        <thead className='common-table-header-wrapper'>
                            <tr>{tableHeader?.map((ele) => (<th key={ele?.id} className='common-table-header'>{ele?.name}</th>))}</tr>
                        </thead>

                        <tbody className='common-table-body-wrapper'>
                            {data.map((ele, index) => (
                                <tr className='common-table-row' key={index}>
                                    <td className='common-table-data' data-cell="S.no">{((currentPage - 1) * 10) + index + 1}</td>

                                    {ele?.name && (<td className='common-table-data' data-cell="name">{ele?.name}</td>)}

                                    {(ele.hasOwnProperty('email') && ele?.email) && (
                                        <td data-cell="email" className='common-table-data'>
                                            <a href={`mailto:${ele?.email}`} className='common-table-mail' rel="noopener noreferrer">{maskMail(ele?.email)}</a>
                                        </td>
                                    )}

                                    {/* View button to view in detail about the queries raised by the user. */}
                                    <td data-cell="view" className='common-table-data'>
                                        <div className='common-table-btn'>
                                            <span>View</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
};