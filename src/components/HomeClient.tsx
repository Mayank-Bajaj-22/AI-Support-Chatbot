"use client"

import { AnimatePresence, motion } from "motion/react"
import { useEffect, useRef, useState } from "react"

function HomeClient({ email }: { email: string}) {

    const handleLogin = () => {
        window.location.href="/api/auth/login"
    }

    const firstLetter = email ? email[0].toUpperCase() : ""
    const [open, setOpen] = useState(false)

    const popupRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }        

        document.addEventListener("mousedown", handler)
        return () => {
            document.removeEventListener("mousedown", handler)
        }
    }, [])

    return (
        <div className='min-h-screen bg-linear-to-br from-white to-zinc-50 text-zinc-900 overflow-x-hidden'>
            <motion.div
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className='fixed top-0 left-0 w-full z-50 bg-white/70 backdrop-blur-2xl border-b border-zinc-200'>
                <div className="max-w-7xl mx-auto h-16 flex items-center justify-between">
                    <div className="text-lg font-semibold tracking-tight">
                        Support.<span className="text-zinc-400">ai</span>
                    </div>

                    {
                        email ? 
                        <div className="relative" ref={popupRef}>
                            <button className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-semibold hover:scale-105 transition" onClick={() => setOpen(!open)}>
                                { firstLetter }
                            </button>

                            <AnimatePresence>
                                {
                                    open && <motion.div
                                    initial={{ opacity: 0, y: -6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -6 }}
                                    className="absolute right-0 mt-4 w-44 bg-white rounded-xl border border-zinc-200 overflow-hidden">
                                        <button className="w-full text-left px-4 py-3 text-sm hover:bg-zinc-100">
                                            Dashboard
                                        </button>

                                        <hr className="text-zinc-200" />

                                        <button className="w-full text-left px-4 py-3 text-sm hover:bg-zinc-100 text-red-600">
                                            Logout
                                        </button>
                                    </motion.div>
                                }
                            </AnimatePresence>
                        </div> 
                        : <button className="px-5 py-2 rounded-full bg-black text-white text-sm font-medium hover:bg-zinc-800 transition disabled:opacity-60 flex items-center gap-2" onClick={handleLogin}>
                            Login
                        </button>
                    }
                </div>
            </motion.div>
        </div>
    )
}

export default HomeClient