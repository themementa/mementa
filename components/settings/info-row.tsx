"use client";

type InfoRowProps = {
  label: string;
  value?: string;
};

export function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-base text-stone-700 font-medium">{label}</p>
      {value && <p className="text-sm text-stone-500">{value}</p>}
    </div>
  );
}

