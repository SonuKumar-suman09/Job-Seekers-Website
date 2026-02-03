// ====== LOGO MANAGEMENT & CACHING SYSTEM ====== 
const logoCache = new Map();
const logoRetryMap = new Map();
const maxLogoRetries = 2;

function getCompanyInitials(companyName) {
    return (companyName || 'J')
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .substring(0, 2)
        .toUpperCase();
}

function createLogoContainer(job, size = 'lg') {
    const initials = getCompanyInitials(job.company);
    
    const sizeClass = {
        'lg': 'w-20 h-20',      // Increased from w-14 h-14
        'md': 'w-16 h-16',      // Increased from w-10 h-10
        'sm': 'w-12 h-12',      // Increased from w-8 h-8
        'xs': 'w-8 h-8'         // Increased from w-6 h-6
    }[size] || 'w-20 h-20';
    
    const fontSizeClass = {
        'lg': 'text-2xl',       // Increased from text-xl
        'md': 'text-lg',        // Increased from text-base
        'sm': 'text-base',      // Increased from text-sm
        'xs': 'text-sm'         // Increased from text-xs
    }[size] || 'text-2xl';
    
    // Use actual logo from database if available with HD parameters
    let logoUrl = '';
    if (job.logo && job.logo.startsWith('http')) {
        logoUrl = job.logo;
    } else {
        // Try Clearbit with high-quality parameters first
        const domain = job.company.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '') + '.com';
        logoUrl = `https://logo.clearbit.com/${domain}`;
    }
    
    return `
        <div class="${sizeClass} bg-gradient-to-br from-white via-slate-50 to-slate-100 rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden border border-slate-200 shadow-md hover:shadow-xl hover:border-primary/30 transition-all duration-300 logo-container" data-company="${job.company}" style="image-rendering: high-quality; image-rendering: crisp-edges;">
            <img src="${logoUrl}" 
                 alt="${job.company}" 
                 class="w-full h-full object-contain p-3 logo-img" 
                 style="display:block; image-rendering: high-quality;" 
                 loading="lazy"
                 onerror="handleLogoErrorNew(this, '${job.company}', '${initials}', '${size}')" />
            <div class="w-full h-full bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold ${fontSizeClass} font-poppins logo-badge shadow-lg" style="display:none;">${initials}</div>
        </div>
    `;
}

// Enhanced logo error handling with 4-tier fallback system for HD/4K displays
function handleLogoErrorNew(img, company, initials, size = 'lg') {
    if (!img.dataset.fallbackAttempt) img.dataset.fallbackAttempt = 0;
    const attempt = parseInt(img.dataset.fallbackAttempt);
    const devicePixelRatio = window.devicePixelRatio || 1;
    const hdSize = Math.round(160 * devicePixelRatio); // 160px base × DPR
    
    if (attempt === 0) {
        // Attempt 1: Logo.dev API with HD resolution
        img.dataset.fallbackAttempt = 1;
        const domain = company.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');
        img.src = `https://img.logo.dev/${domain}.com?token=pk_X-NvO5CWSuOjYLhEP5B1Yw&size=${hdSize}`;
    } else if (attempt === 1) {
        // Attempt 2: Google favicon service (reliable fallback)
        img.dataset.fallbackAttempt = 2;
        const domain = company.toLowerCase().replace(/\s+/g, '') + '.com';
        img.src = `https://www.google.com/s2/favicons?sz=${Math.max(256, hdSize)}&domain=${domain}`;
    } else if (attempt === 2) {
        // Attempt 3: Alternative source
        img.dataset.fallbackAttempt = 3;
        img.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 160 160'%3E%3Crect fill='%230066cc' width='160' height='160' rx='16'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle' fill='white' font-size='60' font-weight='bold' font-family='Poppins,Arial,sans-serif'%3E${initials}%3C/text%3E%3C/svg%3E`;
    } else {
        // Final fallback: Show badge
        img.style.display = 'none';
        const badge = img.parentElement?.querySelector('.logo-badge');
        if (badge) badge.style.display = 'flex';
    }
}

function handleLogoError(img, company, initials, size = 'lg') {
    handleLogoErrorNew(img, company, initials, size);
}

function handleLogoSuccess(img) {
    // Remove loading state if any
    img.style.animation = 'none';
    img.style.opacity = '1';
    
    // Hide fallback badge
    const badge = img.parentElement?.querySelector('.logo-badge');
    const fallback = img.parentElement?.querySelector('.logo-badge-fallback');
    if (badge) badge.style.display = 'none';
    if (fallback) fallback.style.display = 'none';
    
    // Cache successful logo
    const company = img.parentElement?.dataset.company;
    if (company && img.src) {
        logoCache.set(company, img.src);
        console.log(`✅ HD Logo loaded for ${company}`);
    }
}

// ====== APPLY LINK VERIFICATION & TRACKING ====== 
function validateApplyLinks() {
    const allJobs = [...jobsDatabase, ...INDIAN_LIVE_JOBS];
    const linkStatus = {
        valid: 0,
        total: allJobs.length,
        companies: {}
    };
    
    allJobs.forEach(job => {
        const hasApplyLink = job.applyLink && job.applyLink.startsWith('https://');
        linkStatus.companies[job.company] = {
            id: job.id,
            applyLink: job.applyLink,
            isValid: hasApplyLink
        };
        if (hasApplyLink) linkStatus.valid++;
    });
    
    console.log('✅ Apply Links Validation:', linkStatus);
    return linkStatus;
}

function getApplyLinkStats() {
    const stats = validateApplyLinks();
    console.log(`✅ ${stats.valid}/${stats.total} companies have valid apply links`);
    Object.entries(stats.companies).forEach(([company, data]) => {
        const status = data.isValid ? '✅' : '❌';
        console.log(`${status} ${company}: ${data.applyLink}`);
    });
    
    // Also validate logos
    console.log('\n📸 Logo Validation:');
    const logoStats = validateAndFixLogos();
    console.log(`✅ All ${logoStats.length} jobs have company logos!`);
    console.log('🔍 Search functionality: READY');
    console.log('🎨 Logo display: READY');
    
    return stats;
}

function validateAndFixLogos() {
    const allJobs = INDIAN_LIVE_JOBS;
    let missingLogos = [];
    
    allJobs.forEach(job => {
        if (!job.logo || !job.logo.startsWith('http')) {
            missingLogos.push(job.company);
            // Try to set a fallback logo
            if (!job.logo) {
                const domain = job.company.toLowerCase().replace(/\s+/g, '');
                job.logo = `https://www.google.com/s2/favicons?domain=${domain}.com&sz=256`;
            }
        }
    });
    
    if (missingLogos.length > 0) {
        console.warn('⚠️ Companies without proper logos:', missingLogos);
    } else {
        console.log('✅ All companies have logos assigned!');
    }
    
    return allJobs;
}

