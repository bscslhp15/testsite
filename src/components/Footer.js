import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#1E1E1E' }} className="text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-4">
          <div>
            <h3 className="text-white text-lg font-semibold">Company</h3>
            <p className="mt-4 text-sm leading-6 text-slate-400">A108 Adam Street<br />New York, NY 535022<br />United States</p>
            <p className="mt-4 text-sm text-slate-500">Phone: +1 5589 55488 55<br />Email: info@example.com</p>
          </div>
          <div>
            <h3 className="text-white text-lg font-semibold">Useful Links</h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-400">
              <li className="flex items-center gap-2"><span className="text-[#22C55E]">&gt;</span><Link to="/">Home</Link></li>
              <li className="flex items-center gap-2"><span className="text-[#22C55E]">&gt;</span><Link to="/about">About us</Link></li>
              <li className="flex items-center gap-2"><span className="text-[#22C55E]">&gt;</span><Link to="/services">Services</Link></li>
              <li className="flex items-center gap-2"><span className="text-[#22C55E]">&gt;</span><Link to="/pricing">Terms of service</Link></li>
              <li className="flex items-center gap-2"><span className="text-[#22C55E]">&gt;</span><Link to="/contact">Privacy policy</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white text-lg font-semibold">Our Services</h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-400">
              <li className="flex items-center gap-2"><span className="text-[#22C55E]">&gt;</span>Web Design</li>
              <li className="flex items-center gap-2"><span className="text-[#22C55E]">&gt;</span>Web Development</li>
              <li className="flex items-center gap-2"><span className="text-[#22C55E]">&gt;</span>Product Management</li>
              <li className="flex items-center gap-2"><span className="text-[#22C55E]">&gt;</span>Marketing</li>
              <li className="flex items-center gap-2"><span className="text-[#22C55E]">&gt;</span>Graphic Design</li>
            </ul>
          </div>
          <div>
            <h3 className="text-white text-lg font-semibold">Join Our Newsletter</h3>
            <p className="mt-4 text-sm text-slate-400">Tamen quem nulla quae legam multos aute sint culpa legam noster magna.</p>
            <div className="mt-4 flex gap-2">
              <input type="email" placeholder="Your email" className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-[#22C55E]" />
              <button className="rounded-md bg-[#22C55E] px-4 py-2 text-sm text-white hover:bg-emerald-600">Subscribe</button>
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-slate-800 pt-6 text-sm text-slate-500">© Copyright TestSite. All Rights Reserved</div>
      </div>
    </footer>
  );
};

export default Footer;
