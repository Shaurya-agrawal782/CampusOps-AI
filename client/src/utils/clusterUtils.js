const STOP_WORDS = new Set(['the', 'is', 'in', 'at', 'of', 'on', 'and', 'a', 'to', 'for', 'with', 'from', 'about', 'by', 'this', 'that', 'it', 'not', 'no', 'me', 'my']);

function extractKeywords(text) {
  if (!text) return [];
  return text.toLowerCase()
    .replace(/[^\w\s]/gi, '')
    .split(/\s+/)
    .filter(word => word.length > 3 && !STOP_WORDS.has(word));
}

function calculateSimilarity(text1, text2) {
  const kw1 = extractKeywords(text1);
  const kw2 = extractKeywords(text2);
  if (kw1.length === 0 || kw2.length === 0) return 0;
  
  const set1 = new Set(kw1);
  let matches = 0;
  kw2.forEach(w => { if (set1.has(w)) matches++; });
  return matches / Math.max(set1.size, kw2.length);
}

export function detectCluster(newTicket, existingTickets) {
  const matches = existingTickets.map(t => {
    let score = 0;
    if (t._id === newTicket._id || t.trackingId === newTicket.trackingId) return { ticket: t, score: 0 };
    if (t.category !== newTicket.category) return { ticket: t, score: 0 };
    
    const loc1 = (t.location?.address || '').toLowerCase();
    const loc2 = (newTicket.location?.address || '').toLowerCase();
    const text1 = (t.title + ' ' + t.description);
    const text2 = (newTicket.title + ' ' + newTicket.description);
    
    if (loc1 && loc2 && (loc1.includes(loc2) || loc2.includes(loc1))) {
      score += 0.5;
    }
    
    score += calculateSimilarity(text1, text2);
    return { ticket: t, score };
  });
  
  const bestMatch = matches.sort((a, b) => b.score - a.score)[0];
  if (bestMatch && bestMatch.score >= 0.2) {
    return bestMatch.ticket;
  }
  return null;
}

export function computeClusters(tickets) {
  const clusters = [];
  const processedIds = new Set();
  const priLevels = { low: 1, medium: 2, high: 3, critical: 4 };
  
  tickets.forEach(ticket => {
    if (processedIds.has(ticket._id)) return;
    
    const clusterGroup = [ticket];
    processedIds.add(ticket._id);
    
    tickets.forEach(other => {
      if (!processedIds.has(other._id) && other.category === ticket.category) {
        const loc1 = (ticket.location?.address || '').toLowerCase();
        const loc2 = (other.location?.address || '').toLowerCase();
        const sameLoc = loc1 && loc2 && (loc1.includes(loc2) || loc2.includes(loc1));
        const textSimilarity = calculateSimilarity(
          ticket.title + ' ' + ticket.description,
          other.title + ' ' + other.description
        );
        
        if (textSimilarity > 0.2 || (sameLoc && textSimilarity > 0.1)) {
          clusterGroup.push(other);
          processedIds.add(other._id);
        }
      }
    });
    
    if (clusterGroup.length > 1) {
      let maxPri = 'low';
      clusterGroup.forEach(t => {
        if (priLevels[t.priority] > priLevels[maxPri]) maxPri = t.priority;
      });
        
      let title = ticket.title;
      const tLower = title.toLowerCase();
      if (tLower.includes('wifi') || tLower.includes('internet')) {
        title = 'Library WiFi Outage';
      } else if (tLower.includes('water') || tLower.includes('paani') || tLower.includes('washroom')) {
        title = 'Hostel B Water Issue';
      }
      
      clusters.push({
        id: `cluster-${ticket._id}`,
        title,
        category: ticket.category,
        location: ticket.location?.address || 'Multiple Locations',
        duplicateCount: clusterGroup.length,
        priority: maxPri,
        campusUnit: ticket.aiClassification?.campusUnit || ticket.department,
        suggestedAction: ticket.aiClassification?.suggestedAction || 'Investigate root cause immediately.',
        relatedTickets: clusterGroup
      });
    }
  });
  
  return clusters;
}