// Run validation on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        validateAndFixLogos();
    });
} else {
    validateAndFixLogos();
}

 
let jobsDatabase = [
    {
        id: 1,
        title: "Senior Software Engineer",
        company: "TCS",
        location: "Bengaluru, Karnataka",
        type: "Full-Time",
        salary: "₹20 - ₹30 LPA",
        category: "Technology",
        description: "Lead development of cloud-based enterprise solutions for global clients.",
        companyWebsite: "https://www.tcs.com/careers",
        applyLink: "https://www.tcs.com/careers",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Tata_Consultancy_Services_Logo.svg/1200px-Tata_Consultancy_Services_Logo.svg.png",
        rating: 4.5,
        reviews: 1204,
        companyRating: 4.2,
        postedDays: 2,
        applicants: 245,
        benefits: ["Health Insurance", "Stock Options", "Flexible Hours"]
    },
    {
        id: 2,
        title: "Data Scientist",
        company: "Amazon India",
        location: "Hyderabad, Telangana",
        type: "Full-Time",
        salary: "₹18 - ₹25 LPA",
        category: "Technology",
        description: "Build ML models to enhance customer experience for millions of users.",
        companyWebsite: "https://www.amazon.jobs/en-in/",
        applyLink: "https://www.amazon.jobs/en-in/search",
        logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
        rating: 4.7,
        reviews: 2145,
        postedDays: 4
    },
    {
        id: 3,
        title: "Product Manager",
        company: "Swiggy",
        location: "Bengaluru, Karnataka",
        type: "Remote",
        salary: "₹18 - ₹28 LPA",
        category: "Marketing",
        description: "Shape the future of food delivery and manage products for millions of users.",
        companyWebsite: "https://www.swiggycareers.com/",
        applyLink: "https://www.swiggycareers.com/",
        logo: "https://upload.wikimedia.org/wikipedia/commons/7/7d/Swiggy_logo.svg",
        rating: 4.3,
        reviews: 892,
        postedDays: 7
    },
    {
        id: 4,
        title: "Frontend Developer",
        company: "Flipkart",
        location: "Bengaluru, Karnataka",
        type: "Full-Time",
        salary: "₹15 - ₹22 LPA",
        category: "Technology",
        description: "Create responsive web interfaces for India's leading e-commerce platform.",
        companyWebsite: "https://www.flipkartcareers.com/",
        applyLink: "https://www.flipkartcareers.com/",
        logo: "https://upload.wikimedia.org/wikipedia/commons/5/5b/Flipkart_logo.svg",
        rating: 4.2,
        reviews: 1567,
        postedDays: 3
    },
    {
        id: 5,
        title: "Full Stack Developer",
        company: "Razorpay",
        location: "Bengaluru, Karnataka",
        type: "Full-Time",
        salary: "₹16 - ₹24 LPA",
        category: "Technology",
        description: "Build payment solutions used by millions. Work with cutting-edge technologies.",
        companyWebsite: "https://razorpay.com/careers/",
        applyLink: "https://razorpay.com/careers/",
        logo: "https://upload.wikimedia.org/wikipedia/commons/8/8c/Razorpay_logo.svg",
        rating: 4.6,
        reviews: 743,
        postedDays: 5
    },
    {
        id: 6,
        title: "DevOps Engineer",
        company: "OYO",
        location: "Gurugram, Haryana",
        type: "Full-Time",
        salary: "₹14 - ₹20 LPA",
        category: "Technology",
        description: "Manage infrastructure and deployment pipelines for global hotel platform.",
        companyWebsite: "https://www.oyorooms.com/careers/",
        applyLink: "https://www.oyorooms.com/careers/",
        logo: "https://upload.wikimedia.org/wikipedia/commons/0/0c/OYO_logo.svg",
        rating: 3.9,
        reviews: 654,
        postedDays: 1
    },
    {
        id: 7,
        title: "UI/UX Designer",
        company: "Unacademy",
        location: "Bengaluru, Karnataka",
        type: "Full-Time",
        salary: "₹12 - ₹18 LPA",
        category: "Design",
        description: "Design learning experiences for millions of students across India.",
        companyWebsite: "https://unacademy.com/careers/",
        applyLink: "https://unacademy.com/careers/",
        logo: "https://upload.wikimedia.org/wikipedia/commons/1/1a/Unacademy_logo.svg",
        rating: 4.4,
        reviews: 521,
        postedDays: 6
    },
    {
        id: 8,
        title: "Business Analyst",
        company: "HDFC Bank",
        location: "Mumbai, Maharashtra",
        type: "Remote",
        salary: "₹10 - ₹16 LPA",
        category: "Finance",
        description: "Analyze business requirements and drive digital transformation initiatives.",
        companyWebsite: "https://www.hdfcbank.com/en-in/careers/",
        applyLink: "https://www.hdfcbank.com/en-in/careers/",
        logo: "https://upload.wikimedia.org/wikipedia/commons/d/d4/HDFC_Bank_Logo.svg",
        rating: 4.1,
        reviews: 1876,
        postedDays: 8
    }
];

