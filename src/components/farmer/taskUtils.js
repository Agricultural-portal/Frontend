export const getStatusColor = (status) => {
    if (!status) return "bg-gray-100 text-gray-700 hover:bg-gray-100";
    switch (status.toLowerCase()) {
        case "completed": return "bg-green-100 text-green-700 hover:bg-green-100";
        case "in-progress": return "bg-orange-100 text-orange-700 hover:bg-orange-100";
        case "pending": return "bg-slate-100 text-slate-700 hover:bg-slate-100";
        default: return "bg-gray-100 text-gray-700 hover:bg-gray-100";
    }
};

export const getPriorityColor = (priority) => {
    if (!priority) return "bg-slate-500 text-white";
    switch (priority.toLowerCase()) {
        case "high": return "bg-red-500 text-white hover:bg-red-600";
        case "medium": return "bg-orange-400 text-white hover:bg-orange-500";
        case "low": return "bg-green-500 text-white hover:bg-green-600";
        default: return "bg-slate-500 text-white";
    }
};
