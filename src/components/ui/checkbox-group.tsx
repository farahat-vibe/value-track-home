
import * as React from "react";
import { Checkbox } from "@/components/ui/checkbox";

interface CheckboxGroupProps {
  value: string[];
  onChange?: (values: string[]) => void;
  children?: React.ReactNode;
}

const CheckboxGroupContext = React.createContext<{
  value: string[];
  toggleValue: (value: string) => void;
}>({
  value: [],
  toggleValue: () => {},
});

export function CheckboxGroup({
  value = [],
  onChange,
  children,
}: CheckboxGroupProps) {
  const toggleValue = React.useCallback(
    (itemValue: string) => {
      const newValue = value.includes(itemValue)
        ? value.filter((v) => v !== itemValue)
        : [...value, itemValue];
      onChange?.(newValue);
    },
    [value, onChange]
  );

  return (
    <CheckboxGroupContext.Provider value={{ value, toggleValue }}>
      <div className="space-y-2">{children}</div>
    </CheckboxGroupContext.Provider>
  );
}

interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof Checkbox> {
  value: string;
}

export function Checkbox({ value, ...props }: CheckboxProps) {
  const { value: groupValue, toggleValue } = React.useContext(
    CheckboxGroupContext
  );

  return (
    <Checkbox
      checked={groupValue.includes(value)}
      onCheckedChange={() => toggleValue(value)}
      {...props}
    />
  );
}
