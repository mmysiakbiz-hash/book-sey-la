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
    <section class="pg-hero">
      <div class="pg-eyebrow">Contact</div>
      <h1>Get in <em>touch</em></h1>
      <p class="lead">Questions, feedback, partnerships or press — we usually reply within 24 hours, island time.</p>
    </section>

    <section class="pg-contact">
      <form class="pg-form" id="contactForm" novalidate>
        <div class="pg-fields">
          <div class="pg-field">
            <label for="c-name">Your name</label>
            <input id="c-name" type="text" placeholder="Jane Doe" required />
          </div>
          <div class="pg-field">
            <label for="c-email">Email</label>
            <input id="c-email" type="email" placeholder="you@example.com" required />
          </div>
          <div class="pg-field">
            <label for="c-topic">Topic</label>
            <select id="c-topic">
              <option>General enquiry</option>
              <option>I run a studio</option>
              <option>Partnership</option>
              <option>Press</option>
              <option>Privacy / data request</option>
            </select>
          </div>
          <div class="pg-field">
            <label for="c-msg">Message</label>
            <textarea id="c-msg" placeholder="How can we help?" required></textarea>
          </div>
          <button type="submit" class="pg-btn">Send message</button>
        </div>
        <div class="pg-success" id="contactSuccess">
          <div class="tick">✓</div>
          <h3 style="font-family:var(--font-display);color:var(--cocoa);margin:0 0 6px;">Message sent</h3>
          <p style="color:var(--cocoa-60);font-size:var(--text-sm);margin:0;">Thanks for reaching out — we'll get back to you within 24 hours. Please check your spam folder if you don't hear from us.</p>
        </div>
      </form>

      <aside>
        <div class="pg-info-item">
          <div class="t">General enquiries</div>
          <div class="d"><a href="mailto:hello@sey.la">hello@sey.la</a></div>
        </div>
        <div class="pg-info-item">
          <div class="t">Privacy / data requests</div>
          <div class="d"><a href="mailto:privacy@sey.la">privacy@sey.la</a></div>
        </div>
        <div class="pg-info-item">
          <div class="t">Response time</div>
          <div class="d">Usually within 24 hours, Monday–Friday. Island time (UTC+4).</div>
        </div>
        <div class="pg-info-item">
          <div class="t">Operator</div>
          <div class="d">Nexora Consulting LLC<br />Sharjah Media City<br />Sharjah, United Arab Emirates</div>
        </div>
      </aside>
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
export default function ContactPage(){return <div dangerouslySetInnerHTML={{__html:HTML}}/>;}
