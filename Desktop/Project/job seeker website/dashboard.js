// Dashboard Analytics and Statistics

class DashboardAnalytics {
    constructor() {
        this.applications = JSON.parse(localStorage.getItem('jobApplications')) || [];
        this.savedJobs = JSON.parse(localStorage.getItem('savedJobs')) || [];
        this.savedJobsDetails = JSON.parse(localStorage.getItem('savedJobsDetails')) || [];
        this.appliedJobs = JSON.parse(localStorage.getItem('appliedJobs')) || [];
        this.applicationTracking = JSON.parse(localStorage.getItem('applicationTracking')) || [];
        this.viewedJobs = JSON.parse(localStorage.getItem('viewedJobs')) || [];
        
        // Job Seeker Profile
        this.seekerProfile = {
            name: localStorage.getItem('userName') || 'Sonu Kumar Suman',
            email: localStorage.getItem('userEmail') || 'sonu@example.com',
            phone: localStorage.getItem('userPhone') || '+91 98765-43210',
            location: localStorage.getItem('userLocation') || 'Bengaluru, Karnataka',
            accountType: localStorage.getItem('userAccountType') || 'job-seeker',
            skills: JSON.parse(localStorage.getItem('userSkills')) || ['JavaScript', 'React', 'Web Development'],
            experience: JSON.parse(localStorage.getItem('userExperience')) || [
                { title: 'Junior Web Developer', company: 'TCS', duration: '1-2 Years' },
                { title: 'B.Tech in Computer Science', company: 'University', duration: '2024 Passed Out' }
            ],
            education: JSON.parse(localStorage.getItem('userEducation')) || [],
            resume: localStorage.getItem('userResume') || null,
            profilePhoto: localStorage.getItem('userProfilePhoto') || null,
            bio: localStorage.getItem('userBio') || 'Passionate job seeker looking for exciting opportunities',
            loggedInAt: localStorage.getItem('loggedInAt') || new Date().toISOString()
        };
    }

    getTotalStats() {
        return {
            totalApplications: this.applications.length + this.appliedJobs.length,
            totalSaved: this.savedJobs.length + this.savedJobsDetails.length,
            totalApplied: this.appliedJobs.length,
            totalViewed: this.viewedJobs.length,
            profileCompletion: this.getProfileCompletion()
        };
    }

    getProfileCompletion() {
        let completion = 0;
        const profile = this.seekerProfile;

        if (profile.name && profile.name !== 'User') completion += 15;
        if (profile.email) completion += 15;
        if (profile.phone) completion += 10;
        if (profile.location) completion += 10;
        if (profile.skills && profile.skills.length > 0) completion += 15;
        if (profile.experience && profile.experience.length > 0) completion += 15;
        if (profile.profilePhoto) completion += 10;

        return Math.min(completion, 100);
    }

    getRecentApplications(limit = 5) {
        const appliedTracking = this.applicationTracking.filter(t => t.status === 'applied');
        if (appliedTracking.length) {
            return appliedTracking.slice(-limit).reverse();
        }
        return this.applications.slice(-limit).reverse();
    }

    getSeekerProfile() {
        return this.seekerProfile;
    }

    updateSeekerProfile(updates) {
        this.seekerProfile = { ...this.seekerProfile, ...updates };
        
        // Save to localStorage
        localStorage.setItem('userName', this.seekerProfile.name);
        localStorage.setItem('userEmail', this.seekerProfile.email);
        localStorage.setItem('userPhone', this.seekerProfile.phone);
        localStorage.setItem('userLocation', this.seekerProfile.location);
        localStorage.setItem('userSkills', JSON.stringify(this.seekerProfile.skills));
        localStorage.setItem('userExperience', JSON.stringify(this.seekerProfile.experience));
        localStorage.setItem('userBio', this.seekerProfile.bio);
        if (updates.profilePhoto !== undefined) {
            localStorage.setItem('userProfilePhoto', this.seekerProfile.profilePhoto || '');
        }
        
        return this.seekerProfile;
    }

    addSkill(skill) {
        if (!this.seekerProfile.skills.includes(skill)) {
            this.seekerProfile.skills.push(skill);
            localStorage.setItem('userSkills', JSON.stringify(this.seekerProfile.skills));
        }
    }

    removeSkill(skill) {
        this.seekerProfile.skills = this.seekerProfile.skills.filter(s => s !== skill);
        localStorage.setItem('userSkills', JSON.stringify(this.seekerProfile.skills));
    }

    addExperience(exp) {
        this.seekerProfile.experience.push(exp);
        localStorage.setItem('userExperience', JSON.stringify(this.seekerProfile.experience));
    }

    getApplicationTrends() {
        const trends = {};
        this.applications.forEach(app => {
            const date = new Date(app.timestamp).toLocaleDateString();
            trends[date] = (trends[date] || 0) + 1;
        });
        return trends;
    }

    getMostActiveCategory() {
        const categories = {};
        // Would need job database for this
        return categories;
    }
}

const analytics = new DashboardAnalytics();

// Initialize Dashboard
document.addEventListener('DOMContentLoaded', function() {
    loadSeekerProfile();
    updateDashboard();
    displayRecentApplications();
    displaySavedJobs();
    displayActivityTimeline();
});

