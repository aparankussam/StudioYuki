import { getHomeBody, getHomeStyles } from '@/lib/templates';
import { getContent } from '@/lib/content';

export const revalidate = 60;

export default async function HomePage() {
  const [body, styles, content] = await Promise.all([getHomeBody(), getHomeStyles(), getContent()]);
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div dangerouslySetInnerHTML={{ __html: body }} />
      <script
        id="syk-content"
        type="application/json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(content) }}
      />
      <script dangerouslySetInnerHTML={{ __html: enhanceScript() }} />
    </>
  );
}

function enhanceScript() {
  return `(function(){
  try {
    var data = JSON.parse(document.getElementById('syk-content').textContent);

    // 1) Hero portrait swap (replace SVG art with uploaded image)
    if (data.hero && data.hero.portraitUrl) {
      var portraitSvg = document.querySelector('.video-card .video-portrait');
      if (portraitSvg) {
        var img = document.createElement('img');
        img.src = data.hero.portraitUrl;
        img.alt = 'Yuki at the piano';
        img.loading = 'eager';
        img.decoding = 'async';
        img.className = 'video-portrait';
        img.style.position = 'absolute';
        img.style.inset = '0';
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        portraitSvg.replaceWith(img);
      }
    }

    // 2) Hero video — if a real clip exists, intercept the click to play inline
    if (data.hero && data.hero.videoUrl) {
      var videoCard = document.querySelector('.video-card');
      if (videoCard) {
        videoCard.addEventListener('click', function(e){
          e.preventDefault();
          openVideoOverlay(data.hero.videoUrl);
        });
      }
    }

    // 3) Meet Yuki photo swap (replace crest SVG with uploaded photo)
    if (data.meet && data.meet.photoUrl) {
      var meetSvg = document.querySelector('.meet-visual svg');
      if (meetSvg) {
        var mimg = document.createElement('img');
        mimg.src = data.meet.photoUrl;
        mimg.alt = 'Yuki, Studio Yuki piano teacher';
        mimg.loading = 'lazy';
        mimg.decoding = 'async';
        mimg.style.width = '100%';
        mimg.style.height = '100%';
        mimg.style.objectFit = 'cover';
        meetSvg.replaceWith(mimg);
      }
    }

    // 4) Testimonials — rebuild the quote section if data has anything
    if (data.testimonials && data.testimonials.length) {
      var quoteWrap = document.querySelector('.quote-wrap');
      if (quoteWrap) {
        var first = data.testimonials[0];
        var rest = data.testimonials.slice(1);
        var html = '<div class="quote-mark" aria-hidden="true">"</div>';
        html += '<blockquote class="quote-text reveal visible">' + escapeHtml(first.quote) + '</blockquote>';
        html += '<div class="quote-author reveal visible"><strong>' + escapeHtml(first.author || '') + '</strong>';
        if (first.authorNote) html += '<br><span style="color: var(--ink-soft); font-size: 0.85rem;">' + escapeHtml(first.authorNote) + '</span>';
        html += '</div>';
        if (rest.length) {
          html += '<div class="quote-more" style="margin-top:3.5rem;display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.5rem;">';
          rest.forEach(function(t){
            html += '<div style="background:var(--paper);border:1px solid var(--line);border-radius:14px;padding:1.6rem;text-align:left;">';
            html += '<p style="font-family:Fraunces,serif;font-size:1.05rem;line-height:1.45;color:var(--ink);margin-bottom:0.9rem;">' + escapeHtml(t.quote) + '</p>';
            html += '<div style="font-size:0.85rem;color:var(--ink-soft);"><strong style="color:var(--ink);font-weight:500;">' + escapeHtml(t.author || '') + '</strong>';
            if (t.authorNote) html += '<br><span>' + escapeHtml(t.authorNote) + '</span>';
            html += '</div></div>';
          });
          html += '</div>';
        }
        quoteWrap.innerHTML = html;
      }
    }

    // 6) Cal.com booking routing — if a URL is configured, route the form there
    if (data.booking && data.booking.calUrl) {
      var bookForm = document.getElementById('bookForm');
      if (bookForm) {
        bookForm.addEventListener('submit', function(e){
          e.preventDefault();
          e.stopImmediatePropagation();
          var parent = (document.getElementById('bfParent')||{}).value || '';
          var age    = (document.getElementById('bfChild')||{}).value || '';
          var phone  = (document.getElementById('bfPhone')||{}).value || '';
          var time   = (document.getElementById('bfTime')||{}).value || '';
          var format = (document.getElementById('bfFormat')||{}).value || '';
          var params = new URLSearchParams();
          if (parent) params.set('name', parent);
          var notes = [];
          if (age) notes.push('Child age: ' + age);
          if (phone) notes.push('Phone: ' + phone);
          if (time) notes.push('Preferred time: ' + time);
          if (format) notes.push('Format: ' + format);
          if (notes.length) params.set('notes', notes.join('\\n'));
          var sep = data.booking.calUrl.indexOf('?') > -1 ? '&' : '?';
          var url = data.booking.calUrl + sep + params.toString();
          window.open(url, '_blank', 'noopener,noreferrer');
          var confirmEl = document.getElementById('bfConfirm');
          if (confirmEl) confirmEl.textContent = 'Opening the calendar so you can pick a time. Yuki will be notified.';
        }, true);
      }
      var submitBtn = document.querySelector('#bookForm .bf-submit');
      if (submitBtn) {
        for (var i = 0; i < submitBtn.childNodes.length; i++) {
          var n = submitBtn.childNodes[i];
          if (n.nodeType === 3 && n.nodeValue.trim()) {
            n.nodeValue = " Pick a time for your $10 trial ";
            break;
          }
        }
      }
      var bookLead = document.querySelector('.book > .book-inner > p');
      if (bookLead) {
        bookLead.textContent = "Tell Yuki a little about your child, then pick a time. Trial is $10. Love it or it's free.";
      }
    }

    // 5) Availability grid + headline subtitle
    if (data.availability && data.availability.days && data.availability.days.length === 7) {
      var grid = document.querySelector('.week-grid');
      if (grid) {
        var html = '';
        data.availability.days.forEach(function(d){
          if (d.open) {
            html += '<a href="#book" class="day-card open" role="listitem"><div class="day-name">' + escapeHtml(d.name) + '</div><div class="day-num">' + escapeHtml(d.period) + '</div><div class="day-slots">' + escapeHtml(d.slots) + '</div></a>';
          } else {
            html += '<div class="day-card busy" role="listitem"><div class="day-name">' + escapeHtml(d.name) + '</div><div class="day-num">' + escapeHtml(d.period) + '</div><div class="day-slots full">Closed</div></div>';
          }
        });
        grid.innerHTML = html;
      }
      var subLabel = document.querySelector('#availTitle');
      var availHeader = document.querySelector('.avail-header p');
      if (availHeader && data.availability.sub) availHeader.textContent = data.availability.sub;
    }

    function escapeHtml(s){
      return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
    }

    function openVideoOverlay(url){
      if (document.getElementById('syk-video-overlay')) return;
      var overlay = document.createElement('div');
      overlay.id = 'syk-video-overlay';
      overlay.style.cssText = 'position:fixed;inset:0;background:rgba(28,18,24,0.9);z-index:200;display:flex;align-items:center;justify-content:center;padding:1rem;backdrop-filter:blur(8px);';
      overlay.innerHTML = '<button aria-label="Close" style="position:absolute;top:1rem;right:1rem;background:rgba(250,244,232,0.15);color:#faf4e8;border:none;width:44px;height:44px;border-radius:50%;font-size:1.6rem;cursor:pointer;">×</button><video src="' + encodeURI(url) + '" controls autoplay style="max-width:min(900px,100%);max-height:90vh;border-radius:14px;box-shadow:0 30px 80px rgba(0,0,0,0.5);"></video>';
      var close = function(){ overlay.remove(); document.removeEventListener('keydown', onKey); };
      overlay.querySelector('button').addEventListener('click', close);
      overlay.addEventListener('click', function(e){ if (e.target === overlay) close(); });
      var onKey = function(e){ if (e.key === 'Escape') close(); };
      document.addEventListener('keydown', onKey);
      document.body.appendChild(overlay);
    }
  } catch (err) {
    console.warn('Studio Yuki enhancement script error', err);
  }
})();`;
}
