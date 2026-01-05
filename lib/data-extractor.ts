
/**
 * Data Extractor Agent
 * Returns structured data for Damien Schonbakler based on CV analysis.
 */

export interface ExperienceItem {
    id: string;
    title: string;
    company: string;
    period: string;
    description: string;
    tech: string[];
}

export interface ExtractedData {
    identity: {
        name: string;
        role: string;
        age: number;
    };
    skills: string[];
    experience: ExperienceItem[];
    education: {
        degree: string;
        institution: string;
        year: string;
    }[];
}

export async function extractDataFromPDF(_pdfBuffer: Buffer): Promise<ExtractedData> {
    // Simulate processing time
    void _pdfBuffer; // Silence unused variable warning
    await new Promise(resolve => setTimeout(resolve, 800));

    return {
        identity: {
            name: "Damien SCHONBAKLER",
            role: "Architecte Solutions",
            age: 43
        },
        skills: ["Docker", "Kubernetes (K3s)", "Ansible", "Grafana", "Cyber Security", "React", "Next.js", "CI/CD", "Linux"],
        experience: [
            {
                id: "1",
                title: "Architecte Solutions",
                company: "Airbus Atlantic",
                period: "JUILLET 2024 - PRESENT",
                description: "Définition et pilotage de l'architecture technique des solutions industrielles. Garantie de la pérennité, de la sécurité et de la scalabilité des systèmes d'information opérationnels.",
                tech: ["Architecture", "Cloud", "Security", "Industrial IoT"]
            },
            {
                id: "2",
                title: "IT Product Manager - Solutions Opérateur",
                company: "Airbus Atlantic",
                period: "JAN 2020 - JUIN 2024",
                description: "Pilotage de luma solutions MES (Manufacturing Execution System). Gestion du cycle de vie, déploiement CI/CD, méthodologie Agile/Scrum. Management d'équipes de développement et urbanisation fonctionnelle.",
                tech: ["MES", "Agile", "CI/CD", "DevOps"]
            },
            {
                id: "3",
                title: "Responsable Achats / Technico-Commercial",
                company: "Adéquat-Système",
                period: "2018 - 2019",
                description: "Gestion des relations fournisseurs stratégiques. Déploiement de projets WiFi4EU (Cisco-Meraki) et VOIP. Support technique avancé et négociation de partenariats.",
                tech: ["Cisco", "Meraki", "VOIP", "Négociation"]
            },
            {
                id: "4",
                title: "Micro-entrepreneur",
                company: "DS17 Informatique",
                period: "2017 - 2018",
                description: "Dépannage d'infrastructure, création de visuels, référencement SEO et optimisation de sites web. Formation utilisateurs.",
                tech: ["Support", "SEO", "Design", "Maintenance"]
            }
        ],
        education: [
            {
                degree: "Auto-Formation Homelab & Certification",
                institution: "Continuous Learning",
                year: "2024"
            },
            {
                degree: "Développeur Informatique",
                institution: "AFPA Créteil",
                year: "2005"
            }
        ]
    };
}
