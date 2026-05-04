import Link from 'next/link';
import { Header } from '@/components/marketing/Header';
import { Footer } from '@/components/marketing/Footer';

interface Article {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  featured?: boolean;
}

const articles: Article[] = [
  {
    slug: 'how-aria-stays-invisible-during-screen-share',
    category: 'Deep Dive',
    title: 'How ARIA Stays Completely Invisible During Screen Share',
    excerpt:
      'Browser extensions show up in OBS, Zoom thumbnails, and task-switcher previews. ARIA runs as a native Windows process — here\'s exactly why that makes it undetectable.',
    date: 'Apr 28, 2025',
    readTime: '6 min read',
    featured: true,
  },
  {
    slug: 'wasapi-vs-browser-audio-capture',
    category: 'Technology',
    title: 'WASAPI vs Browser Audio Capture: Why the Difference Matters',
    excerpt:
      'Most interview tools use browser-level audio, which misses system audio entirely. WASAPI loopback captures what your speakers actually play — both your interviewer and you.',
    date: 'Apr 21, 2025',
    readTime: '5 min read',
  },
  {
    slug: 'star-method-with-ai',
    category: 'Interview Tips',
    title: 'Using the STAR Method with AI: Perfect Behavioral Answers Every Time',
    excerpt:
      'Situation, Task, Action, Result — the format every recruiter expects. See how ARIA\'s coaching mode structures your personal experience into polished STAR answers under pressure.',
    date: 'Apr 14, 2025',
    readTime: '4 min read',
  },
  {
    slug: 'live-coding-interviews-guide',
    category: 'Interview Tips',
    title: 'Surviving Live Coding Interviews: What Actually Helps',
    excerpt:
      'LeetCode alone won\'t cut it. Learn how real-time AI assistance during a coding session can explain approaches, hint at edge cases, and keep you from freezing under pressure.',
    date: 'Apr 7, 2025',
    readTime: '7 min read',
  },
  {
    slug: 'resume-personalization-ai-answers',
    category: 'Feature Guide',
    title: 'Why Generic AI Answers Fail — And How Resume-Aware AI Fixes It',
    excerpt:
      'Interviewers spot templated answers immediately. When ARIA has your resume, every response is grounded in your real projects, your actual metrics, and your genuine voice.',
    date: 'Mar 31, 2025',
    readTime: '5 min read',
  },
  {
    slug: 'multi-user-account-sharing',
    category: 'Feature Guide',
    title: 'One Account, Multiple Users: How ARIA\'s Team Sharing Works',
    excerpt:
      'Every ARIA plan supports simultaneous multi-user access. Job seekers in the same household — or a small team prepping together — can share a single subscription.',
    date: 'Mar 24, 2025',
    readTime: '3 min read',
  },
];

const categoryColors: Record<string, string> = {
  'Deep Dive': 'bg-brand-500/15 text-brand-400 border-brand-500/25',
  'Technology': 'bg-violet-500/15 text-violet-400 border-violet-500/25',
  'Interview Tips': 'bg-green-500/15 text-green-400 border-green-500/25',
  'Feature Guide': 'bg-cyan-500/15 text-cyan-400 border-cyan-500/25',
};

export default function BlogPage() {
  const [featured, ...rest] = articles;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-neutral-950 pt-24 pb-32">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Page header */}
          <div className="pt-16 pb-14 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-400 mb-3">ARIA Blog</p>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight">
              Insights & Guides
            </h1>
            <p className="max-w-xl mx-auto text-base text-white/50 leading-relaxed">
              Deep dives into interview strategy, AI technology, and how to use ARIA to land the role you want.
            </p>
          </div>

          {/* Featured article */}
          {featured && (
            <Link
              href={`/blog/${featured.slug}`}
              className="group block rounded-2xl border border-white/10 bg-white/3 hover:bg-white/5 hover:border-white/20 transition-all duration-300 overflow-hidden mb-8"
            >
              <div className="flex flex-col lg:flex-row">
                <div className="lg:flex-1 bg-gradient-to-br from-brand-500/20 via-neutral-800/50 to-violet-600/10 min-h-[220px] lg:min-h-0 flex items-center justify-center">
                  <div className="text-8xl font-black text-brand-500/10 select-none p-12">ARIA</div>
                </div>
                <div className="lg:flex-1 p-8 lg:p-10 flex flex-col justify-center gap-4">
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-semibold border rounded-full px-3 py-1 ${categoryColors[featured.category]}`}>
                      {featured.category}
                    </span>
                    <span className="text-xs text-white/30">Featured</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white leading-snug group-hover:text-brand-300 transition-colors">
                    {featured.title}
                  </h2>
                  <p className="text-sm text-white/50 leading-relaxed">{featured.excerpt}</p>
                  <div className="flex items-center gap-3 text-xs text-white/30 pt-2">
                    <span>{featured.date}</span>
                    <span>&middot;</span>
                    <span>{featured.readTime}</span>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* Article grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {rest.map((article) => (
              <Link
                key={article.slug}
                href={`/blog/${article.slug}`}
                className="group flex flex-col rounded-2xl border border-white/10 bg-white/3 hover:bg-white/5 hover:border-white/20 transition-all duration-300 overflow-hidden"
              >
                <div className="bg-gradient-to-br from-neutral-800/60 to-neutral-900/80 h-36 flex items-center justify-center">
                  <span className="text-5xl font-black text-white/5 select-none">{article.category[0]}</span>
                </div>
                <div className="flex flex-col gap-3 p-6 flex-1">
                  <span className={`self-start text-xs font-semibold border rounded-full px-3 py-1 ${categoryColors[article.category]}`}>
                    {article.category}
                  </span>
                  <h2 className="text-base font-bold text-white leading-snug group-hover:text-brand-300 transition-colors flex-1">
                    {article.title}
                  </h2>
                  <p className="text-sm text-white/45 leading-relaxed line-clamp-2">{article.excerpt}</p>
                  <div className="flex items-center gap-3 text-xs text-white/25 pt-1">
                    <span>{article.date}</span>
                    <span>&middot;</span>
                    <span>{article.readTime}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
