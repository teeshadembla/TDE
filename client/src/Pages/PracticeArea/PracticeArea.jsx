import { Key } from "lucide-react";
import react from "react";
import { useParams } from "react-router-dom";
import HeroSection from "../../components/PracticeArea/HeroSection.jsx";
import KeyThemesSection from "../../components/PracticeArea/KeyThemesSection.jsx";
import MembersSections from "../../components/PracticeArea/MembersSections.jsx";

const PracticeAreaInfo = [
    {
        id:1,
        slug: "digital-policy",
        name: "Digital Policy",
        bgImg: "https://cdn.prod.website-files.com/682f43574652bd066d73adbf/686588188807a147334e71cf_practice%20area%20-%20header%20policy.png",
        headliner: "Designing Inclusive Policy for the Digital Economy",
        description: "We develop adaptive, future-ready policy frameworks that drive equity, resilience, and transparency—bridging public interest, innovation, and governance in a tech-enabled world.",
        keythemes: [
            {title: "Tech-forward Regulation", description: "Crafting agile, ethical policies for emerging technologies like AI, blockchain, and data systems."},
            {title: "Inclusive Economic Policy", description: "Designing frameworks that center on human well-being, planetary boundaries, and equitable access."},
            {title: "Systems metrics and accountability", description: "Reimagining how we measure value, impact, and progress in the digital economy."},
            {title: "Multi-Stakeholder Policy Making", description: "Creating collaborative, cross-sector approaches to policy rooted in transparency and shared governance."},
        ],
        Members: [
            {name: "Imen Ameur", title: "SENIOR FELLOW", imgUrl: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/6857c5a5f18399774396ff7d_Imen%20Ameur.avif"},
            {name: "Dr. Maha Hosain Aziz", title: "NON-EXEC CHAIR & SENIOR FELLOW, POLICY", imgUrl: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/6858f251bc6b6874a4a5a96a_Maha%20Hosain%20Aziz%20headshot_edited.avif"},
            {name: "Oabona Kgengwenyane", title: "SENIOR FELLOW", imgUrl: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/68658df2de2137eb46089fd0_Oabona%20website%20.avif"},
            {name: "Sherman Kong", title: "SENIOR FELLOW", imgUrl: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/68658f2ac1ca17f83ac30552_ShermanKong_34_4.avif"},
            {name: "William J. Vogt", title: "SENIOR FELLOW", imgUrl: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/686591e28df8f90588fac8e8_Screenshot%202025-03-18%20at%209_06_edited.avif"},
            {name: "Dr. Eldar Shafir", title: "SENIOR FELLOW", imgUrl: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/686592a597ea0fbd950dfe10_Eldar%20Shafir.avif"},
            {name: "Lamek Nyabuga", title: "Fellow", imgUrl: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/687395dd1136bc431fa3f96f_Lamek_Nyabuga__2__edited.avif"},
            {name: "Ahlam Alduhaish", title: "Fellow", imgUrl: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/687398cfc58c501c904a7568_Screenshot%202025-03-18%20at%209_26_edited.avif"},
            {name: "Vinayak Sharma", title: "Fellow", imgUrl: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/687399842d7c87c9ed915757_Screenshot%202025-03-18%20at%209_33_14%E2%80%AFPM.avif"},
            {name: "Dr. Melodena Stephens", title: "NON-EXEC CHAIR & SENIOR FELLOW", imgUrl: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/68b5c60eacb8170797dde541_Strategic%20Content%20and%20Policy%20Associate%20(21).png"}
        ]
    },
    {
        id:2,
        slug: "blockchain-digital-assets",
        name: "Blockchain & Digital Assets",
        bgImg: "https://cdn.prod.website-files.com/682f43574652bd066d73adbf/686586a4b4fb3e4fcdaedca8_practice%20area%20-%20header%20blockchain.png",
        headliner: "Rewiring Trust for a Decentralized, Inclusive Future",
        description: "We apply blockchain to reshape financial systems, governance structures, and digital infrastructure—unlocking transparency, equity, and public value at scale",
        keythemes: [
            {
                title: "Decentralization",
                description: "Empowering distributed systems that shift control from centralized entities to communities and users."
            },
            {
                title: "Financial Inclusion",
                description: "Expanding equitable access to financial tools and networks through blockchain-based innovation."
            },
            {
                title: "Blockchain Governance",
                description: "Designing fair, transparent, and adaptive governance models for decentralized ecosystems."
            },
            {
                title: "Digital Public Infrastructure",
                description: "Leveraging blockchain to build resilient, accessible systems for public services, identity, and civic trust."
            }
        ],
        Members: [
            { name: "Dr. Nikhil Varma", title: "NON-EXEC CHAIR & SENIOR FELLOW, BLOCKCHAIN & DIGITAL ASSETS", imgUrl: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/685666c2b4074bbe012ec91b_Dr.%20Nikhil%20Varma%20(updated)-p-1600.jpg" },
            { name: "Georgios Samakovitis", title: "SENIOR FELLOW", imgUrl: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/6857c450a5be68516f827caa_Georgios%20Samakovitis.avif" },
            { name: "Zolboo Batbileg", title: "SENIOR FELLOW", imgUrl: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/6858f5eb2bf539f3881f1f50_Screenshot%202025-03-18%20at%208_38_edited.avif" },
            { name: "Jamil Hasan", title: "SENIOR FELLOW", imgUrl: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/68658ee1ab2dee0151757127_gje4gfbvh5llcb5ui9b7fmiitm.jpg" },
            { name: "Jean Criss", title: "SENIOR FELLOW", imgUrl: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/68658f787b894950c0bf830a_Jean%20website.avif" },
            { name: "Dr. Dimitrios Salampasis", title: "SENIOR FELLOW", imgUrl: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/6865923eb4bcb2ecf40574c8__Dr%20Dimitrios%20Salampasis%20website.avif" },
            { name: "Mallika Ramamurthy", title: "SENIOR FELLOW", imgUrl: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/686595703de9ce37656dca77_Mallika%20Ramamurthy.avif" },
            { name: "Dr. Georgios Samakovitis", title: "SENIOR FELLOW", imgUrl: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/6857c450a5be68516f827caa_Georgios%20Samakovitis.avif" }, 
            { name: "Shyam Nagarajan", title: "SENIOR FELLOW", imgUrl: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/6870e2fa7ad64f28569fbe3b_Shyam%20Nagarajan.avif" },
            { name: "Yuri Cataldo", title: "SENIOR FELLOW", imgUrl: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/6870e65580e8b55583daa861_Yuri%20Cataldo.avif" },
            { name: "Paul Murphy", title: "FELLOW", imgUrl: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/6870e6f17ad64f2856a33e91_Paul%20Murphy%20headshot.avif" },
            { name: "Mohammad Mudassir", title: "FELLOW", imgUrl: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/6873986101fef86d7c641793_Untitled%20design%20(4).avif" },
            { name: "Meet Thosar", title: "FELLOW", imgUrl: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/6873992b46a8046d51406f68_Untitled%20design%20(1)_edited.avif" },
            { name: "Ambriel Pouncy", title: "FELLOW", imgUrl: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/68739bc9d38c7fe7427fbad9_Executive%20Fellow%20announcements%20(8)_edite.avif" },
            { name: "Tristan Thoma", title: "FELLOW", imgUrl: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/68739c1701fef86d7c657694_Tristan%20Thoma%20headshot.avif" }
        ]
    },
    {
        id:3,
        slug: "sustainability",
        name: "Sustainability",
        bgImg: "https://cdn.prod.website-files.com/682f43574652bd066d73adbf/68658480ab9945cc60de2b1b_practice%20area%20-%20sustain.png",
        headliner: "Building a Regenerative, Inclusive Global Economy",
        description: "We drive systems change toward climate resilience and ecological balance—through regenerative design, data-informed strategy, and global partnerships that align innovation with planetary boundaries.",
        keythemes: [
            {
                "title": "Green Economy",
                "description": "Advancing economic systems that align prosperity with planetary health—through regenerative models, circularity, and inclusive growth."
            },
            {
                "title": "Climate Resilience",
                "description": "Designing adaptive strategies and infrastructure that enable communities, institutions, and ecosystems to thrive amid disruption."
            },
            {
                "title": "ESG",
                "description": "Reframing ESG as a systems tool for long-term value creation—integrating equity, ethics, and environmental stewardship into strategy."
            },
            {
                "title": "Renewable Energy",
                "description": "Accelerating the transition to clean energy futures through innovation, investment, and equitable access to sustainable power."
            }
        ],
        Members: [
            { name: "Alex Kontoleon", title: "NON-EXEC CHAIR & SENIOR FELLOW, SUSTAINABILITY", imgUrl: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/68aef2a548eaf8b4529e5e6f_Strategic%20Content%20and%20Policy%20Associate%20(3)-p-500.png" },
            { name: "Ayodele Emmanuel Akande", title: "FELLOW", imgUrl: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/68739548c58c501c90495b72_Akande%20Emmanuel%20headshot.avif" },
            { name: "Bruce Armstrong Taylor", title: "NON-EXEC CHAIR & SENIOR FELLOW, SUSTAINABILITY", imgUrl: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/6858f2ddb67282ad6aa81756_Bruce%20Armstrong%20Taylor%20headshot.avif" },
            { name: "Cathy Latiwa Amato", title: "SENIOR FELLOW", imgUrl: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/686594c0c6049a9fbaf77327_Cathy%20Latiwa%20Amato.avif" },
            { name: "Comfort Onyaga", title: "FELLOW", imgUrl: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/68739cd05892b41213841aab_Comfort%20Adaora-2_edited.avif" },
            { name: "Dr. Chetana Naskar", title: "FELLOW", imgUrl: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/68739b04c59498b19fc6311b_Chetana%20Naskar%20headshot.avif" },
            { name: "Dr. Sindhu Bhaskar", title: "SENIOR FELLOW", imgUrl: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/6870e543b7b8d3951a5c5f3f_Dr_%20Sindhu%20Bhaskar.avif" },
            { name: "Maneesh Kumar", title: "FELLOW", imgUrl: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/6873a188f73b6b65f7a0acde_Maneesh%20Kumar.avif" },
            { name: "Mat Yarger", title: "FELLOW", imgUrl: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/6873973409c5e71a96c89ae8_Screenshot_2024_08_29_at_10_23_53_AM.avif" },
            { name: "Najada Taci", title: "FELLOW", imgUrl: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/687396c419560dc19e89d651_Executive%20Fellow%20announcements%20(11).avif" },
            { name: "Nancy Kgengwenyane", title: "SENIOR FELLOW", imgUrl: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/6857c4a0a77e8d025cb13aba_Nancy%20Kgengwenyane.avif" },
            { name: "Océane Desvigne", title: "FELLOW", imgUrl: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/6873977e1136bc431fa48093_Oceane%20new%20headshot.avif" },
            { name: "Rafal Libera", title: "SENIOR FELLOW", imgUrl: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/6870e7a0abd12e18356a1d63_Screenshot%202025-04-19%20at%208_13_20%E2%80%AFPM.avif" },
            { name: "Shivedita Singh", title: "FELLOW", imgUrl: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/68739b3f1841454b4a497379_Shivedita%20headshot%20-2_edited_edited.avif" },
            { name: "Sindile Monica Mazibuko", title: "SENIOR FELLOW", imgUrl: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/6870e5e8ac1ae0fab38f780c_Sindile%20Monica%20Mazibuko.avif" }
        ]
    },
    {
        id:4,
        slug: "applied-ai",
        name: "Applied AI",
        bgImg: "https://cdn.prod.website-files.com/682f43574652bd066d73adbf/6865859f4d653ec79d2b5bdf_practice%20area%20-%20header%20ai.png",
        headliner: "Ethical AI for a Human-Centered Economy",
        description: "We shape the future of artificial intelligence through ethical design, policy innovation, and systems readiness—ensuring that AI serves human dignity, environmental resilience, and collective well-being.",
        keythemes: [
            {
                "title": "AI Ethics",
                "description": "Embedding human values and accountability into AI systems from design to deployment."
            },
            {
                "title": "Policy Toolkits",
                "description": "Developing oversight frameworks that align innovation with transparency, equity, and trust."
            },
            {
                "title": "AI for Climate",
                "description": "Equipping decision-makers with practical guidance to assess and govern AI responsibly."
            },
            {
                "title": "AI Governance",
                "description": "Applying AI to accelerate climate modeling, optimize sustainability efforts, and enable adaptive solutions for global resilience."
            }
        ],
        Members: [
            { name: "Sandy Carter", title: "NON-EXEC CHAIR & SENIOR FELLOW, APPLIED AI", imgUrl: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/6857b01f00a40d4c5fa2254c_Sandy%20Carter.png" },
            { name: "Manas Talukdar", title: "SENIOR FELLOW", imgUrl: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/6857c3d507d32d3a5ad1ac46_Manas%20Talukdar.avif" },
            { name: "Mickie Chandra", title: "SENIOR FELLOW", imgUrl: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/6858f66304929026f122407d_Executive%20Fellow%20announcements%20(9).avif" },
            { name: "Olga Magnusson", title: "SENIOR FELLOW", imgUrl: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/68658d1b7b894950c0bd8261_DSC_4737_edited_edited.avif" },
            { name: "Dr. Priyanka Shrivastava", title: "SENIOR FELLOW", imgUrl: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/686590f6cdbd5999dcf38c31_Priyanka%20website.avif" },
            { name: "Marisa Zalabak", title: "SENIOR FELLOW", imgUrl: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/68659134413c57083261f61b_marisa-zalabak.avif" },
            { name: "Bill Lesieur", title: "SENIOR FELLOW", imgUrl: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/6865930b8ad497e5cefddd3d_Untitled-7.avif" },
            { name: "Balaji Dhamodharan", title: "SENIOR FELLOW", imgUrl: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/6865936d08174dedf5c638d1_Untitled%20design%20(5).avif" },
            { name: "Nikolaos Ntigrintaakis", title: "SENIOR FELLOW", imgUrl: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/6870e1ede76ce1fc59448e68_Nikolaos%20Ntigrintakis_edited.avif" },
            { name: "Neeraj Madan", title: "SENIOR FELLOW", imgUrl: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/6870e48b411909924536f42a_Neeraj%20Madan.avif" },
            { name: "Yoshita Sharma", title: "FELLOW", imgUrl: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/6873961d682c0263eeae29c3_Yoshita_Sharma_2_edited.avif" },
            { name: "Dr. Monica Lopez", title: "SENIOR FELLOW", imgUrl: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/687397ebe740983f6e741a53_Untitled-5.avif" },
            { name: "Justin Bérubé", title: "FELLOW", imgUrl: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/68739db9825fc4da4baf6162_ES_JustinBerube_2_edited%20(1).avif" },
            { name: "Sangeetha Rajkumar", title: "FELLOW", imgUrl: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/6873a0525da735d72bc19830_Sangeetha%20Rajkumar.avif" },
            { name: "Shree Varuna Ramesh", title: "FELLOW", imgUrl: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/6873a0de09c5e71a96cbd1c4_SV%20DE%205_JPG.avif" },
            { name: "Nikhil Kasssetty", title: "FELLOW", imgUrl: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/6873a1b9be7a73913f6b7613_Nikhil_Kassetty_Headshot.avif" }
        ]
    },
    {
        id:5,
        slug: "governance",
        name: "Governance",
        bgImg: "https://cdn.prod.website-files.com/682f43574652bd066d73adbf/685c40a1017f9579f03fae5a_practice%20area%20-%20header.png",
        headliner: "Shaping Governance for a Human-Centered Digital Economy",
        description: "We reimagine leadership and accountability for the digital age—drawing on Elinor Ostrom’s commons principles to design transparent, inclusive, and decentralized systems.",
        keythemes: [
            {
                "title": "Decentralized Governance",
                "description": "Designing distributed decision systems that shift power closer to citizens, communities, and ecosystems."
            },
            {
                "title": "Public Sector Modernization",
                "description": "Reinventing government frameworks with digital infrastructure, agile delivery, and inclusive policymaking."
            },
            {
                "title": "Policy Innovation",
                "description": "Creating adaptive, forward-looking regulatory pathways that balance innovation with social equity and accountability."
            },
            {
                "title": "Commons-Based Governance",
                "description": "Applying principles of collective resource stewardship to shape equitable digital infrastructure and shared public goods."
            }
        ],
        Members: [
            { name: "Bhuva Shakti", title: "NON-EXEC CHAIR & SENIOR FELLOW, GOVERNANCE", imgUrl: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/68658b96b4bcb2ecf4ff15aa_6858f43a03e8e51000553d01_Bhuva%20Shakti%20-%20Website%20-%201%20(1).jpg" },
            { name: "Rob Ginsburg", title: "SENIOR FELLOW", imgUrl: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/6865940078c1a719c8512089_Screenshot%202025-03-18%20at%208_50_edited.avif" },
            { name: "Satish Padmanabhan", title: "SENIOR FELLOW", imgUrl: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/6857c546dd78e3f5bf303786_Satish%20Padmanabhan.avif" }
        ]
    },
    {
        id:6,
        slug: "healthcare",
        name: "Healthcare ",
        bgImg: "https://cdn.prod.website-files.com/682f43574652bd066d73adbf/6874748234fcf89b5399087d_wwdw.png",
        headliner: "Redesigning Health Systems for Equity and Access",
        description: "We explore how emerging technologies—from AI to blockchain—can transform healthcare systems globally. Our work bridges digital innovation with public health to advance access, equity, data governance, and resilient care delivery.",
        keythemes: [
            {
                "title": "Digital Health",
                "description": "Leveraging technology to improve care delivery, data access, and health system efficiency."
            },
            {
                "title": "Health Equity",
                "description": "Advancing inclusive models that address disparities in care and outcomes across populations."
            },
            {
                "title": "Health Governance",
                "description": "Designing frameworks for ethical data use, accountability, and systemic resilience."
            },
            {
                "title": "Preventative Innovation",
                "description": "Empowering early intervention, personalized care, and proactive public health through tech."
            }
        ],
        Members: [
            { name: "Shannon Kennedy", title: "NON-EXEC CHAIR & SENIOR FELLOW, HEALTHCARE", imgUrl: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/68658c70df72fa50900c91e5_Untitled%20design%20(1).png" },
            { name: "Dr. Manjula Devi Shroff", title: "SENIOR FELLOW", imgUrl: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/6870e34e45e808fb51a89a61_Dr_edited.avif" },
            { name: "Sundar Krishnan", title: "FELLOW", imgUrl: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/68739a7d18b1ad3911caa6cb_Screenshot%202025-03-18%20at%209_31_30%E2%80%AFPM.avif" },
            { name: "Athena Visel", title: "SENIOR FELLOW", imgUrl: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/6870e1889e996987714ff2a5_Athena%20Visel.avif" },
            { name: "Laurel Hudson Cipriani", title: "SENIOR FELLOW", imgUrl: "https://cdn.prod.website-files.com/685269b5ec19fa449f15ae3c/6857c4ebd6d2e5f216c1e114_Laurel%20Hudson%20Cipriani.avif" }
        ]
    },
]

const PracticeArea = () => {
    const {slug} = useParams();
    const area = PracticeAreaInfo.find(area => area.slug === slug);
    console.log(area);

    if (!area) {
        return <div>Practice Area not found</div>;
    }

    return  (
        <>
        <HeroSection name={area.name} description={area.description} bgImg={area.bgImg} headliner={area.headliner}/>
        <KeyThemesSection keythemes={area.keythemes} />
        <MembersSections members={area.Members} />
        </>
    )
}

export default PracticeArea;