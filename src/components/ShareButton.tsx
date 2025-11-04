import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ShareButtonProps {
  title?: string;
  text?: string;
  url?: string;
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

const ShareButton = ({ 
  title = "AquaAid Guide - SDG 6 Water & Sanitation",
  text = "Join me in promoting clean water and sanitation for all. Check out AquaAid Guide!",
  url,
  variant = "outline",
  size = "default",
  className = "",
}: ShareButtonProps) => {
  const { toast } = useToast();

  const handleShare = async () => {
    const shareUrl = url || window.location.href;
    const shareData = {
      title,
      text,
      url: shareUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast({
          title: "Thanks for sharing!",
          description: "Help us spread awareness about water conservation.",
        });
      } else {
        // Fallback for browsers that don't support Web Share API
        await navigator.clipboard.writeText(shareUrl);
        toast({
          title: "Link Copied!",
          description: "Share this link to spread awareness about SDG 6.",
        });
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error("Error sharing:", error);
        toast({
          title: "Share Failed",
          description: "Unable to share. Please try copying the link manually.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Button onClick={handleShare} variant={variant} size={size} className={className}>
      <Share2 className="w-4 h-4 mr-2" />
      Share
    </Button>
  );
};

export default ShareButton;