import { useAtom } from "jotai";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { selectedZoneIdAtom } from "@/store/atoms";
import { ZoneMap, type Zone } from "../components/ZoneMap";
import { ZoneTable } from "../components/ZoneTable";

const mockZones: Zone[] = [
  {
    id: "1",
    name: "Zone Centre-Ville",
    latitude: 35.1897,
    longitude: 0.6312,
    address: "Place de la République, Sidi-Bel-Abbès",
  },
  {
    id: "2",
    name: "Zone Université",
    latitude: 35.2012,
    longitude: 0.6198,
    address: "Campus Universitaire, Sidi-Bel-Abbès",
  },
  {
    id: "3",
    name: "Zone Marché",
    latitude: 35.1823,
    longitude: 0.6445,
    address: "Grand Marché, Sidi-Bel-Abbès",
  },
];

export function ZonesPage() {
  const [selectedZoneId, setSelectedZoneId] = useAtom(selectedZoneIdAtom);

  return (
    <PageWrapper
      title="Zones"
      description="Geographic coverage and operational zones."
    >
      <div className="flex w-full max-w-full flex-col gap-8">
        <ZoneMap
          zones={mockZones}
          onZoneSelect={(id) => setSelectedZoneId(id)}
        />
        <div className="rounded-[var(--radius-lg)] border border-border bg-card shadow-card">
          <ZoneTable
            zones={mockZones}
            selectedZoneId={selectedZoneId}
            onSelectZone={(id) => setSelectedZoneId(id)}
          />
        </div>
      </div>
    </PageWrapper>
  );
}
