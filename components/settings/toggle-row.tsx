"use client";

type ToggleRowProps = {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
};

export function ToggleRow({
  label,
  description,
  checked,
  onChange,
  disabled = false,
}: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <p className="text-base text-stone-700 font-medium">{label}</p>
        {description && (
          <p className="text-sm text-stone-500 mt-1">{description}</p>
        )}
      </div>
      <button
        type="button"
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors touch-manipulation ${
          checked ? "bg-stone-400" : "bg-stone-300"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        role="switch"
        aria-checked={checked}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}