function loadSeekerProfile() {
    const profile = analytics.getSeekerProfile();
    
    // Update profile photo in dashboard header
    const profilePhotoElement = document.getElementById('profilePhoto');
    if (profilePhotoElement && profile.profilePhoto) {
        profilePhotoElement.src = profile.profilePhoto;
        profilePhotoElement.classList.remove('hidden');
        const placeholder = profilePhotoElement.parentElement.querySelector('[class*="fa-user"]');
        if (placeholder) {
            placeholder.parentElement?.classList.add('hidden');
        }
    }
    
    // Update profile photo in navigation bar
    const navProfilePhoto = document.getElementById('navProfilePhoto');
    const navProfileIcon = document.getElementById('navProfileIcon');
    if (navProfilePhoto && profile.profilePhoto) {
        navProfilePhoto.src = profile.profilePhoto;
        navProfilePhoto.classList.remove('hidden');
        if (navProfileIcon) {
            navProfileIcon.classList.add('hidden');
        }
    }
    
    // Update profile display
    document.getElementById('seekerName').textContent = profile.name;
    document.getElementById('seekerEmail').textContent = profile.email;
    document.getElementById('seekerPhone').textContent = profile.phone;
    document.getElementById('seekerLocation').textContent = '📍 ' + profile.location;
    document.getElementById('memberSince').textContent = new Date(profile.loggedInAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short' });
    
    // Update skills
    const skillsList = document.getElementById('skillsList');
    if (profile.skills && profile.skills.length > 0) {
        const skillsHTML = profile.skills.map(skill => `
            <div class="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-full border-2 border-blue-200 shadow-sm hover:shadow-md transition">
                <i class="fas fa-star text-yellow-500 text-sm"></i>
                <span class="font-semibold text-slate-900">${skill}</span>
                <button type="button" onclick="removeSkill('${skill}')" class="text-slate-500 hover:text-red-600 text-lg transition">✕</button>
            </div>
        `).join('') + `
            <button onclick="addSkill()" class="inline-flex items-center gap-1 px-4 py-2 border-2 border-blue-300 text-blue-600 rounded-full font-semibold text-sm hover:bg-blue-50 transition">
                <i class="fas fa-plus"></i> Add Skill
            </button>
        `;
        skillsList.innerHTML = skillsHTML;
    }
    
    // Update experience
    const expList = document.getElementById('experienceList');
    if (profile.experience && profile.experience.length > 0) {
        const expHTML = profile.experience.map((exp, index) =>
            `<div class="pb-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-transparent p-4 rounded-lg hover:shadow-md transition">
                <div class="flex items-start justify-between">
                    <div class="flex-1">
                        <div class="flex items-center gap-2 mb-1">
                            <i class="fas fa-briefcase text-blue-600 text-lg"></i>
                            <p class="font-bold text-slate-900 text-lg">${exp.title || 'Position'}</p>
                        </div>
                        <div class="flex items-center gap-2 text-slate-600 mb-1">
                            <i class="fas fa-building text-green-600"></i>
                            <p class="text-sm">${exp.company || 'Company'}</p>
                        </div>
                        <div class="flex items-center gap-2 text-slate-600">
                            <i class="fas fa-calendar text-purple-600"></i>
                            <p class="text-sm font-medium">${exp.duration || 'Duration'}</p>
                        </div>
                        ${exp.description ? `<p class="text-slate-600 text-sm mt-2 pl-6 border-l-2 border-slate-300 italic">"${exp.description}"</p>` : ''}
                    </div>
                    <button type="button" onclick="removeExperience(${index})" class="ml-2 px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg transition font-semibold text-sm">
                        <i class="fas fa-trash"></i> Remove
                    </button>
                </div>
            </div>`
        ).join('');
        expList.innerHTML = expHTML + `
            <button onclick="addExperience()" class="w-full px-4 py-3 border-2 border-blue-300 text-blue-600 rounded-lg font-bold hover:bg-blue-50 transition flex items-center justify-center gap-2 mt-2">
                <i class="fas fa-plus text-lg"></i> Add Experience
            </button>
        `;
    }
}

function updateDashboard() {
    const stats = analytics.getTotalStats();
    
    document.getElementById('totalApps').textContent = stats.totalApplications;
    document.getElementById('savedCount').textContent = stats.totalSaved;
    document.getElementById('appliedCount').textContent = stats.totalApplied;
    
    const completion = stats.profileCompletion;
    document.getElementById('profilePercent').textContent = completion + '%';
    const profileBar = document.getElementById('profileBar');
    if (profileBar) {
        profileBar.querySelector('div').style.width = completion + '%';
    }
}

function displayRecentApplications() {
    const apps = analytics.getRecentApplications();
    const container = document.getElementById('recentApps');
    
    if (apps.length === 0) {
        container.innerHTML = '<p class="text-slate-600 text-center py-8">No applications yet. Start applying to jobs!</p>';
        return;
    }

    container.innerHTML = apps.map(app => {
        const title = app.title || app.position || 'Position Not Specified';
        const company = app.company ? ` • ${app.company}` : '';
        const status = (app.status || 'applied').toLowerCase();
        const time = app.appliedAt || app.clickedAt || app.updatedAt || app.timestamp;
        const badge = status === 'applied'
            ? 'bg-green-100 text-green-700'
            : status === 'clicked'
                ? 'bg-amber-100 text-amber-700'
                : status === 'pending'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-slate-100 text-slate-700';
        const label = status === 'applied'
            ? 'Applied'
            : status === 'clicked'
                ? 'Clicked'
                : status === 'pending'
                    ? 'Pending'
                    : status.charAt(0).toUpperCase() + status.slice(1);
        return `
        <div class="flex items-start justify-between p-4 border border-slate-200 rounded-lg hover:border-primary hover:bg-slate-50 transition">
            <div class="flex-1 flex items-start gap-3">
                <div class="w-10 h-10 bg-slate-100 rounded-md flex items-center justify-center flex-shrink-0 overflow-hidden mt-0.5">
                    <img src="${app.logo || '#'}" alt="${app.company}" class="w-full h-full object-contain p-0.5" onerror="this.style.display='none'; this.parentElement.innerHTML='<div class=\"w-full h-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xs\">${app.company.charAt(0)}</div>'" />
                </div>
                <div class="flex-1">
                    <h3 class="font-bold text-slate-900">
                        ${title}
                    </h3>
                    <p class="text-sm text-slate-600 flex items-center gap-1 mt-1">
                        <i class="fas fa-calendar text-slate-400"></i> ${time ? new Date(time).toLocaleDateString() : ''}${company ? ` • ${company}` : ''}
                    </p>
                </div>
            </div>
                </p>
            </div>
            <span class="px-3 py-1 ${badge} text-sm font-bold rounded-full">${label}</span>
        </div>
    `;
    }).join('');
}

function displaySavedJobs() {
    const container = document.getElementById('savedJobsList');

    if (analytics.savedJobsDetails.length === 0) {
        container.innerHTML = '<p class="text-slate-600 text-center py-8">You haven\'t saved any jobs yet.</p>';
        return;
    }

    container.innerHTML = analytics.savedJobsDetails.map((job) => `
        <div class="flex items-start justify-between p-4 border border-slate-200 rounded-lg hover:border-primary hover:bg-slate-50 transition">
            <div class="flex-1 flex items-start gap-3">
                <div class="w-10 h-10 bg-slate-100 rounded-md flex items-center justify-center flex-shrink-0 overflow-hidden mt-0.5">
                    <img src="${job.logo || '#'}" alt="${job.company}" class="w-full h-full object-contain p-0.5" onerror="this.style.display='none'; this.parentElement.innerHTML='<div class=\"w-full h-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xs\">${job.company.charAt(0)}</div>'" />
                </div>
                <div class="flex-1">
                    <h3 class="font-bold text-slate-900">${job.title}</h3>
                    <p class="text-sm text-slate-600 flex items-center gap-1 mt-1">
                        <span>${job.company}</span> • ${job.location}
                    </p>
                </div>
            </div>
            <div class="flex gap-2">
                <a href="${job.companyWebsite}" target="_blank" class="px-3 py-1 bg-blue-100 text-primary text-sm font-bold rounded-lg hover:bg-blue-200 transition">
                    <i class="fas fa-external-link-alt"></i> View
                </a>
                <button onclick="removeSavedJob(${job.id})" class="px-3 py-1 bg-red-100 text-red-600 text-sm font-bold rounded-lg hover:bg-red-200 transition">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function displayActivityTimeline() {
    const container = document.getElementById('timeline');
    const allEvents = [];

    // Combine all events
    analytics.applicationTracking.forEach(app => {
        const status = (app.status || 'applied').toLowerCase();
        const title = status === 'applied'
            ? 'Applied to Job'
            : status === 'clicked'
                ? 'Opened Application'
                : status === 'pending'
                    ? 'Application Submitted'
                    : 'Application Update';
        const time = app.appliedAt || app.clickedAt || app.updatedAt || app.timestamp || Date.now();
        allEvents.push({
            type: 'application',
            title: title,
            description: `${app.title || 'Position'}${app.company ? ' • ' + app.company : ''}`,
            logo: app.logo,
            company: app.company,
            timestamp: new Date(time),
            icon: status === 'clicked' ? 'fa-arrow-up-right-from-square' : 'fa-file-alt',
            color: status === 'clicked' ? 'amber' : 'blue'
        });
    });

    analytics.savedJobsDetails.forEach(job => {
        allEvents.push({
            type: 'save',
            title: 'Saved Job',
            description: `${job.title} • ${job.company}`,
            logo: job.logo,
            company: job.company,
            timestamp: new Date(job.savedAt || Date.now()),
            icon: 'fa-heart',
            color: 'red'
        });
    });

    // Sort by timestamp (newest first)
    allEvents.sort((a, b) => b.timestamp - a.timestamp);

    // Display timeline (show latest 10 events)
    if (container) {
        container.innerHTML = allEvents.slice(0, 10).map(event => `
            <div class="flex gap-4 items-start">
                <div class="flex-shrink-0 w-10 h-10 rounded-full bg-${event.color}-100 flex items-center justify-center">
                    <i class="fas ${event.icon} text-${event.color}-600"></i>
                </div>
                <div class="flex-1">
                    <p class="font-semibold text-slate-900">${event.title}</p>
                    <p class="text-sm text-slate-600">${event.description}</p>
                    <p class="text-xs text-slate-500 mt-1">${event.timestamp.toLocaleString()}</p>
                </div>
            </div>
        `).join('');
    }
}

// ====== PROFILE MANAGEMENT FUNCTIONS ======

function editProfile() {
    const profile = analytics.getSeekerProfile();
    
    // Create WOW modal HTML with amazing design
    const modalHTML = `
        <div id="editProfileModal" class="fixed inset-0 bg-gradient-to-br from-black/60 to-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
            <div class="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden relative">
                <!-- Decorative Background Elements -->
                <div class="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl -mr-48 -mt-48"></div>
                <div class="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-purple-400/20 to-pink-400/20 rounded-full blur-3xl -ml-40 -mb-40"></div>
                
                <!-- Header Section -->
                <div class="relative z-10 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 p-8 sticky top-0">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-4">
                            <div class="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-lg">
                                <i class="fas fa-user-edit text-3xl text-white"></i>
                            </div>
                            <div>
                                <h2 class="text-3xl font-black text-white drop-shadow-lg">Edit Your Profile</h2>
                                <p class="text-blue-100 text-sm font-medium mt-1">Update your professional information</p>
                            </div>
                        </div>
                        <button onclick="closeEditModal()" class="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-xl flex items-center justify-center hover:bg-white/30 transition-all duration-300 text-white hover:rotate-90" type="button">
                            <i class="fas fa-times text-2xl"></i>
                        </button>
                    </div>
                </div>

                <!-- Content Section with Beautiful Scroll -->
                <div class="p-8 overflow-y-auto max-h-[calc(95vh-140px)] relative z-10 custom-scrollbar">
                    <!-- Profile Photo Section - Premium Design -->
                    <div class="text-center mb-10">
                        <div class="inline-block relative">
                            <label class="cursor-pointer block">
                                <div class="w-40 h-40 rounded-3xl bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-2xl hover:shadow-3xl transition-all duration-500 relative group hover:scale-105">
                                    <img id="profilePhotoPreview" src="" alt="Profile" class="w-full h-full object-cover hidden">
                                    <div id="profilePhotoPlaceholder" class="text-6xl text-blue-400">
                                        <i class="fas fa-user-circle"></i>
                                    </div>
                                    <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                                        <div class="text-center">
                                            <i class="fas fa-camera text-4xl text-white mb-2"></i>
                                            <p class="text-white text-sm font-bold">Change Photo</p>
                                        </div>
                                    </div>
                                </div>
                                <input type="file" id="profilePhotoInput" accept="image/*" class="hidden" onchange="handleProfilePhotoChange(event)">
                            </label>
                            
                            <!-- Floating Badge -->
                            <div class="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full shadow-lg">
                                Profile Photo
                            </div>
                        </div>
                        
                        <!-- Photo Action Buttons - Modern Design -->
                        <div class="flex gap-3 justify-center mt-8">
                            <button type="button" class="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-bold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105" onclick="document.getElementById('profilePhotoInput').click()">
                                <i class="fas fa-cloud-upload-alt text-lg group-hover:scale-110 transition-transform"></i> 
                                <span>Upload</span>
                            </button>
                            <button type="button" class="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105" onclick="captureCamera()">
                                <i class="fas fa-camera text-lg group-hover:scale-110 transition-transform"></i> 
                                <span>Camera</span>
                            </button>
                            <button type="button" class="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl font-bold hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105" onclick="showAvatarSelector()">
                                <i class="fas fa-icons text-lg group-hover:scale-110 transition-transform"></i> 
                                <span>Avatar</span>
                            </button>
                        </div>
                        
                        <button type="button" id="removePhotoBtn" class="mt-4 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-semibold text-sm transition-all duration-300 hidden hover:scale-105" onclick="removeProfilePhoto()">
                            <i class="fas fa-trash-alt mr-1"></i> Remove Photo
                        </button>
                    </div>

                    <!-- Avatar Selector Modal -->
                    <div id="avatarSelectorModal" class="hidden fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[60] p-4">
                        <div class="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden">
                            <div class="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 p-6 flex justify-between items-center">
                                <h3 class="text-2xl font-black text-white flex items-center gap-3">
                                    <i class="fas fa-palette"></i> Choose Your Avatar
                                </h3>
                                <button type="button" class="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center hover:bg-white/30 transition text-white hover:rotate-90" onclick="closeAvatarSelector()">
                                    <i class="fas fa-times text-xl"></i>
                                </button>
                            </div>
                            <div class="p-8 grid grid-cols-4 gap-4 max-h-96 overflow-y-auto custom-scrollbar">
                                <button type="button" class="avatar-option p-4 rounded-2xl hover:bg-gradient-to-br hover:from-blue-50 hover:to-cyan-50 transition-all duration-300 hover:scale-110 hover:shadow-lg" onclick="selectAvatar('👨‍💼')">
                                    <span class="text-5xl">👨‍💼</span>
                                </button>
                                <button type="button" class="avatar-option p-4 rounded-2xl hover:bg-gradient-to-br hover:from-pink-50 hover:to-purple-50 transition-all duration-300 hover:scale-110 hover:shadow-lg" onclick="selectAvatar('👩‍💼')">
                                    <span class="text-5xl">👩‍💼</span>
                                </button>
                                <button type="button" class="avatar-option p-4 rounded-2xl hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 hover:scale-110 hover:shadow-lg" onclick="selectAvatar('👨‍💻')">
                                    <span class="text-5xl">👨‍💻</span>
                                </button>
                                <button type="button" class="avatar-option p-4 rounded-2xl hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 transition-all duration-300 hover:scale-110 hover:shadow-lg" onclick="selectAvatar('👩‍💻')">
                                    <span class="text-5xl">👩‍💻</span>
                                </button>
                                <button type="button" class="avatar-option p-4 rounded-2xl hover:bg-gradient-to-br hover:from-green-50 hover:to-emerald-50 transition-all duration-300 hover:scale-110 hover:shadow-lg" onclick="selectAvatar('🧑‍🎓')">
                                    <span class="text-5xl">🧑‍🎓</span>
                                </button>
                                <button type="button" class="avatar-option p-4 rounded-2xl hover:bg-gradient-to-br hover:from-orange-50 hover:to-red-50 transition-all duration-300 hover:scale-110 hover:shadow-lg" onclick="selectAvatar('👨‍🎨')">
                                    <span class="text-5xl">👨‍🎨</span>
                                </button>
                                <button type="button" class="avatar-option p-4 rounded-2xl hover:bg-gradient-to-br hover:from-pink-50 hover:to-rose-50 transition-all duration-300 hover:scale-110 hover:shadow-lg" onclick="selectAvatar('👩‍🎨')">
                                    <span class="text-5xl">👩‍🎨</span>
                                </button>
                                <button type="button" class="avatar-option p-4 rounded-2xl hover:bg-gradient-to-br hover:from-cyan-50 hover:to-blue-50 transition-all duration-300 hover:scale-110 hover:shadow-lg" onclick="selectAvatar('🧑‍🔬')">
                                    <span class="text-5xl">🧑‍🔬</span>
                                </button>
                                <button type="button" class="avatar-option p-4 rounded-2xl hover:bg-gradient-to-br hover:from-amber-50 hover:to-yellow-50 transition-all duration-300 hover:scale-110 hover:shadow-lg" onclick="selectAvatar('💼')">
                                    <span class="text-5xl">💼</span>
                                </button>
                                <button type="button" class="avatar-option p-4 rounded-2xl hover:bg-gradient-to-br hover:from-red-50 hover:to-orange-50 transition-all duration-300 hover:scale-110 hover:shadow-lg" onclick="selectAvatar('🎯')">
                                    <span class="text-5xl">🎯</span>
                                </button>
                                <button type="button" class="avatar-option p-4 rounded-2xl hover:bg-gradient-to-br hover:from-yellow-50 hover:to-amber-50 transition-all duration-300 hover:scale-110 hover:shadow-lg" onclick="selectAvatar('⭐')">
                                    <span class="text-5xl">⭐</span>
                                </button>
                                <button type="button" class="avatar-option p-4 rounded-2xl hover:bg-gradient-to-br hover:from-indigo-50 hover:to-purple-50 transition-all duration-300 hover:scale-110 hover:shadow-lg" onclick="selectAvatar('🚀')">
                                    <span class="text-5xl">🚀</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Form Section with Beautiful Input Fields -->
                    <form id="editProfileForm" class="space-y-6" onsubmit="saveProfileChanges(event)">
                        <!-- Two Column Layout -->
                        <div class="grid md:grid-cols-2 gap-6">
                            <!-- Full Name -->
                            <div class="group">
                                <label class="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                                    <i class="fas fa-user text-blue-500"></i> Full Name *
                                </label>
                                <input type="text" id="editName" value="${profile.name}" class="w-full px-5 py-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 font-medium hover:border-blue-300" placeholder="Sonu Kumar Suman" required>
                            </div>

                            <!-- Email -->
                            <div class="group">
                                <label class="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                                    <i class="fas fa-envelope text-purple-500"></i> Email Address *
                                </label>
                                <input type="email" id="editEmail" value="${profile.email}" class="w-full px-5 py-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 font-medium hover:border-purple-300" placeholder="sonu@example.com" required>
                            </div>

                            <!-- Phone -->
                            <div class="group">
                                <label class="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                                    <i class="fas fa-phone text-green-500"></i> Phone Number *
                                </label>
                                <input type="tel" id="editPhone" value="${profile.phone}" class="w-full px-5 py-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300 font-medium hover:border-green-300" placeholder="+91 98765-43210" required>
                            </div>

                            <!-- Location -->
                            <div class="group">
                                <label class="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                                    <i class="fas fa-map-marker-alt text-red-500"></i> Location
                                </label>
                                <input type="text" id="editLocation" value="${profile.location}" class="w-full px-5 py-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all duration-300 font-medium hover:border-red-300" placeholder="Begusarai, Bihar">
                            </div>
                        </div>

                        <!-- Bio - Full Width -->
                        <div class="group">
                            <label class="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                                <i class="fas fa-pen-fancy text-cyan-500"></i> Bio / About Yourself
                            </label>
                            <textarea id="editBio" class="w-full px-5 py-4 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 transition-all duration-300 font-medium resize-none hover:border-cyan-300" rows="4" placeholder="Data Scientist | Passionate about AI and Machine Learning">${profile.bio || ''}</textarea>
                            <p class="text-xs text-slate-500 mt-2 flex items-center gap-1">
                                <i class="fas fa-info-circle"></i> Tell employers about yourself
                            </p>
                        </div>

                        <!-- Action Buttons - Premium Style -->
                        <div class="flex gap-4 pt-6 border-t-2 border-slate-100">
                            <button type="button" onclick="closeEditModal()" class="flex-1 px-6 py-4 border-2 border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                                <i class="fas fa-times mr-2"></i> Cancel
                            </button>
                            <button type="submit" class="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 text-white font-black rounded-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-[length:200%] hover:bg-right">
                                <i class="fas fa-check-circle mr-2"></i> Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        
        <style>
            .custom-scrollbar::-webkit-scrollbar {
                width: 8px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
                background: #f1f5f9;
                border-radius: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
                background: linear-gradient(135deg, #0066cc, #00d4ff);
                border-radius: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                background: linear-gradient(135deg, #0052a3, #00b8e6);
            }
        </style>
    `;

    // Add modal to page
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Show/hide remove photo button
    if (profile.profilePhoto) {
        document.getElementById('profilePhotoPreview').src = profile.profilePhoto;
        document.getElementById('profilePhotoPreview').classList.remove('hidden');
        document.getElementById('profilePhotoPlaceholder').classList.add('hidden');
        document.getElementById('removePhotoBtn').classList.remove('hidden');
    }
}

function saveProfileChanges(event) {
    event.preventDefault();
    
    const updatedProfile = {
        name: document.getElementById('editName').value.trim(),
        email: document.getElementById('editEmail').value.trim(),
        phone: document.getElementById('editPhone').value.trim(),
        location: document.getElementById('editLocation').value.trim(),
        bio: document.getElementById('editBio').value.trim()
    };

    // Validate
    if (!updatedProfile.name || !updatedProfile.email || !updatedProfile.phone) {
        showNotification('❌ Please fill all required fields', 'error');
        return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(updatedProfile.email)) {
        showNotification('❌ Please enter a valid email', 'error');
        return;
    }

    // Update profile
    analytics.updateSeekerProfile(updatedProfile);
    loadSeekerProfile();
    closeEditModal();
    showNotification('✅ Profile updated successfully!', 'success');
}

function handleProfilePhotoChange(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
        showNotification('❌ Please select an image file', 'error');
        return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
        showNotification('❌ Image size must be less than 2MB', 'error');
        return;
    }

    // Read and convert to base64
    const reader = new FileReader();
    reader.onload = function(e) {
        const base64String = e.target.result;
        
        // Update preview in modal
        const preview = document.getElementById('profilePhotoPreview');
        const placeholder = document.getElementById('profilePhotoPlaceholder');
        
        if (preview) {
            preview.src = base64String;
            preview.classList.remove('hidden');
        }
        if (placeholder) {
            placeholder.classList.add('hidden');
        }

        // Update main dashboard profile photo
        const mainProfilePhoto = document.getElementById('profilePhoto');
        if (mainProfilePhoto) {
            mainProfilePhoto.src = base64String;
            mainProfilePhoto.classList.remove('hidden');
            // Hide the icon placeholder in main dashboard
            const mainPlaceholder = mainProfilePhoto.parentElement.querySelector('[class*="fa-user"]');
            if (mainPlaceholder) {
                mainPlaceholder.classList.add('hidden');
            }
        }

        // Update navigation bar profile photo
        const navProfilePhoto = document.getElementById('navProfilePhoto');
        const navProfileIcon = document.getElementById('navProfileIcon');
        if (navProfilePhoto) {
            navProfilePhoto.src = base64String;
            navProfilePhoto.classList.remove('hidden');
            if (navProfileIcon) {
                navProfileIcon.classList.add('hidden');
            }
        }

        // Store in localStorage
        analytics.updateSeekerProfile({ profilePhoto: base64String });
        
        // Show remove button
        const removeBtn = document.getElementById('removePhotoBtn');
        if (removeBtn) {
            removeBtn.classList.remove('hidden');
        }
        
        showNotification('✅ Photo updated successfully!', 'success');
    };

    reader.readAsDataURL(file);
}

function removeProfilePhoto() {
    if (confirm('Remove profile photo?')) {
        analytics.updateSeekerProfile({ profilePhoto: null });
        
        // Update preview in modal
        const preview = document.getElementById('profilePhotoPreview');
        const placeholder = document.getElementById('profilePhotoPlaceholder');
        
        if (preview) {
            preview.src = '';
            preview.classList.add('hidden');
        }
        if (placeholder) {
            placeholder.classList.remove('hidden');
        }
        
        // Update main dashboard profile photo
        const mainProfilePhoto = document.getElementById('profilePhoto');
        if (mainProfilePhoto) {
            mainProfilePhoto.src = '';
            mainProfilePhoto.classList.add('hidden');
            // Show the icon placeholder in main dashboard
            const mainPlaceholder = mainProfilePhoto.parentElement.querySelector('[class*="fa-user"]');
            if (mainPlaceholder) {
                mainPlaceholder.classList.remove('hidden');
            }
        }
        
        // Update navigation bar profile photo
        const navProfilePhoto = document.getElementById('navProfilePhoto');
        const navProfileIcon = document.getElementById('navProfileIcon');
        if (navProfilePhoto) {
            navProfilePhoto.src = '';
            navProfilePhoto.classList.add('hidden');
            if (navProfileIcon) {
                navProfileIcon.classList.remove('hidden');
            }
        }
        
        // Hide remove button
        const removeBtn = document.getElementById('removePhotoBtn');
        if (removeBtn) {
            removeBtn.classList.add('hidden');
        }

        showNotification('❌ Photo removed!', 'info');
    }
}

// Camera capture functionality
function captureCamera() {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function(stream) {
            // Create modal for camera preview
            const cameraModal = document.createElement('div');
            cameraModal.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[70] p-4';
            cameraModal.id = 'cameraModal';
            
            cameraModal.innerHTML = `
                <div class="bg-white rounded-xl shadow-2xl w-full max-w-md">
                    <div class="bg-gradient-to-r from-green-600 to-emerald-600 p-4 flex justify-between items-center">
                        <h3 class="text-lg font-bold text-white flex items-center gap-2">
                            <i class="fas fa-camera"></i> Capture Photo
                        </h3>
                        <button type="button" class="text-white text-2xl hover:scale-125 transition" onclick="closeCameraModal()">×</button>
                    </div>
                    <div class="p-4">
                        <video id="cameraVideo" autoplay playsinline class="w-full rounded-lg mb-4" style="max-height: 400px;"></video>
                        <div class="flex gap-2">
                            <button type="button" class="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2 font-semibold" onclick="captureFrame()">
                                <i class="fas fa-camera"></i> Capture
                            </button>
                            <button type="button" class="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition flex items-center justify-center gap-2 font-semibold" onclick="closeCameraModal()">
                                <i class="fas fa-times"></i> Cancel
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(cameraModal);
            
            const videoElement = document.getElementById('cameraVideo');
            videoElement.srcObject = stream;
            
            window.currentStream = stream;
            window.currentCanvas = canvas;
            window.currentVideo = videoElement;
            
            showNotification('📷 Camera ready! Click Capture to take photo', 'info');
        })
        .catch(function(err) {
            showNotification('❌ Camera access denied: ' + err.message, 'error');
        });
}

function captureFrame() {
    const video = window.currentVideo;
    const canvas = window.currentCanvas;
    
    if (!video || !canvas) {
        showNotification('❌ Error accessing camera', 'error');
        return;
    }
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    
    const imageData = canvas.toDataURL('image/jpeg', 0.9);
    
    // Update profile photo in modal
    const preview = document.getElementById('profilePhotoPreview');
    const placeholder = document.getElementById('profilePhotoPlaceholder');
    
    if (preview) {
        preview.src = imageData;
        preview.classList.remove('hidden');
    }
    if (placeholder) {
        placeholder.classList.add('hidden');
    }
    
    // Update main dashboard profile photo
    const mainProfilePhoto = document.getElementById('profilePhoto');
    if (mainProfilePhoto) {
        mainProfilePhoto.src = imageData;
        mainProfilePhoto.classList.remove('hidden');
        // Hide the icon placeholder in main dashboard
        const mainPlaceholder = mainProfilePhoto.parentElement.querySelector('[class*="fa-user"]');
        if (mainPlaceholder) {
            mainPlaceholder.classList.add('hidden');
        }
    }
    
    // Update navigation bar profile photo
    const navProfilePhoto = document.getElementById('navProfilePhoto');
    const navProfileIcon = document.getElementById('navProfileIcon');
    if (navProfilePhoto) {
        navProfilePhoto.src = imageData;
        navProfilePhoto.classList.remove('hidden');
        if (navProfileIcon) {
            navProfileIcon.classList.add('hidden');
        }
    }
    
    // Show remove button
    const removeBtn = document.getElementById('removePhotoBtn');
    if (removeBtn) {
        removeBtn.classList.remove('hidden');
    }
    
    analytics.updateSeekerProfile({ profilePhoto: imageData });
    
    closeCameraModal();
    showNotification('✅ Photo captured successfully!', 'success');
}

function closeCameraModal() {
    const modal = document.getElementById('cameraModal');
    if (modal) {
        const stream = window.currentStream;
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        modal.remove();
    }
}

// Avatar selector functionality
function showAvatarSelector() {
    const modal = document.getElementById('avatarSelectorModal');
    if (modal) {
        modal.classList.remove('hidden');
    }
}

function closeAvatarSelector() {
    const modal = document.getElementById('avatarSelectorModal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

function selectAvatar(emoji) {
    // Create a canvas with emoji background
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 200;
    
    const ctx = canvas.getContext('2d');
    
    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, 200, 200);
    gradient.addColorStop(0, '#3b82f6');
    gradient.addColorStop(1, '#06b6d4');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 200, 200);
    
    // Add emoji
    ctx.font = 'bold 100px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(emoji, 100, 100);
    
    const imageData = canvas.toDataURL('image/png');
    
    // Update profile photo in modal
    const preview = document.getElementById('profilePhotoPreview');
    const placeholder = document.getElementById('profilePhotoPlaceholder');
    
    if (preview) {
        preview.src = imageData;
        preview.classList.remove('hidden');
    }
    if (placeholder) {
        placeholder.classList.add('hidden');
    }
    
    // Update main dashboard profile photo
    const mainProfilePhoto = document.getElementById('profilePhoto');
    if (mainProfilePhoto) {
        mainProfilePhoto.src = imageData;
        mainProfilePhoto.classList.remove('hidden');
        // Hide the icon placeholder in main dashboard
        const mainPlaceholder = mainProfilePhoto.parentElement.querySelector('[class*="fa-user"]');
        if (mainPlaceholder) {
            mainPlaceholder.classList.add('hidden');
        }
    }
    
    // Update navigation bar profile photo
    const navProfilePhoto = document.getElementById('navProfilePhoto');
    const navProfileIcon = document.getElementById('navProfileIcon');
    if (navProfilePhoto) {
        navProfilePhoto.src = imageData;
        navProfilePhoto.classList.remove('hidden');
        if (navProfileIcon) {
            navProfileIcon.classList.add('hidden');
        }
    }
    
    // Show remove button
    const removeBtn = document.getElementById('removePhotoBtn');
    if (removeBtn) {
        removeBtn.classList.remove('hidden');
    }
    
    analytics.updateSeekerProfile({ profilePhoto: imageData });
    
    closeAvatarSelector();
    showNotification('✅ Avatar selected successfully!', 'success');
}

function closeEditModal() {
    const modal = document.getElementById('editProfileModal');
    if (modal) {
        modal.remove();
    }
}

function addSkill() {
    const modalHTML = `
        <div id="addSkillModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div class="bg-white rounded-xl shadow-2xl max-w-md w-full">
                <!-- Header -->
                <div style="background: linear-gradient(135deg, #0066cc 0%, #00d4ff 100%);" class="text-white p-6 flex items-center justify-between">
                    <h2 class="text-2xl font-bold flex items-center gap-2">
                        <i class="fas fa-star"></i> Add Skill
                    </h2>
                    <button onclick="closeAddSkillModal()" class="text-2xl hover:text-slate-200 transition">✕</button>
                </div>
                
                <!-- Content -->
                <form id="addSkillForm" class="p-6 space-y-4" onsubmit="saveNewSkill(event)">
                    <div>
                        <label class="block text-sm font-semibold text-slate-900 mb-2">
                            <i class="fas fa-code mr-1 text-blue-600"></i> Skill Name
                        </label>
                        <input type="text" id="newSkillInput" placeholder="e.g. JavaScript, React, Python, AWS" class="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition" required>
                    </div>
                    
                    <!-- Suggested Skills -->
                    <div class="pt-2">
                        <p class="text-xs font-semibold text-slate-600 mb-2">Popular Skills:</p>
                        <div class="grid grid-cols-2 gap-2">
                            <button type="button" class="px-3 py-2 bg-slate-100 hover:bg-blue-100 text-slate-700 rounded-lg text-sm transition" onclick="selectSkill('JavaScript')">JavaScript</button>
                            <button type="button" class="px-3 py-2 bg-slate-100 hover:bg-blue-100 text-slate-700 rounded-lg text-sm transition" onclick="selectSkill('React')">React</button>
                            <button type="button" class="px-3 py-2 bg-slate-100 hover:bg-blue-100 text-slate-700 rounded-lg text-sm transition" onclick="selectSkill('Python')">Python</button>
                            <button type="button" class="px-3 py-2 bg-slate-100 hover:bg-blue-100 text-slate-700 rounded-lg text-sm transition" onclick="selectSkill('Node.js')">Node.js</button>
                            <button type="button" class="px-3 py-2 bg-slate-100 hover:bg-blue-100 text-slate-700 rounded-lg text-sm transition" onclick="selectSkill('AWS')">AWS</button>
                            <button type="button" class="px-3 py-2 bg-slate-100 hover:bg-blue-100 text-slate-700 rounded-lg text-sm transition" onclick="selectSkill('Git')">Git</button>
                        </div>
                    </div>
                    
                    <!-- Buttons -->
                    <div class="flex gap-3 pt-4 border-t border-slate-200">
                        <button type="submit" class="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-lg hover:shadow-lg transition flex items-center justify-center gap-2">
                            <i class="fas fa-check"></i> Add Skill
                        </button>
                        <button type="button" onclick="closeAddSkillModal()" class="px-6 py-3 border-2 border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.getElementById('newSkillInput').focus();
}

function closeAddSkillModal() {
    const modal = document.getElementById('addSkillModal');
    if (modal) modal.remove();
}

function selectSkill(skillName) {
    const input = document.getElementById('newSkillInput');
    if (input) input.value = skillName;
}

function saveNewSkill(event) {
    event.preventDefault();
    const skill = document.getElementById('newSkillInput').value.trim();
    
    if (!skill) {
        showNotification('❌ Please enter a skill name', 'error');
        return;
    }
    
    analytics.addSkill(skill);
    closeAddSkillModal();
    loadSeekerProfile();
    showNotification(`✅ "${skill}" skill added successfully!`, 'success');
}

function removeSkill(skill) {
    if (confirm(`Remove "${skill}" skill?`)) {
        analytics.removeSkill(skill);
        loadSeekerProfile();
        showNotification(`❌ Skill "${skill}" removed!`, 'info');
    }
}

function addExperience() {
    const profile = analytics.getSeekerProfile();
    
    const modalHTML = `
        <div id="addExperienceModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
                <!-- Header -->
                <div style="background: linear-gradient(135deg, #00d4ff 0%, #0066cc 100%);" class="text-white p-6 flex items-center justify-between">
                    <h2 class="text-2xl font-bold flex items-center gap-2">
                        <i class="fas fa-briefcase"></i> Add Experience
                    </h2>
                    <button onclick="closeAddExperienceModal()" class="text-2xl hover:text-slate-200 transition">✕</button>
                </div>
                
                <!-- Content -->
                <form id="addExperienceForm" class="p-6 space-y-4" onsubmit="saveExperience(event)">
                    <!-- Job Title -->
                    <div>
                        <label class="block text-sm font-semibold text-slate-900 mb-2">
                            <i class="fas fa-heading mr-1 text-blue-600"></i> Job Title / Qualification *
                        </label>
                        <input type="text" id="expTitle" placeholder="e.g. Senior Software Engineer" class="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200" required>
                    </div>
                    
                    <!-- Company -->
                    <div>
                        <label class="block text-sm font-semibold text-slate-900 mb-2">
                            <i class="fas fa-building mr-1 text-green-600"></i> Company / Institution *
                        </label>
                        <input type="text" id="expCompany" placeholder="e.g. TCS, Google, Your University" class="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200" required>
                    </div>
                    
                    <!-- Duration -->
                    <div>
                        <label class="block text-sm font-semibold text-slate-900 mb-2">
                            <i class="fas fa-calendar mr-1 text-purple-600"></i> Duration *
                        </label>
                        <input type="text" id="expDuration" placeholder="e.g. 1-2 Years, Jan 2023 - Present, 2024" class="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200" required>
                    </div>
                    
                    <!-- Description -->
                    <div>
                        <label class="block text-sm font-semibold text-slate-900 mb-2">
                            <i class="fas fa-pencil-alt mr-1 text-cyan-600"></i> Description (Optional)
                        </label>
                        <textarea id="expDesc" placeholder="Describe your responsibilities and achievements" class="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-none" rows="3"></textarea>
                    </div>
                    
                    <!-- Buttons -->
                    <div class="flex gap-3 pt-4 border-t border-slate-200">
                        <button type="submit" class="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-lg hover:shadow-lg transition flex items-center justify-center gap-2">
                            <i class="fas fa-save"></i> Add Experience
                        </button>
                        <button type="button" onclick="closeAddExperienceModal()" class="px-6 py-3 border-2 border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.getElementById('addExperienceModal').style.animation = 'fadeIn 0.3s ease-out';
}

function closeAddExperienceModal() {
    const modal = document.getElementById('addExperienceModal');
    if (modal) modal.remove();
}

function saveExperience(event) {
    event.preventDefault();
    
    const title = document.getElementById('expTitle').value.trim();
    const company = document.getElementById('expCompany').value.trim();
    const duration = document.getElementById('expDuration').value.trim();
    const description = document.getElementById('expDesc').value.trim();
    
    if (!title || !company || !duration) {
        alert('Please fill in all required fields');
        return;
    }
    
    const experience = { title, company, duration, description };
    analytics.addExperience(experience);
    
    closeAddExperienceModal();
    loadSeekerProfile();
    showNotification(`✅ "${title}" experience added successfully!`, 'success');
}

function removeExperience(index) {
    if (confirm('Are you sure you want to remove this experience?')) {
        const profile = analytics.getSeekerProfile();
        const expTitle = profile.experience[index]?.title || 'Experience';
        profile.experience.splice(index, 1);
        analytics.updateSeekerProfile(profile);
        loadSeekerProfile();
        showNotification(`✅ "${expTitle}" removed!`, 'success');
    }
}

// ====== NOTIFICATION SYSTEM ======

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    const styles = {
        success: 'bg-gradient-to-r from-green-500 to-green-600',
        error: 'bg-gradient-to-r from-red-500 to-red-600',
        info: 'bg-gradient-to-r from-blue-500 to-cyan-500',
        warning: 'bg-gradient-to-r from-yellow-500 to-orange-500'
    };
    
    notification.className = `fixed bottom-4 right-4 ${styles[type] || styles.info} text-white px-6 py-3 rounded-lg shadow-lg z-[9999] animate-pulse`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Export Dashboard Data
function exportDashboardData() {
    const stats = analytics.getTotalStats();
    const data = {
        stats,
        applications: analytics.applications,
        timestamp: new Date().toISOString()
    };
    
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dashboard-data.json';
    a.click();
}

// Handle quick profile photo upload from profile picture area
function handleQuickPhotoUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const photoData = e.target.result;
            analytics.updateSeekerProfile({ profilePhoto: photoData });
            displayProfile();
            
            // Show success message
            showNotification('Profile photo updated successfully!', 'success');
        };
        reader.readAsDataURL(file);
    }
}

// Show notification helper
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-6 right-6 px-6 py-4 rounded-lg font-semibold shadow-lg z-50 animate-fade-in ${
        type === 'success' ? 'bg-green-500 text-white' : 
        type === 'error' ? 'bg-red-500 text-white' : 
        'bg-blue-500 text-white'
    }`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

