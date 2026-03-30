import { Share2, Facebook, Twitter, MessageCircle, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ShareButtonProps {
  ideaTitle: string;
  ideaDescription: string;
  ideaId: string;
  authorName?: string;
  className?: string;
}

export default function ShareButton({
  ideaTitle,
  ideaDescription,
  ideaId,
  authorName,
  className = "",
}: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Construir URL base do site
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const ideaUrl = `${baseUrl}/ideias#ideia-${ideaId}`;

  // Textos para compartilhamento
  const shortDescription = ideaDescription.substring(0, 100) + "...";
  const shareText = `Confira esta ideia para Goiás: "${ideaTitle}" - ${shortDescription}`;
  const fullShareText = `Confira esta ideia para Goiás: "${ideaTitle}"\n\n${ideaDescription}\n\nVote e compartilhe em: ${ideaUrl}`;

  // URLs de compartilhamento
  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(ideaUrl)}&quote=${encodeURIComponent(shareText)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(ideaUrl)}&hashtags=GoiasPodeMais,Ideias`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(fullShareText)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(ideaUrl)}`,
  };

  const handleShare = (platform: keyof typeof shareUrls) => {
    const url = shareUrls[platform];
    window.open(url, "_blank", "width=600,height=400");
    setIsOpen(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(ideaUrl);
    alert("Link copiado para a área de transferência!");
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 border-yellow-400 text-yellow-600 hover:bg-yellow-50 ${className}`}
      >
        <Share2 size={16} />
        Compartilhar
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-3 border-b border-gray-200">
            <p className="text-sm font-semibold text-gray-700">Compartilhar em:</p>
          </div>

          <div className="p-2 space-y-2">
            {/* Facebook */}
            <button
              onClick={() => handleShare("facebook")}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded transition-colors"
            >
              <Facebook size={18} className="text-blue-600" />
              <span>Facebook</span>
            </button>

            {/* Twitter */}
            <button
              onClick={() => handleShare("twitter")}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-sky-50 rounded transition-colors"
            >
              <Twitter size={18} className="text-sky-500" />
              <span>Twitter / X</span>
            </button>

            {/* WhatsApp */}
            <button
              onClick={() => handleShare("whatsapp")}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-green-50 rounded transition-colors"
            >
              <MessageCircle size={18} className="text-green-600" />
              <span>WhatsApp</span>
            </button>

            {/* LinkedIn */}
            <button
              onClick={() => handleShare("linkedin")}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded transition-colors"
            >
              <Linkedin size={18} className="text-blue-700" />
              <span>LinkedIn</span>
            </button>

            <div className="border-t border-gray-200 my-2" />

            {/* Copiar Link */}
            <button
              onClick={handleCopyLink}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded transition-colors"
            >
              <Share2 size={18} className="text-gray-600" />
              <span>Copiar link</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
