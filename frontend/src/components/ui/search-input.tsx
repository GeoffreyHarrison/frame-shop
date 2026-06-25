import { Search } from "lucide-react";

interface SearchInputProps {
  placeholder?: string;
  className?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch?: () => void;
}

export function SearchInput({ placeholder = "Search...", className = "", value, onChange, onSearch }: SearchInputProps) {
  return (
    <div className={`flex rounded-lg border border-primary-dark overflow-hidden ${className}`}>
      <button
        type="button"
        onClick={onSearch}
        className="flex items-center justify-center w-9 shrink-0 bg-primary-dark hover:bg-primary transition-colors"
      >
        <Search size={15} className="text-white" />
      </button>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyDown={(e) => e.key === "Enter" && onSearch?.()}
        className="flex-1 px-3 py-2 text-sm bg-white placeholder:text-primary-dark focus:outline-none"
      />
    </div>
  );
}