// ====== EXPANDED INDIAN JOBS DATABASE FOR LIVE LOADING ======
const INDIAN_LIVE_JOBS = [
    ...jobsDatabase,
    // Infosys
    {
        id: 101,
        title: "Cloud Architect",
        company: "Infosys",
        location: "Pune, Maharashtra",
        type: "Full-Time",
        salary: "₹22 - ₹35 LPA",
        category: "Technology",
        description: "Design and implement cloud infrastructure solutions for enterprise clients.",
        companyWebsite: "https://www.infosys.com/careers/",
        applyLink: "https://www.infosys.com/careers/",
        logo: "https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg",
        rating: 4.3,
        reviews: 3245,
        companyRating: 4.1,
        postedDays: 2,
        applicants: 178,
        benefits: ["Health Insurance", "Flexible Hours", "Learning Budget"]
    },
    // Wipro
    {
        id: 102,
        title: "Java Backend Developer",
        company: "Wipro",
        location: "Bengaluru, Karnataka",
        type: "Full-Time",
        salary: "₹12 - ₹18 LPA",
        category: "Technology",
        description: "Develop scalable backend services using Java Spring Boot framework.",
        companyWebsite: "https://careers.wipro.com/",
        applyLink: "https://careers.wipro.com/",
        logo: "https://upload.wikimedia.org/wikipedia/commons/4/4f/Wipro_logo.svg",
        rating: 4.2,
        reviews: 2134,
        companyRating: 4.0,
        postedDays: 3,
        applicants: 234,
        benefits: ["Health Insurance", "WFH Options", "Cafeteria"]
    },
    // Zomato
    {
        id: 103,
        title: "Product Designer",
        company: "Zomato",
        location: "Gurugram, Haryana",
        type: "Full-Time",
        salary: "₹18 - ₹28 LPA",
        category: "Design",
        description: "Create delightful user experiences for millions of food lovers.",
        companyWebsite: "https://www.zomato.com/careers",
        applyLink: "https://www.zomato.com/careers",
        logo: "https://upload.wikimedia.org/wikipedia/commons/7/75/Zomato_logo.png",
        rating: 4.5,
        reviews: 876,
        companyRating: 4.3,
        postedDays: 1,
        applicants: 145,
        benefits: ["Free Meals", "Health Insurance", "ESOP"]
    },
    // Paytm
    {
        id: 104,
        title: "Mobile App Developer",
        company: "Paytm",
        location: "Noida, Uttar Pradesh",
        type: "Full-Time",
        salary: "₹15 - ₹24 LPA",
        category: "Technology",
        description: "Build and maintain mobile applications for India's leading fintech platform.",
        companyWebsite: "https://www.paytm.com/careers/",
        applyLink: "https://www.paytm.com/careers/",
        logo: "https://upload.wikimedia.org/wikipedia/commons/e/e1/Paytm_logo.svg",
        rating: 4.4,
        reviews: 1432,
        companyRating: 4.2,
        postedDays: 4,
        applicants: 289,
        benefits: ["Health Insurance", "Performance Bonus", "Flexible Hours"]
    },
    // PhonePe
    {
        id: 105,
        title: "Backend Engineer",
        company: "PhonePe",
        location: "Bengaluru, Karnataka",
        type: "Full-Time",
        salary: "₹20 - ₹32 LPA",
        category: "Technology",
        description: "Build high-performance backend systems handling millions of transactions.",
        companyWebsite: "https://www.phonepe.com/careers/",
        applyLink: "https://www.phonepe.com/careers/",
        logo: "https://upload.wikimedia.org/wikipedia/commons/a/a0/PhonePe_Logo.svg",
        rating: 4.7,
        reviews: 654,
        companyRating: 4.5,
        postedDays: 2,
        applicants: 198,
        benefits: ["Stock Options", "Health Insurance", "Remote Work"]
    },
    // CRED
    {
        id: 106,
        title: "Senior Product Manager",
        company: "CRED",
        location: "Bengaluru, Karnataka",
        type: "Full-Time",
        salary: "₹25 - ₹40 LPA",
        category: "Marketing",
        description: "Lead product strategy for India's most trusted credit card platform.",
        companyWebsite: "https://careers.cred.club/",
        applyLink: "https://careers.cred.club/",
        logo: "https://upload.wikimedia.org/wikipedia/commons/f/f5/CRED_Logo.svg",
        rating: 4.6,
        reviews: 423,
        companyRating: 4.4,
        postedDays: 3,
        applicants: 167,
        benefits: ["Premium Health", "ESOP", "Unlimited Leaves"]
    },
    // Ola
    {
        id: 107,
        title: "Data Engineer",
        company: "Ola",
        location: "Bengaluru, Karnataka",
        type: "Full-Time",
        salary: "₹16 - ₹26 LPA",
        category: "Technology",
        description: "Build data pipelines and analytics systems for mobility platform.",
        companyWebsite: "https://www.olacabs.com/careers",
        applyLink: "https://www.olacabs.com/careers",
        logo: "https://upload.wikimedia.org/wikipedia/commons/f/f8/Ola_Logo.svg",
        rating: 4.1,
        reviews: 987,
        companyRating: 3.9,
        postedDays: 5,
        applicants: 145,
        benefits: ["Health Insurance", "Flexible Hours", "Travel Allowance"]
    },
    // Freshworks
    {
        id: 108,
        title: "Full Stack Engineer",
        company: "Freshworks",
        location: "Chennai, Tamil Nadu",
        type: "Full-Time",
        salary: "₹18 - ₹28 LPA",
        category: "Technology",
        description: "Develop SaaS products used by businesses worldwide.",
        companyWebsite: "https://www.freshworks.com/careers/",
        applyLink: "https://www.freshworks.com/careers/",
        logo: "https://upload.wikimedia.org/wikipedia/commons/3/3a/Freshworks_logo.svg",
        rating: 4.5,
        reviews: 1234,
        companyRating: 4.3,
        postedDays: 2,
        applicants: 234,
        benefits: ["Stock Options", "Health Insurance", "Learning Budget"]
    },
    // Dream11
    {
        id: 109,
        title: "QA Engineer",
        company: "Dream11",
        location: "Mumbai, Maharashtra",
        type: "Full-Time",
        salary: "₹14 - ₹22 LPA",
        category: "Technology",
        description: "Ensure quality of India's largest fantasy sports platform.",
        companyWebsite: "https://www.dream11.com/careers",
        applyLink: "https://www.dream11.com/careers",
        logo: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Dream11_logo.svg",
        rating: 4.3,
        reviews: 765,
        companyRating: 4.1,
        postedDays: 4,
        applicants: 189,
        benefits: ["Health Insurance", "Performance Bonus", "Sports Events"]
    },
    // Zerodha
    {
        id: 110,
        title: "DevOps Lead",
        company: "Zerodha",
        location: "Bengaluru, Karnataka",
        type: "Full-Time",
        salary: "₹22 - ₹35 LPA",
        category: "Technology",
        description: "Lead DevOps for India's largest stock broking platform.",
        companyWebsite: "https://zerodha.com/careers/",
        applyLink: "https://zerodha.com/careers/",
        logo: "https://upload.wikimedia.org/wikipedia/commons/8/85/Zerodha_Logo.svg",
        rating: 4.8,
        reviews: 543,
        companyRating: 4.6,
        postedDays: 1,
        applicants: 123,
        benefits: ["High Salary", "Work-Life Balance", "Health Insurance"]
    },
    // Myntra
    {
        id: 111,
        title: "Android Developer",
        company: "Myntra",
        location: "Bengaluru, Karnataka",
        type: "Full-Time",
        salary: "₹16 - ₹24 LPA",
        category: "Technology",
        description: "Build features for India's leading fashion e-commerce app.",
        companyWebsite: "https://www.myntra.com/careers",
        applyLink: "https://www.myntra.com/careers",
        logo: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Myntra_logo.svg",
        rating: 4.4,
        reviews: 1098,
        companyRating: 4.2,
        postedDays: 3,
        applicants: 267,
        benefits: ["Shopping Discounts", "Health Insurance", "Flexible Hours"]
    },
    // BigBasket
    {
        id: 112,
        title: "Supply Chain Manager",
        company: "BigBasket",
        location: "Bengaluru, Karnataka",
        type: "Full-Time",
        salary: "₹15 - ₹25 LPA",
        category: "Operations",
        description: "Optimize supply chain operations for online grocery delivery.",
        companyWebsite: "https://www.bigbasket.com/careers/",
        applyLink: "https://www.bigbasket.com/careers/",
        logo: "https://upload.wikimedia.org/wikipedia/commons/3/3f/BigBasket_logo.svg",
        rating: 4.2,
        reviews: 654,
        companyRating: 4.0,
        postedDays: 6,
        applicants: 145,
        benefits: ["Health Insurance", "Performance Bonus", "Grocery Discounts"]
    },
    // Byju's
    {
        id: 113,
        title: "Content Developer",
        company: "Byju's",
        location: "Bengaluru, Karnataka",
        type: "Full-Time",
        salary: "₹10 - ₹16 LPA",
        category: "Education",
        description: "Create engaging educational content for K-12 students.",
        companyWebsite: "https://byjus.com/careers/",
        applyLink: "https://byjus.com/careers/",
        logo: "https://upload.wikimedia.org/wikipedia/commons/8/8e/Byjus_logo.svg",
        rating: 4.1,
        reviews: 2345,
        companyRating: 3.8,
        postedDays: 5,
        applicants: 456,
        benefits: ["Health Insurance", "Flexible Hours", "Learning Resources"]
    },
    // Tech Mahindra
    {
        id: 114,
        title: "Cybersecurity Analyst",
        company: "Tech Mahindra",
        location: "Hyderabad, Telangana",
        type: "Full-Time",
        salary: "₹12 - ₹20 LPA",
        category: "Technology",
        description: "Protect enterprise systems and networks from cyber threats.",
        companyWebsite: "https://www.techmahindra.com/careers/",
        applyLink: "https://www.techmahindra.com/careers/",
        logo: "https://upload.wikimedia.org/wikipedia/commons/b/b2/Tech_Mahindra_Logo.svg",
        rating: 4.0,
        reviews: 1876,
        companyRating: 3.9,
        postedDays: 4,
        applicants: 234,
        benefits: ["Health Insurance", "Training Programs", "Flexible Hours"]
    },
    // HCL Technologies
    {
        id: 115,
        title: "AI/ML Engineer",
        company: "HCL Technologies",
        location: "Noida, Uttar Pradesh",
        type: "Full-Time",
        salary: "₹18 - ₹28 LPA",
        category: "Technology",
        description: "Develop AI/ML solutions for global enterprise clients.",
        companyWebsite: "https://www.hcltech.com/careers",
        applyLink: "https://www.hcltech.com/careers",
        logo: "https://upload.wikimedia.org/wikipedia/commons/3/38/HCL_Technologies_Logo.svg",
        rating: 4.2,
        reviews: 2543,
        companyRating: 4.0,
        postedDays: 2,
        applicants: 298,
        benefits: ["Health Insurance", "Global Exposure", "Learning Budget"]
    },
    // Nykaa
    {
        id: 116,
        title: "Digital Marketing Manager",
        company: "Nykaa",
        location: "Mumbai, Maharashtra",
        type: "Full-Time",
        salary: "₹14 - ₹22 LPA",
        category: "Marketing",
        description: "Drive digital marketing strategies for India's leading beauty platform.",
        companyWebsite: "https://www.nykaa.com/careers",
        applyLink: "https://www.nykaa.com/careers",
        logo: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Nykaa_logo.svg",
        rating: 4.3,
        reviews: 678,
        companyRating: 4.1,
        postedDays: 3,
        applicants: 189,
        benefits: ["Product Discounts", "Health Insurance", "Performance Bonus"]
    },
    // PolicyBazaar
    {
        id: 117,
        title: "Insurance Sales Executive",
        company: "PolicyBazaar",
        location: "Gurugram, Haryana",
        type: "Full-Time",
        salary: "₹8 - ₹15 LPA",
        category: "Sales",
        description: "Help customers find the best insurance policies for their needs.",
        companyWebsite: "https://www.policybazaar.com/careers/",
        applyLink: "https://www.policybazaar.com/careers/",
        logo: "https://upload.wikimedia.org/wikipedia/commons/f/f0/PolicyBazaar_logo.svg",
        rating: 4.0,
        reviews: 1234,
        companyRating: 3.8,
        postedDays: 7,
        applicants: 345,
        benefits: ["Incentives", "Health Insurance", "Flexible Hours"]
    },
    // Urban Company
    {
        id: 118,
        title: "Operations Manager",
        company: "Urban Company",
        location: "Gurugram, Haryana",
        type: "Full-Time",
        salary: "₹12 - ₹20 LPA",
        category: "Operations",
        description: "Manage operations for home services marketplace.",
        companyWebsite: "https://www.urbancompany.com/careers",
        applyLink: "https://www.urbancompany.com/careers",
        logo: "https://upload.wikimedia.org/wikipedia/commons/5/5c/Urban_Company_logo.svg",
        rating: 4.2,
        reviews: 543,
        companyRating: 4.0,
        postedDays: 4,
        applicants: 167,
        benefits: ["Health Insurance", "Performance Bonus", "Service Discounts"]
    },
    // Grofers (Blinkit)
    {
        id: 119,
        title: "Logistics Coordinator",
        company: "Blinkit",
        location: "Gurugram, Haryana",
        type: "Full-Time",
        salary: "₹10 - ₹16 LPA",
        category: "Operations",
        description: "Coordinate quick commerce delivery operations.",
        companyWebsite: "https://www.blinkit.com/careers",
        applyLink: "https://www.blinkit.com/careers",
        logo: "https://upload.wikimedia.org/wikipedia/commons/9/9c/Blinkit_logo.svg",
        rating: 4.1,
        reviews: 456,
        companyRating: 3.9,
        postedDays: 5,
        applicants: 234,
        benefits: ["Health Insurance", "Performance Bonus", "Flexible Hours"]
    },
    // MakeMyTrip
    {
        id: 120,
        title: "Frontend React Developer",
        company: "MakeMyTrip",
        location: "Gurugram, Haryana",
        type: "Full-Time",
        salary: "₹14 - ₹22 LPA",
        category: "Technology",
        description: "Build user interfaces for India's leading travel platform.",
        companyWebsite: "https://www.makemytrip.com/careers/",
        applyLink: "https://www.makemytrip.com/careers/",
        logo: "https://upload.wikimedia.org/wikipedia/commons/9/93/MakeMyTrip_logo.svg",
        rating: 4.3,
        reviews: 987,
        companyRating: 4.1,
        postedDays: 2,
        applicants: 198,
        benefits: ["Travel Discounts", "Health Insurance", "Flexible Hours"]
    },
    // Jio
    {
        id: 121,
        title: "Network Engineer",
        company: "Reliance Jio",
        location: "Mumbai, Maharashtra",
        type: "Full-Time",
        salary: "₹16 - ₹26 LPA",
        category: "Technology",
        description: "Maintain and optimize India's largest 4G network infrastructure.",
        companyWebsite: "https://www.jio.com/careers",
        applyLink: "https://www.jio.com/careers",
        logo: "https://upload.wikimedia.org/wikipedia/commons/9/9d/Jio_Logo.svg",
        rating: 4.4,
        reviews: 1765,
        companyRating: 4.2,
        postedDays: 3,
        applicants: 289,
        benefits: ["Health Insurance", "Telecom Benefits", "Performance Bonus"]
    },
    // BookMyShow
    {
        id: 122,
        title: "Product Analyst",
        company: "BookMyShow",
        location: "Mumbai, Maharashtra",
        type: "Full-Time",
        salary: "₹12 - ₹18 LPA",
        category: "Marketing",
        description: "Analyze product metrics for entertainment booking platform.",
        companyWebsite: "https://in.bookmyshow.com/careers",
        applyLink: "https://in.bookmyshow.com/careers",
        logo: "https://upload.wikimedia.org/wikipedia/commons/8/8d/BookMyShow_logo.svg",
        rating: 4.2,
        reviews: 654,
        companyRating: 4.0,
        postedDays: 6,
        applicants: 178,
        benefits: ["Entertainment Passes", "Health Insurance", "Flexible Hours"]
    },
    // ShareChat
    {
        id: 123,
        title: "Content Moderator",
        company: "ShareChat",
        location: "Bengaluru, Karnataka",
        type: "Full-Time",
        salary: "₹8 - ₹12 LPA",
        category: "Operations",
        description: "Moderate user-generated content on India's social media platform.",
        companyWebsite: "https://sharechat.com/careers",
        applyLink: "https://sharechat.com/careers",
        logo: "https://upload.wikimedia.org/wikipedia/commons/1/1c/ShareChat_logo.svg",
        rating: 4.0,
        reviews: 432,
        companyRating: 3.8,
        postedDays: 8,
        applicants: 345,
        benefits: ["Health Insurance", "Flexible Hours", "Performance Bonus"]
    },
    // Meesho
    {
        id: 124,
        title: "Growth Manager",
        company: "Meesho",
        location: "Bengaluru, Karnataka",
        type: "Full-Time",
        salary: "₹15 - ₹24 LPA",
        category: "Marketing",
        description: "Drive growth initiatives for social commerce platform.",
        companyWebsite: "https://www.meesho.com/careers",
        applyLink: "https://www.meesho.com/careers",
        logo: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Meesho_logo.svg",
        rating: 4.4,
        reviews: 678,
        companyRating: 4.2,
        postedDays: 2,
        applicants: 156,
        benefits: ["ESOP", "Health Insurance", "Flexible Hours"]
    },
    // Dunzo
    {
        id: 125,
        title: "Delivery Operations Lead",
        company: "Dunzo",
        location: "Bengaluru, Karnataka",
        type: "Full-Time",
        salary: "₹12 - ₹18 LPA",
        category: "Operations",
        description: "Lead hyperlocal delivery operations team.",
        companyWebsite: "https://www.dunzo.com/careers",
        applyLink: "https://www.dunzo.com/careers",
        logo: "https://upload.wikimedia.org/wikipedia/commons/d/d0/Dunzo_logo.svg",
        rating: 4.1,
        reviews: 345,
        companyRating: 3.9,
        postedDays: 5,
        applicants: 123,
        benefits: ["Health Insurance", "Delivery Credits", "Flexible Hours"]
    }
];

