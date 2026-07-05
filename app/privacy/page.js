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
      <h1>Privacy <em>Policy</em></h1>
      <span class="pg-updated">Last updated · 1 May 2026</span>
    </section>

    <section class="pg-legal">
      <nav class="pg-toc" aria-label="On this page">
        <div class="pg-toc-h">On this page</div>
        <a href="#who">1 · Who we are</a>
        <a href="#collect">2 · What we collect</a>
        <a href="#use">3 · How we use it</a>
        <a href="#share">4 · Sharing</a>
        <a href="#retention">5 · Retention</a>
        <a href="#rights">6 · Your rights</a>
        <a href="#cookies">7 · Cookies</a>
        <a href="#contact">8 · Contact</a>
      </nav>

      <div class="pg-prose">
        <p class="intro">This policy explains how sey.la | book collects, uses and protects your personal data when you use our booking platform.</p>
        <div class="pg-note">This is a design-system template. Replace with a policy reviewed by qualified legal counsel before going live.</div>

        <h2 id="who"><span class="num">1</span>Who we are</h2>
        <p>sey.la | book is a booking platform for beauty, wellness and studio services in the Seychelles, operated by <strong>Nexora Consulting LLC</strong>, Sharjah Media City, Sharjah, United Arab Emirates (Formation No. 2541456). We are the data controller for the personal data described here.</p>

        <h2 id="collect"><span class="num">2</span>What we collect</h2>
        <ul>
          <li><strong>Account details</strong> — your name, email and phone number when you book or create an account.</li>
          <li><strong>Booking details</strong> — the studio, service, date and time you book.</li>
          <li><strong>Device &amp; usage data</strong> — IP address, browser type and pages viewed, to keep the service secure and improve it.</li>
          <li><strong>Messages</strong> — anything you send us or a studio through the platform.</li>
        </ul>

        <h2 id="use"><span class="num">3</span>How we use it</h2>
        <ul>
          <li>To confirm and manage your bookings with studios.</li>
          <li>To send booking confirmations, reminders and service updates.</li>
          <li>To keep the platform secure and prevent abuse.</li>
          <li>To improve our service and understand how it is used.</li>
        </ul>

        <h2 id="share"><span class="num">4</span>Sharing</h2>
        <p>We share the minimum needed to complete your booking with the studio you choose. We use trusted service providers (hosting, email, analytics) under data-processing agreements. We do not sell your personal data.</p>

        <h2 id="retention"><span class="num">5</span>Retention</h2>
        <p>We keep your data for as long as your account is active and as required to meet legal, accounting or reporting obligations. You can ask us to delete it at any time (see your rights below).</p>

        <h2 id="rights"><span class="num">6</span>Your rights</h2>
        <p>You may request access to, correction of, or deletion of your personal data, and object to certain processing. To exercise any of these, email <a href="mailto:privacy@sey.la">privacy@sey.la</a> and we will respond within a reasonable time.</p>

        <h2 id="cookies"><span class="num">7</span>Cookies</h2>
        <p>We use essential cookies to run the site and optional analytics cookies to understand usage. You can control cookies through your browser settings.</p>

        <h2 id="contact"><span class="num">8</span>Contact</h2>
        <p>For any privacy question or data request, contact <a href="mailto:privacy@sey.la">privacy@sey.la</a>. For everything else, <a href="/contact">get in touch</a>.</p>

        <div class="pg-legal-related">
          <a href="/terms">Terms of Service →</a>
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
export default function PrivacyPage(){return <div dangerouslySetInnerHTML={{__html:HTML}}/>;}
