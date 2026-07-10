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
      <h1>Refund <em>Policy</em></h1>
      <span class="pg-updated">Last updated · 1 May 2026</span>
    </section>

    <section class="pg-legal">
      <nav class="pg-toc" aria-label="On this page">
        <div class="pg-toc-h">On this page</div>
        <a href="#clients">1 · Client bookings</a>
        <a href="#cancel">2 · Cancellations</a>
        <a href="#business">3 · Business subscriptions</a>
        <a href="#trial">4 · Free trial</a>
        <a href="#how">5 · How to request</a>
        <a href="#contact">6 · Contact</a>
      </nav>

      <div class="pg-prose">
        <p class="intro">How refunds work for clients booking services and for studios subscribing to sey.la | book.</p>
        <div class="pg-note">This is a design-system template. Replace with a policy reviewed by qualified legal counsel before going live.</div>

        <h2 id="clients"><span class="num">1</span>Client bookings</h2>
        <p>Booking through sey.la | book is <strong>free for clients</strong> — we don't charge you a booking fee, so there's nothing for us to refund. Any payment for the service itself is made to the studio, and refunds for services are handled by that studio under its own policy.</p>

        <h2 id="cancel"><span class="num">2</span>Cancellations</h2>
        <ul>
          <li>You can cancel or reschedule up to <strong>12 hours</strong> before your appointment at no cost, unless the studio states otherwise.</li>
          <li>If a studio took a deposit, its refund rules apply — these are shown at the time of booking.</li>
          <li>If a studio cancels on you, any deposit is refunded in full.</li>
        </ul>

        <h2 id="business"><span class="num">3</span>Business subscriptions</h2>
        <p>The studio subscription is <strong>€25 per month per studio</strong> (including one team member), plus <strong>€25 per month for each additional team member</strong>, with the first 3 months free. You can cancel anytime and keep access until the end of the current billing period. Monthly fees already paid are non-refundable except where required by law.</p>

        <h2 id="trial"><span class="num">4</span>Free trial</h2>
        <p>New studios get <strong>3 months free</strong>. You won't be charged during the trial and can cancel before it ends at no cost. Billing begins only after the trial unless you cancel.</p>

        <h2 id="how"><span class="num">5</span>How to request</h2>
        <p>For a subscription billing question or refund request, email <a href="mailto:hello@sey.la">hello@sey.la</a> from the address on your account. For refunds on a service you received, contact the studio directly.</p>

        <h2 id="contact"><span class="num">6</span>Contact</h2>
        <p>Still stuck? <a href="/contact">Get in touch</a> and we'll help sort it out, usually within 24 hours.</p>

        <div class="pg-legal-related">
          <a href="/privacy">Privacy Policy →</a>
          <a href="/terms">Terms of Service →</a>
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
export default function RefundPage(){return <div dangerouslySetInnerHTML={{__html:HTML}}/>;}
