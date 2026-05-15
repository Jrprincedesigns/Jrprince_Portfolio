import { addPropertyControls, ControlType } from "framer"
import { motion } from "framer-motion"
import type { CSSProperties } from "react"

interface HeroProps {
    title: string
    subtitle: string
    accent: string
}

/**
 * Hero block for the portfolio landing.
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 */
export default function Hero({ title, subtitle, accent }: HeroProps) {
    const container: CSSProperties = {
        display: "flex",
        flexDirection: "column",
        gap: 16,
        padding: 64,
        width: "100%",
        height: "100%",
        boxSizing: "border-box",
        justifyContent: "center",
    }
    const heading: CSSProperties = {
        fontSize: 64,
        fontWeight: 700,
        margin: 0,
        lineHeight: 1.05,
        letterSpacing: "-0.02em",
        color: accent,
    }
    const sub: CSSProperties = {
        fontSize: 22,
        margin: 0,
        opacity: 0.7,
    }

    return (
        <div style={container}>
            <motion.h1
                style={heading}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                {title}
            </motion.h1>
            <motion.p
                style={sub}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            >
                {subtitle}
            </motion.p>
        </div>
    )
}

addPropertyControls(Hero, {
    title: {
        type: ControlType.String,
        title: "Title",
        defaultValue: "Jonathan Prince",
    },
    subtitle: {
        type: ControlType.String,
        title: "Subtitle",
        defaultValue: "Designer & Developer",
    },
    accent: {
        type: ControlType.Color,
        title: "Accent",
        defaultValue: "#111111",
    },
})
