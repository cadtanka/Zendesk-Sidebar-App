// Compute the total score of the ticket based off of date, sentimate score, and certain key words
export function computePriority(ticket) {
    const now = new Date();
    const slaTime = new Date(ticket.slaDue) - now;
    const hoursUntilSLA = slaTime / (1000 * 60 * 60)

    let score = 0

    // Urgency to be fixed (SLA)
    if (hoursUntilSLA < 2)
        score += 50
    else if (hoursUntilSLA < 24)
        score += 30
    else
        score += 10

    // Score based on sentiment
    score += Math.round(1 - ticket.sentimentScore) * 20;

    // Score based on key words
    if (ticket.tags.includes("urgent")) score += 20;
    if (ticket.tags.includes("vip")) score += 15;

    return score;
}