import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface DecimalInputProps {
  value?: number | string;
  onChange?: (value: number | null) => void; // null khi invalid
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function DecimalInput({
  value,
  onChange,
  placeholder,
  className,
  disabled = false,
}: DecimalInputProps) {
  const [display, setDisplay] = useState(value?.toString() ?? "");

  const handleFocus = () => {
    setDisplay(""); // xóa nội dung hiển thị
    onChange?.(-1); // tùy chọn: reset value trong parent
    };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(",", ".");
    setDisplay(val);
    const isValidDecimal = /^-?\d*([.]\d+)?$/.test(val.trim());
    if (isValidDecimal && val.trim() !== "" && val !== ".") {
        onChange?.(parseFloat(val));
    } else {
        onChange?.(-1); 
    }
  };

  const handleBlur = () => {
    const val = display.replace(",", ".").trim();
    const isValidDecimal = /^-?\d*([.]\d+)?$/.test(val);

    if (!isValidDecimal || val === "" || val === ".") {
        setDisplay("Invalid Value");
        onChange?.(-1);
    } else {
        // Giá trị hợp lệ → set lại format chuẩn
        const num = parseFloat(val);
        setDisplay(num.toString());
        onChange?.(num);
    }
  };

  return (
    <input
      type="text"
      inputMode="decimal"
      step="0.01"
      lang="en-US"
      value={display}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      placeholder={placeholder}
      disabled={disabled}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
    />
  );
}
