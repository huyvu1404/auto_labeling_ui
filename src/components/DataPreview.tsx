import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface ExcelData {
  headers: string[];
  data: any[][];
}
interface DataPreviewProps {
  data: ExcelData;
  previewCount: number;
  onPreviewCountChange: (count: number) => void;
}

export const DataPreview = ({ data, previewCount, onPreviewCountChange }: DataPreviewProps) => {
  const previewOptions = [10, 20, 30];
  const displayData = data.data.slice(0, previewCount);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Preview rows:</span>
          {previewOptions.map((count) => (
            <Button
              key={count}
              variant={previewCount === count ? "default" : "outline"}
              size="sm"
              onClick={() => onPreviewCountChange(count)}
            >
              {count}
            </Button>
          ))}
        </div>
        <Badge variant="secondary">
          Total: {data.data.length} rows
        </Badge>
      </div>

      <div className="border rounded-lg font-xs">
        <Table >
          <TableHeader>
            <TableRow>
              {data.headers.map((header, index) => (
                <TableHead key={index} className="font-semibold">
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayData.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <TableCell key={cellIndex} className="max-w-48 truncate">
                    {cell?.toString() || ""}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};