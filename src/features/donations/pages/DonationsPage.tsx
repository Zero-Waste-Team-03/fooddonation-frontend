import { PageWrapper } from "@/components/layout/PageWrapper";

import { DonationStats } from "../components/DonationStats";
import { DonationFilters } from "../components/DonationFilters";
import { DonationTable } from "../components/DonationTable";
import { ProTipAlert } from "../components/ProTipAlert";

export function DonationsPage() {
  return (
    <PageWrapper title="Donation Monitoring">
      <div className="flex flex-col -mt-2">
        <DonationStats />
        <DonationFilters />
        <DonationTable />
        <ProTipAlert />
      </div>
    </PageWrapper>
  );
}
