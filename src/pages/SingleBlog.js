import { useParams, Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import PageHeader from '../components/PageHeader';
import AuthContext from '../context/AuthContext';

const SingleBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, deletePost } = useContext(AuthContext);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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
  const allPosts = [...globalPostsEnriched, ...userPostsEnriched.filter((post) => !globalPostsEnriched.some((item) => String(item.id) === String(post.id)))];
  const post = allPosts.find((p) => String(p.id) === String(id));

  const handleDeletePost = () => {
    setIsDeleteModalOpen(true);
  };

  const confirmDeletePost = () => {
    deletePost(post.id);
    setIsDeleteModalOpen(false);
    navigate('/blog');
  };

  if (!post) {
    return (
      <>
        <PageHeader title="Blog Post" subtitle="Post not found." />
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-white p-10 shadow-xl text-center">
            <h2 className="text-2xl font-semibold text-slate-900">Post Not Found</h2>
            <p className="mt-4 text-slate-600">The blog post you're looking for doesn't exist.</p>
            <Link to="/blog" className="mt-6 inline-flex rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-700">
              Back to Blog
            </Link>
          </div>
        </section>
      </>
    );
  }

  const categories = ['General', 'Design', 'Development', 'Branding', 'Marketing'];
  const recentPosts = allPosts.slice(0, 3);
  const allTags = post.tags || [];

  const normalizeText = (value) => String(value || '').trim().toLowerCase();
  const currentUserFullName = [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim();
  const currentUserCandidates = [
    user?.email,
    user?.username,
    currentUserFullName,
    `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
    `${user?.lastName || ''} ${user?.firstName || ''}`.trim()
  ]
    .map(normalizeText)
    .filter(Boolean);

  const postAuthorCandidates = [
    post.authorId,
    post.author,
    user?.email,
    user?.username,
    currentUserFullName,
    user?.firstName,
    user?.lastName
  ]
    .map(normalizeText)
    .filter(Boolean);

  const isAuthor = !!user && (
    currentUserCandidates.some((candidate) => postAuthorCandidates.includes(candidate)) ||
    currentUserCandidates.some((candidate) => normalizeText(post.authorId || '').includes(candidate)) ||
    currentUserCandidates.some((candidate) => normalizeText(post.author || '').includes(candidate))
  );

  return (
    <>
      <PageHeader title={post.title} subtitle={post.date} />
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Top Action Bar */}
        <div className="mb-8 flex items-center justify-between">
          <Link to="/blog" className="text-sm font-semibold text-emerald-600 hover:text-emerald-700">
            ← Back to Blog
          </Link>

          {isAuthor && (
            <div className="flex gap-3">
              <Link
                to={`/edit-post/${post.id}`}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Edit Post
              </Link>
              <button
                onClick={handleDeletePost}
                className="rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          )}
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          {/* Main column */}
          <main className="lg:col-span-8">
            <div className="mb-6 overflow-hidden rounded-2xl bg-white shadow">
              {(post.featuredImage || post.image) && (
                <img src={post.featuredImage || post.image} alt={post.title} className="w-full object-cover" style={{ height: 380 }} />
              )}
              <div className="p-8">
                <div className="text-sm uppercase tracking-[0.3em] text-emerald-600">{post.category || 'General'}</div>
                <h1 className="mt-3 text-3xl font-semibold text-slate-900">{post.title}</h1>
                <div className="mt-3 text-sm text-slate-600">By {post.author || 'Author'}</div>
                <div className="mt-6 prose prose-sm max-w-none text-slate-700 leading-7" dangerouslySetInnerHTML={{ __html: post.content }} />
              </div>
            </div>

            {/* Author box */}
            <div className="mb-8 rounded-2xl bg-white p-6 shadow">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-2xl font-semibold">
                  {(post.author || user?.firstName || user?.username || 'A')[0]}
                </div>
                <div>
                  <div className="text-lg font-semibold text-slate-900">{post.author || 'Author'}</div>
                  <div className="text-sm text-slate-500">Author</div>
                </div>
              </div>
              <p className="mt-4 text-slate-600">{user?.bio || 'No bio provided.'}</p>
            </div>
          </main>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Search */}
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <label htmlFor="search" className="sr-only">Search</label>
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <i className="fa-solid fa-magnifying-glass text-slate-400" aria-hidden="true" />
                <input id="search" type="text" placeholder="Search" className="w-full bg-transparent text-sm text-slate-900 outline-none" />
              </div>
            </div>

            {/* Categories */}
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

            {/* Recent Posts */}
            {recentPosts.length > 0 && (
              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">Recent Posts</h3>
                <div className="mt-5 space-y-4">
                  {recentPosts.map((recentPost) => (
                    <Link key={recentPost.id} to={`/blog/${recentPost.id}`} className="flex gap-4 rounded-lg hover:bg-slate-50 p-2 transition">
                      <div className="h-20 w-20 flex-shrink-0 rounded-lg overflow-hidden bg-slate-100">
                        {(recentPost.featuredImage || recentPost.image) ? (
                          <img src={recentPost.featuredImage || recentPost.image} alt={recentPost.title} className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-slate-400">
                            <i className="fas fa-image text-lg"></i>
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-semibold text-slate-900 line-clamp-2">{recentPost.title}</h4>
                        <p className="mt-1 text-xs text-slate-500">{recentPost.date}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {allTags.length > 0 && (
              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">Tags</h3>
                <div className="mt-5 flex flex-wrap gap-3">
                  {allTags.map((tag) => (
                    <button key={tag} className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:border-emerald-600 hover:text-emerald-600">
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </section>

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-xl font-semibold text-slate-900">Delete this post?</h3>
            <p className="mt-3 text-sm text-slate-600">
              This action cannot be undone. The blog post will be removed permanently.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeletePost}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SingleBlog;
