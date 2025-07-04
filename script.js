document.addEventListener('DOMContentLoaded', () => {
     console.log('RK Overseas Education website loaded and DOM is ready!');

     const mainContent = document.getElementById('main-content');
     // Critical check: Ensure mainContent exists before proceeding.
     if (!mainContent) {
         console.error('ERROR: Element with ID "main-content" not found. Script cannot initialize sections properly. Please ensure this ID exists in your HTML.');
         return; // Stop execution if this critical element is missing
     }
     const sections = mainContent.querySelectorAll('section');

     // Define the IDs of sections that should behave as "SPA pages" (hidden/shown)
     // These pages will be hidden by default and shown only when explicitly navigated to.
     const spaPageIds = ['budget-calculator-page', 'fmge-pass-percentage-page'];

     /**
      * Controls the visibility of SPA-like sections.
      * Hides all sections in `spaPageIds` and ensures all other sections are visible.
      * Then, it displays the specified `pageId` if it's an SPA page.
      * Scrolls the window to the top.
      * @param {string} pageId - The ID of the section to show.
      */
     function showPage(pageId) {
         console.log(`[showPage] Attempting to show page: ${pageId}`);
         sections.forEach(section => {
             if (spaPageIds.includes(section.id)) {
                 section.style.display = 'none'; // Hide all designated SPA pages
                 // console.log(`[showPage] Hiding SPA section: ${section.id}`); // Detailed debugging
             } else {
                 section.style.display = 'block'; // Ensure non-SPA sections are visible
                 // console.log(`[showPage] Showing non-SPA section: ${section.id}`); // Detailed debugging
             }
         });

         const activePage = document.getElementById(pageId);
         if (activePage) {
             activePage.style.display = 'block'; // Show the requested SPA page
             window.scrollTo({
                 top: 0,
                 behavior: 'smooth'
             }); // Smoothly scroll to top of the new page
             console.log(`[showPage] Successfully displayed/scrolled to specific page/section: ${pageId}`);
         } else if (spaPageIds.includes(pageId)) {
             console.warn(`[showPage] Attempted to show SPA page with ID "${pageId}" but it was not found in the DOM. Check HTML ID.`);
         } else {
             // This branch is hit when showPage is called with a non-SPA ID (like 'home-main-view')
             // indicating a desire to just reset to the main content view.
             console.log(`[showPage] No specific SPA page "${pageId}" found, resetting to main content view.`);
         }
     }

     // --- Mobile Navigation Toggle ---
     const hamburgerButton = document.querySelector('.hamburger-menu');
     const mainNav = document.querySelector('.main-nav');
     const navLinks = document.querySelectorAll('.main-nav ul li a');

     if (hamburgerButton && mainNav) {
         hamburgerButton.addEventListener('click', () => {
             mainNav.classList.toggle('active'); // Toggles 'active' class to show/hide mobile nav
             const icon = hamburgerButton.querySelector('i');
             if (icon) { // Ensure the icon element exists
                 if (mainNav.classList.contains('active')) {
                     icon.classList.remove('fa-bars');
                     icon.classList.add('fa-times'); // Change icon to 'X'
                     hamburgerButton.setAttribute('aria-expanded', 'true');
                     console.log('[Mobile Nav] Mobile menu opened.');
                 } else {
                     icon.classList.remove('fa-times');
                     icon.classList.add('fa-bars'); // Change icon back to 'bars'
                     hamburgerButton.setAttribute('aria-expanded', 'false');
                     console.log('[Mobile Nav] Mobile menu closed.');
                 }
             } else {
                 console.warn('[Mobile Nav] Hamburger icon (i tag inside .hamburger-menu) not found. Icon toggle will not work.');
             }
         });
     } else {
         console.warn('[Mobile Nav] Hamburger menu button (.hamburger-menu) or main navigation (.main-nav) not found. Mobile menu functionality might be impaired.');
     }

     // Close mobile navigation when clicking on the overlay (outside the menu content)
     if (mainNav) {
         mainNav.addEventListener('click', (e) => {
             if (mainNav.classList.contains('active') && e.target === mainNav) {
                 mainNav.classList.remove('active');
                 if (hamburgerButton) { // Ensure hamburgerButton exists before manipulating its icon
                     const icon = hamburgerButton.querySelector('i');
                     if (icon) {
                         icon.classList.remove('fa-times');
                         icon.classList.add('fa-bars');
                         hamburgerButton.setAttribute('aria-expanded', 'false');
                     }
                 }
                 console.log('[Mobile Nav] Mobile menu closed by clicking overlay.');
             }
         });
     }

     // Adjust the listener for navLinks to close the menu and handle navigation
     if (navLinks.length > 0) {
         navLinks.forEach(link => {
             link.addEventListener('click', (e) => {
                 const targetPageId = link.dataset.page; // For SPA pages (e.g., data-page="budget-calculator-page")
                 const href = link.getAttribute('href'); // For scroll-to sections (e.g., href="#universities")

                 if (targetPageId && spaPageIds.includes(targetPageId)) {
                     // This is an SPA page link (Budget Calculator, FMGE Pass Percentage)
                     e.preventDefault(); // Prevent default anchor jump (which would cause a reload or incorrect scroll)
                     showPage(targetPageId); // Use showPage to toggle visibility
                     console.log(`[Nav Link] Navigating to SPA page via header link: ${targetPageId}`);
                 } else if (href && href.startsWith('#')) {
                     // This is a regular scroll-to-section link (Home, MBBS Abroad, Universities, Students, Contact Us)
                     e.preventDefault(); // Prevent default anchor jump

                     // Ensure all non-SPA sections are visible before scrolling to a main section
                     sections.forEach(section => {
                         if (!spaPageIds.includes(section.id)) {
                             section.style.display = 'block'; // Make all non-SPA sections visible
                         } else {
                             section.style.display = 'none'; // Keep SPA sections hidden
                         }
                     });

                     const targetElement = document.querySelector(href);
                     if (targetElement) {
                         window.scrollTo({
                             top: targetElement.offsetTop,
                             behavior: 'smooth'
                         });
                         console.log(`[Nav Link] Scrolling to section via header link: ${href}`);
                     } else {
                         console.warn(`[Nav Link] Target element for href "${href}" not found for scrolling. Check HTML ID.`);
                     }
                 }

                 // Always close mobile menu after clicking a link, if it's open
                 if (mainNav && mainNav.classList.contains('active')) {
                     mainNav.classList.remove('active');
                     if (hamburgerButton) {
                         const icon = hamburgerButton.querySelector('i');
                         if (icon) {
                             icon.classList.remove('fa-times');
                             icon.classList.add('fa-bars');
                             hamburgerButton.setAttribute('aria-expanded', 'false');
                         }
                     }
                 }
             });
         });
     } else {
         console.warn('[Nav Link] No navigation links found within .main-nav ul li a. Header navigation may not work.');
     }

     // --- Initial Load Logic ---
     // On initial page load, hide designated SPA pages and ensure other main sections are visible.
     sections.forEach(section => {
         if (spaPageIds.includes(section.id)) {
             section.style.display = 'none';
         } else {
             section.style.display = 'block';
         }
     });
     console.log('[Init] Initial page state set: SPA pages hidden, main content sections visible by default.');


     // --- Button Functionality for Hero Section ---
     const exploreDestinationsBtn = document.querySelector('.btn-explore');
     const talkToMentorBtn = document.querySelector('.btn-mentor');

     if (exploreDestinationsBtn) {
         console.log('[Hero Buttons] Found "Explore MBBS Destinations" button. Attaching click listener.');
         exploreDestinationsBtn.addEventListener('click', () => {
             console.log('[Hero Buttons] "Explore MBBS Destinations" button CLICKED!'); // CONFIRM THIS IN CONSOLE!
             const universitiesSection = document.getElementById('universities');
             if (universitiesSection) {
                 console.log('[Hero Buttons] Target section #universities found. Proceeding with showPage and scroll.');
                 // Call showPage with a non-SPA ID to ensure main content sections are visible
                 // and any previously active SPA pages are hidden.
                 showPage('home-main-view'); // 'home-main-view' is a dummy ID to signal reset for showPage.

                 window.scrollTo({
                     top: universitiesSection.offsetTop,
                     behavior: 'smooth'
                 });
                 console.log('[Hero Buttons] Successfully scrolled to "Top Universities" section.');
             } else {
                 console.error('ERROR: Target section with ID "universities" NOT FOUND in the HTML for "Explore MBBS Destinations" button. Please check your HTML structure.');
                 showCustomMessage('The "Universities" section could not be found. Please check the page structure.', 'error');
             }
         });
     } else {
         console.warn('[Hero Buttons] "Explore MBBS Destinations" button with class ".btn-explore" NOT FOUND. This button will not work.');
     }

     if (talkToMentorBtn) {
         console.log('[Hero Buttons] Found "Talk to a Student Mentor" button. Attaching click listener.');
         talkToMentorBtn.addEventListener('click', () => {
             console.log('[Hero Buttons] "Talk to a Student Mentor" button CLICKED!');
             // Updated target ID to the newly added 'indian-students-connect'
             const studentsConnectSection = document.getElementById('indian-students-connect');
             if (studentsConnectSection) {
                 console.log('[Hero Buttons] Target section #indian-students-connect found. Proceeding with showPage and scroll.');
                 // Call showPage with a non-SPA ID to ensure main content sections are visible
                 showPage('home-main-view'); // 'home-main-view' is a dummy ID to signal reset for showPage.

                 window.scrollTo({
                     top: studentsConnectSection.offsetTop,
                     behavior: 'smooth'
                 });
                 console.log('[Hero Buttons] Successfully scrolled to "Connect with Indian students" section (ID: indian-students-connect).');
             } else {
                 console.error('ERROR: Target section with ID "indian-students-connect" NOT FOUND in the HTML for "Talk to a Student Mentor" button. Please check your HTML structure.');
                 showCustomMessage('The "Connect with Indian students" section could not be found. Please check the page structure.', 'error');
             }
         });
     } else {
         console.warn('[Hero Buttons] "Talk to a Student Mentor" button with class ".btn-mentor" NOT FOUND. This button will not work.');
     }


     // --- Form Submission Handler (for general counselling forms) ---
     // Selects both the consultation form and the main contact form
     const consultationForm = document.getElementById('consultation-form');
     const mainContactForm = document.getElementById('main-contact-form');

     if (consultationForm) {
         console.log('[Forms] Found "Book a Free Consultation" form. Attaching listener.');
         consultationForm.addEventListener('submit', (event) => {
             event.preventDefault(); // Prevent default form submission (page reload)
             console.log('[Forms] "Book a Free Consultation" form submission attempted.');

             const nameInput = consultationForm.querySelector('input[name="name"]'); // Uses name attribute
             const emailInput = consultationForm.querySelector('input[name="email"]');
             const phoneInput = consultationForm.querySelector('input[name="phone"]');
             const courseInput = consultationForm.querySelector('input[name="course"]');

             // Basic validation for required fields
             if (!nameInput || !nameInput.value.trim()) {
                 showCustomMessage('Please enter your Name for consultation.', 'error');
                 return;
             }
             if (!emailInput || !emailInput.value.trim()) {
                 showCustomMessage('Please enter your Email for consultation.', 'error');
                 return;
             }
             if (!phoneInput || !phoneInput.value.trim()) {
                 showCustomMessage('Please enter your Phone number for consultation.', 'error');
                 return;
             }

             const formData = {
                 name: nameInput.value.trim(),
                 email: emailInput.value.trim(),
                 phone: phoneInput.value.trim(),
                 course: courseInput ? courseInput.value.trim() : 'N/A' // Course is required in HTML, but N/A if not found
             };

             console.log('[Forms] Consultation Form data captured:', formData);
             // In a real application, you would send this data to a server here (e.g., using fetch API)
             showCustomMessage('Thank you for your consultation enquiry! We will contact you soon.', 'success');
             consultationForm.reset(); // Clear form fields
         });
     } else {
         console.warn('[Forms] "Book a Free Consultation" form (ID: consultation-form) not found. Its submission feature will not work.');
     }

     if (mainContactForm) {
         console.log('[Forms] Found "Get in Touch" contact form. Attaching listener.');
         mainContactForm.addEventListener('submit', (event) => {
             event.preventDefault(); // Prevent default form submission (page reload)
             console.log('[Forms] "Get in Touch" contact form submission attempted.');

             // Using specific IDs for the contact form fields
             const contactNameInput = document.getElementById('contactName');
             const contactEmailInput = document.getElementById('contactEmail');
             const contactPhoneInput = document.getElementById('contactPhone');
             const contactMessageInput = document.getElementById('contactMessage');

             // Basic validation for required fields
             if (!contactNameInput || !contactNameInput.value.trim()) {
                 showCustomMessage('Please enter your Name for contact.', 'error');
                 return;
             }
             if (!contactEmailInput || !contactEmailInput.value.trim()) {
                 showCustomMessage('Please enter your Email for contact.', 'error');
                 return;
             }
             if (!contactMessageInput || !contactMessageInput.value.trim()) {
                 showCustomMessage('Please enter your Message for contact.', 'error');
                 return;
             }

             const formData = {
                 name: contactNameInput.value.trim(),
                 email: contactEmailInput.value.trim(),
                 phone: contactPhoneInput ? contactPhoneInput.value.trim() : 'N/A', // Phone is optional in HTML
                 message: contactMessageInput.value.trim()
             };

             console.log('[Forms] Main Contact Form data captured:', formData);
             // In a real application, you would send this data to a server here (e.g., using fetch API)
             showCustomMessage('Thank you for your message! We will get back to you shortly.', 'success');
             mainContactForm.reset(); // Clear form fields
         });
     } else {
         console.warn('[Forms] Main Contact form (ID: main-contact-form) not found. Its submission feature will not work.');
     }


     // --- Custom Message Box Function ---
     /**
      * Displays a temporary, dismissible message box at the top right of the screen.
      * @param {string} message - The message text to display.
      * @param {string} type - The type of message ('success', 'error', 'info'). Affects background color.
      */
     function showCustomMessage(message, type = 'info') {
         let messageBox = document.getElementById('custom-message-box');
         if (!messageBox) {
             messageBox = document.createElement('div');
             messageBox.id = 'custom-message-box';
             // Basic inline styles for a functional message box. For production, consider moving these to CSS.
             messageBox.style.cssText = `
                        position: fixed;
                        top: 20px;
                        right: 20px;
                        padding: 15px 25px;
                        border-radius: 8px;
                        box-shadow: 0 4px 10px rgba(0,0,0,0.2);
                        z-index: 10000;
                        font-family: 'Montserrat', sans-serif;
                        font-size: 1rem;
                        color: white;
                        opacity: 0;
                        transform: translateY(-20px);
                        transition: opacity 0.3s ease, transform 0.3s ease;
                    `;
             document.body.appendChild(messageBox);
         }

         messageBox.textContent = message;
         messageBox.style.backgroundColor = type === 'success' ? '#28a745' : (type === 'error' ? '#dc3545' : '#007bff');
         messageBox.style.opacity = '1';
         messageBox.style.transform = 'translateY(0)';
         console.log(`[Message Box] Displaying custom message: "${message}" (type: ${type})`);

         // Clear any previous auto-hide timeout to prevent premature disappearance
         if (messageBox.timeoutId) {
             clearTimeout(messageBox.timeoutId);
         }

         // Set a new timeout to hide the message box
         messageBox.timeoutId = setTimeout(() => {
             messageBox.style.opacity = '0';
             messageBox.style.transform = 'translateY(-20px)';
             // Remove the message box from the DOM after its transition completes to clean up
             const transitionEndHandler = () => {
                 if (messageBox.style.opacity === '0') {
                     messageBox.remove();
                 }
                 messageBox.removeEventListener('transitionend', transitionEndHandler); // Remove self listener
             };
             messageBox.addEventListener('transitionend', transitionEndHandler);
         }, 4000); // Message visible for 4 seconds
     }

     // --- Budget Range Slider Functionality (for initial hero section) ---
     // These variables are declared here (within DOMContentLoaded scope) to prevent redeclaration errors
     // if the script is embedded directly in HTML and executed multiple times or in different contexts.
     const step1CountrySelect = document.getElementById('step1CountrySelect');
     const step2BudgetRange = document.getElementById('step2BudgetRange');
     const minBudgetLabel = document.getElementById('minBudget');
     const maxBudgetLabel = document.getElementById('maxBudget');


     if (step2BudgetRange) {
         console.log('[Budget Slider] Budget Range Slider found. Attaching listener.');
         /**
          * Updates the visual fill of the range slider and the displayed current budget.
          */
         const updateSliderFill = () => {
             const min = parseFloat(step2BudgetRange.min || 0);
             const max = parseFloat(step2BudgetRange.max || 1000000); // Default max to avoid division by zero
             const value = parseFloat(step2BudgetRange.value || 0);
             const percentage = ((value - min) / (max - min)) * 100;
             step2BudgetRange.style.setProperty('--fill-percentage', `${percentage}%`);

             // Update the minBudgetLabel to show the current selected value
             if (minBudgetLabel) {
                 minBudgetLabel.textContent = `₹${(value / 100000).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} Lakhs`;
             }
             // maxBudgetLabel remains static as per your HTML's intent for it to show the max range
             console.log(`[Budget Slider] Slider value: ₹${value.toLocaleString('en-IN')}`);
         };
         updateSliderFill(); // Initial update on page load
         step2BudgetRange.addEventListener('input', updateSliderFill); // Update on slider input change
     } else {
         console.warn('[Budget Slider] Budget Range Slider (ID: step2BudgetRange) not found. Slider visual fill and label updates disabled.');
     }


     // --- Student Profiles Carousel Navigation ---
     const studentProfilesCarousel = document.querySelector('.student-profiles-carousel');
     const studentPrevBtn = document.querySelector('.student-carousel-nav-btn.left');
     const studentNextBtn = document.querySelector('.student-carousel-nav-btn.right');

     if (studentProfilesCarousel && studentPrevBtn && studentNextBtn) {
         console.log('[Student Carousel] Student Profiles Carousel and navigation buttons found. Attaching listeners.');
         // Calculate scroll amount based on expected card width + gap from your CSS
         const scrollAmountStudent = 260 + 30; // Student card width (260px) + gap (30px)

         studentPrevBtn.addEventListener('click', () => {
             studentProfilesCarousel.scrollBy({
                 left: -scrollAmountStudent,
                 behavior: 'smooth'
             });
             console.log('[Student Carousel] Scrolled left.');
         });

         studentNextBtn.addEventListener('click', () => {
             studentProfilesCarousel.scrollBy({
                 left: scrollAmountStudent,
                 behavior: 'smooth'
             });
             console.log('[Student Carousel] Scrolled right.');
         });
     } else {
         console.warn('[Student Carousel] Student Profiles Carousel (.student-profiles-carousel) or its navigation buttons not found. Carousel functionality disabled.');
     }


     // --- AI Powered University Recommendation Feature ---
     const showMatchingUniversitiesBtn = document.getElementById('showMatchingUniversitiesBtn');
     const recommendationModal = document.getElementById('recommendationModal');
     const modalCloseBtn = recommendationModal ? recommendationModal.querySelector('.modal-close-btn') : null; // Check if modal exists first
     const recommendationResultsDiv = document.getElementById('recommendationResults');
     // step1CountrySelect and step2BudgetRange are already declared above.

     // Hardcoded university data (as provided by you) - this is your internal data source
     const universityData = {
         "Tashkent State Medical University": {
             "country": "Uzbekistan",
             "annualFeeLakhs": 3.49,
             "imageUrl": "https://res.cloudinary.com/dpxcmzztu/image/upload/v1751279243/photo_2025-04-23_20-11-03_vy7qpp.jpg"
         },
         "Urgench State Medical University": {
             "country": "Uzbekistan",
             "annualFeeLakhs": 3.32,
             "imageUrl": "https://res.cloudinary.com/dpxcmzztu/image/upload/v1751279288/imgpsh_fullsize_anim-5_r7vijs.webp"
         },
         "Bukhara State Medical University": {
             "country": "Uzbekistan",
             "annualFeeLakhs": 3.15,
             "imageUrl": "https://rmgoe.org/universities/Abroad/images/1750847221_685bcef56909c.png"
         },
         "Samarkand State Medical University": {
             "country": "Uzbekistan",
             "annualFeeLakhs": 3.41,
             "imageUrl": "https://ik.imagekit.io/syustaging/SYU_PREPROD/Campus_vYiO8Uzxk.webp?tr=w-3840"
         },
         "Bashkir State Medical University": {
             "country": "Russian Federation",
             "annualFeeLakhs": 3.15,
             "imageUrl": "https://exploremyuniversity.com/wp-content/uploads/2024/01/Bashkir-State-Medical-University-Russia-jpg.webp"
         },
         "Crimea Federal Medical University": {
             "country": "Russian Federation",
             "annualFeeLakhs": 3.36,
             "imageUrl": "https://studymbbsinrussia.co.in/wp-content/uploads/2016/04/crimea.jpg"
         },
         "Ryazan State Medical University": {
             "country": "Russian Federation",
             "annualFeeLakhs": 3.50,
             "imageUrl": "https://www.ruseducation.in/wp-content/uploads/2022/01/Ryazan-State-Medical-University.webp"
         },
         "Perm State Medical University": {
             "country": "Russian Federation",
             "annualFeeLakhs": 3.85,
             "imageUrl": "https://blog.rmgoe.org/wp-content/uploads/2023/04/Perm-State-Medical-University-Russia.jpg"
         },
         "Smolensk State Medical University": {
             "country": "Russian Federation",
             "annualFeeLakhs": 4.25,
             "imageUrl": "https://ik.imagekit.io/syustaging/SYU_PREPROD/Campus_l9gd272mDD.webp?tr=w-3840"
         },
         "Saint Petersburg State Medical University": {
             "country": "Russian Federation",
             "annualFeeLakhs": 4.97,
             "imageUrl": "https://www.rusvuz.com/wp-content/uploads/2020/05/Saint-Petersburg-State-Medical-University-Pavlov.jpg"
         },
         "Orenburg State Medical University": {
             "country": "Russian Federation",
             "annualFeeLakhs": 5.04,
             "imageUrl": "https://ucsworld.com/wp-content/uploads/2017/02/Orenburg-State-Medical-University.png"
         },
         "Kazan State Medical University": {
             "country": "Russian Federation",
             "annualFeeLakhs": 5.215,
             "imageUrl": "https://studymbbsinrussia.co.in/wp-content/uploads/2016/04/kazan-medical-university-russia.jpg"
         },
         "Tver State Medical University": {
             "country": "Russian Federation",
             "annualFeeLakhs": 4.725,
             "imageUrl": "https://images.shiksha.com/mediadata/images/1434083689phpyEuq2x_g.png"
         },
         "Kursk State Medical University": {
             "country": "Russian Federation",
             "annualFeeLakhs": 5.355,
             "imageUrl": "https://ik.imagekit.io/syustaging/SYU_PREPROD/Kursk-State-Medical-University_5V2Z7Rtqf2.webp?tr=w-3840"
         },
         "Peoples Friendship University": {
             "country": "Russian Federation",
             "annualFeeLakhs": 5.74,
             "imageUrl": "https://studymbbsinrussia.co.in/wp-content/uploads/2017/03/peoples-friendship-university.jpg"
         },
         "First Moscow State Medical University": {
             "country": "Russian Federation",
             "annualFeeLakhs": 8.26,
             "imageUrl": "https://www.ruseducation.in/wp-content/uploads/2022/01/I.-M.-Sechenov-First-Moscow-State-Medical-University.webp"
         },
         "Tbilisi State Medical University": {
             "country": "Georgia",
             "annualFeeLakhs": 8.65,
             "imageUrl": "https://images.shiksha.com/mediadata/images/1702625100phpu2Kbnu_g.jpg"
         },
         "Georgian National University SEU": {
             "country": "Georgia",
             "annualFeeLakhs": 6.5,
             "imageUrl": "https://www.atmiaeducation.com/images/georgia/high-technology-medical-centre-university-clinic.jpg"
         },
         "Batumi Shota Rustaveli State University": {
             "country": "Georgia",
             "annualFeeLakhs": 4.8,
             "imageUrl": "https://www.ruseducation.in/wp-content/uploads/2022/01/batumi-shota-rustaveli-state-university.webp"
         },
         "Alte University": {
             "country": "Georgia",
             "annualFeeLakhs": 5.7,
             "imageUrl": "https://www.eklavyaoverseas.com/uploads/galleries/alte-university-building.jpg"
         },
         "Osh State Medical University": {
             "country": "Kyrgyzstan",
             "annualFeeLakhs": 3.0,
             "imageUrl": "https://www.ruseducation.in/wp-content/uploads/2022/01/Osh-State-University.webp"
         },
         "Jalal-Abad State Medical University Medical Faculty": {
             "country": "Kyrgyzstan",
             "annualFeeLakhs": 5.791,
             "imageUrl": "https://jasu.kg/wp-content/uploads/2025/01/JASU-Campus.jpg"
         },
         "Jalal-Abad International University": {
             "country": "Kyrgyzstan",
             "annualFeeLakhs": 4.675,
             "imageUrl": "https://assets.collegedunia.com/public/college_data/images/studyabroad/appImage/college_3752_20-19:28_jasu-uni-cover.jpeg"
         },
         "International Medical University": {
             "country": "Kyrgyzstan",
             "annualFeeLakhs": 4.845,
             "imageUrl": "https://talloiresnetwork.tufts.edu/wp-content/uploads/talnet__1274.bmp"
         },
         "Kyrgyz State Medical Academy": {
             "country": "Kyrgyzstan",
             "annualFeeLakhs": 4.726,
             "imageUrl": "https://edufever.in/colleges/wp-content/uploads/2022/08/Kyrgyz-State-Medical-Academy-Kyrgyzstan-1.webp"
         }
     };

     if (showMatchingUniversitiesBtn && recommendationModal && recommendationResultsDiv && step1CountrySelect && step2BudgetRange) {
         console.log('[AI University Rec] University Recommendation button and modal elements found. Attaching listener.');
         showMatchingUniversitiesBtn.addEventListener('click', async () => {
             const selectedCountry = step1CountrySelect.value;
             const selectedBudget = parseFloat(step2BudgetRange.value);

             if (!selectedCountry || isNaN(selectedBudget) || selectedBudget <= 0) {
                 showCustomMessage('Please select a country and set your budget correctly to get university recommendations.', 'error');
                 return;
             }

             showMatchingUniversitiesBtn.disabled = true;
             showMatchingUniversitiesBtn.innerHTML = 'Searching... <span class="loading-spinner"></span>';
             recommendationResultsDiv.innerHTML = '<p style="text-align:center;">Searching for matching universities, please wait...</p>';
             recommendationModal.classList.add('active'); // Show the modal
             console.log(`[AI University Rec] Initiating university search for Country: ${selectedCountry}, Budget: ₹${selectedBudget.toLocaleString('en-IN')}`);

             try {
                 const budgetInLakhs = selectedBudget / 100000; // Convert budget to Lakhs for comparison
                 const filteredUniversities = Object.keys(universityData).filter(uniName => {
                     const uni = universityData[uniName];
                     return uni.country === selectedCountry && uni.annualFeeLakhs <= budgetInLakhs;
                 }).map(uniName => {
                     const uni = universityData[uniName];
                     return {
                         universityName: uniName,
                         annualFeeRange: `₹${uni.annualFeeLakhs} Lakhs`,
                         country: uni.country,
                         imageUrl: uni.imageUrl
                     };
                 });

                 let prompt = "";
                 let responseSchema;

                 if (filteredUniversities.length > 0) {
                     const formattedUniversities = filteredUniversities.map(uni => `${uni.universityName} (Annual Fee: ${uni.annualFeeRange}, Country: ${uni.country})`).join('; ');
                     prompt = `As an expert overseas education consultant, provide compelling reasons for an Indian student to consider these MBBS universities. They are looking for universities in "${selectedCountry}" within their budget of ₹${budgetInLakhs} Lakhs per year. For each university, explain why it's a good fit (1-2 sentences), mention its estimated annual fee, and key eligibility criteria (general for MBBS, e.g., 'Min 60% in PCB, NEET qualified').

Present this as a JSON array of objects, strictly following this schema:
[
  {
    "universityName": "STRING",
    "recommendationReason": "STRING",
    "annualFeeRange": "STRING",
    "eligibilityCriteria": "STRING"
  }
]
`;
                     responseSchema = {
                         type: "ARRAY",
                         items: {
                             type: "OBJECT",
                             properties: {
                                 "universityName": {
                                     "type": "STRING"
                                 },
                                 "recommendationReason": {
                                     "type": "STRING"
                                 },
                                 "annualFeeRange": {
                                     "type": "STRING"
                                 },
                                 "eligibilityCriteria": {
                                     "type": "STRING"
                                 }
                             },
                             required: ["universityName", "recommendationReason", "annualFeeRange", "eligibilityCriteria"]
                         }
                     };
                 } else {
                     prompt = `As an expert overseas education consultant, I need to inform a student that no specific MBBS universities could be matched with their criteria: selected country "${selectedCountry}", budget around ₹${budgetInLakhs} Lakhs per year. Provide a helpful message explaining this, suggesting they might consider broadening their search criteria (e.g., higher budget, different countries). Also, offer a general tip on what to look for when choosing an MBBS university abroad.

Present this as a JSON array of objects with a single message field:
[
  {
    "message": "STRING"
  }
]
`;
                     responseSchema = {
                         type: "ARRAY",
                         items: {
                             type: "OBJECT",
                             properties: {
                                 "message": {
                                     "type": "STRING"
                                 }
                             },
                             required: ["message"]
                         }
                     };
                 }

                 let chatHistory = [];
                 chatHistory.push({
                     role: "user",
                     parts: [{
                         text: prompt
                     }]
                 });

                 const payload = {
                     contents: chatHistory,
                     generationConfig: {
                         responseMimeType: "application/json",
                         responseSchema: responseSchema
                     }
                 };

                 const apiKey = ""; // <--- !!! IMPORTANT: REPLACE THIS WITH YOUR ACTUAL GEMINI API KEY HERE !!!
                 const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

                 if (!apiKey) {
                     throw new Error("Gemini API Key is missing. Please set it in the code (replace `const apiKey = \"\";`).");
                 }

                 console.log('[AI University Rec] Sending request to Gemini API...');
                 const response = await fetch(apiUrl, {
                     method: 'POST',
                     headers: {
                         'Content-Type': 'application/json'
                     },
                     body: JSON.stringify(payload)
                 });

                 if (!response.ok) {
                     const errorDetails = await response.text();
                     throw new Error(`API call failed with status ${response.status}: ${response.statusText}. Details: ${errorDetails}`);
                 }

                 const result = await response.json();
                 console.log('[AI University Rec] Gemini API raw response:', result);

                 if (result.candidates && result.candidates.length > 0 &&
                     result.candidates[0].content && result.candidates[0].content.parts &&
                     result.candidates[0].content.parts.length > 0) {
                     const jsonResponseText = result.candidates[0].content.parts[0].text;
                     let aiResponseData;
                     try {
                         aiResponseData = JSON.parse(jsonResponseText);
                     } catch (parseError) {
                         throw new Error(`Failed to parse AI response as JSON: ${parseError.message}. Response was: ${jsonResponseText}`);
                     }


                     if (aiResponseData.length > 0 && aiResponseData[0].message) {
                         // This branch handles the "no matching universities" scenario
                         recommendationResultsDiv.innerHTML = `<p style="text-align:center;">${aiResponseData[0].message}</p>`;
                     } else if (aiResponseData.length > 0) {
                         // This branch handles the successful university recommendations
                         let html = '<ul class="recommendation-list">';
                         aiResponseData.forEach(rec => {
                             // Ensure the image URL is retrieved from your local `universityData`
                             const uniImage = universityData[rec.universityName]?.imageUrl || `https://placehold.co/100x100/cccccc/333333?text=${encodeURIComponent(rec.universityName.substring(0, 15))}`; // Fallback placeholder
                             html += `
                                <li class="recommendation-item">
                                    <img src="${uniImage}" alt="${rec.universityName} image" class="university-thumb">
                                    <div class="text-content">
                                        <h4>${rec.universityName}</h4>
                                        <p><strong>Reason:</strong> ${rec.recommendationReason}</p>
                                        <p><strong>Annual Fee:</strong> ${rec.annualFeeRange}</p>
                                        <p><strong>Eligibility:</strong> ${rec.eligibilityCriteria}</p>
                                    </div>
                                </li>
                            `;
                         });
                         html += '</ul>';
                         recommendationResultsDiv.innerHTML = html;
                     } else {
                         recommendationResultsDiv.innerHTML = '<p style="text-align:center;">No specific recommendations could be generated based on your criteria. Please try different options.</p>';
                         console.warn('[AI University Rec] AI response data array was empty or malformed after parsing.');
                     }
                 } else {
                     recommendationResultsDiv.innerHTML = '<p style="text-align:center; color: red;">Failed to get recommendations. API response structure was unexpected or empty candidates array.</p>';
                     console.error('[AI University Rec] Gemini API response structure unexpected or empty candidates:', result);
                 }

             } catch (error) {
                 console.error('[AI University Rec] Error in university recommendation process:', error);
                 recommendationResultsDiv.innerHTML = `<p style="text-align:center; color: red;">An error occurred while fetching recommendations: ${error.message}. Please try again later.</p>`;
             } finally {
                 showMatchingUniversitiesBtn.disabled = false;
                 showMatchingUniversitiesBtn.innerHTML = 'Search';
             }
         });
     } else {
         console.warn('[AI University Rec] University recommendation button (showMatchingUniversitiesBtn) or modal elements not found. AI university recommendation feature might be disabled.');
     }

     if (recommendationModal && modalCloseBtn) {
         modalCloseBtn.addEventListener('click', () => {
             recommendationModal.classList.remove('active');
             console.log('[AI University Rec] Recommendation modal closed via button.');
         });
         // Close modal when clicking outside its content (on the overlay)
         recommendationModal.addEventListener('click', (event) => {
             if (event.target === recommendationModal) { // Check if the click was directly on the modal background
                 recommendationModal.classList.remove('active');
                 console.log('[AI University Rec] Recommendation modal closed by clicking outside.');
             }
         });
     }


     // --- AI Powered Visa Interview Assistant ---
     const getVisaTipsBtn = document.getElementById('getVisaTipsBtn');
     const visaInterviewModal = document.getElementById('visaInterviewModal');
     const visaModalCloseBtn = visaInterviewModal ? visaInterviewModal.querySelector('.modal-close-btn') : null; // Use generic modal-close-btn
     const visaQuestionInput = document.getElementById('visaQuestionInput');
     const generateVisaTipBtn = document.getElementById('generateVisaTipBtn');
     const visaTipsOutput = document.getElementById('visaTipsOutput');

     if (getVisaTipsBtn && visaInterviewModal && visaQuestionInput && generateVisaTipBtn && visaTipsOutput) {
         console.log('[AI Visa Tips] Visa Interview Assistant elements found. Attaching listener.');
         getVisaTipsBtn.addEventListener('click', () => {
             visaInterviewModal.classList.add('active');
             visaQuestionInput.value = ''; // Clear previous input
             visaTipsOutput.innerHTML = '<p style="text-align:center;">Your AI-generated tip will appear here.</p>'; // Reset output
             console.log('[AI Visa Tips] Visa Interview modal opened.');
         });
     } else {
         console.warn('[AI Visa Tips] Visa Interview Assistant elements not found. Feature disabled.');
     }

     if (visaInterviewModal && visaModalCloseBtn) {
         visaModalCloseBtn.addEventListener('click', () => {
             visaInterviewModal.classList.remove('active');
             console.log('[AI Visa Tips] Visa Interview modal closed via button.');
         });
         visaInterviewModal.addEventListener('click', (event) => {
             if (event.target === visaInterviewModal) {
                 visaInterviewModal.classList.remove('active');
                 console.log('[AI Visa Tips] Visa Interview modal closed by clicking outside.');
             }
         });
     }

     if (generateVisaTipBtn && visaQuestionInput && visaTipsOutput) {
         generateVisaTipBtn.addEventListener('click', async () => {
             const question = visaQuestionInput.value.trim();

             if (!question) {
                 showCustomMessage('Please enter a visa interview question to get a tip.', 'error');
                 return;
             }

             generateVisaTipBtn.disabled = true;
             generateVisaTipBtn.innerHTML = 'Generating... <span class="loading-spinner"></span>';
             visaTipsOutput.innerHTML = '<p style="text-align:center;">Thinking of a helpful tip...</p>';
             console.log(`[AI Visa Tips] Generating visa tip for question: "${question.substring(0, 50)}..."`);

             try {
                 const prompt = `As an experienced overseas education visa interview expert, provide a concise and helpful tip or a suggested answer for the following visa interview question. Focus on practical advice and a positive tone.
Question: "${question}"`;

                 let chatHistory = [];
                 chatHistory.push({
                     role: "user",
                     parts: [{
                         text: prompt
                     }]
                 });

                 const payload = {
                     contents: chatHistory,
                     generationConfig: {
                         responseMimeType: "text/plain", // Expect plain text
                     }
                 };

                 const apiKey = ""; // <--- !!! IMPORTANT: REPLACE THIS WITH YOUR ACTUAL GEMINI API KEY HERE !!!
                 const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

                 if (!apiKey) {
                     throw new Error("Gemini API Key is missing. Please set it in the code.");
                 }

                 const response = await fetch(apiUrl, {
                     method: 'POST',
                     headers: {
                         'Content-Type': 'application/json'
                     },
                     body: JSON.stringify(payload)
                 });

                 if (!response.ok) {
                     const errorDetails = await response.text();
                     throw new Error(`API call failed with status ${response.status}: ${response.statusText}. Details: ${errorDetails}`);
                 }

                 const result = await response.json();
                 console.log('[AI Visa Tips] Gemini Visa Tip API raw response:', result);

                 if (result.candidates && result.candidates.length > 0 &&
                     result.candidates[0].content && result.candidates[0].content.parts &&
                     result.candidates[0].content.parts.length > 0) {
                     const generatedTip = result.candidates[0].content.parts[0].text;
                     visaTipsOutput.innerHTML = `<p>${generatedTip.replace(/\n/g, '<br>')}</p>`;
                 } else {
                     visaTipsOutput.innerHTML = '<p style="color: red;">Could not generate a tip. Unexpected API response format.</p>';
                     console.error('[AI Visa Tips] Gemini API response structure unexpected for visa tips:', result);
                 }

             } catch (error) {
                 console.error('[AI Visa Tips] Error in visa tip generation:', error);
                 visaTipsOutput.innerHTML = `<p style="color: red;">An error occurred: ${error.message}. Please try again later.</p>`;
             } finally {
                 generateVisaTipBtn.disabled = false;
                 generateVisaTipBtn.innerHTML = 'Get AI Tip';
             }
         });
     } else {
         console.warn('[AI Visa Tips] Generate Visa Tip button or associated input/output elements not found. Visa tip generation feature disabled.');
     }


     // --- AI Powered Essay/SOP Assistant ---
     const getEssaySOPBtn = document.getElementById('getEssaySOPBtn');
     const essaySOPModal = document.getElementById('essaySOPModal');
     const essayModalCloseBtn = essaySOPModal ? essaySOPModal.querySelector('.modal-close-btn') : null;
     const brainstormModeBtn = document.getElementById('brainstormModeBtn');
     const reviewModeBtn = document.getElementById('reviewModeBtn');
     const essaySOPInput = document.getElementById('essaySOPInput');
     const generateEssaySOPBtn = document.getElementById('generateEssaySOPBtn');
     const essaySOPOutput = document.getElementById('essaySOPOutput');

     let currentEssaySOPMode = 'brainstorm'; // Default mode

     /**
      * Updates the UI elements of the Essay/SOP Assistant based on the current mode.
      */
     function updateEssaySOPModeUI() {
         if (brainstormModeBtn && reviewModeBtn && essaySOPInput && generateEssaySOPBtn && essaySOPOutput) {
             if (currentEssaySOPMode === 'brainstorm') {
                 brainstormModeBtn.classList.add('active');
                 reviewModeBtn.classList.remove('active');
                 essaySOPInput.placeholder = "Describe your topic for brainstorming, or what you need ideas for (e.g., 'Write about my passion for medicine and why I chose MBBS abroad')...";
                 generateEssaySOPBtn.textContent = 'Get AI Ideas';
                 console.log('[AI Essay/SOP] Switched to Brainstorm Mode UI.');
             } else { // review mode
                 brainstormModeBtn.classList.remove('active');
                 reviewModeBtn.classList.add('active');
                 essaySOPInput.placeholder = "Paste your essay draft here for a review (e.g., 'My name is X...').";
                 generateEssaySOPBtn.textContent = 'Get AI Review';
                 console.log('[AI Essay/SOP] Switched to Review Mode UI.');
             }
             essaySOPOutput.innerHTML = '<p style="text-align:center;">Your AI-generated content or feedback will appear here.</p>'; // Clear output
             essaySOPInput.value = ''; // Clear input field
         } else {
             console.warn('[AI Essay/SOP] UI elements not fully found for updating mode. UI changes may not reflect.');
         }
     }

     if (brainstormModeBtn && reviewModeBtn) {
         brainstormModeBtn.addEventListener('click', () => {
             currentEssaySOPMode = 'brainstorm';
             updateEssaySOPModeUI();
         });
         reviewModeBtn.addEventListener('click', () => {
             currentEssaySOPMode = 'review';
             updateEssaySOPModeUI();
         });
     } else {
         console.warn('[AI Essay/SOP] Brainstorm/Review mode buttons not found. Mode switching functionality disabled.');
     }

     if (getEssaySOPBtn && essaySOPModal) {
         console.log('[AI Essay/SOP] Essay/SOP Assistant button and modal found. Attaching listener.');
         getEssaySOPBtn.addEventListener('click', () => {
             essaySOPModal.classList.add('active');
             currentEssaySOPMode = 'brainstorm'; // Reset to brainstorm mode on opening
             updateEssaySOPModeUI(); // Update UI for brainstorm mode
             console.log('[AI Essay/SOP] Essay/SOP modal opened.');
         });
     } else {
         console.warn('[AI Essay/SOP] Essay/SOP Assistant button or modal not found. Feature disabled.');
     }

     if (essaySOPModal && essayModalCloseBtn) {
         essayModalCloseBtn.addEventListener('click', () => {
             essaySOPModal.classList.remove('active');
             console.log('[AI Essay/SOP] Essay/SOP modal closed via button.');
         });
         essaySOPModal.addEventListener('click', (event) => {
             if (event.target === essaySOPModal) {
                 essaySOPModal.classList.remove('active');
                 console.log('[AI Essay/SOP] Essay/SOP modal closed by clicking outside.');
             }
         });
     }

     if (generateEssaySOPBtn && essaySOPInput && essaySOPOutput) {
         generateEssaySOPBtn.addEventListener('click', async () => {
             const inputText = essaySOPInput.value.trim();

             if (!inputText) {
                 showCustomMessage('Please provide some input for the AI assistant (topic or essay draft).', 'error');
                 return;
             }

             generateEssaySOPBtn.disabled = true;
             generateEssaySOPBtn.innerHTML = 'Generating... <span class="loading-spinner"></span>';
             essaySOPOutput.innerHTML = '<p style="text-align:center;">Processing your request...</p>';
             console.log(`[AI Essay/SOP] Generating content in "${currentEssaySOPMode}" mode for input: "${inputText.substring(0, 50)}..."`);

             try {
                 let prompt = "";
                 if (currentEssaySOPMode === 'brainstorm') {
                     prompt = `As an expert in academic writing and overseas admissions, brainstorm and provide creative ideas or a brief outline for an essay/Statement of Purpose (SOP) based on the following topic/request. Focus on unique angles and compelling narratives suitable for MBBS applications abroad.
Topic: "${inputText}"`;
                 } else { // review mode
                     prompt = `As an expert in academic writing and overseas admissions, review the following essay/Statement of Purpose (SOP) draft. Provide constructive feedback, point out areas for improvement (e.g., clarity, conciseness, impact, grammar, structure), and suggest ways to strengthen it for an MBBS abroad application.
Essay/SOP Draft: "${inputText}"`;
                 }

                 let chatHistory = [];
                 chatHistory.push({
                     role: "user",
                     parts: [{
                         text: prompt
                     }]
                 });

                 const payload = {
                     contents: chatHistory,
                     generationConfig: {
                         responseMimeType: "text/plain", // Expect plain text
                     }
                 };

                 const apiKey = ""; // <--- !!! IMPORTANT: REPLACE THIS WITH YOUR ACTUAL GEMINI API KEY HERE !!!
                 const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

                 if (!apiKey) {
                     throw new Error("Gemini API Key is missing. Please set it in the code.");
                 }

                 const response = await fetch(apiUrl, {
                     method: 'POST',
                     headers: {
                         'Content-Type': 'application/json'
                     },
                     body: JSON.stringify(payload)
                 });

                 if (!response.ok) {
                     const errorDetails = await response.text();
                     throw new Error(`API call failed with status ${response.status}: ${response.statusText}. Details: ${errorDetails}`);
                 }

                 const result = await response.json();
                 console.log('[AI Essay/SOP] Gemini API raw response:', result);

                 if (result.candidates && result.candidates.length > 0 &&
                     result.candidates[0].content && result.candidates[0].content.parts &&
                     result.candidates[0].content.parts.length > 0) {
                     const generatedText = result.candidates[0].content.parts[0].text;
                     essaySOPOutput.innerHTML = `<p>${generatedText.replace(/\n/g, '<br>')}</p>`;
                 } else {
                     essaySOPOutput.innerHTML = '<p style="color: red;">Could not generate content. Unexpected API response format.</p>';
                     console.error('[AI Essay/SOP] Gemini API response structure unexpected for essay/SOP:', result);
                 }

             } catch (error) {
                 console.error('[AI Essay/SOP] Error in essay/SOP generation:', error);
                 essaySOPOutput.innerHTML = `<p style="color: red;">An error occurred: ${error.message}. Please try again later.</p>`;
             } finally {
                 generateEssaySOPBtn.disabled = false;
                 updateEssaySOPModeUI(); // Reset button text based on current mode
             }
         });
     } else {
         console.warn('[AI Essay/SOP] Generate Essay/SOP button or associated input/output elements not found. Essay/SOP generation feature disabled.');
     }

     // --- AI Powered Pre-Departure Checklist Generator ---
     const getPreDepartureChecklistBtn = document.getElementById('getPreDepartureChecklistBtn');
     const preDepartureChecklistModal = document.getElementById('preDepartureChecklistModal');
     const checklistModalCloseBtn = preDepartureChecklistModal ? preDepartureChecklistModal.querySelector('.modal-close-btn') : null;
     const checklistCountryInput = document.getElementById('checklistCountryInput');
     const checklistNotesInput = document.getElementById('checklistNotesInput');
     const generateChecklistBtn = document.getElementById('generateChecklistBtn');
     const checklistOutput = document.getElementById('checklistOutput');

     if (getPreDepartureChecklistBtn && preDepartureChecklistModal && checklistCountryInput && checklistNotesInput && generateChecklistBtn && checklistOutput) {
         console.log('[AI Checklist] Pre-Departure Checklist elements found. Attaching listener.');
         getPreDepartureChecklistBtn.addEventListener('click', () => {
             preDepartureChecklistModal.classList.add('active');
             checklistCountryInput.value = ''; // Clear previous input
             checklistNotesInput.value = ''; // Clear previous input
             checklistOutput.innerHTML = '<p style="text-align:center;">Your personalized pre-departure checklist will appear here.</p>'; // Reset output
             console.log('[AI Checklist] Pre-Departure Checklist modal opened.');
         });
     } else {
         console.warn('[AI Checklist] Pre-Departure Checklist elements not found. Feature disabled.');
     }

     if (preDepartureChecklistModal && checklistModalCloseBtn) {
         checklistModalCloseBtn.addEventListener('click', () => {
             preDepartureChecklistModal.classList.remove('active');
             console.log('[AI Checklist] Pre-Departure Checklist modal closed via button.');
         });
         preDepartureChecklistModal.addEventListener('click', (event) => {
             if (event.target === preDepartureChecklistModal) {
                 preDepartureChecklistModal.classList.remove('active');
                 console.log('[AI Checklist] Pre-Departure Checklist modal closed by clicking outside.');
             }
         });
     }

     if (generateChecklistBtn && checklistCountryInput && checklistNotesInput && checklistOutput) {
         generateChecklistBtn.addEventListener('click', async () => {
             const country = checklistCountryInput.value.trim();
             const notes = checklistNotesInput.value.trim();

             if (!country) {
                 showCustomMessage('Please enter a destination country for the checklist.', 'error');
                 return;
             }

             generateChecklistBtn.disabled = true;
             generateChecklistBtn.innerHTML = 'Generating... <span class="loading-spinner"></span>';
             checklistOutput.innerHTML = '<p style="text-align:center;">Crafting your personalized checklist...</p>';
             console.log(`[AI Checklist] Generating checklist for country: "${country}", with notes: "${notes.substring(0, 50)}..."`);

             try {
                 const prompt = `As an expert overseas education advisor, generate a comprehensive pre-departure checklist for an Indian student moving to "${country}" for MBBS studies. Include categories like:
- Documents (Visa, Passport, Admission Letter, Financial Proofs, Academic Transcripts, etc.)
- Travel Essentials (Flights, Luggage, Local Transport)
- Health & Insurance (Medical Check-ups, Travel Insurance, Vaccinations)
- Finance (Currency, Bank Accounts, Emergency Funds)
- Accommodation (Pre-booked, temporary stay)
- Communication (SIM card, contact details)
- Packing Essentials (Clothing, personal items, medicines, adaptors)
${notes ? `Also consider these additional notes: "${notes}".` : ''}

Format the checklist clearly using markdown headings and bullet points. Be specific where possible.`;

                 let chatHistory = [];
                 chatHistory.push({
                     role: "user",
                     parts: [{
                         text: prompt
                     }]
                 });

                 const payload = {
                     contents: chatHistory,
                     generationConfig: {
                         responseMimeType: "text/plain", // Expect plain text
                     }
                 };

                 const apiKey = ""; // <--- !!! IMPORTANT: REPLACE THIS WITH YOUR ACTUAL GEMINI API KEY HERE !!!
                 const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

                 if (!apiKey) {
                     throw new Error("Gemini API Key is missing. Please set it in the code.");
                 }

                 const response = await fetch(apiUrl, {
                     method: 'POST',
                     headers: {
                         'Content-Type': 'application/json'
                     },
                     body: JSON.stringify(payload)
                 });

                 if (!response.ok) {
                     const errorDetails = await response.text();
                     throw new Error(`API call failed with status ${response.status}: ${response.statusText}. Details: ${errorDetails}`);
                 }

                 const result = await response.json();
                 console.log('[AI Checklist] Gemini Checklist API raw response:', result);

                 if (result.candidates && result.candidates.length > 0 &&
                     result.candidates[0].content && result.candidates[0].content.parts &&
                     result.candidates[0].content.parts.length > 0) {
                     const generatedChecklist = result.candidates[0].content.parts[0].text;
                     checklistOutput.innerHTML = `<p>${generatedChecklist.replace(/\n/g, '<br>')}</p>`;
                 } else {
                     checklistOutput.innerHTML = '<p style="color: red;">Could not generate a checklist. Unexpected API response format.</p>';
                     console.error('[AI Checklist] Gemini API response structure unexpected for checklist:', result);
                 }

             } catch (error) {
                 console.error('[AI Checklist] Error in checklist generation:', error);
                 checklistOutput.innerHTML = `<p style="color: red;">An error occurred: ${error.message}. Please try again later.</p>`;
             } finally {
                 generateChecklistBtn.disabled = false;
                 generateChecklistBtn.innerHTML = 'Generate Checklist';
             }
         });
     } else {
         console.warn('[AI Checklist] Generate Checklist button or associated input/output elements not found. Checklist generation feature disabled.');
     }

     // --- Budget Calculator Logic ---
     const calculateBudgetBtn = document.getElementById('calculateBudgetBtn');
     if (calculateBudgetBtn) {
         console.log('[Budget Calc] Budget Calculator button found. Attaching listener.');
         calculateBudgetBtn.addEventListener('click', () => {
             console.log('[Budget Calc] Calculate Budget button CLICKED!');

             const tuitionFeeElement = document.getElementById('tuitionFee');
             const foodAccommodationTravelElement = document.getElementById('foodAccommodationTravel');
             const medicalInsuranceVisaElement = document.getElementById('medicalInsuranceVisa');
             const airTicketElement = document.getElementById('airTicket');
             const applicationProcessingFeeElement = document.getElementById('applicationProcessingFee');
             const administrativeChargesElement = document.getElementById('administrativeCharges');
             const calculationResultElement = document.querySelector('.calculation-result');

             if (!tuitionFeeElement || !foodAccommodationTravelElement || !medicalInsuranceVisaElement ||
                 !airTicketElement || !applicationProcessingFeeElement || !administrativeChargesElement ||
                 !calculationResultElement) {
                 showCustomMessage('One or more budget calculator input/output elements are missing. Cannot calculate budget.', 'error');
                 console.error('[Budget Calc] Missing elements for budget calculation.');
                 return;
             }

             // Using parseFloat and defaulting to 0 for robustness
             const tuitionFee = parseFloat(tuitionFeeElement.value) || 0;
             const foodAccommodationTravel = parseFloat(foodAccommodationTravelElement.value) || 0; // Assuming this is monthly
             const medicalInsuranceVisa = parseFloat(medicalInsuranceVisaElement.value) || 0;
             const airTicket = parseFloat(airTicketElement.value) || 0;
             const applicationProcessingFee = parseFloat(applicationProcessingFeeElement.value) || 0;
             const administrativeCharges = parseFloat(administrativeChargesElement.value) || 0;

             const annualFoodAccommodationTravel = foodAccommodationTravel * 12; // Convert monthly to annual

             const totalAnnualBudget = tuitionFee + annualFoodAccommodationTravel + medicalInsuranceVisa + airTicket + applicationProcessingFee + administrativeCharges;

             calculationResultElement.textContent = `Estimated Annual Budget: ₹${totalAnnualBudget.toLocaleString('en-IN')}`;
             console.log(`[Budget Calc] Budget Calculated: ₹${totalAnnualBudget.toLocaleString('en-IN')}`);
         });
     } else {
         console.warn('[Budget Calc] Budget Calculator button (ID: calculateBudgetBtn) not found. Budget calculation feature disabled.');
     }

     // --- FMGE Pass Percentage Logic ---
     const fmgeCountrySelect = document.getElementById('fmgeCountrySelect');
     const fmgeUniversitySelect = document.getElementById('fmgeUniversitySelect');
     const getFmgePercentageBtn = document.getElementById('getFmgePercentageBtn');
     const fmgeCardsGrid = document.querySelector('.fmge-cards-grid');
     const fmgeSearchInput = document.getElementById('fmgeSearch');

     // FMGE Data (as provided by you)
     const fmgeData = {
         "Russian Federation": {
             "ALTAI STATE MEDICAL UNIVERSITY": {
                 "2024": {
                     "appeared": 251,
                     "qualified": 56,
                     "percentage": "22.31%"
                 }
             },
             "ASTRAKHAN STATE MEDICAL UNIVERSITY": {
                 "2024": {
                     "appeared": 30,
                     "qualified": 4,
                     "percentage": "13.33%"
                 }
             },
             "BASHKIR STATE MEDICAL UNIVERSITY": {
                 "2024": {
                     "appeared": 340,
                     "qualified": 105,
                     "percentage": "30.88%"
                 }
             },
             "BELGOROD NATIONAL RESEARCH UNIVERSITY MEDICAL INSTITUTE": {
                 "2024": {
                     "appeared": 94,
                     "qualified": 14,
                     "percentage": "14.89%"
                 }
             },
             "CHUVASH STATE UNIVERSITY MEDICAL INSTITUTE": {
                 "2024": {
                     "appeared": 78,
                     "qualified": 25,
                     "percentage": "32.05%"
                 }
             },
             "CRIMEAN FEDERAL UNIVERSITY NAMED AFTER V. I. VERNADSKY": {
                 "2024": {
                     "appeared": 177,
                     "qualified": 97,
                     "percentage": "54.80%"
                 }
             },
             "DAGESTAN STATE MEDICAL UNIVERSITY": {
                 "2024": {
                     "appeared": 107,
                     "qualified": 21,
                     "percentage": "19.63%"
                 }
             },
             "FAR EASTERN FEDERAL UNIVERSITY SCHOOL OF BIOMEDICINE": {
                 "2024": {
                     "appeared": 150,
                     "qualified": 50,
                     "percentage": "33.33%"
                 }
             },
             "FIRST MOSCOW STATE MEDICAL UNIVERSITY NAMED AFTER I. M. SECHENOV": {
                 "2024": {
                     "appeared": 54,
                     "qualified": 12,
                     "percentage": "22.22%"
                 }
             },
             "IMMANUEL KANT BALTIC FEDERAL UNIVERSITY INSTITUTE OF MEDICINE": {
                 "2024": {
                     "appeared": 58,
                     "qualified": 28,
                     "percentage": "48.28%"
                 }
             },
             "IRKUTSK STATE MEDICAL UNIVERSITY": {
                 "2024": {
                     "appeared": 44,
                     "qualified": 11,
                     "percentage": "25.00%"
                 }
             },
             "IVANOVO STATE MEDICAL ACADEMY": {
                 "2024": {
                     "appeared": 39,
                     "qualified": 5,
                     "percentage": "12.82%"
                 }
             },
             "IZHEVSK STATE MEDICAL ACADEMY ISMA": {
                 "2024": {
                     "appeared": 16,
                     "qualified": 0,
                     "percentage": "0.00%"
                 }
             },
             "KABARDINO BALKARIAN STATE UNIVERSITY MEDICAL FACULTY": {
                 "2024": {
                     "appeared": 396,
                     "qualified": 105,
                     "percentage": "26.52%"
                 }
             },
             "KAZAN FEDERAL UNIVERSITY INSTITUTE OF FUNDAMENTAL MEDICINE AND BIOLOGY": {
                 "2024": {
                     "appeared": 19,
                     "qualified": 13,
                     "percentage": "68.42%"
                 }
             },
             "KAZAN STATE MEDICAL UNIVERSITY": {
                 "2024": {
                     "appeared": 436,
                     "qualified": 134,
                     "percentage": "30.73%"
                 }
             },
             "KEMEROVO STATE MEDICAL UNIVERSITY": {
                 "2024": {
                     "appeared": 75,
                     "qualified": 28,
                     "percentage": "37.33%"
                 }
             },
             "KUBAN STATE MEDICAL UNIVERSITY": {
                 "2024": {
                     "appeared": 52,
                     "qualified": 8,
                     "percentage": "15.38%"
                 }
             },
             "KURSK STATE MEDICAL UNIVERSITY": {
                 "2024": {
                     "appeared": 489,
                     "qualified": 109,
                     "percentage": "22.29%"
                 }
             },
             "LUGANSK STATE MEDICAL UNIVERSITY": {
                 "2024": {
                     "appeared": 1,
                     "qualified": 0,
                     "percentage": "0.00%"
                 }
             },
             "MARI STATE UNIVERSITY MEDICAL FACULTY": {
                 "2024": {
                     "appeared": 930,
                     "qualified": 292,
                     "percentage": "31.40%"
                 }
             },
             "MEDICAL INSTITUTE OF TAMBOV STATE UNIVERSITY NAMED AFTER G. R. DERZHAVIN": {
                 "2024": {
                     "appeared": 257,
                     "qualified": 72,
                     "percentage": "28.02%"
                 }
             },
             "NATIONAL NUCLEAR RESEARCH UNIVERSITY MEPHI ENGINEERING PHYSICS INSTITUTE OF BIOMEDICINE": {
                 "2024": {
                     "appeared": 9,
                     "qualified": 0,
                     "percentage": "0.00%"
                 }
             },
             "NATIONAL RESEARCH OGAREV MORDOVIA STATE UNIVERSITY MEDICAL FACULTY": {
                 "2024": {
                     "appeared": 288,
                     "qualified": 104,
                     "percentage": "36.11%"
                 }
             },
             "NORTH CAUCASIAN STATE ACADEMY": {
                 "2024": {
                     "appeared": 15,
                     "qualified": 4,
                     "percentage": "26.67%"
                 }
             },
             "NORTH CAUCASIAN STATE HUMANITARIAN TECHNOLOGICAL ACADEMY": {
                 "2024": {
                     "appeared": 141,
                     "qualified": 29,
                     "percentage": "20.57%"
                 }
             },
             "NORTH OSSETIAN STATE MEDICAL ACADEMY": {
                 "2024": {
                     "appeared": 188,
                     "qualified": 51,
                     "percentage": "27.13%"
                 }
             },
             "NORTH WESTERN STATE MEDICAL UNIVERSITY I. I. MECHNIKOV": {
                 "2024": {
                     "appeared": 63,
                     "qualified": 2,
                     "percentage": "3.17%"
                 }
             },
             "NORTHERN STATE MEDICAL UNIVERSITY": {
                 "2024": {
                     "appeared": 805,
                     "qualified": 208,
                     "percentage": "25.84%"
                 }
             },
             "OBNINSK INSTITUTE OF ATOMIC ENERGY NATIONAL NUCLEAR RESEARCH UNIVERSITY MEPI MEDICAL FACULTY": {
                 "2024": {
                     "appeared": 3,
                     "qualified": 2,
                     "percentage": "66.67%"
                 }
             },
             "OMSK STATE MEDICAL UNIVERSITY": {
                 "2024": {
                     "appeared": 2,
                     "qualified": 0,
                     "percentage": "0.00%"
                 }
             },
             "OREL STATE UNIVERSITY MEDICAL INSTITUTE": {
                 "2024": {
                     "appeared": 169,
                     "qualified": 40,
                     "percentage": "23.67%"
                 }
             },
             "ORENBURG STATE MEDICAL UNIVERSITY": {
                 "2024": {
                     "appeared": 447,
                     "qualified": 194,
                     "percentage": "43.40%"
                 }
             },
             "PENZA STATE UNIVERSITY MEDICAL INSTITUTE": {
                 "2024": {
                     "appeared": 277,
                     "qualified": 101,
                     "percentage": "36.46%"
                 }
             },
             "PEOPLE S FRIENDSHIP UNIVERSITY OF RUSSIA FACULTY OF MEDICINE": {
                 "2024": {
                     "appeared": 22,
                     "qualified": 10,
                     "percentage": "45.45%"
                 }
             },
             "PERM STATE MEDICAL UNIVERSITY NAMED AFTER ACADEMICIAN E. A. WAGNER": {
                 "2024": {
                     "appeared": 944,
                     "qualified": 295,
                     "percentage": "31.25%"
                 }
             },
             "PETROZAVODSK STATE UNIVERSITY INSTITUTE OF MEDICINE PETRSU": {
                 "2024": {
                     "appeared": 1,
                     "qualified": 0,
                     "percentage": "0.00%"
                 }
             },
             "PITIRIM SOROKIN SYKTYVKAR STATE UNIVERSITY MEDICAL INSTITUTE": {
                 "2024": {
                     "appeared": 6,
                     "qualified": 1,
                     "percentage": "16.67%"
                 }
             },
             "PRIVOLZHSKY RESEARCH MEDICAL UNIVERSITY": {
                 "2024": {
                     "appeared": 213,
                     "qualified": 95,
                     "percentage": "44.60%"
                 }
             },
             "PSKOV STATE UNIVERSITY INSTITUTE OF MEDICINE AND EXPERIMENTAL BIOLOGY": {
                 "2024": {
                     "appeared": 23,
                     "qualified": 4,
                     "percentage": "17.39%"
                 }
             },
             "ROSTOV STATE MEDICAL UNIVERSITY": {
                 "2024": {
                     "appeared": 87,
                     "qualified": 11,
                     "percentage": "12.64%"
                 }
             },
             "RUSSIAN NATIONAL RESEARCH MEDICAL UNIVERSITY NAMED AFTER N. I. PIROGOV": {
                 "2024": {
                     "appeared": 42,
                     "qualified": 18,
                     "percentage": "42.86%"
                 }
             },
             "RUSSIAN STATE MEDICAL UNIVERSITY": {
                 "2024": {
                     "appeared": 1,
                     "qualified": 0,
                     "percentage": "0.00%"
                 }
             },
             "RYAZAN STATE IVAN PETROVICH PAVLOV MEDICAL UNIVERSITY MEDICAL FACULTY": {
                 "2024": {
                     "appeared": 44,
                     "qualified": 12,
                     "percentage": "27.27%"
                 }
             },
             "SAINT PETERSBURG PAVLOV STATE MEDICAL UNIVERSITY": {
                 "2024": {
                     "appeared": 8,
                     "qualified": 0,
                     "percentage": "0.00%"
                 }
             },
             "SAINT PETERSBURG STATE PEDIATRIC MEDICAL UNIVERSITY": {
                 "2024": {
                     "appeared": 11,
                     "qualified": 1,
                     "percentage": "9.09%"
                 }
             },
             "SAMARA STATE MEDICAL UNIVERSITY": {
                 "2024": {
                     "appeared": 5,
                     "qualified": 0,
                     "percentage": "0.00%"
                 }
             },
             "SARATOV STATE MEDICAL UNIVERSITY NAMED AFTER V. I. RAZUMOVSKY": {
                 "2024": {
                     "appeared": 71,
                     "qualified": 15,
                     "percentage": "21.13%"
                 }
             },
             "SIBERIAN STATE MEDICAL UNIVERSITY": {
                 "2024": {
                     "appeared": 67,
                     "qualified": 20,
                     "percentage": "29.85%"
                 }
             },
             "SMOLENSK STATE MEDICAL UNIVERSITY": {
                 "2024": {
                     "appeared": 748,
                     "qualified": 321,
                     "percentage": "42.91%"
                 }
             },
             "STAVROPOL STATE MEDICAL UNIVERSITY": {
                 "2024": {
                     "appeared": 719,
                     "qualified": 132,
                     "percentage": "18.36%"
                 }
             },
             "TULA STATE UNIVERSITY MEDICAL INSTITUTE": {
                 "2024": {
                     "appeared": 2,
                     "qualified": 0,
                     "percentage": "0.00%"
                 }
             },
             "TVER STATE MEDICAL UNIVERSITY": {
                 "2024": {
                     "appeared": 484,
                     "qualified": 118,
                     "percentage": "24.38%"
                 }
             },
             "TYUMEN STATE MEDICAL UNIVERSITY": {
                 "2024": {
                     "appeared": 4,
                     "qualified": 1,
                     "percentage": "25.00%"
                 }
             },
             "ULYANOVSK STATE UNIVERSITY MEDICAL FACULTY NAMED AFTER T. Z. BIKTIMIROV": {
                 "2024": {
                     "appeared": 366,
                     "qualified": 116,
                     "percentage": "31.69%"
                 }
             },
             "V. I. VERNADSKY CRIMEA FEDERAL UNIVERSITY": {
                 "2024": {
                     "appeared": 121,
                     "qualified": 68,
                     "percentage": "56.20%"
                 }
             },
             "VOLGOGRAD STATE MEDICAL UNIVERSITY": {
                 "2024": {
                     "appeared": 586,
                     "qualified": 113,
                     "percentage": "19.28%"
                 }
             },
             "VORONEZH STATE MEDICAL UNIVERSITY NAMED AFTER N. N. BURDENKO": {
                 "2024": {
                     "appeared": 196,
                     "qualified": 55,
                     "percentage": "28.06%"
                 }
             },
             "YAROSLAVL STATE MEDICAL UNIVERSITY": {
                 "2024": {
                     "appeared": 5,
                     "qualified": 1,
                     "percentage": "20.00%"
                 }
             }
         },
         "Uzbekistan": {
             "ANDIZHAN STATE MEDICAL INSTITUTE": {
                 "2024": {
                     "appeared": 4,
                     "qualified": 0,
                     "percentage": "0.00%"
                 }
             },
             "BUKHARA STATE MEDICAL INSTITUTE NAMED AFTER ABU ALI IBN SINO": {
                 "2024": {
                     "appeared": 299,
                     "qualified": 143,
                     "percentage": "47.83%"
                 }
             },
             "SAMARKAND STATE MEDICAL INSTITUTE": {
                 "2024": {
                     "appeared": 54,
                     "qualified": 7,
                     "percentage": "12.96%"
                 }
             },
             "TASHKENT MEDICAL ACADEMY": {
                 "2024": {
                     "appeared": 4,
                     "qualified": 4,
                     "percentage": "100.00%"
                 }
             },
             "TASHKENT STATE DENTAL INSTITUTE FACULTY OF MEDICINE": {
                 "2024": {
                     "appeared": 21,
                     "qualified": 8,
                     "percentage": "38.10%"
                 }
             },
             "URGENCH BRANCH OF TASHKENT MEDICAL ACADEMY": {
                 "2024": {
                     "appeared": 108,
                     "qualified": 35,
                     "percentage": "32.41%"
                 }
             },
             "FERGANA MEDICAL INSTITUTE OF PUBLIC HEALTH": {
                 "2024": {
                     "appeared": 150,
                     "qualified": 45,
                     "percentage": "30.00%"
                 }
             }
         },
         "Kyrgyzstan": {
             "ASIAN MEDICAL INSTITUTE": {
                 "2024": {
                     "appeared": 8,
                     "qualified": 0,
                     "percentage": "0.00%"
                 }
             },
             "AVICENNA INTERNATIONAL MEDICAL UNIVERSITY": {
                 "2024": {
                     "appeared": 28,
                     "qualified": 7,
                     "percentage": "25.00%"
                 }
             },
             "BISHKEK INTERNATIONAL MEDICAL INSTITUTE": {
                 "2024": {
                     "appeared": 140,
                     "qualified": 23,
                     "percentage": "16.43%"
                 }
             },
             "CENTRAL ASIAN INTERNATIONAL MEDICAL UNIVERSITY": {
                 "2024": {
                     "appeared": 21,
                     "qualified": 8,
                     "percentage": "38.10%"
                 }
             },
             "EURASIAN INTERNATIONAL MEDICAL UNIVERSITY FACULTY OF MEDICINE": {
                 "2024": {
                     "appeared": 33,
                     "qualified": 2,
                     "percentage": "6.06%"
                 }
             },
             "I. K. AKHUNBAEV KYRGYZ STATE MEDICAL ACADEMY FACULTY OF GENERAL MEDICINE": {
                 "2024": {
                     "appeared": 1299,
                     "qualified": 410,
                     "percentage": "31.56%"
                 }
             },
             "INTERNATIONAL HIGHER SCHOOL OF MEDICINE": {
                 "2024": {
                     "appeared": 4457,
                     "qualified": 1074,
                     "percentage": "24.10%"
                 }
             },
             "INTERNATIONAL MEDICAL UNIVERSITY": {
                 "2024": {
                     "appeared": 568,
                     "qualified": 132,
                     "percentage": "23.24%"
                 }
             },
             "INTERNATIONAL SCHOOL OF MEDICINE INTERNATIONAL UNIVERSITY OF KYRGYZSTAN EASTERN MEDICAL CAMPUS": {
                 "2024": {
                     "appeared": 254,
                     "qualified": 17,
                     "percentage": "6.69%"
                 }
             },
             "INTERNATIONAL UNIVERSITY OF SCIENCE AND MEDICINE IUSM": {
                 "2024": {
                     "appeared": 211,
                     "qualified": 18,
                     "percentage": "8.53%"
                 }
             },
             "JALAL ABAD PEOPLE S FRIENDSHIP UNIVERSITY A. BATIROV MEDICAL FACULTY": {
                 "2024": {
                     "appeared": 5,
                     "qualified": 2,
                     "percentage": "40.00%"
                 }
             },
             "JALAL ABAD STATE UNIVERSITY MEDICAL FACULTY": {
                 "2024": {
                     "appeared": 1917,
                     "qualified": 472,
                     "percentage": "24.62%"
                 }
             },
             "JALAL ABAD STATE UNIVERSITY NAMED AFTER B. OSMONOV": {
                 "2024": {
                     "appeared": 3,
                     "qualified": 1,
                     "percentage": "33.33%"
                 }
             },
             "KYRGYZ RUSSIAN SLAVIC STATE UNIVERSITY KRSU MEDICAL FACULTY": {
                 "2024": {
                     "appeared": 174,
                     "qualified": 69,
                     "percentage": "39.66%"
                 }
             },
             "OSH INTERNATIONAL MEDICAL UNIVERSITY": {
                 "2024": {
                     "appeared": 160,
                     "qualified": 16,
                     "percentage": "10.00%"
                 }
             },
             "OSH STATE UNIVERSITY MEDICAL FACULTY": {
                 "2024": {
                     "appeared": 3070,
                     "qualified": 817,
                     "percentage": "26.61%"
                 }
             },
             "ROYAL METROPOLITAN UNIVERSITY": {
                 "2024": {
                     "appeared": 61,
                     "qualified": 9,
                     "percentage": "14.75%"
                 }
             },
             "S. TENTISHEV ASIAN MEDICAL INSTITUTE": {
                 "2024": {
                     "appeared": 2699,
                     "qualified": 709,
                     "percentage": "26.27%"
                 }
             },
             "SALYMBEKOV UNIVERSITY FACULTY OF MEDICINE": {
                 "2024": {
                     "appeared": 13,
                     "qualified": 5,
                     "percentage": "38.46%"
                 }
             },
             "SCIENTIFIC RESEARCH MEDICAL SOCIAL INSTITUTE": {
                 "2024": {
                     "appeared": 5,
                     "qualified": 0,
                     "percentage": "0.00%"
                 }
             },
             "TENTISHEV SATKYNBAY MEMORIAL ASIAN MEDICAL INSTITUTE": {
                 "2024": {
                     "appeared": 2,
                     "qualified": 1,
                     "percentage": "50.00%"
                 }
             }
         },
         "Georgia": {
             "AKAKI TSERETELI STATE UNIVERSITY FACULTY OF MEDICINE": {
                 "2024": {
                     "appeared": 152,
                     "qualified": 43,
                     "percentage": "28.29%"
                 }
             },
             "ALTE UNIVERSITY SCHOOL OF MEDICINE": {
                 "2024": {
                     "appeared": 75,
                     "qualified": 35,
                     "percentage": "46.67%"
                 }
             },
             "AVICENNA BATUMI MEDICAL UNIVERSITY": {
                 "2024": {
                     "appeared": 2,
                     "qualified": 0,
                     "percentage": "0.00%"
                 }
             },
             "BATUMI SHOTA RUSTAVELI STATE UNIVERSITY FACULTY OF NATURAL SCIENCES AND HEALTH CARE": {
                 "2024": {
                     "appeared": 396,
                     "qualified": 165,
                     "percentage": "41.67%"
                 }
             },
             "BAU INTERNATIONAL UNIVERSITY FACULTY OF MEDICINE": {
                 "2024": {
                     "appeared": 158,
                     "qualified": 100,
                     "percentage": "63.29%"
                 }
             },
             "CAUCASUS INTERNATIONAL UNIVERSITY FACULTY OF MEDICINE": {
                 "2024": {
                     "appeared": 106,
                     "qualified": 35,
                     "percentage": "33.02%"
                 }
             },
             "CAUCASUS UNIVERSITY SCHOOL OF MEDICINE AND HEALTHCARE MANAGEMENT": {
                 "2024": {
                     "appeared": 98,
                     "qualified": 54,
                     "percentage": "55.10%"
                 }
             },
             "DAVID TVILDIANI MEDICAL UNIVERSITY AIETI MEDICAL SCHOOL": {
                 "2024": {
                     "appeared": 167,
                     "qualified": 81,
                     "percentage": "48.50%"
                 }
             },
             "EAST EUROPEAN UNIVERSITY FACULTY OF HEALTHCARE SCIENCES": {
                 "2024": {
                     "appeared": 61,
                     "qualified": 14,
                     "percentage": "22.95%"
                 }
             },
             "EAST WEST UNIVERSITY": {
                 "2024": {
                     "appeared": 9,
                     "qualified": 0,
                     "percentage": "0.00%"
                 }
             },
             "EUROPEAN UNIVERSITY FACULTY OF MEDICINE": {
                 "2024": {
                     "appeared": 420,
                     "qualified": 151,
                     "percentage": "35.95%"
                 }
             },
             "GEORGIAN AMERICAN UNIVERSITY": {
                 "2024": {
                     "appeared": 61,
                     "qualified": 49,
                     "percentage": "80.33%"
                 }
             },
             "GEORGIAN NATIONAL UNIVERSITY SEU FACULTY OF MEDICINE": {
                 "2024": {
                     "appeared": 154,
                     "qualified": 93,
                     "percentage": "60.39%"
                 }
             },
             "GRIGOL ROBAKIDZE UNIVERSITY SCHOOL OF MEDICINE": {
                 "2024": {
                     "appeared": 668,
                     "qualified": 138,
                     "percentage": "20.66%"
                 }
             },
             "IVANE JAVAKHISHVILI TBILISI STATE UNIVERSITY FACULTY OF MEDICINE": {
                 "2024": {
                     "appeared": 96,
                     "qualified": 45,
                     "percentage": "46.88%"
                 }
             },
             "LLC EAST-WEST UNIVERSITY": {
                 "2024": {
                     "appeared": 38,
                     "qualified": 4,
                     "percentage": "10.53%"
                 }
             },
             "NEW VISION UNIVERSITY SCHOOL OF MEDICINE": {
                 "2024": {
                     "appeared": 284,
                     "qualified": 104,
                     "percentage": "36.62%"
                 }
             },
             "PETRE SHOTADZE TBILISI MEDICAL ACADEMY FACULTY OF MEDICINE": {
                 "2024": {
                     "appeared": 280,
                     "qualified": 90,
                     "percentage": "32.14%"
                 }
             },
             "TBILISI OPEN TEACHING UNIVERSITY SCHOOL OF MEDICINE": {
                 "2024": {
                     "appeared": 8,
                     "qualified": 3,
                     "percentage": "37.50%"
                 }
             },
             "TBILISI STATE MEDICAL UNIVERSITY FACULTY OF MEDICINE": {
                 "2024": {
                     "appeared": 703,
                     "qualified": 215,
                     "percentage": "30.58%"
                 }
             },
             "TEACHING UNIVERSITY GEOMEDI FACULTY OF MEDICINE": {
                 "2024": {
                     "appeared": 280,
                     "qualified": 83,
                     "percentage": "29.64%"
                 }
             },
             "UNIVERSITY OF GEORGIA SCHOOL OF HEALTH SCIENCES AND PUBLIC HEALTH": {
                 "2024": {
                     "appeared": 5,
                     "qualified": 3,
                     "percentage": "60.00%"
                 }
             }
         }
     };

     if (fmgeCountrySelect && fmgeUniversitySelect) {
         console.log('[FMGE] FMGE Country and University selects found. Attaching change listener.');
         fmgeCountrySelect.addEventListener('change', () => {
             const selectedCountry = fmgeCountrySelect.value;
             fmgeUniversitySelect.innerHTML = '<option value="">Select University</option>'; // Clear previous options
             if (selectedCountry && fmgeData[selectedCountry]) {
                 for (const universityName in fmgeData[selectedCountry]) {
                     const option = document.createElement('option');
                     option.value = universityName;
                     option.textContent = universityName;
                     fmgeUniversitySelect.appendChild(option);
                 }
                 console.log(`[FMGE] Universities dropdown populated for ${selectedCountry}.`);
             } else {
                 console.log('[FMGE] No country selected or no data for selected country to populate universities.');
             }
         });
     } else {
         console.warn('[FMGE] FMGE Country Select (fmgeCountrySelect) or University Select (fmgeUniversitySelect) not found. FMGE dropdown functionality disabled.');
     }

     if (getFmgePercentageBtn && fmgeCardsGrid && fmgeSearchInput) {
         console.log('[FMGE] FMGE Percentage button and results grid found. Attaching listener.');
         getFmgePercentageBtn.addEventListener('click', () => {
             console.log('[FMGE] "Get FMGE Percentage" button CLICKED!');
             const selectedCountry = fmgeCountrySelect ? fmgeCountrySelect.value : '';
             const selectedUniversity = fmgeUniversitySelect ? fmgeUniversitySelect.value : '';
             const searchTerm = fmgeSearchInput.value.toLowerCase().trim();

             fmgeCardsGrid.innerHTML = ''; // Clear previous results

             if (!selectedCountry && !searchTerm) {
                 showCustomMessage('Please select a country or enter a university name to search FMGE data.', 'error');
                 return;
             }

             let resultsFound = false;
             let displayedCount = 0;

             for (const countryName in fmgeData) {
                 // Filter by selected country (if one is chosen)
                 if (selectedCountry && countryName !== selectedCountry) continue;

                 for (const universityName in fmgeData[countryName]) {
                     // Filter by search term (if provided)
                     const matchesSearch = searchTerm ?
                         (universityName.toLowerCase().includes(searchTerm) || countryName.toLowerCase().includes(searchTerm)) :
                         true;

                     if (!matchesSearch) continue; // Skip if no search match

                     // Filter by selected university (if a specific university is chosen)
                     if (selectedUniversity && universityName !== selectedUniversity) continue;

                     resultsFound = true;
                     displayedCount++;
                     const university = fmgeData[countryName][universityName];
                     let yearDataHtml = '';
                     let latestPassPercentage = 'N/A';
                     let latestAppeared = 'N/A';
                     let latestQualified = 'N/A';

                     // Sort years in descending order to get the latest easily
                     const sortedYears = Object.keys(university).filter(key => !isNaN(parseInt(key))).sort((a, b) => parseInt(b) - parseInt(a));

                     if (sortedYears.length > 0) {
                         const latestYear = sortedYears[0];
                         const latestData = university[latestYear];
                         latestPassPercentage = latestData.percentage;
                         latestAppeared = latestData.appeared;
                         latestQualified = latestData.qualified;
                     }

                     sortedYears.forEach(year => {
                         const data = university[year];
                         const passPercent = parseFloat(data.percentage);
                         const safePassPercent = isNaN(passPercent) ? 0 : passPercent; // Ensure it's a number for width

                         yearDataHtml += `
                                    <div class="year-row">
                                        <span>${year}:</span>
                                        <div class="year-bar-container">
                                            <div class="year-bar" style="width: ${safePassPercent}%;"></div>
                                        </div>
                                        <span style="margin-left: 5px;">${data.percentage}</span>
                                    </div>
                                `;
                     });

                     const card = document.createElement('div');
                     card.classList.add('fmge-card');
                     card.innerHTML = `
                                <h4>${universityName}</h4>
                                <p class="country-name">${countryName}</p>
                                <div class="data-row">
                                    <span>Total Students Appeared:</span>
                                    <span>${latestAppeared}</span>
                                </div>
                                <div class="data-row">
                                    <span>Qualified Students:</span>
                                    <span>${latestQualified}</span>
                                </div>
                                <div class="data-row">
                                    <span>Average Pass Percentage (${sortedYears.length > 0 ? sortedYears[0] : 'Latest'}):</span>
                                    <span class="pass-percentage-value">${latestPassPercentage}</span>
                                </div>
                                <div class="progress-bar-container">
                                    <div class="progress-bar" style="--progress-percentage: ${parseFloat(latestPassPercentage) || 0}%;"></div>
                                </div>
                                ${yearDataHtml ? `<div class="year-data-summary"><h5>Year-wise Data:</h5>${yearDataHtml}</div>` : ''}
                            `;
                     fmgeCardsGrid.appendChild(card);
                 }
             }

             if (!resultsFound) {
                 fmgeCardsGrid.innerHTML = '<p style="text-align:center; color: #555;">No FMGE data found for the selected criteria or search term. Please try broadening your search.</p>';
                 console.log('[FMGE] No results found for the given criteria.');
             } else {
                 console.log(`[FMGE] Successfully displayed ${displayedCount} universities.`);
             }
         });
     } else {
         console.warn('[FMGE] FMGE search button (getFmgePercentageBtn), results grid (fmgeCardsGrid), or search input (fmgeSearchInput) not found. FMGE data display disabled.');
     }
 });