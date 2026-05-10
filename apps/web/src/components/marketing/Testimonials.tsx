import { cn } from '@/lib/utils';

interface Testimonial {
  name: string;
  role: string;
  company: string;
  quote: string;
  stars?: number;
}

const testimonials: Testimonial[] = [
  {
    name: 'Marcus T.',
    role: 'Senior Software Engineer',
    company: 'Hired at Stripe',
    quote:
      "I bombed two system-design rounds before ARIA. The dual-stream capture is incredible — it actually hears what the interviewer says and gives me a structured answer in under a second. Got the Stripe offer first try.",
    stars: 5,
  },
  {
    name: 'Priya S.',
    role: 'Product Manager',
    company: 'Hired at Figma',
    quote:
      "ARIA knows my resume better than I do. When they asked about a specific project, it surfaced the exact metrics I'd forgotten. I used the AI overlay across four rounds — it kept me calm, structured, and specific every time.",
    stars: 5,
  },
  {
    name: 'Jordan L.',
    role: 'Data Scientist',
    company: 'Hired at Databricks',
    quote:
      "I was skeptical of browser-extension tools — they felt sketchy and slow. ARIA is a real Windows app. The WASAPI capture is rock-solid even on my corporate VPN. Answered every stats question in real time.",
    stars: 5,
  },
  {
    name: 'Aisha K.',
    role: 'Frontend Engineer',
    company: 'Hired at Vercel',
    quote:
      "The profile-aware answers are what sold me. I pasted my resume once and ARIA remembered every single project. STAR-method coaching mode helped me stop rambling and actually answer behavioral questions confidently.",
    stars: 5,
  },
  {
    name: 'Tomás R.',
    role: 'Backend Engineer',
    company: 'Hired at Cloudflare',
    quote:
      "I compared ARIA to a Chrome extension tool. The extension was flaky and platform-dependent. ARIA is a native Windows app — rock-solid on every call platform, better audio capture, and $10 cheaper per month. No-brainer.",
    stars: 5,
  },
  {
    name: 'Lin W.',
    role: 'ML Engineer',
    company: 'Hired at Anthropic',
    quote:
      "The model selection feature is underrated. I switched to DeepSeek R1 for reasoning-heavy ML questions and the quality jumped. Feels like having a senior engineer whispering in my ear the entire interview.",
    stars: 5,
  },
];

function StarRating({ count = 5 }: { count?: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={cn('w-4 h-4', i < count ? 'text-amber-400' : 'text-muted')}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export function Testimonials() {
  return (
    <section className="py-24 sm:py-32 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Candidates are getting offers
          </h2>
          <p className="max-w-xl mx-auto text-base text-muted-foreground">
            Real people. Real interviews. Real results.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="flex flex-col gap-4 rounded-2xl border border-border bg-background p-6 hover:shadow-md transition-shadow"
            >
              <StarRating count={t.stars} />

              <blockquote className="text-sm text-foreground/80 leading-relaxed flex-1">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              <div className="flex items-center gap-3 pt-2 border-t border-border">
                {/* Avatar placeholder */}
                <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center shrink-0">
                  {/* TODO: insert avatar image */}
                  <span className="text-xs font-semibold text-muted-foreground">
                    {t.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {t.role} &middot; {t.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
