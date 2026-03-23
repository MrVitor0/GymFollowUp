"use client";

import { Modal } from "@/components/ui/Modal";

interface VideoModalProps {
  videoUrl: string;
  isOpen: boolean;
  onClose: () => void;
}

function getYouTubeEmbedUrl(url: string): string {
  // Handle youtube.com/watch?v=ID
  const watchMatch = url.match(/[?&]v=([^&]+)/);
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;

  // Handle youtube.com/shorts/ID
  const shortsMatch = url.match(/\/shorts\/([^?&]+)/);
  if (shortsMatch) return `https://www.youtube.com/embed/${shortsMatch[1]}`;

  // Handle youtu.be/ID
  const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;

  return url;
}

export function VideoModal({ videoUrl, isOpen, onClose }: VideoModalProps) {
  const embedUrl = getYouTubeEmbedUrl(videoUrl);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Tutorial"
      className="max-w-2xl"
    >
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black">
        <iframe
          src={embedUrl}
          title="Tutorial do exercício"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>
    </Modal>
  );
}
