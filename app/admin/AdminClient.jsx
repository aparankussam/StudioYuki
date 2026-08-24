'use client';

import { useCallback, useMemo, useState } from 'react';
import styles from './admin.module.css';

const SLOT_LABELS = {
  heroPortrait: { title: 'Hero portrait', sub: 'Photo of Yuki at the piano. Shown in the hero card.', accept: 'image/*' },
  heroVideo: { title: 'Hero video', sub: '20 to 30 second clip of Yuki playing. Shown when visitors tap the play button.', accept: 'video/mp4,video/quicktime,video/webm' },
  meetPhoto: { title: 'Meet Yuki photo', sub: 'Portrait in the About section. Falls back to the lotus crest if empty.', accept: 'image/*' },
};

function newId() {
  return 't_' + Math.random().toString(36).slice(2, 8) + '_' + Date.now().toString(36);
}

export default function AdminClient({ initialContent }) {
  const [content, setContent] = useState(initialContent);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState({});

  const hasUnsaved = useMemo(() => JSON.stringify(content) !== JSON.stringify(initialContent), [content, initialContent]);

  const showMsg = (m, ms = 4000) => {
    setMessage(m);
    if (ms) setTimeout(() => setMessage(''), ms);
  };

  const uploadFile = useCallback(async (file, slot) => {
    setUploading((s) => ({ ...s, [slot]: true }));
    try {
      const form = new FormData();
      form.append('file', file);
      form.append('slot', slot);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: form });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'Upload failed');
      return data;
    } finally {
      setUploading((s) => ({ ...s, [slot]: false }));
    }
  }, []);

  const handleMediaUpload = async (slot, file) => {
    try {
      const { url, contentType } = await uploadFile(file, slot);
      setContent((c) => {
        const next = { ...c };
        if (slot === 'heroPortrait') next.hero = { ...c.hero, portraitUrl: url };
        if (slot === 'heroVideo') next.hero = { ...c.hero, videoUrl: url };
        if (slot === 'meetPhoto') next.meet = { ...c.meet, photoUrl: url };
        return next;
      });
      showMsg(`Uploaded ${slot}. Click Save changes to publish.`);
    } catch (err) {
      showMsg(`Upload failed: ${err.message}`, 6000);
    }
  };

  const clearMedia = (slot) => {
    setContent((c) => {
      const next = { ...c };
      if (slot === 'heroPortrait') next.hero = { ...c.hero, portraitUrl: null };
      if (slot === 'heroVideo') next.hero = { ...c.hero, videoUrl: null };
      if (slot === 'meetPhoto') next.meet = { ...c.meet, photoUrl: null };
      return next;
    });
  };

  const saveAll = async () => {
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'Save failed');
      setContent(data.content);
      showMsg('Saved. Live in a few seconds.');
    } catch (err) {
      showMsg(`Save failed: ${err.message}`, 8000);
    } finally {
      setSaving(false);
    }
  };

  const addTestimonial = () => {
    setContent((c) => ({
      ...c,
      testimonials: [...c.testimonials, { id: newId(), quote: '', author: '', authorNote: '' }],
    }));
  };

  const updateTestimonial = (id, patch) => {
    setContent((c) => ({
      ...c,
      testimonials: c.testimonials.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    }));
  };

  const removeTestimonial = (id) => {
    setContent((c) => ({ ...c, testimonials: c.testimonials.filter((t) => t.id !== id) }));
  };

  const moveTestimonial = (id, dir) => {
    setContent((c) => {
      const arr = [...c.testimonials];
      const i = arr.findIndex((t) => t.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= arr.length) return c;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      return { ...c, testimonials: arr };
    });
  };

  const updateDay = (i, patch) => {
    setContent((c) => {
      const days = c.availability.days.map((d, idx) => (idx === i ? { ...d, ...patch } : d));
      return { ...c, availability: { ...c.availability, days } };
    });
  };

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <span aria-hidden="true">●</span>
          Studio Yuki · Admin
        </div>
        <div className={styles.headerRight}>
          <a href="/" className={styles.viewLive} target="_blank" rel="noreferrer">View live site &rarr;</a>
          <button
            className={`${styles.saveBtn} ${hasUnsaved ? styles.saveBtnUnsaved : ''}`}
            onClick={saveAll}
            disabled={saving || !hasUnsaved}
          >
            {saving ? 'Saving...' : hasUnsaved ? 'Save changes' : 'All changes saved'}
          </button>
        </div>
      </header>

      {message ? <div className={styles.toast}>{message}</div> : null}

      <main className={styles.main}>

        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Photos and video</h2>
          <p className={styles.cardSub}>Swap the hero portrait, the playing-clip video, and the Meet Yuki photo. Falls back to the lotus art if nothing uploaded.</p>
          <div className={styles.mediaGrid}>
            <MediaSlot
              slot="heroPortrait"
              labels={SLOT_LABELS.heroPortrait}
              url={content.hero.portraitUrl}
              uploading={uploading.heroPortrait}
              onUpload={handleMediaUpload}
              onClear={clearMedia}
              kind="image"
            />
            <MediaSlot
              slot="heroVideo"
              labels={SLOT_LABELS.heroVideo}
              url={content.hero.videoUrl}
              uploading={uploading.heroVideo}
              onUpload={handleMediaUpload}
              onClear={clearMedia}
              kind="video"
            />
            <MediaSlot
              slot="meetPhoto"
              labels={SLOT_LABELS.meetPhoto}
              url={content.meet.photoUrl}
              uploading={uploading.meetPhoto}
              onUpload={handleMediaUpload}
              onClear={clearMedia}
              kind="image"
            />
          </div>
        </section>

        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <h2 className={styles.cardTitle}>Testimonials</h2>
              <p className={styles.cardSub}>Real parent quotes. Top one shows first on the site.</p>
            </div>
            <button className={styles.smallBtn} onClick={addTestimonial}>+ Add quote</button>
          </div>
          <div className={styles.testList}>
            {content.testimonials.map((t, i) => (
              <div key={t.id} className={styles.testItem}>
                <div className={styles.testHead}>
                  <span className={styles.testIdx}>#{i + 1}</span>
                  <div className={styles.testActions}>
                    <button className={styles.iconBtn} title="Move up" onClick={() => moveTestimonial(t.id, -1)}>↑</button>
                    <button className={styles.iconBtn} title="Move down" onClick={() => moveTestimonial(t.id, 1)}>↓</button>
                    <button className={styles.iconBtnDanger} title="Delete" onClick={() => removeTestimonial(t.id)}>×</button>
                  </div>
                </div>
                <label className={styles.label}>Quote</label>
                <textarea
                  className={styles.textarea}
                  rows={3}
                  value={t.quote}
                  onChange={(e) => updateTestimonial(t.id, { quote: e.target.value })}
                  placeholder="Our daughter actually asks when her next lesson is..."
                />
                <div className={styles.row2}>
                  <div>
                    <label className={styles.label}>Author</label>
                    <input
                      className={styles.input}
                      type="text"
                      value={t.author}
                      onChange={(e) => updateTestimonial(t.id, { author: e.target.value })}
                      placeholder="Priya, mom of a 7-year-old"
                    />
                  </div>
                  <div>
                    <label className={styles.label}>Author note (optional)</label>
                    <input
                      className={styles.input}
                      type="text"
                      value={t.authorNote}
                      onChange={(e) => updateTestimonial(t.id, { authorNote: e.target.value })}
                      placeholder="Troy, MI · trial signed up in March"
                    />
                  </div>
                </div>
              </div>
            ))}
            {!content.testimonials.length ? (
              <p className={styles.emptyHint}>No testimonials yet. Click &ldquo;Add quote&rdquo;.</p>
            ) : null}
          </div>
        </section>

        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Booking link (Cal.com)</h2>
          <p className={styles.cardSub}>
            Paste a Cal.com booking link here and the trial form will send parents straight to your calendar with their info pre-filled. Leave blank to keep the current text-to-Yuki flow.
          </p>
          <label className={styles.label}>Cal.com URL</label>
          <input
            className={styles.input}
            type="url"
            inputMode="url"
            placeholder="https://cal.com/yukistudio/trial"
            value={content.booking?.calUrl || ''}
            onChange={(e) => setContent((c) => ({ ...c, booking: { ...c.booking, calUrl: e.target.value } }))}
          />
          <p style={{ fontSize: '0.82rem', color: '#4a3a48', marginTop: '0.6rem', lineHeight: 1.5 }}>
            Don&rsquo;t have one yet? Sign up free at <a href="https://cal.com/signup" target="_blank" rel="noreferrer" style={{ color: '#3d1f3d' }}>cal.com/signup</a>, create a 30-minute event called &ldquo;Trial Lesson,&rdquo; connect your Google Calendar, and paste the public link here.
          </p>
        </section>

        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Weekly availability</h2>
          <p className={styles.cardSub}>Toggle each day open or closed. Update the slot text when your real schedule changes.</p>
          <div className={styles.daysList}>
            {content.availability.days.map((d, i) => (
              <div key={i} className={`${styles.dayRow} ${!d.open ? styles.dayRowClosed : ''}`}>
                <span className={styles.dayName}>{d.name}</span>
                <input
                  className={styles.input}
                  type="text"
                  value={d.period}
                  onChange={(e) => updateDay(i, { period: e.target.value })}
                  placeholder="Eve / AM / PM"
                  style={{ maxWidth: 110 }}
                />
                <input
                  className={styles.input}
                  type="text"
                  value={d.slots}
                  onChange={(e) => updateDay(i, { slots: e.target.value })}
                  placeholder="4 to 7 PM"
                />
                <label className={styles.toggle}>
                  <input
                    type="checkbox"
                    checked={d.open}
                    onChange={(e) => updateDay(i, { open: e.target.checked })}
                  />
                  <span>{d.open ? 'Open' : 'Closed'}</span>
                </label>
              </div>
            ))}
          </div>
          <div className={styles.avSubGrid}>
            <div>
              <label className={styles.label}>Headline subtitle</label>
              <input
                className={styles.input}
                type="text"
                value={content.availability.label}
                onChange={(e) => setContent((c) => ({ ...c, availability: { ...c.availability, label: e.target.value } }))}
              />
            </div>
            <div>
              <label className={styles.label}>Helper text</label>
              <input
                className={styles.input}
                type="text"
                value={content.availability.sub}
                onChange={(e) => setContent((c) => ({ ...c, availability: { ...c.availability, sub: e.target.value } }))}
              />
            </div>
          </div>
        </section>

        <div className={styles.footerSave}>
          <button
            className={`${styles.saveBtn} ${hasUnsaved ? styles.saveBtnUnsaved : ''}`}
            onClick={saveAll}
            disabled={saving || !hasUnsaved}
          >
            {saving ? 'Saving...' : hasUnsaved ? 'Save changes' : 'All changes saved'}
          </button>
        </div>

      </main>
    </div>
  );
}

function MediaSlot({ slot, labels, url, uploading, onUpload, onClear, kind }) {
  return (
    <div className={styles.slot}>
      <div className={styles.slotPreview}>
        {url ? (
          kind === 'video' ? (
            <video src={url} controls muted preload="metadata" className={styles.slotMedia} />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt={labels.title} className={styles.slotMedia} />
          )
        ) : (
          <div className={styles.slotEmpty}>
            <span>No upload yet</span>
            <small>Falls back to lotus art</small>
          </div>
        )}
      </div>
      <h3 className={styles.slotTitle}>{labels.title}</h3>
      <p className={styles.slotSub}>{labels.sub}</p>
      <div className={styles.slotActions}>
        <label className={styles.slotUpload}>
          <input
            type="file"
            accept={labels.accept}
            disabled={uploading}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onUpload(slot, f);
              e.target.value = '';
            }}
            style={{ display: 'none' }}
          />
          {uploading ? 'Uploading...' : url ? 'Replace' : 'Upload'}
        </label>
        {url ? (
          <button className={styles.slotClear} onClick={() => onClear(slot)}>Clear</button>
        ) : null}
      </div>
    </div>
  );
}
