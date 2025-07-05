"use client"

import { useEffect, useState } from "react"

export default function TypewriterText({ words }: { words: string[] }) {
  const [currentWord, setCurrentWord] = useState(0)
  const [displayedText, setDisplayedText] = useState("")
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (index < words[currentWord].length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + words[currentWord][index])
        setIndex(index + 1)
      }, 80)
      return () => clearTimeout(timeout)
    } else {
      const timeout = setTimeout(() => {
        setDisplayedText("")
        setIndex(0)
        setCurrentWord((prev) => (prev + 1) % words.length)
      }, 2000)
      return () => clearTimeout(timeout)
    }
  }, [index, currentWord, words])

  return (
    <h2 className="text-2xl sm:text-3xl text-center mt-4 font-bold text-yellow-400">
      {displayedText}
    </h2>
  )
}