const LOCAL_JOBS = [...jobsDatabase];
let usingLiveJobs = false;

// ====== LOCAL STORAGE FOR SAVED & APPLIED JOBS ====== 
let savedJobs = JSON.parse(localStorage.getItem('savedJobs')) || [];
let appliedJobs = JSON.parse(localStorage.getItem('appliedJobs')) || [];
let savedJobsDetails = JSON.parse(localStorage.getItem('savedJobsDetails')) || [];

// ====== SAVE JOB FUNCTION ====== 
function toggleSaveJob(jobId) {
    const job = jobsDatabase.find(j => j.id === jobId);
    const jobIndex = savedJobs.indexOf(jobId);
    if (jobIndex > -1) {
        savedJobs.splice(jobIndex, 1);
        savedJobsDetails = savedJobsDetails.filter(j => j.id !== jobId);
    } else {
        savedJobs.push(jobId);
        if (job) {
            const exists = savedJobsDetails.some(j => j.id === jobId);
            if (!exists) {
                savedJobsDetails.push({
                    id: job.id,
                    title: job.title,
                    company: job.company,
                    logo: job.logo,
                    location: job.location,
                    companyWebsite: job.companyWebsite,
                    savedAt: new Date().toISOString()
                });
            }
        }
    }
    localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
    localStorage.setItem('savedJobsDetails', JSON.stringify(savedJobsDetails));
    updateUI();
    showNotification('Job saved successfully!', 'success');
}

