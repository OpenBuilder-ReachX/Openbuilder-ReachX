export interface ParsedData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: string | null;
    textParams: string; // The full raw text for debugging/AI
    confidence: number; // 0-100 score of how sure we are
}

export const extractCandidateData = (text: string): ParsedData => {
    let confidence = 0;

    // 1. Email
    const emailMatch = text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/);
    const email = emailMatch ? emailMatch[0] : '';
    if (email) confidence += 40;

    // 2. Phone (Mauritius + General)
    // Matches +230 57654321, 5 765 4321, etc.
    const phoneMatch = text.match(/(\+?230|00230)?\s?[546]\d{3}\s?\d{4}/);
    const phone = phoneMatch ? phoneMatch[0] : '';
    if (phone) confidence += 20;

    // 3. Name (Hardest part)
    // Heuristic: First line that isn't empty, usually.
    // Clean text first
    const cleanLines = text.split(/\r\n|\n|\r/).map(l => l.trim()).filter(l => l.length > 0);

    // Skip common header words
    const skipWords = ['curriculum', 'vitae', 'resume', 'cv', 'personal', 'details', 'profile'];
    let nameLine = '';

    for (const line of cleanLines) {
        if (skipWords.some(w => line.toLowerCase().includes(w))) continue;
        // If line is reasonably short (likely a name, not a paragraph)
        if (line.split(' ').length < 5) {
            nameLine = line;
            break;
        }
    }

    // Fallback if loop failed (just take first line)
    if (!nameLine && cleanLines.length > 0) nameLine = cleanLines[0];

    const parts = nameLine.split(' ');
    let firstName = parts[0] || 'Unknown';
    let lastName = parts.slice(1).join(' ') || 'Candidate';

    // Capitalize properly
    firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
    lastName = lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase();

    if (firstName !== 'Unknown') confidence += 20;

    // 4. Role Detect (Keyword dictionary)
    const lowerText = text.toLowerCase();
    const roles = [
        'welder', 'carpenter', 'mason', 'driver', 'accountant', 'nurse',
        'waiter', 'chef', 'electrician', 'plumber', 'mechanic', 'supervisor'
    ];
    const foundRole = roles.find(r => lowerText.includes(r));
    const role = foundRole ? foundRole.charAt(0).toUpperCase() + foundRole.slice(1) : 'General Worker';

    if (foundRole) confidence += 20;

    return {
        firstName,
        lastName,
        email,
        phone,
        role,
        textParams: text,
        confidence
    };
};
