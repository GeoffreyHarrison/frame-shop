import { Search } from "lucide-react";

interface SearchInputProps {
  placeholder?: string;
  className?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function SearchInput({ placeholder = "Search...", className = "", value, onChange }: SearchInputProps) {
  return (
    <div className={`flex rounded-lg border border-primary-dark overflow-hidden ${className}`}>
      <div className="flex items-center justify-center w-9 shrink-0 bg-primary-dark">
        <Search size={15} className="text-white" />
      </div>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="flex-1 px-3 py-2 text-sm bg-white placeholder:text-primary-dark focus:outline-none"
      />
    </div>
  );
}
