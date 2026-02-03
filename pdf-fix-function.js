// ============================================================
// UNIVERSITY-STANDARD PDF GENERATION FUNCTION
// 
// ROOT CAUSE OF BLANK PDF (Fixed):
// 1. Container was positioned off-screen (top: -10000px) making it invisible to html2canvas
// 2. The function called window.print() instead of html2pdf().save()
// 3. Missing proper inline styles for PDF rendering
// 4. No page number/footer implementation
//
// HOW THIS FIX RESOLVES IT:
// 1. Container is now positioned at top:0 left:0 with proper visibility
// 2. Uses html2pdf().from().toPdf().save() chain for programmatic generation
// 3. All styles are applied inline to ensure consistent rendering
// 4. Adds page numbers via jsPDF API after PDF generation
// ============================================================

function downloadLessonAsPDF() {
    // Get button reference safely
    const button = event.currentTarget || event.target;
    const originalText = button.innerHTML;
    button.innerHTML = '⏳ Generating PDF...';
    button.disabled = true;

    // ============================================================
    // LESSON METADATA - Customize these values per lesson
    // ============================================================
    const lessonData = {
        number: 'I',
        title: 'Selection Structures',
        subtitle: 'Control Program Flow Using Conditional Statements',
        filename: 'CC3_Lesson1_Selection-Structures.pdf'
    };

    // Auto-detect lesson info from page if available
    const heroTitle = document.querySelector('.lesson-hero h2');
    const heroBadge = document.querySelector('.lesson-badge');
    const heroSubtitle = document.querySelector('.lesson-hero p');
    
    if (heroTitle) lessonData.title = heroTitle.textContent.trim();
    if (heroBadge) lessonData.number = heroBadge.textContent.replace('Lesson', '').trim();
    if (heroSubtitle) lessonData.subtitle = heroSubtitle.textContent.trim();

    // ============================================================
    // CREATE PDF CONTAINER
    // CRITICAL: Must be visible for html2canvas to capture content
    // Position at top:0 left:0, NOT off-screen
    // ============================================================
    const pdfContainer = document.createElement('div');
    pdfContainer.id = 'pdf-export-container';
    pdfContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 210mm;
        min-height: 297mm;
        background: #ffffff;
        color: #000000;
        font-family: 'Times New Roman', Times, serif;
        font-size: 11pt;
        line-height: 1.6;
        z-index: 99999;
        padding: 0;
        margin: 0;
        box-sizing: border-box;
    `;

    // ============================================================
    // COVER PAGE - Academic Standard Format
    // ============================================================
    const coverPageHTML = `
        <div class="pdf-cover-page" style="
            width: 100%;
            min-height: 270mm;
            padding: 25mm 20mm;
            box-sizing: border-box;
            background: #ffffff;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            page-break-after: always;
        ">
            <!-- University Header -->
            <div style="text-align: center;">
                <div style="font-size: 18pt; font-weight: bold; margin-bottom: 8px; letter-spacing: 1px;">
                    HOLY CHILD CENTRAL COLLEGES, INC.
                </div>
                <div style="font-size: 13pt; margin-bottom: 5px;">College of Computer Studies</div>
                <div style="font-size: 11pt; color: #444;">Surallah, South Cotabato</div>
                <hr style="width: 60%; margin: 25px auto; border: none; border-top: 2px solid #1a365d;">
            </div>
            
            <!-- Course & Lesson Info -->
            <div style="text-align: center; flex-grow: 1; display: flex; flex-direction: column; justify-content: center;">
                <div style="font-size: 12pt; margin-bottom: 15px; color: #333;">
                    <strong>Course:</strong> CC3 - Computer Programming 2
                </div>
                <div style="font-size: 13pt; margin-bottom: 20px; color: #1a365d; font-weight: 600;">
                    LESSON ${lessonData.number}
                </div>
                <h1 style="
                    font-size: 26pt;
                    font-weight: bold;
                    margin: 20px 0;
                    color: #000;
                    line-height: 1.3;
                ">${lessonData.title}</h1>
                <p style="
                    font-size: 12pt;
                    font-style: italic;
                    margin: 15px auto;
                    color: #555;
                    max-width: 80%;
                ">${lessonData.subtitle}</p>
            </div>
            
            <hr style="width: 60%; margin: 25px auto; border: none; border-top: 1px solid #999;">
            
            <!-- Instructor & Academic Info -->
            <div style="text-align: center; margin-top: auto;">
                <table style="margin: 0 auto; font-size: 11pt; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 5px 15px; text-align: right; font-weight: bold;">Instructor:</td>
                        <td style="padding: 5px 15px; text-align: left;">Jastine M. Gatdula</td>
                    </tr>
                    <tr>
                        <td style="padding: 5px 15px; text-align: right; font-weight: bold;">Academic Year:</td>
                        <td style="padding: 5px 15px; text-align: left;">2025-2026, Second Semester</td>
                    </tr>
                    <tr>
                        <td style="padding: 5px 15px; text-align: right; font-weight: bold;">Campus:</td>
                        <td style="padding: 5px 15px; text-align: left;">Surallah</td>
                    </tr>
                </table>
            </div>
        </div>
    `;

    // ============================================================
    // REFERENCES SECTION - Academic Standard
    // ============================================================
    const referencesHTML = `
        <div class="pdf-references" style="
            page-break-before: always;
            padding: 20px 0;
            background: #ffffff;
        ">
            <h3 style="
                font-size: 14pt;
                font-weight: bold;
                color: #1a365d;
                border-bottom: 2px solid #1a365d;
                padding-bottom: 8px;
                margin-bottom: 20px;
            ">References</h3>
            <ol style="
                font-size: 10pt;
                line-height: 1.8;
                padding-left: 25px;
                color: #333;
            ">
                <li style="margin-bottom: 10px;">
                    Deitel, P., & Deitel, H. (2020). <em>Java How to Program, Early Objects</em> (11th ed.). Pearson.
                </li>
                <li style="margin-bottom: 10px;">
                    Liang, Y. D. (2019). <em>Introduction to Java Programming and Data Structures, Comprehensive Version</em> (12th ed.). Pearson.
                </li>
                <li style="margin-bottom: 10px;">
                    Oracle Corporation. (2024). <em>The Java™ Tutorials</em>. Retrieved from 
                    <span style="color: #0066cc;">https://docs.oracle.com/javase/tutorial/</span>
                </li>
                <li style="margin-bottom: 10px;">
                    Horstmann, C. S. (2018). <em>Core Java Volume I—Fundamentals</em> (11th ed.). Prentice Hall.
                </li>
                <li style="margin-bottom: 10px;">
                    Schildt, H. (2018). <em>Java: A Beginner's Guide</em> (8th ed.). McGraw-Hill Education.
                </li>
            </ol>
        </div>
    `;

    // ============================================================
    // GET AND PROCESS LESSON CONTENT
    // ============================================================
    const lessonContent = document.querySelector('.lesson-content');
    if (!lessonContent) {
        alert('Error: Lesson content not found. Please refresh the page and try again.');
        button.innerHTML = originalText;
        button.disabled = false;
        return;
    }

    // Clone content to avoid modifying original DOM
    const contentClone = lessonContent.cloneNode(true);

    // Remove interactive/non-printable elements
    const excludeSelectors = [
        '.try-it-section',
        '.predict-output',
        '.interactive-section',
        '.lesson-nav',
        '.mobile-menu-toggle',
        '.code-copy-btn',
        'button',
        'textarea',
        'input[type="text"]',
        'input[type="radio"]',
        '.feedback',
        '.quiz-question button',
        '.collapsible-header'
    ];

    excludeSelectors.forEach(selector => {
        contentClone.querySelectorAll(selector).forEach(el => el.remove());
    });

    // ============================================================
    // APPLY PDF-SPECIFIC INLINE STYLES
    // These override CSS classes for consistent PDF rendering
    // ============================================================
    
    // Style section cards
    contentClone.querySelectorAll('.section-card').forEach(card => {
        card.style.cssText = `
            background: #ffffff;
            border: 1px solid #ddd;
            border-left: 4px solid #1a365d;
            border-radius: 0;
            padding: 15px 20px;
            margin-bottom: 20px;
            page-break-inside: avoid;
            box-shadow: none;
        `;
    });

    // Style headings
    contentClone.querySelectorAll('h3').forEach(h3 => {
        h3.style.cssText = `
            font-size: 14pt;
            font-weight: bold;
            color: #1a365d;
            margin: 0 0 12px 0;
            padding-bottom: 8px;
            border-bottom: 1px solid #ccc;
            page-break-after: avoid;
        `;
    });

    contentClone.querySelectorAll('h4').forEach(h4 => {
        h4.style.cssText = `
            font-size: 12pt;
            font-weight: bold;
            color: #333;
            margin: 15px 0 8px 0;
            page-break-after: avoid;
        `;
    });

    // Style paragraphs
    contentClone.querySelectorAll('p').forEach(p => {
        p.style.cssText = `
            font-size: 11pt;
            line-height: 1.6;
            margin-bottom: 10px;
            text-align: justify;
            color: #000;
            page-break-inside: avoid;
        `;
    });

    // Style code blocks - CRITICAL for readability
    contentClone.querySelectorAll('.code-example').forEach(codeBlock => {
        codeBlock.style.cssText = `
            background: #f5f5f5;
            border: 1px solid #ccc;
            border-left: 3px solid #1a365d;
            border-radius: 0;
            padding: 12px;
            margin: 12px 0;
            page-break-inside: avoid;
            overflow: visible;
        `;
    });

    contentClone.querySelectorAll('pre').forEach(pre => {
        pre.style.cssText = `
            font-family: 'Courier New', Consolas, monospace;
            font-size: 9pt;
            line-height: 1.4;
            margin: 0;
            padding: 0;
            white-space: pre-wrap;
            word-wrap: break-word;
            color: #000;
            background: transparent;
        `;
    });

    contentClone.querySelectorAll('.code-label').forEach(label => {
        label.style.cssText = `
            font-size: 9pt;
            font-weight: bold;
            color: #1a365d;
            display: block;
            margin-bottom: 8px;
            text-transform: uppercase;
        `;
    });

    // Style inline code
    contentClone.querySelectorAll('code').forEach(code => {
        if (!code.closest('pre')) {
            code.style.cssText = `
                font-family: 'Courier New', Consolas, monospace;
                font-size: 10pt;
                background: #f0f0f0;
                padding: 1px 4px;
                border-radius: 2px;
                color: #c7254e;
            `;
        }
    });

    // Style tables
    contentClone.querySelectorAll('table').forEach(table => {
        table.style.cssText = `
            width: 100%;
            border-collapse: collapse;
            margin: 12px 0;
            font-size: 10pt;
            page-break-inside: avoid;
        `;
    });

    contentClone.querySelectorAll('th, td').forEach(cell => {
        cell.style.cssText = `
            border: 1px solid #999;
            padding: 8px 10px;
            text-align: left;
            background: #fff;
        `;
    });

    contentClone.querySelectorAll('th').forEach(th => {
        th.style.background = '#e6f0ff';
        th.style.fontWeight = 'bold';
        th.style.color = '#1a365d';
    });

    // Style info/warning boxes
    contentClone.querySelectorAll('.info-box').forEach(box => {
        box.style.cssText = `
            background: #f0f7ff;
            border-left: 4px solid #3182ce;
            padding: 12px 15px;
            margin: 12px 0;
            page-break-inside: avoid;
            font-size: 10pt;
        `;
    });

    contentClone.querySelectorAll('.warning-box').forEach(box => {
        box.style.cssText = `
            background: #fff5f5;
            border-left: 4px solid #e53e3e;
            padding: 12px 15px;
            margin: 12px 0;
            page-break-inside: avoid;
            font-size: 10pt;
        `;
    });

    // Style lists
    contentClone.querySelectorAll('.outcomes-list, .summary-list').forEach(list => {
        list.style.cssText = `
            padding-left: 25px;
            margin: 10px 0;
        `;
    });

    contentClone.querySelectorAll('.outcomes-list li, .summary-list li').forEach(li => {
        li.style.cssText = `
            margin-bottom: 8px;
            line-height: 1.5;
            font-size: 11pt;
            page-break-inside: avoid;
        `;
    });

    // Style container
    contentClone.querySelectorAll('.container').forEach(container => {
        container.style.cssText = `
            max-width: 100%;
            padding: 0;
            margin: 0;
        `;
    });

    // ============================================================
    // ASSEMBLE FINAL PDF CONTENT
    // ============================================================
    pdfContainer.innerHTML = coverPageHTML;
    
    // Create content wrapper
    const contentWrapper = document.createElement('div');
    contentWrapper.style.cssText = `
        padding: 0 5mm;
        background: #ffffff;
    `;
    contentWrapper.innerHTML = contentClone.innerHTML;
    pdfContainer.appendChild(contentWrapper);
    
    // Add references
    const referencesDiv = document.createElement('div');
    referencesDiv.innerHTML = referencesHTML;
    pdfContainer.appendChild(referencesDiv);

    // Add to document body
    document.body.appendChild(pdfContainer);

    // ============================================================
    // GENERATE PDF USING html2pdf.js
    // CRITICAL: Use .from().toPdf().save() chain, NOT window.print()
    // ============================================================
    setTimeout(() => {
        const opt = {
            margin: [20, 15, 25, 15], // top, left, bottom, right in mm
            filename: lessonData.filename,
            image: { 
                type: 'jpeg', 
                quality: 0.95 
            },
            html2canvas: {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff',
                logging: false,
                letterRendering: true,
                scrollX: 0,
                scrollY: 0,
                windowWidth: pdfContainer.scrollWidth,
                windowHeight: pdfContainer.scrollHeight
            },
            jsPDF: {
                unit: 'mm',
                format: 'a4',
                orientation: 'portrait',
                compress: true
            },
            pagebreak: {
                mode: ['avoid-all', 'css', 'legacy'],
                before: '.pdf-cover-page',
                after: '.pdf-cover-page',
                avoid: ['.section-card', '.code-example', 'pre', 'table', '.info-box', '.warning-box', 'p']
            }
        };

        html2pdf()
            .set(opt)
            .from(pdfContainer)
            .toPdf()
            .get('pdf')
            .then((pdf) => {
                // Add page numbers to footer (skip cover page)
                const totalPages = pdf.internal.getNumberOfPages();
                
                for (let i = 2; i <= totalPages; i++) {
                    pdf.setPage(i);
                    pdf.setFontSize(9);
                    pdf.setTextColor(100);
                    
                    // Footer with instructor name and page numbers
                    const footerText = `Instructor: Jastine M. Gatdula | Page ${i - 1} of ${totalPages - 1}`;
                    const pageWidth = pdf.internal.pageSize.getWidth();
                    const textWidth = pdf.getTextWidth(footerText);
                    const xPos = (pageWidth - textWidth) / 2;
                    
                    pdf.text(footerText, xPos, pdf.internal.pageSize.getHeight() - 10);
                }
            })
            .save()
            .then(() => {
                // Cleanup: Remove temporary container
                if (document.body.contains(pdfContainer)) {
                    document.body.removeChild(pdfContainer);
                }
                button.innerHTML = originalText;
                button.disabled = false;
            })
            .catch((error) => {
                console.error('PDF Generation Error:', error);
                alert('An error occurred while generating the PDF. Please try again.');
                if (document.body.contains(pdfContainer)) {
                    document.body.removeChild(pdfContainer);
                }
                button.innerHTML = originalText;
                button.disabled = false;
            });
    }, 800); // Delay ensures DOM is fully rendered before capture
}
