import { Link } from "react-router-dom";

export const WordFooter = () => (
  <footer className="bg-transparent text-white border-t border-theme-gray h-16 p-0 w-full">
    <div className="container flex justify-between px-0">
      <p className="mb-4 text-sm">
        &copy; {new Date().getFullYear()} All rights reserved.
      </p>
      <div>
        <Link
          to="/privacy-policy"
          className="underline text-theme-gray text-sm"
        >
          プライバシーポリシー
        </Link>
        <a
          href="/terms-of-service"
          className="underline text-theme-gray text-sm"
        >
          利用規約
        </a>
      </div>
    </div>
  </footer>
);
