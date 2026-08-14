import { Link } from 'react-router-dom';
import { useContext } from 'react';
import PageHeader from '../components/PageHeader';
import AuthContext from '../context/AuthContext';

const defaultComments = [{ id: 1, name: 'Guest', text: 'Great post!' }];

const categories = ['General', 'Design', 'Development', 'Branding', 'Marketing'];
const tags = ['Design', 'Tips', 'Blog', 'React', 'Yii2', 'UI'];

const Blog = () => {
  const { user } = useContext(AuthContext);
  const globalPosts = JSON.parse(localStorage.getItem('testsite-posts') || '[]');
  const userPosts = Array.isArray(user?.posts) ? user.posts : [];
  
  const enrichPost = (post) => {
    if (post.author && post.author.trim()) return post;
    if (post.authorId && post.authorId.trim()) {
      const authorId = post.authorId;
      if (authorId.includes('@')) {
        return { ...post, author: authorId.split('@')[0] };
      }
      return { ...post, author: authorId };
    }
    return { ...post, author: 'Author' };
  };
  
  const globalPostsEnriched = globalPosts.map(enrichPost);
  const userPostsEnriched = userPosts.map(enrichPost);
  const mergedPosts = [...globalPostsEnriched, ...userPostsEnriched.filter((post) => !globalPostsEnriched.some((item) => String(item.id) === String(post.id)))];
  const displayPosts = mergedPosts;
  const recentPosts = mergedPosts.slice(0, 3);

  return (
    <>
      <PageHeader title="Blog" subtitle="Browse the latest posts and explore author content." />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-8">
            {displayPosts.map((post) => (
              <article key={post.id} className="overflow-hidden rounded-3xl bg-white shadow-lg">
                {(post.featuredImage || post.image) && (
                  <img src={post.featuredImage || post.image} alt={post.title} className="h-72 w-full object-cover" />
                )}
                <div className="p-8">
                  <h2 className="text-2xl font-semibold text-slate-900">{post.title}</h2>
                  <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-600">
                    <span><i className="fas fa-user mr-1"></i>{post.author || 'Author'}</span>
                    <span><i className="far fa-calendar mr-1"></i>{post.date}</span>
                    <span><i className="far fa-comments mr-1"></i>{defaultComments.length} Comments</span>
                  </div>
                  <p className="mt-4 line-clamp-2 text-slate-600">{post.description || post.excerpt || (typeof post.content === 'string' ? post.content.replace(/<[^>]*>/g, '').substring(0, 150) : 'No description available')}</p>
                  <div className="mt-6 flex items-center justify-end gap-4">
                    <Link to={`/blog/${post.id}`} className="rounded-full bg-[#22C55E] px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
                      Read More
                    </Link>
                  </div>
                </div>
              </article>
            ))}

            <div className="flex items-center justify-center gap-3 rounded-3xl bg-white p-4 shadow-sm">
              {[1, 2, 3].map((number) => (
                <button
                  key={number}
                  className={`h-11 w-11 rounded-full text-sm font-semibold transition ${
                    number === 1
                      ? 'bg-[#22C55E] text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {number}
                </button>
              ))}
            </div>
          </div>

          <aside className="space-y-8">
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <label htmlFor="search" className="sr-only">Search</label>
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <i className="fa-solid fa-magnifying-glass text-slate-400" aria-hidden="true" />
                <input id="search" type="text" placeholder="Search" className="w-full bg-transparent text-sm text-slate-900 outline-none" />
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">Categories</h3>
              <ul className="mt-5 space-y-3 text-slate-600">
                {categories.map((category) => (
                  <li key={category} className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3">
                    <span>{category}</span>
                    <span className="text-xs font-semibold text-slate-400">12</span>
                  </li>
                ))}
              </ul>
            </div>

            {recentPosts.length > 0 && (
              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">Recent Posts</h3>
                <div className="mt-5 space-y-4">
                  {recentPosts.map((post) => (
                    <Link key={post.id} to={`/blog/${post.id}`} className="flex items-center gap-4 rounded-xl p-2 transition hover:bg-slate-50">
                      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100">
                        {(post.featuredImage || post.image) ? (
                          <img src={post.featuredImage || post.image} alt={post.title} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-slate-400">
                            <i className="fas fa-image text-lg"></i>
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h4 className="text-base font-semibold text-slate-900 line-clamp-2">{post.title}</h4>
                        <p className="mt-2 text-sm text-slate-500">{post.date || 'No date'}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">Tags</h3>
              <div className="mt-5 flex flex-wrap gap-3">
                {tags.map((tag) => (
                  <button key={tag} className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:border-[#22C55E] hover:text-[#22C55E]">
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
};

export default Blog;