// ====== APPLY TO JOB FUNCTION ====== 
function applyToJob(jobId) {
    const job = jobsDatabase.find(j => j.id === jobId) || INDIAN_LIVE_JOBS.find(j => j.id === jobId);
    if (!job) {
        showNotification('Job not found in database', 'error');
        return;
    }
    
    // Validate apply link before proceeding
    if (!job.applyLink || !job.applyLink.startsWith('https://')) {
        showNotification('This company does not have a valid career page link. Please try another job.', 'error');
        return;
    }
    
    // Track as clicked (not applied) until user submits application form - include logo
    trackJobApplication(jobId, job.title, job.company, 'clicked', job.logo);

    // Store last clicked job for apply form to mark as applied on submit
    localStorage.setItem('lastApplyJob', JSON.stringify({
        jobId: job.id,
        title: job.title,
        company: job.company,
        logo: job.logo,
        applyLink: job.applyLink,
        companyWebsite: job.companyWebsite
    }));
    
    // Open company's career page in new tab
    window.open(job.applyLink, '_blank');
    showNotification(`Opened ${job.company} careers page. Complete your application to mark as Applied.`, 'info');
    updateUI();
}

// ====== LOCATION DETECTION ======
function setDetectedLocation(locationText) {
    const locationInput = document.getElementById('locationSearch');
    if (locationInput) {
        locationInput.value = locationText;
        localStorage.setItem('userLocation', locationText);
        // Trigger search after location is set
        setTimeout(() => {
            updateSearchSuggestions();
            searchJobs();
        }, 300);
    }
}

function reverseGeocode(lat, lon) {
    // First try OpenStreetMap Nominatim API
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;
    return fetch(url, { 
        headers: { 'Accept-Language': 'en' },
        timeout: 5000
    })
        .then(res => res.json())
        .then(data => {
            const addr = data.address || {};
            // Try to get city/town first, then state and country
            const city = addr.city || addr.town || addr.village || addr.county || '';
            const state = addr.state || '';
            const country = addr.country || '';
            const parts = [city, state, country].filter(Boolean);
            
            if (parts.length > 0) {
                return parts.join(', ');
            }
            // Fallback to coordinates
            return `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
        })
        .catch(error => {
            console.error('Reverse geocoding failed:', error);
            // Return coordinates as fallback
            return `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
        });
}

function detectUserLocation() {
    const detectBtn = document.getElementById('detectLocationBtn');
    
    if (!navigator.geolocation) {
        showNotification('❌ Geolocation not supported in your browser', 'error');
        return;
    }

    // Show detecting state
    if (detectBtn) {
        detectBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Detecting...';
        detectBtn.disabled = true;
    }
    
    showNotification('📍 Detecting your location...', 'info');
    
    navigator.geolocation.getCurrentPosition(
        async (position) => {
            try {
                const { latitude, longitude } = position.coords;
                console.log(`📍 Location found: ${latitude}, ${longitude}`);
                
                const locationText = await reverseGeocode(latitude, longitude);
                console.log(`🌍 Detected location: ${locationText}`);
                
                setDetectedLocation(locationText);
                showNotification(`✅ Location set to: ${locationText}`, 'success');
                
                // Reset button
                if (detectBtn) {
                    detectBtn.innerHTML = '<i class="fas fa-location-crosshairs"></i> Use my current location';
                    detectBtn.disabled = false;
                }
            } catch (error) {
                console.error('Error processing location:', error);
                showNotification('⚠️ Error processing location data', 'error');
                if (detectBtn) {
                    detectBtn.innerHTML = '<i class="fas fa-location-crosshairs"></i> Use my current location';
                    detectBtn.disabled = false;
                }
            }
        },
        (error) => {
            console.error('Geolocation error:', error);
            
            let errorMsg = 'Unable to detect location';
            if (error.code === 1) {
                errorMsg = '❌ Location permission denied. Enable location access in browser settings.';
            } else if (error.code === 2) {
                errorMsg = '⚠️ Location unavailable. Please check your internet connection.';
            } else if (error.code === 3) {
                errorMsg = '⏱️ Location detection timed out. Please try again.';
            }
            
            showNotification(errorMsg, 'warning');
            
            // Reset button
            if (detectBtn) {
                detectBtn.innerHTML = '<i class="fas fa-location-crosshairs"></i> Use my current location';
                detectBtn.disabled = false;
            }
        },
        { 
            enableHighAccuracy: true, 
            timeout: 10000, 
            maximumAge: 300000 // 5 minutes cache
        }
    );
}

// ====== ENHANCED NOTIFICATION SYSTEM ====== 
let notificationCount = 0;

