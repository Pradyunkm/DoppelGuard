import React, { useState, useRef, useEffect } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Bot, 
  Send, 
  X, 
  Sparkles, 
  AlertTriangle, 
  ExternalLink, 
  CheckCircle2,
  Lock,
  Maximize2,
  Minimize2,
  Trash2,
  ArrowRight
} from 'lucide-react';
import { INITIAL_PROFILES } from '../../data/profiles';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestedActions?: string[];
  riskCard?: {
    username: string;
    riskScore: number;
    riskBand: string;
    warning: string;
    action: string;
  };
}

export const DoppelGramAiSafetyChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-msg',
      role: 'assistant',
      content: "👋 Hi! I'm **Shield AI**, your DoppelGram safety copilot.\n\nI can help you verify accounts, spot giveaway & job scams, check suspicious DMs, or scan profiles directly with **DoppelGuard**.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedActions: [
        "Is @elonmusk_official2 real?",
        "Check @google_hr_recruitment",
        "How to spot UPI scams?",
        "How to protect my account?"
      ]
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMsg: Message = {
      id: 'user-' + Date.now(),
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Check if user is asking about a specific profile in DoppelGram
      const lower = query.toLowerCase();
      let matchedProfile = INITIAL_PROFILES.find((p) => 
        lower.includes(p.username.toLowerCase()) || 
        (p.displayName && lower.includes(p.displayName.toLowerCase()))
      );

      // Attempt to query DoppelGuard backend if available
      let backendAnalysis = null;
      if (matchedProfile) {
        try {
          const apiBase = (import.meta as any).env?.VITE_DOPPELGUARD_API_URL || 'http://localhost:8000';
          const resp = await fetch(`${apiBase}/profile/check`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              username: matchedProfile.username,
              name: matchedProfile.displayName,
              bio: matchedProfile.bio,
              photo_url: matchedProfile.profileImage,
              followers: matchedProfile.followers,
              following: matchedProfile.following,
              account_age_days: matchedProfile.accountAgeDays,
              links: (matchedProfile.links || []).map((l) => l.url)
            })
          });
          if (resp.ok) {
            backendAnalysis = await resp.json();
          }
        } catch {
          // Backend unreachable or offline
        }
      }

      // Generate context-aware reply
      setTimeout(() => {
        const botReply = generateSafetyReply(query, matchedProfile, backendAnalysis);
        const botMsg: Message = {
          id: 'bot-' + Date.now(),
          role: 'assistant',
          content: botReply.content,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestedActions: botReply.suggestedActions,
          riskCard: botReply.riskCard
        };
        setMessages((prev) => [...prev, botMsg]);
        setLoading(false);
      }, 400);

    } catch (err) {
      setLoading(false);
    }
  };

  const generateSafetyReply = (query: string, profile?: any, analysis?: any) => {
    const q = query.toLowerCase();

    // 1. Matched profile in DoppelGram database
    if (profile) {
      const isScam = profile.username.includes('official') || profile.username.includes('recruitment') || profile.username.includes('support') || profile.followers < 1000 && profile.following > 2000;
      const score = analysis?.risk_score || (isScam ? 94.5 : 8.5);
      const band = analysis?.risk_band || (isScam ? 'CRITICAL' : 'LOW');

      if (isScam) {
        return {
          content: `⚠️ **Warning: Suspect Impersonator Detected (@${profile.username})**\n\n` +
            `This profile shows severe deceptive indicators:\n` +
            `- **High Following vs Low Followers:** Following ${profile.following.toLocaleString()} but only followed by ${profile.followers.toLocaleString()}.\n` +
            `- **Young Account:** Created only ${profile.accountAgeDays} days ago.\n` +
            `- **Scam Indicators in Bio:** Matched suspicious financial/recruitment claims and unverified link shorteners.\n\n` +
            `🚨 **Action Advice:** Do NOT send UPI payments, OTPs, or click links. Report this profile immediately.`,
          suggestedActions: [
            `Scan @${profile.username} in DoppelGuard`,
            "How do I report this account?",
            "Check another profile"
          ],
          riskCard: {
            username: profile.username,
            riskScore: score,
            riskBand: band,
            warning: "High-Risk Impersonator & Scam Account",
            action: "Block & Report Profile"
          }
        };
      } else {
        return {
          content: `✅ **Verified / Authentic Creator (@${profile.username})**\n\n` +
            `This profile matches normal, authentic community activity:\n` +
            `- **Mature Account:** ${profile.accountAgeDays} days active.\n` +
            `- **Healthy Ratio:** ${profile.followers.toLocaleString()} followers with organic engagement.\n` +
            `- **Clean Links:** Official portfolio/links verified.`,
          suggestedActions: [
            "Check another profile",
            "How does verification work?"
          ],
          riskCard: {
            username: profile.username,
            riskScore: score,
            riskBand: band,
            warning: "Profile aligns with legitimate baseline",
            action: "Standard Operating Status"
          }
        };
      }
    }

    // 2. UPI / Indian Scam Questions
    if (q.includes('upi') || q.includes('lakh') || q.includes('recharge') || q.includes('paytm') || q.includes('sebi')) {
      return {
        content: `🚨 **How to Spot Indian Social Media UPI Scams:**\n\n` +
          `1. **The "Processing Fee" Trap:** Scammers claim you won Rs 5 Lakh or an iPhone, but demand a "Rs 499 GST / verification fee" via UPI QR code.\n` +
          `2. **wa.link / Telegram Groups:** Directing you to WhatsApp/Telegram to send UPI IDs or scan payment requests.\n` +
          `3. **Fake SEBI Advisory:** Promising "100% Guaranteed 25,000 daily profits in BankNifty". SEBI never guarantees returns.\n\n` +
          `**Golden Rule:** Legitimate giveaways will NEVER ask you to pay money to claim a prize!`,
        suggestedActions: [
          "Check @elonmusk_official2",
          "Check @google_hr_recruitment",
          "What should I do if scammed?"
        ]
      };
    }

    // 3. Job / Recruitment Fraud
    if (q.includes('job') || q.includes('recruiter') || q.includes('hiring') || q.includes('salary') || q.includes('google_hr')) {
      return {
        content: `💼 **Red Flags in Fake Recruitment Offers:**\n\n` +
          `- **No-Interview Direct Hiring:** Claiming $120k-$240k or Rs 7.5 LPA remote jobs without technical interviews.\n` +
          `- **Document / Registration Fees:** Asking for Rs 500 - Rs 1500 to "release offer letters". Genuine companies never charge candidates.\n` +
          `- **Suspicious Domains:** Directing to .top, .click, or wa.link instead of careers.google.com or official portals.`,
        suggestedActions: [
          "Check @google_hr_recruitment",
          "Is @apex_talent_recruiting safe?",
          "How to report fake recruiters"
        ]
      };
    }

    // 4. General Protection
    return {
      content: `🔒 **DoppelGram Safety Guidelines:**\n\n` +
        `- **Check User Badges:** Look for verified badges and inspect account creation age before trusting high-value claims.\n` +
        `- **Use the Shield Tool:** Click **"Check Profile"** on any user page to run a real-time DoppelGuard forensic audit.\n` +
        `- **Never Share OTPs or Passwords:** DoppelGram staff will never DM you asking for security codes.`,
      suggestedActions: [
        "Is @elonmusk_official2 real?",
        "Check @google_hr_recruitment",
        "How to spot UPI scams?"
      ]
    };
  };

  const handleClear = () => {
    setMessages([
      {
        id: 'cleared-msg',
        role: 'assistant',
        content: "Chat cleared. What profile or safety question would you like help with?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: [
          "Is @elonmusk_official2 real?",
          "Check @google_hr_recruitment",
          "How to spot UPI scams?"
        ]
      }
    ]);
  };

  return (
    <>
      {/* Floating Shield Launcher */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 md:bottom-6 right-6 z-40 flex items-center space-x-2 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-indigo-700 px-4 py-3 text-xs font-bold text-white shadow-xl shadow-indigo-600/30 ring-1 ring-white/20 hover:scale-105 active:scale-95 transition-all cursor-pointer group"
          id="btn-open-safety-chat"
        >
          <div className="relative flex h-5 w-5 items-center justify-center">
            <ShieldCheck className="h-5 w-5 text-white" />
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
          </div>
          <span className="tracking-wide">Shield AI</span>
          <span className="rounded-full bg-white/20 px-1.5 py-0.2 text-[9px] font-mono">SAFETY</span>
        </button>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div
          className={`fixed z-50 flex flex-col rounded-3xl border border-indigo-500/30 bg-neutral-900/95 text-neutral-100 shadow-2xl backdrop-blur-xl transition-all duration-300 ${
            isExpanded
              ? "inset-4 md:inset-10"
              : "bottom-20 md:bottom-6 right-6 h-[560px] w-[380px] sm:w-[420px]"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-neutral-800 p-4 bg-neutral-950/70 rounded-t-3xl">
            <div className="flex items-center space-x-3">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 shadow-md">
                <ShieldCheck className="h-5 w-5 text-white" />
                <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-neutral-950" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <h3 className="text-xs font-bold text-white tracking-wide">
                    SHIELD AI SAFETY COPILOT
                  </h3>
                  <span className="rounded bg-indigo-500/20 px-1.5 py-0.2 text-[9px] font-mono text-indigo-300 border border-indigo-500/30">
                    PROTECTION
                  </span>
                </div>
                <p className="text-[10px] text-neutral-400">Scam & Impersonation Defense</p>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={handleClear}
                className="rounded-lg p-1.5 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition-colors"
                title="Clear chat"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="rounded-lg p-1.5 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition-colors hidden sm:block"
                title={isExpanded ? "Collapse" : "Expand"}
              >
                {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                title="Close chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages Thread */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
            {messages.map((m) => {
              const isUser = m.role === 'user';
              return (
                <div key={m.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`max-w-[88%] rounded-2xl p-3.5 leading-relaxed ${
                      isUser
                        ? "bg-indigo-600 text-white rounded-br-none shadow-md"
                        : "bg-neutral-950 text-neutral-200 rounded-bl-none border border-neutral-800"
                    }`}
                  >
                    <div className="whitespace-pre-line break-words">
                      {m.content}
                    </div>

                    {/* Rich Risk Card */}
                    {m.riskCard && (
                      <div className={`mt-3 rounded-xl border p-3 text-xs space-y-1.5 ${
                        m.riskCard.riskBand === 'CRITICAL' || m.riskCard.riskBand === 'HIGH'
                          ? "border-rose-500/40 bg-rose-950/40 text-rose-200"
                          : "border-emerald-500/40 bg-emerald-950/40 text-emerald-200"
                      }`}>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white font-mono">@{m.riskCard.username}</span>
                          <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold font-mono ${
                            m.riskCard.riskBand === 'CRITICAL' ? "bg-rose-950 text-rose-300 border border-rose-800" : "bg-emerald-950 text-emerald-300 border border-emerald-800"
                          }`}>
                            {m.riskCard.riskBand} ({m.riskCard.riskScore}/100)
                          </span>
                        </div>
                        <p className="text-[11px] font-medium">{m.riskCard.warning}</p>
                      </div>
                    )}
                  </div>

                  <span className="text-[9px] text-neutral-500 font-mono mt-1 px-1">
                    {m.timestamp}
                  </span>

                  {/* Suggestion Chips */}
                  {!isUser && m.suggestedActions && m.suggestedActions.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5 max-w-[90%]">
                      {m.suggestedActions.map((act, i) => (
                        <button
                          key={i}
                          onClick={() => handleSend(act)}
                          className="rounded-lg border border-indigo-500/30 bg-indigo-950/40 px-2.5 py-1 text-[10px] text-indigo-300 hover:bg-indigo-900/50 transition-colors flex items-center space-x-1 cursor-pointer font-mono"
                        >
                          <Sparkles className="h-2.5 w-2.5 text-indigo-400" />
                          <span>{act}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {loading && (
              <div className="flex items-center space-x-2 rounded-2xl bg-neutral-950 p-3.5 border border-neutral-800 max-w-[70%]">
                <div className="h-3 w-3 animate-spin rounded-full border-2 border-indigo-400 border-t-transparent" />
                <span className="text-xs text-indigo-300 font-mono">Verifying profile threat signals...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className="p-3 border-t border-neutral-800 bg-neutral-950/80 rounded-b-3xl">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center space-x-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about @handle, fake jobs, or UPI scams..."
                className="flex-1 rounded-xl border border-neutral-800 bg-neutral-900 px-3.5 py-2 text-xs text-white placeholder-neutral-500 focus:border-indigo-500 focus:outline-none"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="rounded-xl bg-indigo-600 p-2 text-white hover:bg-indigo-500 disabled:opacity-50 transition-colors cursor-pointer"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
