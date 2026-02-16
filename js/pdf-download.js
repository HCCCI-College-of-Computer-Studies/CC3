// ============================================================
// UNIVERSITY-STANDARD PDF GENERATION FUNCTION
// Uses jsPDF direct text rendering for sharp, small PDFs
// ============================================================

async function downloadLessonAsPDF() {
    const button = event.currentTarget || event.target;
    const originalText = button.innerHTML;
    button.innerHTML = '⏳ Generating PDF...';
    button.disabled = true;

    // Extract lesson metadata from the page
    const lessonBadge = document.querySelector('.lesson-badge');
    const lessonTitle = document.querySelector('.lesson-hero h2');
    const lessonDesc = document.querySelector('.lesson-hero p');
    
    // Roman numeral to Arabic number converter
    function romanToArabic(roman) {
        const romanMap = { 'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100, 'D': 500, 'M': 1000 };
        let result = 0;
        const str = roman.trim().toUpperCase();
        for (let i = 0; i < str.length; i++) {
            const current = romanMap[str[i]] || 0;
            const next = romanMap[str[i + 1]] || 0;
            result += (current < next) ? -current : current;
        }
        return result;
    }

    const romanNum = lessonBadge ? lessonBadge.textContent.replace('Lesson', '').trim() : 'I';
    const arabicNum = romanToArabic(romanNum);
    const titleText = lessonTitle ? lessonTitle.textContent.trim() : 'Lesson';

    const lessonData = {
        number: romanNum,
        title: titleText,
        subtitle: lessonDesc ? lessonDesc.textContent.trim() : '',
        filename: 'Lesson ' + arabicNum + ' - ' + titleText + '.pdf'
    };

    try {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        const pageWidth = 210;
        const pageHeight = 297;
        const margin = 20;
        const contentWidth = pageWidth - (margin * 2);
        const topMargin = 20;
        const bottomMargin = 25;
        let currentY = topMargin;

        // Helper: Check if we need a new page
        function checkPageBreak(neededHeight) {
            if (currentY + neededHeight > pageHeight - bottomMargin) {
                pdf.addPage();
                currentY = topMargin;
                return true;
            }
            return false;
        }

        // Helper: Add text with word wrap
        function addText(text, fontSize, fontStyle = 'normal', color = [0, 0, 0], indent = 0) {
            pdf.setFont('helvetica', fontStyle);
            pdf.setFontSize(fontSize);
            pdf.setTextColor(color[0], color[1], color[2]);
            const lines = pdf.splitTextToSize(text, contentWidth - indent);
            const lineHeight = fontSize * 0.4;
            
            lines.forEach(line => {
                checkPageBreak(lineHeight + 2);
                pdf.text(line, margin + indent, currentY);
                currentY += lineHeight;
            });
            currentY += 2;
        }

        // Helper: Add code block
        function addCodeBlock(code, label = '') {
            const codeLines = code.split('\n').filter(l => l.trim());
            const blockHeight = (codeLines.length * 3.5) + 12;
            checkPageBreak(blockHeight);

            // Label
            if (label) {
                pdf.setFont('helvetica', 'bold');
                pdf.setFontSize(8);
                pdf.setTextColor(26, 54, 93);
                pdf.text(label, margin, currentY);
                currentY += 4;
            }

            // Background
            const bgHeight = Math.min(codeLines.length * 3.5 + 6, pageHeight - bottomMargin - currentY - 5);
            pdf.setFillColor(245, 245, 245);
            pdf.setDrawColor(200, 200, 200);
            pdf.roundedRect(margin, currentY - 2, contentWidth, bgHeight, 1, 1, 'FD');

            // Code text
            pdf.setFont('courier', 'normal');
            pdf.setFontSize(8);
            pdf.setTextColor(0, 0, 0);
            currentY += 3;
            
            codeLines.forEach(line => {
                if (currentY > pageHeight - bottomMargin - 5) {
                    pdf.addPage();
                    currentY = topMargin;
                    pdf.setFillColor(245, 245, 245);
                    pdf.roundedRect(margin, currentY - 2, contentWidth, 20, 1, 1, 'FD');
                    currentY += 3;
                }
                pdf.text(line.substring(0, 90), margin + 3, currentY);
                currentY += 3.5;
            });
            currentY += 5;
        }

        // Helper: Add section header
        function addSectionHeader(title) {
            checkPageBreak(15);
            
            // Blue left border and background
            pdf.setFillColor(248, 250, 252);
            pdf.setDrawColor(26, 54, 93);
            pdf.rect(margin, currentY - 3, contentWidth, 10, 'F');
            pdf.setLineWidth(0.8);
            pdf.line(margin, currentY - 3, margin, currentY + 7);
            
            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(12);
            pdf.setTextColor(26, 54, 93);
            pdf.text(title, margin + 4, currentY + 3);
            currentY += 12;
        }

        // Helper: Add bullet point
        function addBullet(text, indent = 0) {
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(10);
            pdf.setTextColor(0, 0, 0);
            const bulletX = margin + indent;
            const textX = bulletX + 5;
            const lines = pdf.splitTextToSize(text, contentWidth - indent - 5);
            const lineHeight = 4.5;
            
            checkPageBreak(lines.length * lineHeight + 2);
            pdf.text('•', bulletX, currentY);
            lines.forEach((line, i) => {
                pdf.text(line, textX, currentY);
                currentY += lineHeight;
            });
            currentY += 1;
        }

        // ============================================================
        // PAGE 1: COVER PAGE
        // ============================================================
        pdf.setFont('times', 'bold');
        pdf.setFontSize(18);
        pdf.text('HOLY CHILD CENTRAL COLLEGES, INC.', pageWidth / 2, 50, { align: 'center' });
        
        pdf.setFont('times', 'normal');
        pdf.setFontSize(14);
        pdf.text('College of Computer Studies', pageWidth / 2, 60, { align: 'center' });
        
        pdf.setFontSize(11);
        pdf.text('Surallah, South Cotabato', pageWidth / 2, 68, { align: 'center' });
        
        pdf.setLineWidth(0.5);
        pdf.line(50, 80, pageWidth - 50, 80);
        
        pdf.setFontSize(12);
        pdf.text('Course: CC3 - Computer Programming 2', pageWidth / 2, 110, { align: 'center' });
        
        pdf.setFont('times', 'bold');
        pdf.setFontSize(14);
        pdf.setTextColor(26, 54, 93);
        pdf.text('LESSON ' + lessonData.number, pageWidth / 2, 125, { align: 'center' });
        
        pdf.setFontSize(22);
        pdf.setTextColor(0, 0, 0);
        pdf.text(lessonData.title, pageWidth / 2, 145, { align: 'center' });
        
        pdf.setFont('times', 'italic');
        pdf.setFontSize(11);
        pdf.setTextColor(100, 100, 100);
        // Wrap subtitle if too long
        const subtitleLines = pdf.splitTextToSize(lessonData.subtitle, 140);
        let subtitleY = 158;
        subtitleLines.forEach(line => {
            pdf.text(line, pageWidth / 2, subtitleY, { align: 'center' });
            subtitleY += 5;
        });
        
        pdf.setTextColor(0, 0, 0);
        pdf.line(50, 175, pageWidth - 50, 175);
        
        pdf.setFont('times', 'normal');
        pdf.setFontSize(11);
        pdf.text('Instructor: Jastine M. Gatdula', pageWidth / 2, 210, { align: 'center' });
        pdf.text('Academic Year: 2025-2026, Second Semester', pageWidth / 2, 220, { align: 'center' });
        pdf.text('Campus: Surallah', pageWidth / 2, 230, { align: 'center' });

        // ============================================================
        // CONTENT PAGES - Extract and render text directly
        // ============================================================
        pdf.addPage();
        currentY = topMargin;

        // Get lesson content
        const lessonContent = document.querySelector('.lesson-content');
        if (!lessonContent) throw new Error('Lesson content not found');

        // Process each section
        const sections = lessonContent.querySelectorAll('.section-card');
        
        sections.forEach((section, sectionIndex) => {
            // Skip interactive sections
            if (section.classList.contains('try-it-section') || 
                section.classList.contains('predict-output') ||
                section.classList.contains('interactive-section')) {
                return;
            }

            // Get section title
            const h3 = section.querySelector('h3');
            if (h3) {
                addSectionHeader(h3.textContent.trim());
            }

            // Process content elements
            const elements = section.querySelectorAll('p, h4, ul, ol, .code-example, table, .info-box, .warning-box');
            
            elements.forEach(el => {
                // Skip if inside interactive section
                if (el.closest('.try-it-section') || el.closest('.predict-output')) return;

                if (el.tagName === 'H4') {
                    checkPageBreak(10);
                    pdf.setFont('helvetica', 'bold');
                    pdf.setFontSize(11);
                    pdf.setTextColor(51, 51, 51);
                    pdf.text(el.textContent.trim(), margin, currentY);
                    currentY += 7;
                }
                else if (el.tagName === 'P') {
                    const text = el.textContent.trim();
                    if (text) addText(text, 10, 'normal', [0, 0, 0]);
                }
                else if (el.tagName === 'UL' || el.tagName === 'OL') {
                    const items = el.querySelectorAll(':scope > li');
                    items.forEach((li, i) => {
                        const text = li.textContent.trim();
                        if (el.tagName === 'OL') {
                            addText(`${i + 1}. ${text}`, 10, 'normal', [0, 0, 0], 3);
                        } else {
                            addBullet(text);
                        }
                    });
                    currentY += 2;
                }
                else if (el.classList.contains('code-example')) {
                    const label = el.querySelector('.code-label');
                    const pre = el.querySelector('pre');
                    if (pre) {
                        const code = pre.textContent.trim();
                        addCodeBlock(code, label ? label.textContent.trim() : '');
                    }
                }
                else if (el.tagName === 'TABLE') {
                    const rows = el.querySelectorAll('tr');
                    if (rows.length === 0) return;
                    
                    checkPageBreak(rows.length * 7 + 5);
                    
                    const headers = el.querySelectorAll('th');
                    const cols = headers.length || el.querySelector('tr')?.querySelectorAll('td').length || 3;
                    const colWidth = contentWidth / cols;
                    
                    let tableY = currentY;
                    
                    // Header row
                    if (headers.length > 0) {
                        pdf.setFillColor(230, 240, 255);
                        pdf.rect(margin, tableY - 3, contentWidth, 7, 'F');
                        pdf.setFont('helvetica', 'bold');
                        pdf.setFontSize(9);
                        pdf.setTextColor(0, 0, 0);
                        
                        headers.forEach((th, i) => {
                            const text = th.textContent.trim().substring(0, 25);
                            pdf.text(text, margin + (i * colWidth) + 2, tableY + 1);
                        });
                        tableY += 7;
                    }
                    
                    // Data rows
                    pdf.setFont('helvetica', 'normal');
                    pdf.setFontSize(9);
                    const dataRows = el.querySelectorAll('tbody tr, tr:not(:first-child)');
                    dataRows.forEach(row => {
                        if (row.querySelector('th')) return;
                        const cells = row.querySelectorAll('td');
                        cells.forEach((td, i) => {
                            const text = td.textContent.trim().substring(0, 30);
                            pdf.text(text, margin + (i * colWidth) + 2, tableY + 1);
                        });
                        tableY += 6;
                    });
                    
                    // Table border
                    pdf.setDrawColor(180, 180, 180);
                    pdf.rect(margin, currentY - 3, contentWidth, tableY - currentY + 3);
                    
                    currentY = tableY + 5;
                }
                else if (el.classList.contains('info-box') || el.classList.contains('warning-box')) {
                    const text = el.textContent.trim();
                    checkPageBreak(15);
                    
                    const isWarning = el.classList.contains('warning-box');
                    if (isWarning) {
                        pdf.setFillColor(255, 245, 245);
                        pdf.setDrawColor(229, 62, 62);
                    } else {
                        pdf.setFillColor(240, 247, 255);
                        pdf.setDrawColor(49, 130, 206);
                    }
                    
                    const lines = pdf.splitTextToSize(text, contentWidth - 10);
                    const boxHeight = lines.length * 4 + 6;
                    
                    pdf.rect(margin, currentY - 2, contentWidth, boxHeight, 'F');
                    pdf.setLineWidth(0.8);
                    pdf.line(margin, currentY - 2, margin, currentY + boxHeight - 2);
                    
                    pdf.setFont('helvetica', 'normal');
                    pdf.setFontSize(9);
                    pdf.setTextColor(0, 0, 0);
                    currentY += 3;
                    lines.forEach(line => {
                        pdf.text(line, margin + 5, currentY);
                        currentY += 4;
                    });
                    currentY += 5;
                }
            });

            currentY += 5; // Space between sections
        });

        // ============================================================
        // REFERENCES PAGE
        // ============================================================
        pdf.addPage();
        currentY = topMargin;
        
        pdf.setFont('times', 'bold');
        pdf.setFontSize(16);
        pdf.setTextColor(26, 54, 93);
        pdf.text('References', margin, currentY);
        currentY += 8;
        
        pdf.setLineWidth(0.5);
        pdf.line(margin, currentY, pageWidth - margin, currentY);
        currentY += 10;
        
        const references = [
            'Deitel, P., & Deitel, H. (2020). Java How to Program, Early Objects (11th ed.). Pearson.',
            'Liang, Y. D. (2019). Introduction to Java Programming and Data Structures (12th ed.). Pearson.',
            'Oracle Corporation. (2024). The Java Tutorials. https://docs.oracle.com/javase/tutorial/',
            'Horstmann, C. S. (2018). Core Java Volume I - Fundamentals (11th ed.). Prentice Hall.',
            'Schildt, H. (2018). Java: A Beginners Guide (8th ed.). McGraw-Hill Education.'
        ];
        
        pdf.setFont('times', 'normal');
        pdf.setFontSize(11);
        pdf.setTextColor(0, 0, 0);
        
        references.forEach((ref, i) => {
            const lines = pdf.splitTextToSize(`${i + 1}. ${ref}`, contentWidth - 5);
            lines.forEach(line => {
                pdf.text(line, margin + 3, currentY);
                currentY += 5;
            });
            currentY += 3;
        });

        // ============================================================
        // PAGE NUMBERS (skip cover)
        // ============================================================
        const totalPages = pdf.internal.getNumberOfPages();
        for (let i = 2; i <= totalPages; i++) {
            pdf.setPage(i);
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(9);
            pdf.setTextColor(120, 120, 120);
            
            // Draw separator line
            pdf.setDrawColor(180, 180, 180);
            pdf.setLineWidth(0.3);
            pdf.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);
            
            // Left side: Course info
            pdf.text('CC3: Computer Programming 2 | Instructor: Jastine Gatdula', margin, pageHeight - 10);
            
            // Right side: Page number
            pdf.text(`Page ${i - 1} of ${totalPages - 1}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
        }

        // Save
        pdf.save(lessonData.filename);
        console.log('PDF saved! Pages:', totalPages);

    } catch (error) {
        console.error('PDF Error:', error);
        alert('Error: ' + error.message);
    } finally {
        button.innerHTML = originalText;
        button.disabled = false;
    }
}