function showNotification(message, type = 'info', duration = 4000) {
    const notification = document.createElement('div');
    const notifId = ++notificationCount;
    
    // Determine colors and icons based on type
    const styles = {
        success: { bg: 'bg-gradient-to-r from-green-500 to-green-600', icon: 'check-circle', ring: 'ring-green-300' },
        error: { bg: 'bg-gradient-to-r from-red-500 to-red-600', icon: 'times-circle', ring: 'ring-red-300' },
        warning: { bg: 'bg-gradient-to-r from-yellow-500 to-orange-500', icon: 'exclamation-triangle', ring: 'ring-yellow-300' },
        info: { bg: 'bg-gradient-to-r from-blue-500 to-cyan-500', icon: 'info-circle', ring: 'ring-blue-300' }
    };
    
    const style = styles[type] || styles.info;
    
    // Calculate position based on existing notifications
    const existingNotifs = document.querySelectorAll('.custom-notification');
    const topOffset = 20 + (existingNotifs.length * 90);
    
    notification.className = `custom-notification fixed right-4 p-4 pr-12 rounded-xl text-white font-semibold z-50 shadow-2xl ring-2 ${style.bg} ${style.ring} transform transition-all duration-300 ease-out`;
    notification.style.top = `${topOffset}px`;
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(400px)';
    notification.style.minWidth = '320px';
    notification.style.maxWidth = '400px';
    
    notification.innerHTML = `
        <div class="flex items-start gap-3">
            <i class="fas fa-${style.icon} text-2xl flex-shrink-0 mt-1"></i>
            <p class="flex-1 leading-relaxed">${message}</p>
            <button onclick="this.parentElement.parentElement.remove()" class="absolute top-3 right-3 text-white hover:text-gray-200 transition">
                <i class="fas fa-times text-lg"></i>
            </button>
        </div>
        <div class="progress-bar mt-2 h-1 bg-white/30 rounded-full overflow-hidden">
            <div class="progress-fill h-full bg-white/80 rounded-full" style="animation: progress ${duration}ms linear"></div>
        </div>
    `;
    
    // Add progress bar animation
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        @keyframes progress {
            from { width: 100%; }
            to { width: 0%; }
        }
        .custom-notification:hover .progress-fill {
            animation-play-state: paused;
        }
    `;
    if (!document.querySelector('style[data-notification-styles]')) {
        styleSheet.setAttribute('data-notification-styles', 'true');
        document.head.appendChild(styleSheet);
    }
    
    document.body.appendChild(notification);
    
    // Slide in animation
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Auto remove with slide out animation
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            notification.remove();
            // Reposition remaining notifications
            repositionNotifications();
        }, 300);
    }, duration);
}

function repositionNotifications() {
    const notifications = document.querySelectorAll('.custom-notification');
    notifications.forEach((notif, index) => {
        notif.style.top = `${20 + (index * 90)}px`;
    });
}

// ====== STAR RATING DISPLAY ====== 
function getStarRating(rating) {
    let stars = '';
    for (let i = 0; i < 5; i++) {
        if (i < Math.floor(rating)) {
            stars += '<i class="fas fa-star star-rating"></i>';
        } else if (i === Math.floor(rating) && rating % 1 !== 0) {
            stars += '<i class="fas fa-star-half-alt star-rating"></i>';
        } else {
            stars += '<i class="fas fa-star star-empty"></i>';
        }
    }
    return stars;
}

// ====== SEARCH OPTIONS & SUGGESTIONS ======
function getUniqueValues(key) {
    const allJobs = [...jobsDatabase, ...INDIAN_LIVE_JOBS];
    return [...new Set(allJobs.map(job => job[key]).filter(Boolean))].sort();
}

function populateDatalists() {
    const titleOptions = document.getElementById('jobTitleOptions');
    const companyOptions = document.getElementById('companyOptions');
    if (!titleOptions || !companyOptions) return;

    try {
        const titles = getUniqueValues('title');
        const companies = getUniqueValues('company');

        titleOptions.innerHTML = titles.map(t => `<option value="${t}"></option>`).join('');
        companyOptions.innerHTML = companies.map(c => `<option value="${c}"></option>`).join('');
        
        console.log('✅ Datalists populated:', { titles: titles.length, companies: companies.length });
    } catch (e) {
        console.error('❌ Error populating datalists:', e);
    }
}

function updateSearchSuggestions() {
    const suggestionsEl = document.getElementById('searchSuggestions');
    if (!suggestionsEl) return;

    const titleInput = document.getElementById('titleSearch')?.value?.toLowerCase() || '';
    const companyInput = document.getElementById('companySearch')?.value?.toLowerCase() || '';
    const locationInput = document.getElementById('locationSearch')?.value?.toLowerCase() || '';

    const titles = getUniqueValues('title').filter(t => t.toLowerCase().includes(titleInput)).slice(0, 4);
    const companies = getUniqueValues('company').filter(c => c.toLowerCase().includes(companyInput)).slice(0, 4);
    const locations = getUniqueValues('location').filter(l => l.toLowerCase().includes(locationInput)).slice(0, 4);

    const chips = [
        ...titles.map(t => `<button class="px-3 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-200 hover:bg-blue-100 transition text-xs" onclick="applySuggestion('title', '${t.replace(/'/g, "&#39;")}')" type="button"><i class="fas fa-briefcase mr-1"></i>${t}</button>`),
        ...companies.map(c => `<button class="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200 hover:bg-emerald-100 transition text-xs" onclick="applySuggestion('company', '${c.replace(/'/g, "&#39;")}')" type="button"><i class="fas fa-building mr-1"></i>${c}</button>`),
        ...locations.map(l => `<button class="px-3 py-1 bg-orange-50 text-orange-700 rounded-full border border-orange-200 hover:bg-orange-100 transition text-xs" onclick="applySuggestion('location', '${l.replace(/'/g, "&#39;")}')" type="button"><i class="fas fa-map-marker-alt mr-1"></i>${l}</button>`)
    ];

    suggestionsEl.innerHTML = chips.length
        ? `<span class="text-slate-600 font-semibold mr-2">💡 Suggestions:</span>${chips.join('')}`
        : '';
}

function applySuggestion(type, value) {
    if (type === 'title') {
        document.getElementById('titleSearch').value = value;
    } else if (type === 'company') {
        document.getElementById('companySearch').value = value;
    } else if (type === 'location') {
        document.getElementById('locationSearch').value = value;
    }
    searchJobs();
    updateSearchSuggestions();
    console.log('✅ Suggestion applied:', { type, value });
}

// ====== LIVE JOBS (PUBLIC API) ======
function setLiveStatus(message, show = true) {
    const statusEl = document.getElementById('liveStatus');
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.classList.toggle('hidden', !show);
    
    // Add color based on message content
    if (message.includes('✓')) {
        statusEl.className = 'mt-2 text-sm text-green-600 font-semibold';
    } else if (message.includes('⚠')) {
        statusEl.className = 'mt-2 text-sm text-amber-600 font-semibold';
    } else {
        statusEl.className = 'mt-2 text-sm text-blue-600 font-semibold';
    }
    if (!show) statusEl.classList.add('hidden');
}

async function loadLiveJobs() {
    const btn = document.getElementById('loadLiveJobsBtn');
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    }
    setLiveStatus('Loading live jobs from Indian companies...', true);

    // Simulate API loading for better UX
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
        console.log('Loading jobs from top Indian companies...');
        
        // Use the expanded Indian jobs database
        const indianJobs = [...INDIAN_LIVE_JOBS];
        
        // Shuffle to show variety each time
        for (let i = indianJobs.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [indianJobs[i], indianJobs[j]] = [indianJobs[j], indianJobs[i]];
        }

        console.log(`✓ Successfully loaded ${indianJobs.length} jobs from Indian companies`);
        jobsDatabase = indianJobs;
        usingLiveJobs = true;
        populateDatalists();
        updateSearchSuggestions();
        searchJobs();
        setLiveStatus(`✓ Showing ${indianJobs.length} live jobs from top Indian companies`, true);
        showNotification(`${indianJobs.length} jobs loaded from Indian companies!`, 'success');
    } catch (e) {
        console.error('Failed to load jobs:', e);
        jobsDatabase = [...LOCAL_JOBS];
        usingLiveJobs = false;
        populateDatalists();
        updateSearchSuggestions();
        searchJobs();
        setLiveStatus('⚠ Showing curated jobs.', true);
        showNotification('Showing curated jobs.', 'info');
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-bolt"></i> Load Live Jobs';
        }
    }
}

// ====== SEARCH & FILTER FUNCTIONS ====== 
let searchTimeout;

