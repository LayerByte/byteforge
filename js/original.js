// Page navigation
        function navigateTo(pageId) {
            // Hide all pages
            document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
            // Show target page
            const target = document.getElementById('page-' + pageId);
            if (target) target.classList.add('active');

            // Update nav active state
            document.querySelectorAll('.nav-links a').forEach(a => {
                a.classList.remove('active');
                if (a.dataset.page === pageId) a.classList.add('active');
            });

            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // Demo mode: pre-populate all interactive elements with simulated data.
        // Since this is a static frontend, we hardcoded data in the HTML.
        // The following just ensures console message.
        console.log('BYTEFORGE demo mode enabled. All data is simulated.');

        // Optional: simple click simulation for demo buttons that don't navigate.
        document.querySelectorAll('button:not(.btn-outline):not(.btn-accent)').forEach(btn => {
            if (btn.type === 'submit') return;
            btn.addEventListener('click', function(e) {
                if (this.closest('form')) return;
                // Do nothing special, already handled by navigation or default.
            });
        });