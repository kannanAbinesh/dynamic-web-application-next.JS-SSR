/* Model */
import Queries from "@/models/Queries";

/* Component */
import QueriesClient from "@/components/Queries/Queries";

/* Helpers */
import dbConnect from "@/lib/db";
import { queriesTableHeader } from "@/helpers/commonTableHelper";

/* Global variable. */
export const dynamic = "force-dynamic";

/* Convert string → number safely */
function toInt(value, defaultValue) {
    const num = parseInt(value, 10);
    return Number.isFinite(num) && num > 0 ? num : defaultValue;
};

export default async function QueriesPage({ searchParams }) {

    /* Params variable. */
    const resolvedSearchParams = await searchParams;

    /* Variables. */
    let page = toInt(resolvedSearchParams?.page, 1);
    let limit = 10;
    let search = (resolvedSearchParams?.search || "").toString().trim();
    let filter = search ? { $or: [{ name: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }, { message: { $regex: search, $options: "i" } }] } : {};
    let skip = (page - 1) * limit;

    /* Connect DB */
    await dbConnect();

    /* Fetch queries + total count. */
    const [queries, total] = await Promise.all([
        Queries.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
        Queries.countDocuments(filter),
    ]);
    const totalPages = Math.max(1, Math.ceil(total / limit));

    /* Serialize data for client component */
    const data = queries.map((item) => ({
        id: item._id.toString(),
        name: item.name,
        email: item.email || "",
        message: item.message,
        createdAt: item?.createdAt ? new Date(item.createdAt).toISOString() : null,
        updatedAt: item.updatedAt ? new Date(item.updatedAt).toISOString() : null,
    }));

    return (
        <QueriesClient
            data={data}
            currentPage={page}
            totalPages={totalPages}
            search={search}
            total={total}
            tableType="queries"
            tableHeader={queriesTableHeader}
        />
    );
}