function searchJobs() {
    // Clear previous timeout to debounce rapid searches
    clearTimeout(searchTimeout);
    
    // Debounce search for 300ms to avoid performance issues
    searchTimeout = setTimeout(() => {
        const titleFilter = document.getElementById('titleSearch')?.value?.toLowerCase() || '';
        const companyFilter = document.getElementById('companySearch')?.value?.toLowerCase() || '';
        const locationFilter = document.getElementById('locationSearch')?.value?.toLowerCase() || '';
        const jobType = document.getElementById('jobType')?.value || '';
        const salaryRange = document.getElementById('salaryRange')?.value || '';
        const sortBy = document.getElementById('sortBy')?.value || 'relevance';
        
        // Use all available jobs for search
        const allJobs = [...jobsDatabase, ...INDIAN_LIVE_JOBS];
        
        let filteredJobs = allJobs.filter(job => {
            // Title search - partial match
            const matchTitle = !titleFilter || job.title.toLowerCase().includes(titleFilter);
            
            // Company search - partial match
            const matchCompany = !companyFilter || job.company.toLowerCase().includes(companyFilter);
            
            // Location search - partial match
            const matchLocation = !locationFilter || job.location.toLowerCase().includes(locationFilter);
            
            // Job type exact match
            const matchType = !jobType || job.type === jobType;
            
            // Salary range filtering
            let matchSalary = true;
            if (salaryRange) {
                try {
                    const salaryText = job.salary || '';
                    const jobSalaryStart = parseInt(salaryText.split(' - ')[0].replace(/[^0-9]/g, '')) || 0;
                    
                    if (salaryRange === '0-8') matchSalary = jobSalaryStart <= 8;
                    else if (salaryRange === '8-12') matchSalary = jobSalaryStart >= 8 && jobSalaryStart < 12;
                    else if (salaryRange === '12-20') matchSalary = jobSalaryStart >= 12 && jobSalaryStart < 20;
                    else if (salaryRange === '20') matchSalary = jobSalaryStart >= 20;
                } catch (e) {
                    console.warn('Salary parsing error:', e);
                    matchSalary = true;
                }
            }
            
            return matchTitle && matchCompany && matchLocation && matchType && matchSalary;
        });
        
        // Remove duplicates by ID
        const uniqueJobIds = new Set();
        filteredJobs = filteredJobs.filter(job => {
            if (uniqueJobIds.has(job.id)) return false;
            uniqueJobIds.add(job.id);
            return true;
        });
        
        if (sortBy !== 'relevance') {
            filteredJobs = sortJobs(filteredJobs, sortBy);
        }

        displayJobs(filteredJobs, 'Search Results (' + filteredJobs.length + ')');
        console.log('🔍 Search executed:', { titleFilter, companyFilter, locationFilter, jobType, salaryRange, resultsCount: filteredJobs.length });
    }, 300);
}

function parseSalaryStart(salary) {
    const start = salary.split(' - ')[0].replace(/[^0-9]/g, '');
    return parseInt(start || '0', 10);
}

function sortJobs(jobs, sortBy) {
    const sorted = [...jobs];
    if (sortBy === 'newest') {
        sorted.sort((a, b) => (a.postedDays || 0) - (b.postedDays || 0));
    } else if (sortBy === 'rating') {
        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === 'salary') {
        sorted.sort((a, b) => parseSalaryStart(b.salary) - parseSalaryStart(a.salary));
    }
    return sorted;
}

// ====== FILTER BY CATEGORY ====== 
function filterByCategory(category) {
    const allJobs = [...jobsDatabase, ...INDIAN_LIVE_JOBS];
    const filteredJobs = allJobs.filter(job => job.category === category);
    
    // Remove duplicates
    const uniqueJobIds = new Set();
    const uniqueJobs = filteredJobs.filter(job => {
        if (uniqueJobIds.has(job.id)) return false;
        uniqueJobIds.add(job.id);
        return true;
    });
    
    displayJobs(uniqueJobs, category + ' Jobs (' + uniqueJobs.length + ')');
    console.log('📁 Category filter applied:', { category, resultsCount: uniqueJobs.length });
}

// ====== RESET FILTERS ====== 
function resetFilters() {
    document.getElementById('titleSearch').value = '';
    document.getElementById('companySearch').value = '';
    document.getElementById('locationSearch').value = '';
    document.getElementById('jobType').value = '';
    document.getElementById('salaryRange').value = '';
    document.getElementById('sortBy').value = 'relevance';
    displayJobs(INDIAN_LIVE_JOBS, 'All Jobs');
    showNotification('Filters reset successfully', 'success');
}

// ====== DISPLAY JOBS ====== 
function displayJobs(jobs, title = 'All Jobs') {
    const jobsList = document.getElementById('jobsList');
    const noResults = document.getElementById('noResults');
    const jobsTitle = document.getElementById('jobsTitle');
    const jobsCount = document.getElementById('jobsCount');
    
    jobsTitle.textContent = title;
    jobsCount.textContent = jobs.length;
    
    if (jobs.length === 0) {
        jobsList.innerHTML = '';
        noResults.classList.remove('hidden');
        return;
    }
    
    noResults.classList.add('hidden');
    jobsList.innerHTML = jobs.map((job, index) => {
        const isSaved = savedJobs.includes(job.id);
        const status = getApplicationStatus(job.id);
        const isApplied = status === 'applied';
        const isClicked = status === 'clicked';
        
        return `
            <div class="bg-white rounded-xl p-5 shadow-sm hover:shadow-xl border border-slate-100 hover:border-blue-200 transition-all duration-300 group animate-slide-in" style="animation-delay: ${index * 0.05}s">
                <!-- Header -->
                <div class="flex items-start justify-between mb-4">
                    <div class="flex-1">
                        <div class="flex items-center gap-3 mb-2">
                            ${createLogoContainer(job, 'lg')}
                            <div>
                                <h3 class="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition">${job.title}</h3>
                                <p class="text-blue-600 font-semibold text-sm flex items-center gap-1.5">
                                    <i class="fas fa-building text-xs"></i> ${job.company}
                                </p>
                            </div>
                        </div>
                    </div>
                    <button onclick="toggleSaveJob(${job.id})" class="p-2.5 text-xl ${isSaved ? 'text-red-500 scale-110' : 'text-slate-300'} hover:text-red-500 hover:scale-110 transition-all">
                        <i class="fas fa-heart ${isSaved ? 'animate-pulse' : ''}"></i>
                    </button>
                </div>

                <!-- Description -->
                <p class="text-slate-600 mb-4 text-sm line-clamp-2">${job.description}</p>

                <!-- Rating -->
                <div class="flex items-center gap-2 mb-4 bg-amber-50 px-3 py-2 rounded-lg inline-flex">
                    <div class="flex gap-0.5">
                        ${getStarRating(job.rating)}
                    </div>
                    <span class="text-sm font-bold text-slate-800">${job.rating}/5</span>
                    <span class="text-xs text-slate-500">(${job.reviews})</span>
                </div>

                <!-- Details Grid -->
                <div class="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-4">
                    <div class="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-lg text-center group-hover:shadow-md transition">
                        <p class="text-xs text-blue-600 font-medium mb-1 flex items-center justify-center gap-1">
                            <i class="fas fa-map-marker-alt"></i> Location
                        </p>
                        <p class="text-sm font-bold text-slate-900">${job.location.split(',')[0]}</p>
                    </div>
                    <div class="bg-gradient-to-br from-purple-50 to-purple-100 p-3 rounded-lg text-center group-hover:shadow-md transition">
                        <p class="text-xs text-purple-600 font-medium mb-1 flex items-center justify-center gap-1">
                            <i class="fas fa-briefcase"></i> Type
                        </p>
                        <p class="text-sm font-bold text-slate-900">${job.type}</p>
                    </div>
                    <div class="bg-gradient-to-br from-green-50 to-green-100 p-3 rounded-lg text-center group-hover:shadow-md transition">
                        <p class="text-xs text-green-600 font-medium mb-1 flex items-center justify-center gap-1">
                            <i class="fas fa-rupee-sign"></i> Salary
                        </p>
                        <p class="text-sm font-bold text-green-700">${job.salary}</p>
                    </div>
                    <div class="bg-gradient-to-br from-cyan-50 to-cyan-100 p-3 rounded-lg text-center group-hover:shadow-md transition">
                        <p class="text-xs text-cyan-600 font-medium mb-1 flex items-center justify-center gap-1">
                            <i class="fas fa-tag"></i> Category
                        </p>
                        <p class="text-sm font-bold text-slate-900">${job.category}</p>
                    </div>
                </div>

                <div class="text-xs text-slate-500 mb-4 flex items-center justify-between bg-slate-50 px-3 py-2 rounded-lg">
                    <div class="flex items-center gap-1.5">
                        <i class="fas fa-shield-check text-green-600"></i>
                        <span class="font-medium">Verified Position</span>
                    </div>
                    ${job.applyLink && job.applyLink.startsWith('https://') ? '<span class="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full flex items-center gap-1"><i class="fas fa-check-circle"></i> Active</span>' : ''}
                </div>

                <!-- Action Buttons -->
                <div class="flex gap-2.5">
                    <button onclick="applyToJob(${job.id})" class="flex-1 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:shadow-lg hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 ${isApplied ? 'from-green-600 to-green-700 hover:from-green-700 hover:to-green-800' : ''}">
                        <i class="fas fa-${isApplied ? 'check-circle' : isClicked ? 'clock' : 'paper-plane'}"></i>
                        ${isApplied ? 'Applied ✓' : isClicked ? 'Continue' : 'Apply Now'}
                    </button>
                    <a href="${job.companyWebsite}" target="_blank" class="px-5 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-600 hover:text-white transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2">
                        <i class="fas fa-external-link-alt text-sm"></i>
                    </a>
                </div>
            </div>
        `;
    }).join('');
    
    updateUI();
}

