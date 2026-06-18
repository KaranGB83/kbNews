import { AlertTriangle } from "lucide-react";

const RateLimitedUI = () => {
    <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
        <AlertTriangle size={64} className="text-warning" />
        <h2 className="text-2x1 font-bold">Rate limit reached</h2>
        <p className="text-based-content/60">Too many requests. Please wait and try again!</p>
    </div>
};

export default RateLimitedUI;