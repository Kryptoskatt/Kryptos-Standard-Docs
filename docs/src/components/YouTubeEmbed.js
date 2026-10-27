import React from "react";

// Responsive 16:9 YouTube player. Uses the no-cookie domain so nothing is set until the reader presses play.
export default function YouTubeEmbed({ id, title }) {
  return (
    <div className="kp-video">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${id}?rel=0`}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  );
}
