
/**
 * Data Extractor Agent
 * Returns structured data for Damien Schonbakler based on CV analysis.
 */

export interface ExperienceItem {
    id: string;
    titleKey: string;
    companyKey: string;
    periodKey: string;
    descriptionKey: string;
    tech: string[];
}

export interface ExtractedData {
    identity: {
        name: string;
        roleKey: string;
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

export async function extractDataFromPDF(_pdfBuffer: Buffer, _locale: string = 'fr'): Promise<ExtractedData> {
    // Simulate processing time
    void _pdfBuffer; // Silence unused variable warning
    void _locale; // Silence unused variable warning
    await new Promise(resolve => setTimeout(resolve, 800));

    return {
        identity: {
            name: "Damien SCHONBAKLER",
            roleKey: "identity.role",
            age: 43
        },
        skills: ["Docker", "Kubernetes (K3s)", "Ansible", "Grafana", "Cyber Security", "React", "Next.js", "CI/CD", "Linux"],
        experience: [
            {
                id: "1",
                titleKey: "experienceItems.airbus1.title",
                companyKey: "experienceItems.airbus1.company",
                periodKey: "experienceItems.airbus1.period",
                descriptionKey: "experienceItems.airbus1.description",
                tech: ["Architecture", "Cloud", "Security", "Industrial IoT"]
            },
            {
                id: "2",
                titleKey: "experienceItems.airbus2.title",
                companyKey: "experienceItems.airbus2.company",
                periodKey: "experienceItems.airbus2.period",
                descriptionKey: "experienceItems.airbus2.description",
                tech: ["MES", "Agile", "CI/CD", "DevOps"]
            },
            {
                id: "3",
                titleKey: "experienceItems.adequat.title",
                companyKey: "experienceItems.adequat.company",
                periodKey: "experienceItems.adequat.period",
                descriptionKey: "experienceItems.adequat.description",
                tech: ["Cisco", "Meraki", "VOIP", "Négociation"]
            },
            {
                id: "4",
                titleKey: "experienceItems.ds17.title",
                companyKey: "experienceItems.ds17.company",
                periodKey: "experienceItems.ds17.period",
                descriptionKey: "experienceItems.ds17.description",
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
