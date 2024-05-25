export const WordFooter = () => (
  <footer className="bg-theme-black text-white border-t border-theme-gray h-16">
    <div className="container mx-auto text-center flex justify-between">
      <p className="mb-4 text-sm">
        &copy; {new Date().getFullYear()} All rights reserved.
      </p>
      <div>
        <a
          href="/privacy-policy"
          className="mx-2 underline text-theme-white text-sm"
        >
          プライバシーポリシー
        </a>
        <a
          href="/terms-of-service"
          className="mx-2 underline text-theme-white text-sm"
        >
          利用規約
        </a>
      </div>
    </div>
  </footer>
);