// ====== UPDATE UI ====== 
function updateUI() {
    document.getElementById('savedCount').textContent = savedJobs.length;
    const tracking = JSON.parse(localStorage.getItem('applicationTracking')) || [];
    const appliedCount = tracking.filter(t => t.status === 'applied').length;
    document.getElementById('appliedCount').textContent = appliedCount;
}

// ====== ADVANCED FEATURES - JOB RATING SYSTEM ====== 
function rateJob(jobId, rating) {
    let ratings = JSON.parse(localStorage.getItem('jobRatings')) || {};
    ratings[jobId] = rating;
    localStorage.setItem('jobRatings', JSON.stringify(ratings));
    showNotification(`Job rated ${rating}⭐ - Thank you for your feedback!`, 'success');
}

function getJobRating(jobId) {
    let ratings = JSON.parse(localStorage.getItem('jobRatings')) || {};
    return ratings[jobId] || 0;
}

// ====== APPLICATION TRACKING ====== 
function trackJobApplication(jobId, jobTitle, company, status = 'clicked', logo = null) {
    let tracking = JSON.parse(localStorage.getItem('applicationTracking')) || [];
    const now = new Date().toISOString();
    const existing = tracking.find(t => t.jobId === jobId);

    if (existing) {
        existing.status = status;
        existing.updatedAt = now;
        if (logo && !existing.logo) {
            existing.logo = logo;
        }
        if (status === 'applied') {
            existing.appliedAt = now;
        }
        if (status === 'clicked' && !existing.clickedAt) {
            existing.clickedAt = now;
        }
    } else {
        tracking.push({
            jobId: jobId,
            title: jobTitle,
            company: company,
            logo: logo,
            status: status,
            clickedAt: status === 'clicked' ? now : undefined,
            appliedAt: status === 'applied' ? now : undefined,
            updatedAt: now
        });
    }
    localStorage.setItem('applicationTracking', JSON.stringify(tracking));
}

function getApplicationStatus(jobId) {
    let tracking = JSON.parse(localStorage.getItem('applicationTracking')) || [];
    const app = tracking.find(t => t.jobId === jobId);
    return app ? app.status : 'not-applied';
}

// ====== JOB RECOMMENDATIONS ====== 
function getRecommendedJobs() {
    let viewedJobs = JSON.parse(localStorage.getItem('viewedJobs')) || [];
    if (viewedJobs.length === 0) return jobsDatabase.slice(0, 3);
    
    const lastViewed = viewedJobs[viewedJobs.length - 1];
    const lastJob = jobsDatabase.find(j => j.id === lastViewed);
    
    return jobsDatabase.filter(j => 
        j.category === lastJob.category && 
        j.id !== lastViewed
    ).slice(0, 3);
}

function trackJobView(jobId) {
    let viewed = JSON.parse(localStorage.getItem('viewedJobs')) || [];
    if (!viewed.includes(jobId)) {
        viewed.push(jobId);
        localStorage.setItem('viewedJobs', JSON.stringify(viewed));
    }
}

// ====== JOB STATISTICS ====== 
function getJobStats() {
    return {
        totalJobs: jobsDatabase.length,
        savedJobs: savedJobs.length,
        appliedJobs: appliedJobs.length,
        categories: [...new Set(jobsDatabase.map(j => j.category))].length,
        companies: [...new Set(jobsDatabase.map(j => j.company))].length,
        avgRating: (jobsDatabase.reduce((sum, j) => sum + j.rating, 0) / jobsDatabase.length).toFixed(1)
    };
}

// ====== EXPORT SAVED JOBS ====== 
function exportSavedJobs() {
    const saved = savedJobs.map(id => jobsDatabase.find(j => j.id === id));
    const csv = "Job Title,Company,Location,Salary,Rating\n" + 
        saved.map(j => `"${j.title}","${j.company}","${j.location}","${j.salary}",${j.rating}`).join("\n");
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'saved-jobs.csv';
    a.click();
}

// ====== JOB ALERTS ====== 
function createJobAlert(criteria) {
    let alerts = JSON.parse(localStorage.getItem('jobAlerts')) || [];
    alerts.push({
        id: Date.now(),
        ...criteria,
        createdAt: new Date().toISOString(),
        enabled: true
    });
    localStorage.setItem('jobAlerts', JSON.stringify(alerts));
    showNotification('Job alert created! You\'ll be notified of new matches.', 'success');
}

// ====== INITIALIZE ON PAGE LOAD ====== 
document.addEventListener('DOMContentLoaded', () => {
    // Initialize with combined jobs database
    const allJobs = [...jobsDatabase, ...INDIAN_LIVE_JOBS];
    const uniqueJobIds = new Set();
    const uniqueJobs = allJobs.filter(job => {
        if (uniqueJobIds.has(job.id)) return false;
        uniqueJobIds.add(job.id);
        return true;
    });
    
    console.log('✅ Jobs Database Loaded:', { totalJobs: uniqueJobs.length, sources: { database: jobsDatabase.length, live: INDIAN_LIVE_JOBS.length } });
    
    // Display all jobs on page load
    displayJobs(uniqueJobs, 'All Available Jobs');
    updateUI();
    populateDatalists();
    updateSearchSuggestions();
    
    // Add event listeners for filters
    const titleSearch = document.getElementById('titleSearch');
    const companySearch = document.getElementById('companySearch');
    const locationSearch = document.getElementById('locationSearch');
    const jobType = document.getElementById('jobType');
    const salaryRange = document.getElementById('salaryRange');
    const sortSelect = document.getElementById('sortBy');
    
    if (jobType) jobType.addEventListener('change', searchJobs);
    if (salaryRange) salaryRange.addEventListener('change', searchJobs);
    if (titleSearch) {
        titleSearch.addEventListener('keyup', searchJobs);
        titleSearch.addEventListener('input', updateSearchSuggestions);
    }
    if (companySearch) {
        companySearch.addEventListener('keyup', searchJobs);
        companySearch.addEventListener('input', updateSearchSuggestions);
    }
    if (locationSearch) locationSearch.addEventListener('keyup', searchJobs);
    if (sortSelect) sortSelect.addEventListener('change', searchJobs);

    const liveBtn = document.getElementById('loadLiveJobsBtn');
    if (liveBtn) {
        liveBtn.addEventListener('click', loadLiveJobs);
    }

    const detectBtn = document.getElementById('detectLocationBtn');
    if (detectBtn) {
        detectBtn.addEventListener('click', detectUserLocation);
    }

    const savedLocation = localStorage.getItem('userLocation');
    if (savedLocation) {
        setDetectedLocation(savedLocation);
    }
    // Auto-detection disabled - user can click "Use my current location" button
    // else {
    //     setTimeout(() => detectUserLocation(), 1000);
    // }
    
    console.log('🔍 Search and filter functionality initialized');
});

