"use client";
import React from "react";
// VenueShowcase — about strip, the team, and a photo gallery. Real studio data
// only (no demo fallback). Classes live in VenueClasses, so no classes here.

function VenueShowcase({ studio }) {
  const name = (studio && studio.name) || "This studio";
  const about = (studio && (studio.bio || studio.tagline)) || "";
  const photos = (studio && Array.isArray(studio.photos) && studio.photos) || [];
  const sized = (u, w) => (u && !u.includes("?") ? u + "?auto=format&fit=crop&w=" + w + "&q=74" : u);
  const team = studio && Array.isArray(studio.team) ? studio.team : [];
  const gallery = photos.length >= 3 ? photos.slice(0, 6) : [];
  const aboutPhoto = photos[1] || photos[0] || null;

  return (
    <React.Fragment>
      {(about || aboutPhoto) && (
        <section className="vn-section vn-alt" id="about">
          <div className="sey-container vn-about">
            <div className="vn-about-copy">
              <div className="sey-eyebrow vn-eyebrow">The place</div>
              <h2 className="vn-sec-title">Made for slowing <em className="sey-accent-italic">down.</em></h2>
              {about && <p>{about}</p>}
            </div>
            {aboutPhoto && (
              <div className="vn-about-photo">
                <img src={sized(aboutPhoto, 720)} alt={"Inside " + name} loading="lazy" />
              </div>
            )}
          </div>
        </section>
      )}

      {team.length > 0 && (
        <section className="vn-section" id="team">
          <div className="sey-container">
            <div className="sey-eyebrow vn-eyebrow">The team</div>
            <h2 className="vn-sec-title">The <em className="sey-accent-italic">hands.</em></h2>
            <div className="vn-team">
              {team.map((t) => (
                <figure className="vn-member" key={t.id || t.name}>
                  {t.img ? (
                    <img src={t.img + "?auto=format&fit=crop&w=400&h=460&q=72"} alt={t.name} loading="lazy" />
                  ) : (
                    <div style={{ aspectRatio: "400 / 460", display: "grid", placeItems: "center", background: "var(--blush)", color: "var(--clay)", fontWeight: 700, fontSize: "2rem", borderRadius: "var(--radius-lg)" }}>
                      {(t.name || "?").slice(0, 1).toUpperCase()}
                    </div>
                  )}
                  <figcaption>
                    <span className="vn-member-name">{t.name}</span>
                    {t.role && <span className="vn-member-role">{t.role}</span>}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {gallery.length >= 3 && (
        <section className="vn-section vn-alt" id="gallery">
          <div className="sey-container">
            <div className="sey-eyebrow vn-eyebrow">Inside</div>
            <h2 className="vn-sec-title">A look <em className="sey-accent-italic">around.</em></h2>
            <div className="vn-gallery">
              {gallery.map((g, i) => (
                <figure className={"vn-gcell vn-gcell--" + i} key={i}>
                  <img src={g.includes("?") ? g : g + "?auto=format&fit=crop&w=600&q=72"} alt="" loading="lazy" />
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}
    </React.Fragment>
  );
}

export default VenueShowcase;
