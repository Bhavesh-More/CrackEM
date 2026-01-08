import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { User, ChevronDown, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface NavBarProps {
  user: { name: string; email: string } | null;
  onSignInClick: () => void;
  onSignOut: () => void;
}

const NavBar = ({ user, onSignInClick, onSignOut }: NavBarProps) => {
  return (
    <div className="flex items-center">
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant="ghost"
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card/80 backdrop-blur-sm border border-border hover:bg-secondary transition-all duration-200"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground hidden sm:inline">{user.name}</span>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </Button>
            </motion.div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-card border-border">
            <DropdownMenuItem className="text-muted-foreground text-xs">
              {user.email}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={onSignOut}
              className="text-destructive focus:text-destructive cursor-pointer"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={onSignInClick}
            className="px-5 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:shadow-primary/20"
          >
            Sign In
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default NavBar;
