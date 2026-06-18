import { Link } from "react-router-dom";
import { Newspaper, PenLine } from "lucide-react";

const Navbar = () => {
    return (
        <nav className="bg-base-200 border-b border-base-300 px-6 py-4 items-center justify-between sticky top-0 z-50">
            <Link to="/" className="flex items-center gap-2 text-2x1 font-extrabold tracking-tight text-primary">
                <Newspaper size={28} />
                knNews
            </Link>   
            <Link to="/create" className="btn btn-primary btn-sm gap-2">
                <PenLine size={16} />
                Write Arcticle
            </Link>     
        </nav>
    );
};

export default Navbar;