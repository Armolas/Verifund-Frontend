
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Wallet, Menu } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 glass-card border-b border-verifund-sage/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-verifund-sage to-verifund-moss rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">V</span>
            </div>
            <span className="text-xl font-bold text-verifund-forest-dark font-['Space_Grotesk']">VeriFund</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/campaigns" className="text-verifund-forest-dark hover:text-verifund-sage transition-colors">
              Campaigns
            </Link>
            <Link to="/dashboard" className="text-verifund-forest-dark hover:text-verifund-sage transition-colors">
              Dashboard
            </Link>
            <Link to="/create" className="text-verifund-forest-dark hover:text-verifund-sage transition-colors">
              Create
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Button variant="outline" size="sm" className="btn-secondary">
              <Wallet className="w-4 h-4 mr-2" />
              Connect Wallet
            </Button>
          </div>

          <button
            className="md:hidden text-verifund-forest-dark"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-verifund-sage/30">
            <div className="flex flex-col space-y-4">
              <Link to="/campaigns" className="text-verifund-forest-dark hover:text-verifund-sage transition-colors">
                Campaigns
              </Link>
              <Link to="/dashboard" className="text-verifund-forest-dark hover:text-verifund-sage transition-colors">
                Dashboard
              </Link>
              <Link to="/create" className="text-verifund-forest-dark hover:text-verifund-sage transition-colors">
                Create
              </Link>
              <Button variant="outline" size="sm" className="btn-secondary w-fit">
                <Wallet className="w-4 h-4 mr-2" />
                Connect Wallet
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
