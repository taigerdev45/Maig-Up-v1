import { useEffect } from "react";

export const useScrollReveal = () => {
    useEffect(() => {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px",
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("reveal-visible");
                }
            });
        }, observerOptions);

        const observeElements = () => {
            const elements = document.querySelectorAll(".reveal, .reveal-up, .reveal-left, .reveal-right");
            elements.forEach((el) => observer.observe(el));
        };

        observeElements();

        // Réagit aux insertions de contenu dynamiques (React Query, timeout, etc.)
        const mutationObserver = new MutationObserver(() => {
            observeElements();
        });

        mutationObserver.observe(document.body, { childList: true, subtree: true });

        return () => {
            observer.disconnect();
            mutationObserver.disconnect();
        };
    }, []);
};
