export default function AuthLayout({ title, subtitle, children }) {
  return (
    <main className="auth-page">
      <section className="auth-shell" aria-label={title}>
        <aside className="auth-showcase">
          <div className="brand-lockup">
            <span className="brand-mark">MH</span>
            <span>Mastery Hub</span>
          </div>

          <div className="study-illustration" aria-hidden="true">
            <svg viewBox="0 0 420 320" role="img">
              <circle className="mint-orbit" cx="210" cy="150" r="118" />
              <circle className="soft-disc" cx="210" cy="152" r="104" />
              <path className="paper paper-one" d="M78 112h78v112H78z" />
              <path className="paper paper-two" d="M112 88h90v130h-90z" />
              <path className="paper-line" d="M127 113h54M127 128h42M127 143h55M127 160h14M151 160h14M175 160h14M127 178h14M151 178h14M175 178h14M127 196h14M151 196h14M175 196h14" />
              <path className="chair" d="M239 165h74c14 0 22 10 18 22l-18 55h-86z" />
              <path className="chair-leg" d="M263 240l-19 46M303 240l17 46" />
              <path className="person-face" d="M241 118c18-3 34 10 34 29 0 18-13 32-31 32-17 0-31-14-31-31 0-15 11-27 28-30z" />
              <path className="hair" d="M210 145c6-23 27-39 51-28 15 7 22 20 18 34-16-7-25-18-25-29-11 18-25 27-44 23z" />
              <path className="shirt" d="M220 176c22 15 50 15 72 0l18 68H203z" />
              <path className="arm" d="M224 196c-21 16-43 23-68 22M283 194c-16 12-31 19-49 22" />
              <path className="desk" d="M137 225h198M167 225l-23 62M306 225l28 62" />
              <path className="plant" d="M65 241c17-24 32-26 44-7-20 4-33 7-44 7zM69 259c16-18 30-17 39 2-18 2-28 1-39-2zM86 286v-61" />
              <path className="bag" d="M309 238h50l14 46h-78zM322 238c1-18 25-18 27 0" />
              <path className="math" d="M93 64l21 21M114 64L93 85M290 56h30M304 42v30M322 105l19 19 19-19M64 150l18 12-18 12M338 154l21 12-21 12" />
              <circle className="clock" cx="91" cy="82" r="24" />
              <path className="clock-hand" d="M91 65v18l13-7" />
              <circle className="clock" cx="331" cy="86" r="18" />
              <path className="clock-hand" d="M331 74v13l9 5" />
            </svg>
          </div>

          <div className="showcase-copy">
            <h1>Exam Mastery Hub</h1>
            <p>Practice, assess, and certify progress with a focused online examination portal.</p>
          </div>

          <div className="showcase-dots" aria-hidden="true">
            <span />
            <span className="active" />
            <span />
          </div>
        </aside>

        <section className="auth-panel">
          <div className="auth-card">
            <div className="mobile-brand">
              <span className="brand-mark">MH</span>
              <span>Mastery Hub</span>
            </div>
            <div className="auth-heading">
              <h2>{title}</h2>
              <p>{subtitle}</p>
            </div>
            {children}
          </div>
        </section>
      </section>
    </main>
  );
}
