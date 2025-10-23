import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

interface QuotaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const QuotaModal = ({ open, onOpenChange }: QuotaModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md animate-scale-in">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="p-4 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20">
                <div className="p-3 rounded-full bg-gradient-to-br from-primary to-secondary">
                  <Lock className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="absolute -top-1 -right-1 p-2 rounded-full bg-accent shadow-lg animate-pulse">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
          <DialogTitle className="text-2xl">You've reached your free lesson limit 💡</DialogTitle>
          <DialogDescription className="text-base pt-2">
            You've used all your free AI lessons this month. Upgrade to continue learning with your personalized AI tutor and unlock unlimited access.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 pt-4">
          <Link to="/pricing" onClick={() => onOpenChange(false)}>
            <Button className="w-full btn-hero rounded-xl h-12 gap-2">
              <Sparkles className="w-5 h-5" />
              Upgrade to Pro
            </Button>
          </Link>
          <Button
            variant="outline"
            className="w-full rounded-xl h-12"
            onClick={() => onOpenChange(false)}
          >
            Maybe Later
          </Button>
        </div>

        <div className="text-center text-xs text-muted-foreground pt-2">
          <p>Pro Plan: Unlimited lessons + analytics for just $19/month</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuotaModal;
