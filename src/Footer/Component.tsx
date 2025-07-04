import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'
import { Mail, Facebook, Linkedin, Github, Youtube, Book } from 'lucide-react'

import type { Footer } from '@/payload-types'

import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'

const categories = ['About', 'Experience', 'Read', 'Watch', 'Buy']

export async function Footer() {
  const footerData = (await getCachedGlobal('footer', 1)()) as Footer
  const navItems: Footer['navItems'] = footerData?.navItems || []

  const grouped = categories.map((cat) => navItems.filter((item) => item.category === cat))

  // Social links to inject under specific columns
  const extraLinks = [
    null, // About
    null, // Experience
    null, // Read
    null, // Watch
    null, // Buy
  ]

  return (
    <footer className="mt-auto border-t border-border bg-black dark:bg-card text-white">
      <div className="container py-12 flex flex-col gap-8 items-center">
        {/* Subscription Form */}
        <form className="w-full max-w-md flex flex-col sm:flex-row gap-4 items-center justify-center">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 rounded-md px-4 py-2 bg-transparent border border-white text-white placeholder:text-white/70 focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-md bg-blue-200 text-black font-semibold px-6 py-2 transition hover:bg-blue-300"
          >
            Subscribe
          </button>
        </form>

        {/* Social Icons */}
        <div className="flex gap-8 justify-center items-center text-white text-2xl">
          <a
            href="https://bit.ly/ErinJerriFBFanP"
            aria-label="Facebook"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Facebook size={32} />
          </a>
          <a
            href="https://github.com/erinjerri"
            aria-label="GitHub"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github size={32} />
          </a>
          <a href="mailto: createyourrealities@proton.me" aria-label="Email">
            <Mail size={32} />
          </a>
          <a
            href="https://bit.ly/CreatingARVR"
            aria-label="Amazon Book"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Book size={32} />
          </a>
        </div>

        {/* Footer Links in Columns with Category Titles and Social Links */}
        <div className="w-full flex flex-col md:flex-row justify-center gap-12">
          {grouped.map((colLinks, idx) => (
            <div key={idx} className="flex flex-col items-center md:items-start min-w-[140px]">
              <span className="font-bold mb-4 uppercase tracking-wide text-sm text-white/80">
                {categories[idx]}
              </span>
              {colLinks.map((item, i) => (
                <CMSLink className="text-white mb-3 text-base" key={i} {...item.link} />
              ))}
            </div>
          ))}
        </div>

        {/* Copyright and Made with */}
        <div className="w-full flex flex-col md:flex-row justify-between items-center text-xs text-white/70 mt-8 gap-2">
          <span>2023 Cypher Realities Inc. All rights reserved.</span>
          <span>
            Made with <span className="text-red-400">♥</span> and PayloadCMS
          </span>
        </div>
      </div>
    </footer>
  )
}
