"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_admin_1 = require("../config/firebase-admin");
async function seedContent() {
    console.log("Démarrage de la migration des contenus statiques vers Firestore...");
    try {
        const batch = firebase_admin_1.db.batch();
        const contentRef = firebase_admin_1.db.collection('content');
        // 1. Statistiques Accueil
        const statsData = {
            items: [
                { icon: "Users", value: "500+", label: "Étudiants accompagnés" },
                { icon: "Award", value: "95%", label: "Taux de réussite" },
                { icon: "Star", value: "4.9/5", label: "Satisfaction client" },
            ]
        };
        batch.set(contentRef.doc('stats'), statsData);
        // 2. Pourquoi Nous Choisir
        const whyUsData = {
            items: [
                { icon: "Shield", title: "Expertise prouvée", description: "Des conseillers experts formés aux procédures Campus France" },
                { icon: "Clock", title: "Gain de temps", description: "Évitez les erreurs et accélérez vos démarches administratives" },
                { icon: "Heart", title: "Accompagnement humain", description: "Un conseiller dédié disponible tout au long de votre parcours" },
                { icon: "Zap", title: "Stratégie personnalisée", description: "Des conseils adaptés à votre profil et vos ambitions" },
                { icon: "Award", title: "Taux de réussite élevé", description: "95% de nos étudiants obtiennent leur admission" },
                { icon: "Headphones", title: "Support continu", description: "Assistance par WhatsApp et email 7j/7" },
            ]
        };
        batch.set(contentRef.doc('whyUs'), whyUsData);
        // 3. Section Hero (Accueil)
        const heroData = {
            titleLine1: "Réussissez vos",
            titleLine2: "études en France",
            titleLine3: "avec Maig'Up",
            description: "Nous accompagnons les étudiants africains dans toutes les étapes de leur projet d'études : Campus France, choix d'université, lettres de motivation et préparation aux entretiens.",
            badges: ["Accompagnement personnalisé", "Experts Campus France", "Suivi jusqu'à l'obtention du visa"]
        };
        batch.set(contentRef.doc('hero'), heroData);
        // 4. Paramètres de contact (Settings) global
        const settingsData = {
            siteName: "Maig'Up France",
            email: "contact@maigup-france.com",
            phone: "+33 1 23 45 67 89",
            address: "Paris, France",
            whatsappMessage: "Bonjour, je souhaite des informations sur vos services."
        };
        batch.set(contentRef.doc('settings'), settingsData);
        await batch.commit();
        console.log("✅ Tous les contenus (Stats, WhyUs, Hero, Settings) ont été écrits avec succès dans Firestore !");
        process.exit(0);
    }
    catch (error) {
        console.error("❌ Erreur pendant la migration :", error);
        process.exit(1);
    }
}
seedContent();
