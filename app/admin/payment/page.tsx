import { pageSize as defaultPageSize } from "@/const/globalconst";
import PaymentClient from "./paymentClient";
import { fetchPurchasePayments } from "@/helper/index";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    page_size?: string;
    search?: string;
    payment_status?: string;
  }>;
}

function toInt(value: string | undefined, fallback: number) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

const Page = async ({ searchParams }: PageProps) => {
  const params = await searchParams;

  const page = toInt(params.page, 1);
  const pageSize = toInt(params.page_size, defaultPageSize);
  const search = params.search ?? "";
  const paymentStatus = params.payment_status ?? "";

  const result = await fetchPurchasePayments({
    page,
    pageSize,
    search,
    paymentStatus,
  });

  return (
    <PaymentClient
      rows={result.data}
      total={result.meta.totalPages}
      currentPage={result.meta.page}
      pageSize={result.meta.pageSize}
      paymentStatus={paymentStatus}
    />
  );
};

export default Page;
