import { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import AuthContext from '../context/AuthContext';

const categories = ['General', 'Design', 'Development', 'Branding', 'Marketing'];

const PostEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, updateProfile } = useContext(AuthContext);
  const contentEditorRef = useRef(null);
  const isEdit = Boolean(id);
  const [form, setForm] = useState({
    title: '',
    slug: '',
    category: 'General',
    tags: '',
    image: null,
    content: ''
  });
  const [isDirty, setIsDirty] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);

  useEffect(() => {
    if (!user) return;

    const posts = Array.isArray(user.posts) ? user.posts : [];

    if (isEdit) {
      const existingPost = posts.find((post) => String(post.id) === String(id));

      if (existingPost) {
        setForm({
          title: existingPost.title || '',
          slug: existingPost.slug || '',
          category: existingPost.category || 'General',
          tags: Array.isArray(existingPost.tags) ? existingPost.tags.join(', ') : existingPost.tags || '',
          image: existingPost.featuredImage || existingPost.image || null,
          content: existingPost.content || ''
        });
        return;
      }
    }

    setForm({
      title: '',
      slug: '',
      category: 'General',
      tags: '',
      image: null,
      content: ''
    });
  }, [id, isEdit, user]);

  useEffect(() => {
    if (!contentEditorRef.current) return;

    const editor = contentEditorRef.current;
    const nextHtml = form.content || '';

    if (editor.innerHTML !== nextHtml) {
      editor.innerHTML = nextHtml;
    }
  }, [form.content]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (isDirty) {
        event.preventDefault();
        event.returnValue = '';
      }
    };

    const handleDocumentClick = (event) => {
      const anchor = event.target.closest('a');

      if (!isDirty || !anchor) return;

      const targetUrl = new URL(anchor.href, window.location.href);
      const currentUrl = new URL(window.location.href);

      if (targetUrl.origin !== currentUrl.origin) {
        event.preventDefault();
        handleLeave('/account');
        return;
      }

      if (targetUrl.pathname !== currentUrl.pathname) {
        event.preventDefault();
        handleLeave('/account');
      }
    };

    const handlePopState = () => {
      if (isDirty) {
        setPendingNavigation('/account');
        setPendingAction('save');
        setShowConfirm(true);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('click', handleDocumentClick, true);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('click', handleDocumentClick, true);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isDirty]);

  const handleChange = (event) => {
    const { name, value, files, type } = event.target;

    if (type === 'file' && files && files[0]) {
      const file = files[0];
      const reader = new FileReader();

      reader.onload = () => {
        setForm((prev) => ({
          ...prev,
          image: reader.result
        }));
        setIsDirty(true);
      };

      reader.readAsDataURL(file);
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
    setIsDirty(true);
  };

  const handleContentInput = (event) => {
    const html = event.currentTarget && event.currentTarget.innerHTML;
    setForm((prev) => ({ ...prev, content: html || '' }));
    setIsDirty(true);
  };

  const applyFormat = (command) => {
    document.execCommand(command, false, null);
    setIsDirty(true);
  };

  const savePost = (redirectTarget = '/account') => {
    try {
      const currentPosts = Array.isArray(user?.posts) ? user.posts : [];
      const allPosts = JSON.parse(localStorage.getItem('testsite-posts') || '[]');
      const normalizedTags = form.tags
        ? form.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
        : [];

      const imageValue = form.image || '';
      const authorName = [user?.firstName, user?.lastName].filter(Boolean).join(' ').trim() || user?.username || 'Author';
      const authorId = user?.email || user?.username || `guest-${Date.now()}`;
      const postData = {
        title: form.title || 'Untitled',
        slug: form.slug || `post-${Date.now()}`,
        category: form.category,
        tags: normalizedTags,
        image: imageValue,
        featuredImage: imageValue,
        content: form.content,
        date: new Date().toLocaleDateString(),
        author: authorName,
        authorId: authorId
      };

      if (isEdit && id) {
        const updatedGlobalPosts = allPosts.map((post) =>
          String(post.id) === String(id)
            ? { ...post, ...postData, id: post.id }
            : post
        );

        const updatedUserPosts = currentPosts.map((post) =>
          String(post.id) === String(id)
            ? { ...post, ...postData, id: post.id }
            : post
        );

        const savedPosts = updatedGlobalPosts.length > 0 ? updatedGlobalPosts : [{ id: Number(id), ...postData }];

        localStorage.setItem('testsite-posts', JSON.stringify(savedPosts));

        if (updateProfile) {
          updateProfile({ posts: updatedUserPosts.length > 0 ? updatedUserPosts : [{ id: Number(id), ...postData }] });
        }

        navigate(redirectTarget);
        return;
      }

      const newPost = {
        id: Date.now(),
        ...postData
      };

      const savedPosts = [newPost, ...allPosts];
      const savedUserPosts = [newPost, ...currentPosts];
      localStorage.setItem('testsite-posts', JSON.stringify(savedPosts));

      if (updateProfile) {
        updateProfile({ posts: savedUserPosts });
      }

      navigate(redirectTarget);
    } catch (err) {
      console.error('Failed to save post locally', err);
      alert('Unable to save post. Check console for details.');
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (isDirty) {
      setPendingAction(isEdit ? 'save' : 'publish');
      setPendingNavigation('/account');
      setShowConfirm(true);
      return;
    }

    setIsDirty(false);
    setShowConfirm(false);
    setPendingAction(null);
    savePost('/account');
  };

  const handleLeave = (target = '/account') => {
    if (isDirty) {
      setPendingNavigation(target);
      setPendingAction(isEdit ? 'save' : 'publish');
      setShowConfirm(true);
    } else {
      navigate(target);
    }
  };

  const confirmLeave = (action) => {
    if (action === 'discard') {
      setIsDirty(false);
      setShowConfirm(false);
      setPendingNavigation(null);
      setPendingAction(null);
      navigate('/account');
      return;
    }

    setIsDirty(false);
    setShowConfirm(false);
    setPendingNavigation(null);
    setPendingAction(null);
    savePost('/account');
  };

  const confirmPrimaryLabel = isEdit ? 'Save' : 'Publish';
  const confirmMessage = isEdit
    ? 'You have unsaved changes. Save or discard before leaving.'
    : 'You have unsaved changes. Publish or discard before leaving.';

  if (!user) {
    return (
      <>
        <PageHeader title="Create Post" subtitle="Please log in to manage blog posts." />
        <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-white p-10 shadow-xl text-center">
            <h2 className="text-2xl font-semibold text-slate-900">Sign in required</h2>
            <p className="mt-4 text-slate-600">You must be logged in to create or edit posts.</p>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHeader title={isEdit ? 'Edit Post' : 'Create Post'} subtitle={isEdit ? 'Update your blog content.' : 'Write a new blog post.'} />
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-12">
          {/* Left column: title + editor */}
          <div className="lg:col-span-8">
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700">Title</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Give your story a title..."
                className="mt-3 w-full rounded-none border-0 text-6xl leading-tight text-slate-900 placeholder-slate-300 focus:ring-0"
              />
              <div className="mt-4 text-sm text-slate-500">{`${window.location.origin}/blog/${form.slug || 'your-story-slug'}`}</div>
              <hr className="my-6 border-slate-200" />
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-3 text-slate-600">
                <button type="button" onClick={() => applyFormat('bold')} className="text-sm font-semibold">B</button>
                <button type="button" onClick={() => applyFormat('italic')} className="text-sm font-semibold">I</button>
                <button type="button" onClick={() => applyFormat('underline')} className="text-sm font-semibold">U</button>
              </div>
              <div className="mt-4 overflow-hidden rounded-md border border-slate-200 bg-white">
                <div
                  ref={contentEditorRef}
                  id="editor"
                  contentEditable
                  suppressContentEditableWarning
                  onInput={handleContentInput}
                  className="min-h-[420px] p-6 pb-24 text-lg text-slate-900 leading-relaxed outline-none"
                />
              </div>
            </div>
          </div>

          {/* Right column: sidebar */}
          <aside className="lg:col-span-4">
            <div className="sticky top-28 space-y-6">
              <div className="flex items-center justify-end gap-3">
                <button type="button" onClick={handleSubmit} className="rounded-xl bg-[#22C55E] px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600">{isEdit ? 'Update' : 'Publish story'}</button>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <h3 className="text-sm font-semibold text-slate-900">Story details</h3>
                <div className="mt-4">
                  <label className="block text-xs font-medium text-slate-500">Category</label>
                  <select name="category" value={form.category} onChange={handleChange} className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800">
                    {categories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div className="mt-4">
                  <label className="block text-xs font-medium text-slate-500">Tags</label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : []).map((tag) => (
                      <span key={tag} className="rounded-md bg-emerald-50 px-3 py-1 text-sm text-emerald-700">{tag}</span>
                    ))}
                  </div>
                  <input name="tags" value={form.tags} onChange={handleChange} placeholder="Add a tag" className="mt-3 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700" />
                </div>

                <div className="mt-4">
                  <label className="block text-xs font-medium text-slate-500">Featured image</label>
                  <input name="image" type="file" onChange={handleChange} className="mt-2 w-full text-sm text-slate-500" />
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <h3 className="text-sm font-semibold text-slate-900">Publishing checklist</h3>
                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                  <li>✓ Add a clear title</li>
                  <li>✓ Choose a category</li>
                  <li>✓ Add content</li>
                </ul>
              </div>
            </div>
          </aside>
        </form>
      </section>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
            <h3 className="text-xl font-semibold text-slate-900">Unsaved Changes</h3>
            <p className="mt-4 text-slate-600">{confirmMessage}</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button onClick={() => confirmLeave('discard')} className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100">
                Discard
              </button>
              <button onClick={() => confirmLeave('save')} className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700">
                {confirmPrimaryLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PostEditor;
