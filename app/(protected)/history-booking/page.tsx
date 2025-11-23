import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import HistoryBookingTable from "@/components/history-booking/table/history-booking-table";
import {
  fetchListBookingStatus,
  fetchListPaymentStatus,
} from "@/server/general";
import React from "react";
import { getData } from "./fetch";
import { HistoryBookingPageProps } from "./types";

const HistoryBookingPage = async (props: HistoryBookingPageProps) => {
  const searchParams = await props.searchParams;

  const promises = Promise.all([
    getData({
      searchParams,
    }),
    fetchListBookingStatus(),
    fetchListPaymentStatus(),
  ]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">History Booking</h1>
      </div>
      <div className="w-full">
        <React.Suspense
          key={Math.random()}
          fallback={
            <DataTableSkeleton
              columnCount={7}
              filterCount={2}
              cellWidths={[
                "6rem",
                "16rem",
                "14rem",
                "14rem",
                "12rem",
                "12rem",
                "10rem",
              ]}
            />
          }
        >
          <HistoryBookingTable promises={promises} />
        </React.Suspense>
      </div>
    </div>
  );
};

export default HistoryBookingPage;
