// Motion utilities for consistent animations and performance optimization

// Common easing curves for smooth animations
export const easings = {
	easeOutQuart: [0.25, 0.46, 0.45, 0.94],
	easeOutCubic: [0.33, 1, 0.68, 1],
	easeInOutCubic: [0.65, 0, 0.35, 1],
	easeOutBack: [0.34, 1.56, 0.64, 1],
	spring: { type: "spring", stiffness: 100, damping: 15 },
};

// Check for reduced motion preference - improved implementation
export const prefersReducedMotion = () => {
	if (typeof window === "undefined") return false;
	return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

// Global reduced motion media query for dynamic updates - lazy initialization
let _reducedMotionMediaQuery = null;

export const getReducedMotionMediaQuery = () => {
	if (typeof window === "undefined") return null;
	if (_reducedMotionMediaQuery === null) {
		_reducedMotionMediaQuery = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		);
	}
	return _reducedMotionMediaQuery;
};

// Backward compatibility - but deprecated
export const reducedMotionMediaQuery = getReducedMotionMediaQuery();

// Common animation variants with reduced motion support
export const fadeInUp = {
	hidden: {
		opacity: 0,
		y: prefersReducedMotion() ? 0 : 30,
		transition: { duration: 0.2 },
	},
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: prefersReducedMotion() ? 0.15 : 0.6,
			ease: prefersReducedMotion() ? "easeOut" : easings.easeOutQuart,
		},
	},
};

export const fadeInScale = {
	hidden: {
		opacity: 0,
		scale: prefersReducedMotion() ? 1 : 0.95,
		transition: { duration: 0.2 },
	},
	visible: {
		opacity: 1,
		scale: 1,
		transition: {
			duration: prefersReducedMotion() ? 0.15 : 0.5,
			ease: prefersReducedMotion() ? "easeOut" : easings.easeOutCubic,
		},
	},
};

export const staggerContainer = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: prefersReducedMotion() ? 0 : 0.1,
			delayChildren: prefersReducedMotion() ? 0 : 0.2,
		},
	},
};

export const staggerItem = {
	hidden: {
		opacity: 0,
		y: prefersReducedMotion() ? 0 : 20,
	},
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: prefersReducedMotion() ? 0.15 : 0.5,
			ease: prefersReducedMotion() ? "easeOut" : easings.easeOutQuart,
		},
	},
};

// Hover animations for interactive elements
export const hoverLift = {
	scale: 1.02,
	y: -2,
	transition: {
		duration: 0.2,
		ease: easings.easeOutCubic,
	},
};

export const hoverScale = {
	scale: 1.05,
	transition: {
		duration: 0.2,
		ease: easings.easeOutCubic,
	},
};

export const buttonHover = {
	scale: 1.05,
	transition: {
		duration: 0.15,
		ease: easings.easeOutCubic,
	},
};

export const cardHover = {
	y: -8,
	transition: {
		duration: 0.3,
		ease: easings.easeOutQuart,
	},
};

// Tap animations for mobile
export const tapScale = {
	scale: 0.98,
	transition: {
		duration: 0.1,
		ease: easings.easeOutCubic,
	},
};

// Accessibility-aware motion props with enhanced reduced motion support
export const getMotionProps = (variant, options = {}) => {
	const {
		delay = 0,
		viewport = { once: true, margin: "-50px 0px", amount: 0.2 },
	} = options;

	if (prefersReducedMotion()) {
		return {
			initial: { opacity: 0 },
			whileInView: { opacity: 1 },
			transition: { duration: 0.15, ease: "easeOut" },
			viewport,
		};
	}

	return {
		initial: "hidden",
		whileInView: "visible",
		variants: variant,
		viewport,
		transition: { delay },
	};
};

// Simple fade variants for reduced motion
export const reducedMotionVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			duration: 0.15,
			ease: "easeOut",
		},
	},
};

// Performance-optimized transform properties
export const gpuAcceleration = {
	transform: "translateZ(0)",
	willChange: "transform, opacity",
};

// Common viewport settings for scroll-triggered animations
export const defaultViewport = {
	once: true,
	margin: "-100px 0px",
	amount: 0.3,
};

export const partialViewport = {
	once: true,
	margin: "-50px 0px",
	amount: 0.1,
};

// Loading state animations
export const skeleton = {
	animate: {
		opacity: [0.4, 0.8, 0.4],
	},
	transition: {
		duration: 1.5,
		repeat: Infinity,
		ease: "easeInOut",
	},
};

// Page transition variants
export const pageVariants = {
	initial: {
		opacity: 0,
		y: 20,
	},
	in: {
		opacity: 1,
		y: 0,
	},
	out: {
		opacity: 0,
		y: -20,
	},
};

export const pageTransition = {
	type: "tween",
	ease: easings.easeOutQuart,
	duration: 0.4,
};

// Text animation utilities
export const letterVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.3,
			ease: easings.easeOutCubic,
		},
	},
};

export const wordContainer = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.05,
			delayChildren: 0.1,
		},
	},
};
