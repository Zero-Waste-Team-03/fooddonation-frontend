import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { Zone } from "./ZoneMap";

type ZoneTableProps = {
  zones: Zone[];
  selectedZoneId: string | null;
  onSelectZone: (id: string) => void;
};

export function ZoneTable({
  zones,
  selectedZoneId,
  onSelectZone,
}: ZoneTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Address</TableHead>
          <TableHead className="text-right">Latitude</TableHead>
          <TableHead className="text-right">Longitude</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {zones.map((zone) => {
          const isSelected = zone.id === selectedZoneId;
          return (
            <TableRow
              key={zone.id}
              data-state={isSelected ? "selected" : undefined}
              className={cn("cursor-pointer", isSelected && "bg-muted/50")}
              onClick={() => onSelectZone(zone.id)}
            >
              <TableCell className="font-medium">{zone.name}</TableCell>
              <TableCell className="text-muted-foreground">
                {zone.address}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {zone.latitude.toFixed(4)}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {zone.longitude.toFixed(4)}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
