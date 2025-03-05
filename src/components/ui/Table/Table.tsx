import { ReactNode } from "react";
import { useTheme } from "@/context/ThemeContext";

interface Theme {
  boxColor: string;
  bgColor: string;
  primaryTextColor: string;
  secondaryTextColor: string;
  accentColor: string;
  borderColor: string;
}

interface Column<T> {
  header: string;
  key: string;
  render?: (item: T) => ReactNode;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  theme: Theme;
  emptyMessage?: string;
}

export function Table<T>({
  columns,
  data,
  theme: providedTheme,
  emptyMessage = "No data found",
}: TableProps<T>) {
  const { theme } = useTheme();
  const finalTheme = providedTheme ?? theme;

  if (!data || data.length === 0) {
    return (
      <div
        style={{ backgroundColor: finalTheme.boxColor }}
        className="rounded-lg p-4"
      >
        <div
          style={{ color: finalTheme.secondaryTextColor }}
          className="text-center"
        >
          {emptyMessage}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="p-4 text-left"
                style={{
                  color: finalTheme.secondaryTextColor,
                  backgroundColor: finalTheme.bgColor,
                }}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={index}
              style={{
                backgroundColor: finalTheme.bgColor,
              }}
            >
              {columns.map((column) => (
                <td
                  key={`${index}-${column.key}`}
                  className="p-4"
                  style={{
                    color: finalTheme.primaryTextColor,
                  }}
                >
                  {column.render
                    ? column.render(item)
                    : String((item as Record<string, unknown>)[column.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
