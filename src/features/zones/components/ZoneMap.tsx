import {
  Map,
  MapControls,
  MapMarker,
  MarkerContent,
  MarkerPopup,
} from "@/components/ui/map";

export type Zone = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
};

type ZoneMapProps = {
  zones: Zone[];
  onZoneSelect: (id: string) => void;
};

export function ZoneMap({ zones, onZoneSelect }: ZoneMapProps) {
  return (
    <div className="h-[268px] w-full overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card">
      <Map center={[0.6312, 35.1897]} zoom={12} className="min-h-[268px]">
        <MapControls />
        {zones.map((zone) => (
          <MapMarker
            key={zone.id}
            longitude={zone.longitude}
            latitude={zone.latitude}
            onClick={() => onZoneSelect(zone.id)}
          >
            <MarkerContent />
            <MarkerPopup>
              <p className="pr-6 font-medium text-card-foreground">{zone.name}</p>
              <p className="mt-1 text-sm text-muted-foreground">{zone.address}</p>
            </MarkerPopup>
          </MapMarker>
        ))}
      </Map>
    </div>
  );
}
