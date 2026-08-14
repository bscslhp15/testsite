import { useContext, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import AuthContext from '../context/AuthContext';

const Account = () => {
  const { user, updateProfile } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(user?.profile_photo || null);
  const photoInputRef = useRef(null);
  const canvasRef = useRef(null);
  const [form, setForm] = useState(() => ({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    username: user?.username || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    newPassword: '',
    bio: user?.bio || '',
    facebook: user?.social?.facebook || '',
    twitter: user?.social?.twitter || '',
    instagram: user?.social?.instagram || '',
    linkedin: user?.social?.linkedin || '',
    profilePhoto: user?.profile_photo || ''
  }));

  if (!user) {
    return (
      <>
        <PageHeader title="My Account" subtitle="Please sign in to manage your profile." />
        <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-white p-10 shadow-xl text-center">
            <h2 className="text-2xl font-semibold text-slate-900">Not signed in</h2>
            <p className="mt-4 text-slate-600">Please log in to view your profile and your posts.</p>
            <Link to="/login" className="mt-6 inline-flex rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-700">Go to Login</Link>
          </div>
        </section>
      </>
    );
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target.result);
        setForm({ ...form, profilePhoto: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    updateProfile({
      firstName: form.firstName,
      lastName: form.lastName,
      username: form.username,
      email: form.email,
      phone: form.phone,
      address: form.address,
      bio: form.bio,
      social: { 
        facebook: form.facebook,
        twitter: form.twitter,
        instagram: form.instagram,
        linkedin: form.linkedin 
      },
      profile_photo: form.profilePhoto
    });
    setIsEditing(false);
  };

  const posts = user.posts || [];

  return (
    <>
      <PageHeader title="My Account" subtitle="Manage your profile and your published blog posts." />
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid items-start gap-8 lg:grid-cols-3">
          {/* Left Column - Profile Form */}
          <div className="rounded-3xl bg-white p-10 shadow-xl lg:col-span-2 self-start">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">Edit Profile</h2>
                <p className="mt-1 text-sm text-slate-500">Update your account details and preferences.</p>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="rounded-xl bg-[#22C55E] px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-600"
                type="button"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            {/* Form Fields - Two Columns */}
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700">First Name</label>
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  type="text"
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 placeholder-slate-500 focus:border-emerald-500 disabled:bg-slate-50"
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700">Last Name</label>
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  type="text"
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 placeholder-slate-500 focus:border-emerald-500 disabled:bg-slate-50"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-700">Email</label>
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  type="email"
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 placeholder-slate-500 focus:border-emerald-500 disabled:bg-slate-50"
                />
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-slate-700">Username</label>
                <input
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  disabled={!isEditing}
                  type="text"
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 placeholder-slate-500 focus:border-emerald-500 disabled:bg-slate-50"
                />
              </div>

              {/* Your Phone */}
              <div>
                <label className="block text-sm font-medium text-slate-700">Your Phone</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  type="tel"
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 placeholder-slate-500 focus:border-emerald-500 disabled:bg-slate-50"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-slate-700">Address</label>
                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  disabled={!isEditing}
                  type="text"
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 placeholder-slate-500 focus:border-emerald-500 disabled:bg-slate-50"
                />
              </div>

              {/* New Password */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700">New Password</label>
                <input
                  name="newPassword"
                  value={form.newPassword}
                  onChange={handleChange}
                  disabled={!isEditing}
                  type="password"
                  placeholder="Leave blank to keep current password"
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 placeholder-slate-500 focus:border-emerald-500 disabled:bg-slate-50"
                />
              </div>

              {/* Profile Photo Upload */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700">Profile Photo</label>
                <div className="mt-2 flex gap-6">
                  {/* Photo Preview Circle */}
                  <div className="flex-shrink-0">
                    <div className="h-24 w-24 overflow-hidden rounded-full border-2 border-emerald-600 bg-slate-100">
                      {photoPreview ? (
                        <img src={photoPreview} alt="Preview" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-slate-400">
                          <i className="fas fa-user text-2xl"></i>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Upload Button */}
                  {isEditing && (
                    <div className="flex flex-col justify-center">
                      <input
                        ref={photoInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => photoInputRef.current?.click()}
                        className="rounded-xl bg-[#22C55E] px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600"
                      >
                        Upload Photo
                      </button>
                      <p className="mt-2 text-xs text-slate-500">JPG, PNG or GIF (Max. 2MB)</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Bio */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700">Bio</label>
                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  disabled={!isEditing}
                  rows="4"
                  placeholder="Tell us about yourself..."
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 placeholder-slate-500 focus:border-emerald-500 disabled:bg-slate-50"
                />
              </div>

              {/* Social Media Links */}
              <div className="sm:col-span-2">
                <h3 className="text-sm font-semibold text-slate-900">Social Media Links</h3>
                <div className="mt-4 space-y-3">
                  {/* Facebook */}
                  <div className="flex min-w-0 gap-2">
                    <span className="flex shrink-0 items-center rounded-lg bg-slate-100 px-3 text-sm font-medium text-slate-700">
                      <i className="fab fa-facebook mr-2"></i> facebook.com/
                    </span>
                    <input
                      name="facebook"
                      value={form.facebook}
                      onChange={handleChange}
                      disabled={!isEditing}
                      type="text"
                      placeholder="yourprofile"
                      className="min-w-0 flex-1 rounded-xl border border-slate-300 px-4 py-2 text-sm text-slate-900 placeholder-slate-500 focus:border-emerald-500 disabled:bg-slate-50"
                    />
                  </div>

                  {/* Twitter */}
                  <div className="flex min-w-0 gap-2">
                    <span className="flex shrink-0 items-center rounded-lg bg-slate-100 px-3 text-sm font-medium text-slate-700">
                      <i className="fab fa-twitter mr-2"></i> twitter.com/
                    </span>
                    <input
                      name="twitter"
                      value={form.twitter}
                      onChange={handleChange}
                      disabled={!isEditing}
                      type="text"
                      placeholder="yourhandle"
                      className="min-w-0 flex-1 rounded-xl border border-slate-300 px-4 py-2 text-sm text-slate-900 placeholder-slate-500 focus:border-emerald-500 disabled:bg-slate-50"
                    />
                  </div>

                  {/* Instagram */}
                  <div className="flex min-w-0 gap-2">
                    <span className="flex shrink-0 items-center rounded-lg bg-slate-100 px-3 text-sm font-medium text-slate-700">
                      <i className="fab fa-instagram mr-2"></i> instagram.com/
                    </span>
                    <input
                      name="instagram"
                      value={form.instagram}
                      onChange={handleChange}
                      disabled={!isEditing}
                      type="text"
                      placeholder="yourprofile"
                      className="min-w-0 flex-1 rounded-xl border border-slate-300 px-4 py-2 text-sm text-slate-900 placeholder-slate-500 focus:border-emerald-500 disabled:bg-slate-50"
                    />
                  </div>

                  {/* LinkedIn */}
                  <div className="flex min-w-0 gap-2">
                    <span className="flex shrink-0 items-center rounded-lg bg-slate-100 px-3 text-sm font-medium text-slate-700">
                      <i className="fab fa-linkedin mr-2"></i> linkedin.com/in/
                    </span>
                    <input
                      name="linkedin"
                      value={form.linkedin}
                      onChange={handleChange}
                      disabled={!isEditing}
                      type="text"
                      placeholder="yourprofile"
                      className="min-w-0 flex-1 rounded-xl border border-slate-300 px-4 py-2 text-sm text-slate-900 placeholder-slate-500 focus:border-emerald-500 disabled:bg-slate-50"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            {isEditing && (
              <button
                onClick={handleSave}
                type="button"
                className="mt-8 rounded-xl bg-[#22C55E] px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-600"
              >
                Save Profile
              </button>
            )}
          </div>

          {/* Right Column - Blog Posts (1/3 width) */}
          <div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">Your Blog Posts</h2>
                <p className="mt-1 text-sm text-slate-500">Manage your posts.</p>
              </div>
            </div>
            <Link to="/create-post" className="mt-4 block rounded-xl bg-[#22C55E] px-5 py-3 text-center text-sm font-semibold text-white hover:bg-emerald-600">
              Create Post
            </Link>
            <div className="mt-6 space-y-4">
              {posts.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 p-5 text-center text-sm text-slate-600">No posts yet. Create your first blog post.</div>
              ) : (
                posts.map((post) => (
                  <div key={post.id} className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-md">
                    {/* Post Title */}
                    <div className="p-5 pb-3">
                      <p className="font-semibold text-slate-900 text-base">{post.title}</p>
                    </div>

                    {/* Post Date */}
                    <div className="px-5">
                      <p className="text-xs text-slate-500">{post.date}</p>
                    </div>

                    {/* Featured Image */}
                    {(post.featuredImage || post.image) && (
                      <div className="mt-3 px-5">
                        <img 
                          src={post.featuredImage || post.image} 
                          alt={post.title} 
                          className="w-full h-40 object-cover rounded-xl"
                        />
                      </div>
                    )}

                    {/* Post Description/Content */}
                    <div className="mt-3 px-5">
                      <p className="text-sm text-slate-700 line-clamp-2">{post.description || post.content || 'No description available'}</p>
                    </div>

                    {/* Read Story Link */}
                    <div className="mt-4 px-5 pb-5">
                      <Link
                        to={`/blog/${post.id}`}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700"
                      >
                        Read story
                        <i className="fas fa-arrow-right text-xs"></i>
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Account;
