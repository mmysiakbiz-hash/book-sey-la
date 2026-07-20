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
      <h1>Terms &amp; <em>Privacy</em></h1>
      <span class="pg-updated">Last updated · 20 July 2026</span>
    </section>

    <section class="pg-legal">
      <nav class="pg-toc" aria-label="On this page">
        <div class="pg-toc-h">On this page</div>
        <a href="#clients">1 · Terms for clients</a>
        <a href="#studios">2 · Terms for studios</a>
        <a href="#privacy">3 · Privacy</a>
        <a href="#about">4 · Who we are</a>
      </nav>

      <div class="pg-prose">
        <p class="intro">Plain and simple. sey.la | book connects clients with independent beauty, wellness and studio businesses in the Seychelles. We provide the booking technology — the services themselves are provided by the studios. By using the platform you agree to these terms.</p>

        <h2 id="clients"><span class="num">1</span>Terms for clients</h2>
        <ul>
          <li><strong>Booking is free</strong> for clients — always.</li>
          <li>A booking is a request the studio confirms. <strong>Times and prices are set by the studio</strong>, in Seychelles rupees (SCR).</li>
          <li>You can <strong>cancel up to 12 hours</strong> before your appointment, unless the studio says otherwise.</li>
          <li>We confirm and remind you <strong>by email only</strong> — there's no SMS or push, and no online payment (you pay the studio on site).</li>
          <li>Keep your login secure; you're responsible for what happens under your account. Repeated no-shows may lead to restrictions.</li>
          <li>The studio provides your service and is responsible for it — please raise any issue with the service directly with them.</li>
        </ul>

        <h2 id="studios"><span class="num">2</span>Terms for studios</h2>
        <ul>
          <li><strong>Free for your first 3 months.</strong> After that it's <strong>€25 / month per studio</strong> (includes your first team member), plus <strong>€25 / month for each additional team member</strong>. No setup fees, cancel anytime.</li>
          <li>We charge a <strong>20% commission on the first booking of a new client we bring you</strong> (someone booking your studio for the first time via sey.la). Your own existing/imported clients are marked as regulars and carry <strong>no commission</strong>; walk-ins you add yourself carry none either.</li>
          <li>You're responsible for your <strong>listing, prices, staff, services and opening hours</strong> being accurate, and for the services you provide.</li>
          <li>Subscriptions renew monthly. If payment lapses, your page is paused (hidden from clients) after a 14-day grace period — your setup is kept safe until you resume.</li>
          <li>Don't list unlawful, misleading or harmful content. We may suspend accounts that break these rules.</li>
        </ul>

        <h2 id="privacy"><span class="num">3</span>Privacy</h2>
        <p>We keep this short and honest.</p>
        <ul>
          <li><strong>What we hold:</strong> your name and email, your phone number if you give one, and your bookings.</li>
          <li><strong>Why:</strong> to run your bookings and send confirmations and reminders (by email). Studios you book with see the booking details they need to serve you.</li>
          <li><strong>We don't sell your data</strong>, and we don't send marketing you didn't ask for.</li>
          <li>Email is sent through <strong>Brevo</strong>; bookings and accounts are stored with <strong>Supabase</strong>. They process this data only to run the service for us.</li>
          <li><strong>Your data, your call:</strong> want a copy or want it deleted? Email <a href="mailto:book@sey.la">book@sey.la</a> and we'll sort it.</li>
        </ul>

        <h2 id="about"><span class="num">4</span>Who we are</h2>
        <p>sey.la | book is operated by <strong>Nexora Consulting LLC</strong> (Sharjah Media City, UAE). The platform is provided "as is"; to the extent the law allows, we're not liable for the acts of studios or clients, or for indirect losses — and nothing here removes rights the law gives you. These terms follow the law of Nexora Consulting LLC's place of registration, without affecting mandatory consumer rights in your country.</p>
        <p>Questions, data requests, or anything else — <a href="/contact">use the contact form</a> or email <a href="mailto:book@sey.la">book@sey.la</a>.</p>
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
      <a href="/terms">Terms &amp; Privacy</a>
    </nav>
    <div class="pg-footer-copy">© 2026 sey.la · Operated by Nexora Consulting LLC, Sharjah Media City, UAE</div>
  </div>
</footer>`;
export default function TermsPage(){return <div dangerouslySetInnerHTML={{__html:HTML}}/>;}
