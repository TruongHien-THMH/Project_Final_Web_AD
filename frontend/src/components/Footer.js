const Footer = () => {
  return (
    <footer className="bg-[#0b0b0b] text-gray-300 py-12 px-6 md:px-16 border-t border-gray-700">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
        {/* <!-- Cột trái --> */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">
            <span className="text-pink-500">VNUK</span>Cinemas
          </h2>
          <p className="text-sm text-gray-400 mb-6 leading-relaxed">
            Lorem Ipsum has been the industry's standard dummy text ever since
            the 1500s, when an unknown printer took a galley of type and
            scrambled it to make a type specimen book.
          </p>
          <div className="flex gap-4">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
              alt="Google Play"
              className="h-10 cursor-pointer"
            />
            <img
              src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
              alt="App Store"
              className="h-10 cursor-pointer"
            />
          </div>
        </div>

        {/* <!-- Cột giữa --> */}
        <div>
          <h3 className="text-white font-semibold mb-4">Company</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>
              <a  className="hover:text-pink-500 transition">
                Home
              </a>
            </li>
            <li>
              <a  className="hover:text-pink-500 transition">
                About us
              </a>
            </li>
            <li>
              <a  className="hover:text-pink-500 transition">
                Contact us
              </a>
            </li>
            <li>
              <a  className="hover:text-pink-500 transition">
                Privacy policy
              </a>
            </li>
          </ul>
        </div>

        {/* <!-- Cột phải --> */}
        <div>
          <h3 className="text-white font-semibold mb-4">Get in touch</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>+1-212-456-7890</li>
            <li>contact@example.com</li>
          </ul>
        </div>
      </div>

      {/* <!-- Dòng cuối --> */}
      <div className="border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
        Copyright 2025 © GreatStack. All Right Reserved.
      </div>
    </footer>
  );
};

export default Footer;