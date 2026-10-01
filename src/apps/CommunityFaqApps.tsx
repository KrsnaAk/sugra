import { ArrowUpRight, ChevronDown, ExternalLink, MessageCircle, Radio, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { SUGRA_CONFIG } from '../config/sugra';

const channelLabels = [
  { key: 'x' as const, name: 'X', note: 'Signal feed' },
  { key: 'telegram' as const, name: 'TELEGRAM', note: 'Community room' },
  { key: 'discord' as const, name: 'DISCORD', note: 'World chat' },
];

export function CommunityApp() {
  const configured = channelLabels.filter((channel) => SUGRA_CONFIG.links[channel.key]);
  return (
    <div className="content-page community-page">
      <div className="app-page-heading"><span className="micro-label">SUGRA SIGNAL ROOM</span><span className="signal-wave"><Radio size={14} /> CHANNEL STATUS</span></div>
      <div className="community-hero"><div className="community-visual"><span className="community-pulse pulse-a" /><span className="community-pulse pulse-b" /><span className="community-pulse pulse-c" /><div className="community-center"><MessageCircle size={25} /></div></div><div><h2>FIND THE<br /><span>REAL SIGNAL.</span></h2><p>Only official channels are shown here.</p></div></div>
      <div className="channel-list">
        {configured.length ? configured.map((channel) => (
          <a className="channel-row" key={channel.key} href={SUGRA_CONFIG.links[channel.key] ?? '#'} target="_blank" rel="noreferrer"><span className="channel-icon"><MessageCircle size={16} /></span><span className="channel-copy"><strong>{channel.name}</strong><small>{channel.note}</small></span><span className="channel-open"><ExternalLink size={15} /></span></a>
        )) : <div className="channel-empty"><span className="empty-signal"><i /></span><div><strong>NO LINKS CONFIGURED</strong><p>Official X, Telegram, or Discord links have not been provided.</p></div></div>}
      </div>
      <div className="community-safety"><ShieldCheck size={15} /><span>Verify links before connecting a wallet.</span><span className="community-mark">S / W</span></div>
    </div>
  );
}

const FAQ_ITEMS = [
  { question: 'What is SUGRA?', answer: 'SUGRA.WORLD is the world of sugars — a digital place and operating system built around the SUGRA identity.' },
  { question: 'What is the connection to ARGUS?', answer: 'ARGUS.WORLD is the world of eyes. SUGRA.WORLD is the world of sugars. The simple relationship is ARGUS → SUGRA.' },
  { question: 'Is the token live?', answer: 'No. $SUGRA is not deployed yet. There is no contract address or onchain activity to report.' },
  { question: 'Which chain?', answer: 'SUGRA is intended for Arc. Verified network details will be added to the centralized configuration.' },
  { question: 'How do I buy?', answer: 'Buying is not available yet. No trading links are active before a verified deployment.' },
  { question: 'Where can I find official socials?', answer: 'Only links provided in the official SUGRA configuration appear in the Community app. None are configured right now.' },
];

export function FaqApp() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  return (
    <div className="content-page faq-page">
      <div className="app-page-heading"><span className="micro-label">QUICK ANSWERS</span><span className="faq-total">0{FAQ_ITEMS.length} NOTES</span></div>
      <h2 className="faq-heading">NO MYSTERY.<br /><span>JUST ANSWERS.</span></h2>
      <div className="faq-list">
        {FAQ_ITEMS.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div className={`faq-row${isOpen ? ' is-open' : ''}`} key={item.question}>
              <button type="button" className="faq-question" aria-expanded={isOpen} onClick={() => setOpenIndex(isOpen ? null : index)}><span className="faq-number">0{index + 1}</span><span>{item.question}</span><ChevronDown size={16} /></button>
              <div className="faq-answer-wrap" style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}><div className="faq-answer"><p>{item.answer}</p></div></div>
            </div>
          );
        })}
      </div>
      <div className="faq-foot"><span>STILL CURIOUS?</span><span>OPEN THE TERMINAL <ArrowUpRight size={13} /></span></div>
    </div>
  );
}
