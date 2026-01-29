import { cn } from "@/lib/utils";

export function TaskFilters({ tabs, selectedTab, onSelectTab }) {
    return (
        <div className="flex flex-wrap gap-2">
            {tabs.map(tab => (
                <button
                    key={tab}
                    onClick={() => onSelectTab(tab)}
                    className={cn(
                        "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                        selectedTab === tab
                            ? "bg-green-100 text-green-800 border border-green-200"
                            : "bg-white text-slate-600 border border-transparent hover:bg-slate-50"
                    )}
                >
                    {tab}
                </button>
            ))}
        </div>
    );
}
