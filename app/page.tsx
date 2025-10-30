/**
 * START_MODULE_home.page
 *
 * MODULE_CONTRACT:
 * PURPOSE: Домашняя страница игры Catan с меню
 * SCOPE: Главное меню, навигация на экран игры и историю
 * KEYWORDS: Next.js, home page, menu
 */

import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-100 to-green-100 dark:from-gray-900 dark:to-gray-800">
      <div className="card max-w-md w-full mx-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800 dark:text-white">
          Catan Game
        </h1>

        <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
          Settlers of Catan - Board Game
        </p>

        <div className="space-y-4">
          <Link href="/game" className="block">
            <button className="btn btn-primary w-full text-lg">
              New Game
            </button>
          </Link>

          <Link href="/history" className="block">
            <button className="btn btn-secondary w-full text-lg">
              Game History
            </button>
          </Link>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Built with Next.js + TypeScript + Zustand</p>
        </div>
      </div>
    </main>
  );
}

/**
 * END_MODULE_home.page
 */
