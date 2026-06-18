import { Newspaper } from "lucide-react";
import { Link } from "react-router-dom";

const NewsNotFound = () => (
    <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
        <Newspaper size={64} className="text-based-content/30" />
        <h2 className="text-2x1 font-bold text-based-content/60">No Articles Yet.</h2>
        <p className="text-based-content/40">Be the first to publish a story.</p>
        <Link to="/create" className="btn btn-primary mt-2">Write Article</Link>
    </div>
);

export default NewsNotFound;