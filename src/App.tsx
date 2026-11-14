import { useCallback, useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ArrowLeft, ArrowRight, Volume2, VolumeX, RotateCcw } from 'lucide-react'

const chapters = ['The beginning', 'A little world', 'Little things', 'The letter', 'Our constellation', 'The moment', 'The question']
const memories = [
  { symbol: '✳', title: 'The way you notice', note: 'You find the small, lovely things everyone else walks past.' },
  { symbol: '❋', title: 'Your kind of quiet', note: 'Even the quiet feels full when I get to share it with you.' },
  { symbol: '✧', title: 'The ordinary magic', note: 'Somehow, a completely ordinary day becomes my favourite one.' },
  { symbol: '☾', title: 'Finding my way', note: 'No matter how far the night stretches, you feel like home.' },
]

export default function App() {
  const [page, setPage] = useState(0)
  const [transitioning, setTransitioning] = useState(false)
  const [openLetter, setOpenLetter] = useState(false)
  const [picked, setPicked] = useState<number | null>(null)
  const [accepted, setAccepted] = useState(false)
  const [showNote, setShowNote] = useState(false)
  const [sound, setSound] = useState(false)
  const [musicNotice, setMusicNotice] = useState(true)
  const pageRef = useRef<HTMLDivElement>(null)
  const touchStart = useRef<number | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const navigate = useCallback((next: number) => {
    if (transitioning || next < 0 || next >= chapters.length) return
    setTransitioning(true)
    const el = pageRef.current
    gsap.to(el, { opacity: 0, scale: 1.012, duration: 0.38, ease: 'power2.in', onComplete: () => {
      setPage(next); setPicked(null); setOpenLetter(false); setShowNote(false)
      gsap.fromTo(el, { opacity: 0, scale: 1.008 }, { opacity: 1, scale: 1, duration: 0.75, delay: 0.12, ease: 'power2.out', onComplete: () => setTransitioning(false) })
    } })
  }, [transitioning])

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.key === 'ArrowRight') navigate(page + 1)
      if (e.key === 'ArrowLeft') navigate(page - 1)
      if (e.key === 'Escape') { setPicked(null); setShowNote(false) }
    }
    window.addEventListener('keydown', key)
    return () => window.removeEventListener('keydown', key)
  }, [page, navigate])

  const toggleSound = () => {
    if (sound) {
      audioRef.current?.pause()
      setSound(false)
      return
    }
    const audio = audioRef.current
    if (!audio) return
    void audio.play().then(() => setSound(true)).catch(() => setSound(false))
  }

  return <main className={`app page-${page} ${accepted ? 'accepted' : ''}`} onTouchStart={e => { touchStart.current = e.touches[0].clientX }} onTouchEnd={e => {
    if (touchStart.current === null) return
    const dx = e.changedTouches[0].clientX - touchStart.current
    if (Math.abs(dx) > 70) navigate(page + (dx < 0 ? 1 : -1))
    touchStart.current = null
  }}>
    <div className="backdrop" />
    <div className="crt-overlay" aria-hidden="true" />
    <div className="film-grain" aria-hidden="true" />
    <audio ref={audioRef} src="/bg%20music.aac" loop preload="auto" onPause={() => setSound(false)} onPlay={() => setSound(true)} />

    <header className="topline">
      <button className="chapter-count" onClick={() => navigate(0)} aria-label="Restart at beginning">{String(page + 1).padStart(2, '0')} <span>/ 07</span></button>
      <div className="book-title">{chapters[page].toUpperCase()}</div>
      <button className="sound-toggle" onClick={toggleSound} aria-label={sound ? 'Mute sound' : 'Enable sound'}>{sound ? <Volume2 size={15} /> : <VolumeX size={15} />}<span>SOUND {sound ? 'ON' : 'OFF'}</span></button>
    </header>

    {musicNotice && !sound && <aside className="music-notice" role="status" aria-live="polite"><span className="notice-note">♫</span><p>A little music can make this universe feel even more special.</p><button className="notice-enable" onClick={() => { toggleSound(); setMusicNotice(false) }}>Turn music on</button><button className="notice-close" aria-label="Dismiss music suggestion" onClick={() => setMusicNotice(false)}>×</button></aside>}

    <div ref={pageRef} className="page-content" key={page}>
      {page === 0 && <section className="copy opening"><h1>The Little<br/><em>Universe</em></h1><p className="lede">Somewhere between the stars,<br/>I found something beautiful.</p><span className="ornament">✳</span></section>}
      {page === 1 && <section className="copy world"><p className="eyebrow">CHAPTER TWO · A LITTLE WORLD</p><h2>Somewhere in this<br/>endless universe,</h2><p className="lede">there is one person who makes<br/>everything feel a little brighter.</p><span className="small-rule" /></section>}
      {page === 2 && <section className="copy memory"><p className="eyebrow">CHAPTER THREE · LITTLE THINGS</p><h2>A few things<br/><em>I'll keep.</em></h2><p className="hint">Choose a small light.</p>{picked !== null && <div className="memory-reveal"><span>{memories[picked].symbol}</span><h3>{memories[picked].title}</h3><p>{memories[picked].note}</p></div>}</section>}
      {page === 3 && <section className={`copy letter ${openLetter ? 'opened' : ''}`}><p className="eyebrow">CHAPTER FOUR · SOMETHING FOR YOU</p>{!openLetter ? <><h2>A letter, <em>for you.</em></h2><button className="text-action" onClick={() => setOpenLetter(true)}>Break the seal <span>↗</span></button></> : <div className="letter-copy"><span className="letter-date">TO MY DEAREST LADY</span><p className="letter-salutation">My dearest love,</p><p>If I were a knight riding through a far-off kingdom, I would cross every field and storm simply to find my way to you. Yet the greatest adventure of my life has been learning your laugh, holding your hand, and finding home beside you.</p><p>You bring more light to my days than all the stars above our kingdom. No crown or treasure could mean as much to me as the quiet, ordinary moments we share.</p><p>Wherever life may lead us, I will choose you in every season, and keep finding my way back to you.</p><p className="signature">Ever yours,<br/><em>your devoted knight</em></p></div>}</section>}
    {page === 4 && <section className="copy constellation"><p className="eyebrow">CHAPTER FIVE · OUR CONSTELLATION</p><h2>Every little light<br/>led me <em>here.</em></h2><p className="hint">A map made of moments.</p><div className="heart-constellation" aria-label="Four stars forming a heart"><svg viewBox="0 0 180 130" aria-hidden="true"><path d="M90 112 49 76 28 54 30 34 43 23 60 23 75 34 90 49 105 34 120 23 137 23 150 34 152 54 131 76Z" /></svg><div className="constellation-hotspots">{['First hello','Long walk','Your laugh','Right here'].map((label,i)=><button key={label} className={`constellation-point point-${i}`} aria-label={`Step ${i+1}: ${label}`} onClick={e => { e.currentTarget.classList.toggle('lit') }} style={{ left: `${[24,16,76,50][i]}%`, top: `${[18,42,18,86][i]}%` }}><span>{label}</span></button>)}</div></div><p className="constellation-caption">THE LITTLE THINGS THAT LED ME HERE</p></section>}
      {page === 5 && <section className="copy moment"><p className="eyebrow">CHAPTER SIX · THE MOMENT</p><span className="moment-mark">✳</span><h2>I have something<br/>I've wanted to ask you.</h2><p className="hint">Take all the time you need.</p></section>}
      {page === 6 && <section className="copy question">{!accepted ? <><p className="eyebrow">CHAPTER SEVEN · THE QUESTION</p><span className="proposal-ring" aria-hidden="true"><i /></span><p className="prelude">If every path led me to you,<br/>I would choose it all again.</p><h2>Will you be<br/><em>my person?</em></h2><div className="answers"><button className="yes-button" onClick={() => setAccepted(true)}>Yes, let's make them <span>♡</span></button><button className="note-button" onClick={() => setShowNote(!showNote)}>I want to tell you something...</button></div>{showNote && <p className="side-note">Whatever your answer, you are already one of my favourite parts of this universe.</p>}</> : <><p className="eyebrow">A NEW LITTLE BEGINNING</p><span className="end-star">✧</span><h2>Maybe this is the beginning<br/>of something <em>beautiful.</em></h2><p className="final-note">In every version of the universe,<br/>I would still hope to find my way to you.</p><button className="restart" onClick={() => { setAccepted(false); navigate(0) }}><RotateCcw size={13}/> Begin again</button></>}</section>}
    </div>

    {page === 2 && <div className="memory-hotspots" aria-label="Memory objects">{memories.map((m,i) => <button key={m.title} aria-label={`Reveal: ${m.title}`} onClick={() => setPicked(i)} style={{ left: `${20+i*20}%`, top: `${39+(i%2)*8}%` }}><span>{m.symbol}</span></button>)}</div>}
    {page === 3 && !openLetter && <button className="envelope-visual" aria-label="Open the envelope" onClick={() => setOpenLetter(true)}><span className="envelope-paper"/><span className="envelope-flap"/><span className="wax-seal">♕</span></button>}

    <nav className="book-nav" aria-label="Chapter navigation">
      <button className="prev" onClick={() => navigate(page - 1)} disabled={page === 0}><ArrowLeft size={15}/><span>PREVIOUS</span></button>
      <div className="chapter-dots">{chapters.map((chapter,i)=><button key={chapter} className={i === page ? 'active' : ''} aria-label={`Go to chapter ${i+1}: ${chapter}`} title={chapter} onClick={() => navigate(i)} />)}</div>
      {page < 6 && <button className="next" onClick={() => navigate(page + 1)}><span>{page === 0 ? 'TURN THE PAGE' : 'NEXT CHAPTER'}</span><ArrowRight size={15}/></button>}
      {page === 6 && accepted && <button className="next" onClick={() => { setAccepted(false); navigate(0) }}><span>READ AGAIN</span><ArrowRight size={15}/></button>}
    </nav>
    <a className="creator-credit" href="https://dharmpatel-dev.vercel.app/" target="_blank" rel="noreferrer noopener">Made with <span aria-hidden="true">♡</span> by <strong>Dharm Patel</strong></a>
    <div className="chapter-caption">{chapters[page].toUpperCase()}</div>
  </main>
}
