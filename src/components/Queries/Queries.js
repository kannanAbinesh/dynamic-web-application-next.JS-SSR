/* Components. */
import CommonTable from "../CommonTable/CommonTable";

export default function Queries(props) {

    /* Props. */
    const { data, currentPage, totalPages, search, total, tableType, tableHeader } = props;

    return (
        <div>
            <CommonTable
                search={search}
                data={data}
                tableType={tableType}
                tableHeader={tableHeader}
                currentPage={currentPage}
                totalPages={totalPages}
            />
        </div>
    )
}