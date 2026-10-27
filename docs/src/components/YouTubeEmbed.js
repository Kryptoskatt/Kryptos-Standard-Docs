import React from "react";

// Responsive 16:9 YouTube player on the no-cookie domain (YouTube's privacy-enhanced mode).
// vq=hd1080 asks for 1080p; YouTube treats it as a hint and still adapts to player size and bandwidth.
export default function YouTubeEmbed({ id, title }) {
  return (
    <div className="kp-video">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${id}?rel=0&vq=hd1080`}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  );
}
