export const WordFooter = () => (
  <footer className="bg-transparent text-white border-t border-theme-gray h-16 p-0 w-full">
    <div className="container flex justify-between">
      <p className="mb-4 text-sm">
        &copy; {new Date().getFullYear()} All rights reserved.
      </p>
      <div>
        <a href="/privacy-policy" className="underline text-theme-gray text-sm">
          プライバシーポリシー
        </a>
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
