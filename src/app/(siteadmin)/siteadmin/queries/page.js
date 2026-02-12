/* Model. */
import Queries from "@/models/Queries";

/* Component. */
import QueriesClient from "@/components/Queries/Queries";

/* Helpers. */
import dbConnect from "@/lib/db";
import { queriesTableHeader } from "@/helpers/commonTableHelper";

export const dynamic = "force-dynamic";

function toInt(v, def) {
    let n = Number.parseInt(String(v || ""), 10);
    return Number.isFinite(n) && n > 0 ? n : def;
};

export default async function QueriesPage({ searchParams }) {

    /* Variables. */
    let page = toInt(searchParams?.page, 1);
    let limit = 10;
    let search = (searchParams?.search || "").toString().trim();
    let filter = search ? { $or: [{ name: { $regex: search, $options: "i" } }, { message: { $regex: search, $options: "i" } },] } : {};
    let skip = (page - 1) * limit;

    await dbConnect(); /* Connect DB. */

    /* Running queries to get the count of the queries and the to get the queries based on the page wise. */
    const [queries, total] = await Promise.all([
        Queries.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
        Queries.countDocuments(filter),
    ]);
    const totalPages = Math.max(1, Math.ceil(total / limit));

    // Serialize the data properly for Client Component
    const data = queries.map((ele) => ({
        id: ele._id.toString(),
        name: ele.name,
        email: ele.email || '',
        message: ele.message,
        createdAt: ele.createdAt ? new Date(ele.createdAt).toISOString() : null,
        updatedAt: ele.updatedAt ? new Date(ele.updatedAt).toISOString() : null
    }));

    return (
        <QueriesClient
            data={data}
            page={page}
            totalPages={totalPages}
            search={search}
            total={total}
            tableType="queries"
            tableHeader={queriesTableHeader}
        />
    );
};