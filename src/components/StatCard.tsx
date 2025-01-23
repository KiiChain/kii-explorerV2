import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useTheme } from "@/context/ThemeContext";

interface StatCardProps {
  title: string;
  value: string;
  unit?: string;
  icon?: React.ReactNode;
  variant?: "default" | "horizontal";
  className?: string;
  style?: React.CSSProperties;
}

export function StatCard({
  title,
  value,
  unit,
  icon,
  variant = "default",
}: StatCardProps) {
  const { theme } = useTheme();

  if (variant === "horizontal") {
    return (
      <Card
        style={{
          backgroundColor: theme.boxColor,
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        }}
        className="border-0"
      >
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {icon}
              <span
                className="text-sm xl:text-base font-normal"
                style={{ color: theme.secondaryTextColor }}
              >
                {title}
              </span>
            </div>
            <div
              className="text-lg font-bold"
              style={{ color: theme.secondaryTextColor }}
            >
              {value}
              {unit && (
                <span
                  className="pl-1 ml-1 text-[10px] xl:text-xs"
                  style={{ color: theme.secondaryTextColor }}
                >
                  ({unit})
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      style={{
        backgroundColor: theme.boxColor,
        boxShadow:
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      }}
      className="border-0"
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle
          className="text-sm xl:text-base font-normal"
          style={{ color: theme.secondaryTextColor }}
        >
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className="text-lg font-bold"
          style={{ color: theme.secondaryTextColor }}
        >
          {value}
          {unit && (
            <span
              className="pl-1 ml-1 text-[10px] xl:text-xs"
              style={{ color: theme.secondaryTextColor }}
            >
              ({unit})
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
