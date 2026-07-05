const HTML=`<header class="pg-nav">
  <div class="pg-nav-inner">
    <a class="pg-logo" href="/"><b>sey.la</b><span class="sep">|</span><i>book</i></a>
    <nav class="pg-nav-right">
      <a href="/search">Browse</a>
      <a href="/for-studios">For studios</a>
      <a class="pg-btn" href="/">Book now</a>
    </nav>
  </div>
</header>

<main>
  <div class="pg-wrap">
    <section class="pg-hero">
      <div class="pg-eyebrow">Our story</div>
      <h1>A calmer way to book on the <em>islands</em></h1>
      <p class="lead">sey.la | book is the booking platform for Seychelles beauty, wellness and studios — real-time availability, verified local businesses, always free for clients.</p>
    </section>

    <section class="pg-body">
      <div class="pg-card">
        <p>It started with a simple island problem: finding a good salon or spa on Mahé usually meant asking around, calling numbers that didn't answer, or walking in and hoping for a free chair.</p>
        <p>We built a calmer way — one place to see who's open, what's free tonight or tomorrow, and to book it in a few seconds. No phone tag, no deposits, no fuss.</p>
      </div>

      <h2>What we stand for</h2>
      <div class="pg-pillars">
        <article class="pg-pillar">
          <span class="pg-pillar-ic">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20C7 16.5 4 13.5 4 9.8 4 7.1 6 5.2 8.4 5.2c1.6 0 2.8.8 3.6 2 .8-1.2 2-2 3.6-2C18 5.2 20 7.1 20 9.8c0 3.7-3 6.7-8 10.2Z"/></svg>
          </span>
          <h3>Free for clients</h3>
          <p>Booking is always free — no fees, no cut of the price. You pay the studio, that's it.</p>
        </article>
        <article class="pg-pillar">
          <span class="pg-pillar-ic">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8"/><path d="M12 7.5V12l3 2"/></svg>
          </span>
          <h3>Real-time availability</h3>
          <p>Live calendars, synced with each studio. What you see open is really open.</p>
        </article>
        <article class="pg-pillar">
          <span class="pg-pillar-ic">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 19 6v5c0 4.5-3 7.8-7 10-4-2.2-7-5.5-7-10V6Z"/><path d="m9 12 2 2 4-4"/></svg>
          </span>
          <h3>Verified local studios</h3>
          <p>Every business is a vetted, real place on Mahé, Praslin or La Digue.</p>
        </article>
      </div>

      <h2>Who runs it</h2>
      <p>sey.la | book is operated by Nexora Consulting LLC and is part of the wider sey.la family of island services.</p>
      <div class="pg-company">
        <h3>Company details</h3>
        <div class="pg-crow"><span class="k">Operator</span><span class="v">Nexora Consulting LLC</span></div>
        <div class="pg-crow"><span class="k">Registered office</span><span class="v">Sharjah Media City, Sharjah, United Arab Emirates</span></div>
        <div class="pg-crow"><span class="k">Formation No.</span><span class="v">2541456</span></div>
        <div class="pg-crow"><span class="k">Contact</span><span class="v"><a href="mailto:hello@sey.la">hello@sey.la</a></span></div>
      </div>

      <h2>Explore</h2>
      <div class="pg-links">
        <a class="pg-link" href="/search"><b>Browse studios</b><span>Find and book near you, in seconds.</span></a>
        <a class="pg-link" href="/for-studios"><b>For studios</b><span>List your business and fill your calendar.</span></a>
        <a class="pg-link" href="/contact"><b>Contact us</b><span>Questions, feedback, partnerships.</span></a>
        <a class="pg-link" href="/"><b>Home</b><span>Back to the client home page.</span></a>
      </div>
    </section>
  </div>
</main>

<footer class="pg-footer">
  <div class="pg-footer-inner">
    <a class="pg-logo" href="/"><b>sey.la</b><span class="sep">|</span><i>book</i></a>
    <nav class="pg-footer-nav">
      <a href="/">Home</a>
      <a href="/search">Browse</a>
      <a href="/for-studios">For studios</a>
      <a href="/about">About</a>
      <a href="/contact">Contact</a>
    </nav>
    <div class="pg-footer-copy">© 2026 sey.la · Operated by Nexora Consulting LLC, Sharjah Media City, UAE</div>
  </div>
</footer>`;
export default function AboutPage(){return <div dangerouslySetInnerHTML={{__html:HTML}}/>;}
