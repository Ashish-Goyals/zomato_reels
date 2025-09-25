import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

// Reusable feed for vertical reels
// Props:
// - items: Array of video items { _id, video, description, commentsCount, comments, foodPartner }
// - emptyMessage: string
const ReelFeed = ({ items = [], emptyMessage = 'No videos yet.' }) => {
  const videoRefs = useRef(new Map())

  // Clean up refs for removed items
  useEffect(() => {
    const ids = new Set(items.map(item => item._id))
    for (const key of videoRefs.current.keys()) {
      if (!ids.has(key)) {
        videoRefs.current.delete(key)
      }
    }
  }, [items])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target
          if (!(video instanceof HTMLVideoElement)) return
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            video.play().catch(() => { /* ignore autoplay errors */ })
          } else {
            video.pause()
          }
        })
      },
      { threshold: [0, 0.25, 0.6, 0.9, 1] }
    )

    // Unobserve all before observing new (fixes stale refs)
    videoRefs.current.forEach((vid) => observer.unobserve(vid))
    videoRefs.current.forEach((vid) => {
      if (vid) observer.observe(vid)
    })

    return () => observer.disconnect()
  }, [items])

  const setVideoRef = (id) => (el) => {
    if (!el) {
      videoRefs.current.delete(id)
    } else {
      videoRefs.current.set(id, el)
    }
  }

  return (
    <div className="reels-page">
      <div className="reels-feed" role="list">
        {items.length === 0 && (
          <div className="empty-state">
            <p>{emptyMessage}</p>
          </div>
        )}

        {items.map((item) => {
          return (
          <section key={item._id} className="reel" role="listitem">
            <video
              ref={setVideoRef(item._id)}
              className="reel-video"
              src={item.video}
              muted
              playsInline
              loop
              preload="metadata"
            />

            <div className="reel-overlay">
              <div className="reel-overlay-gradient" aria-hidden="true" />

              <div className="reel-action-group">
                <button className="reel-action" aria-label="Comments">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
                  </svg>
                </button>
                <div className="reel-action__count">{item.commentsCount ?? (Array.isArray(item.comments) ? item.comments.length : 0)}</div>
              </div>

              <div className="reel-content">
                <p className="reel-description" title={item.description}>{item.description}</p>
                {item.foodPartner && (
                  <Link className="reel-btn" to={`/food-partner/${item.foodPartner._id}` } aria-label="Visit store">Visit store</Link>
                )}
              </div>
            </div>
          </section>)
        })}
      </div>
    </div>
  )
}

export default ReelFeed
