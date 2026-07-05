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
  <div class="pg-wrap pg-wrap--wide">
    <section class="pg-hero" style="text-align:left;">
      <div class="pg-eyebrow">Legal</div>
      <h1>Terms of <em>Service</em></h1>
      <span class="pg-updated">Last updated · 1 May 2026</span>
    </section>

    <section class="pg-legal">
      <nav class="pg-toc" aria-label="On this page">
        <div class="pg-toc-h">On this page</div>
        <a href="#accept">1 · Acceptance</a>
        <a href="#service">2 · The service</a>
        <a href="#accounts">3 · Accounts</a>
        <a href="#bookings">4 · Bookings</a>
        <a href="#business">5 · Business subscriptions</a>
        <a href="#conduct">6 · Acceptable use</a>
        <a href="#liability">7 · Liability</a>
        <a href="#law">8 · Governing law</a>
      </nav>

      <div class="pg-prose">
        <p class="intro">These terms govern your use of sey.la | book. By using the platform you agree to them.</p>
        <div class="pg-note">This is a design-system template. Replace with terms reviewed by qualified legal counsel before going live.</div>

        <h2 id="accept"><span class="num">1</span>Acceptance</h2>
        <p>sey.la | book is operated by <strong>Nexora Consulting LLC</strong> (Sharjah Media City, UAE). By creating an account or booking through the platform, you accept these terms. If you do not agree, please don't use the service.</p>

        <h2 id="service"><span class="num">2</span>The service</h2>
        <p>We connect clients with independent beauty, wellness and studio businesses in the Seychelles. We provide the booking technology; the services themselves are provided by the studios, who are solely responsible for them.</p>

        <h2 id="accounts"><span class="num">3</span>Accounts</h2>
        <ul>
          <li>You must give accurate information and keep your login secure.</li>
          <li>You are responsible for activity under your account.</li>
          <li>You must be old enough to enter a binding contract in your jurisdiction.</li>
        </ul>

        <h2 id="bookings"><span class="num">4</span>Bookings</h2>
        <ul>
          <li>Booking through sey.la | book is <strong>free for clients</strong>.</li>
          <li>A booking is a request confirmed by the studio; times and prices are set by the studio.</li>
          <li>You may cancel up to <strong>12 hours</strong> before your appointment unless the studio states otherwise.</li>
          <li>Repeated no-shows may lead to account restrictions.</li>
        </ul>

        <h2 id="business"><span class="num">5</span>Business subscriptions</h2>
        <p>Studios subscribe to list and take bookings. The subscription is <strong>€19 per month</strong> with the first <strong>3 months free</strong>. Subscriptions renew monthly and can be cancelled anytime; see the <a href="/refund">Refund Policy</a> for details. Studios are responsible for their listings, prices, staff and services.</p>

        <h2 id="conduct"><span class="num">6</span>Acceptable use</h2>
        <p>Don't misuse the platform: no fraud, no scraping, no interfering with security, and no unlawful, harmful or misleading content. We may suspend accounts that break these rules.</p>

        <h2 id="liability"><span class="num">7</span>Liability</h2>
        <p>The platform is provided "as is". To the extent permitted by law, we are not liable for the acts of studios or clients, or for indirect or consequential losses. Nothing here excludes liability that cannot be excluded by law.</p>

        <h2 id="law"><span class="num">8</span>Governing law</h2>
        <p>These terms are governed by the laws applicable to Nexora Consulting LLC's place of registration, without affecting mandatory consumer rights in your country. Questions? <a href="/contact">Contact us</a>.</p>

        <div class="pg-legal-related">
          <a href="/privacy">Privacy Policy →</a>
          <a href="/refund">Refund Policy →</a>
        </div>
      </div>
    </section>
  </div>
</main>

<footer class="pg-footer">
  <div class="pg-footer-inner">
    <a class="pg-logo" href="/"><b>sey.la</b><span class="sep">|</span><i>book</i></a>
    <nav class="pg-footer-nav">
      <a href="/about">About</a>
      <a href="/contact">Contact</a>
      <a href="/privacy">Privacy</a>
      <a href="/terms">Terms</a>
      <a href="/refund">Refund</a>
    </nav>
    <div class="pg-footer-copy">© 2026 sey.la · Operated by Nexora Consulting LLC, Sharjah Media City, UAE</div>
  </div>
</footer>`;
export default function TermsPage(){return <div dangerouslySetInnerHTML={{__html:HTML}}/>;}
