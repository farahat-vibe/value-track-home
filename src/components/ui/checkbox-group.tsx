
import * as React from "react";
import { Checkbox as ShadcnCheckbox } from "@/components/ui/checkbox";

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

interface CheckboxItemProps {
  value: string;
  id?: string;
  label?: string;
  children?: React.ReactNode;
}

export function Checkbox({ value, id, children, ...props }: CheckboxItemProps) {
  const { value: groupValue, toggleValue } = React.useContext(
    CheckboxGroupContext
  );

  return (
    <div className="flex items-center space-x-2">
      <ShadcnCheckbox
        id={id || value}
        checked={groupValue.includes(value)}
        onCheckedChange={() => toggleValue(value)}
        {...props}
      />
      {children}
    </div>
  );
}
