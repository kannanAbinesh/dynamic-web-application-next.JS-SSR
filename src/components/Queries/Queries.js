/* Components. */
import CommonTable from "../CommonTable/CommonTable";

export default function Queries(props) {

    /* Props. */
    const { data, page, totalPages, search, total, tableType, tableHeader } = props;

    return (
        <div>
            <CommonTable
                data={data}
                tableType={tableType}
                tableHeader={tableHeader}
                currentPage={page}
            />
        </div>
    )
}