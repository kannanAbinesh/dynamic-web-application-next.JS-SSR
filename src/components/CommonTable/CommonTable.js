/* Helpers. */
import { maskMail } from '@/helpers/maskMail';

/* Style. */
import './commonTable.css';

export default function CommonTable(props) {

    /* Props. */
    const { data, tableType, tableHeader, currentPage } = props;

    return (
        <div className="common-table-container">
            <div className="common-table-wrapper">
                <table className='common-table'>
                    <thead className='common-table-header-wrapper'>
                        <tr>{tableHeader?.map((ele) => (<th key={ele?.id} className='common-table-header'>{ele?.name}</th>))}</tr>
                    </thead>

                    <tbody className='common-table-body-wrapper'>
                        {data?.map((ele, index) => (
                            <tr className='common-table-row' key={index}>
                                <td className='common-table-data' data-cell="S.no">{(currentPage * 10) + index + 1}</td>

                                {ele?.name && (<td className='common-table-data' data-cell="name">{ele?.name}</td>)}

                                {(ele.hasOwnProperty('email') && ele?.email) && (
                                    <td data-cell="email" className='common-table-data'>
                                        <a href={`mailto:${ele?.email}`} className='common-table-mail' rel="noopener noreferrer">{maskMail(ele?.email)}</a>
                                    </td>
                                )}

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
    );
};