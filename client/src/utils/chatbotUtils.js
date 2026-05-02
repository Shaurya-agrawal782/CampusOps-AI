/**
 * Campus AI Action Assistant - Local Intent Classifier
 * Mocks the structured JSON response of a backend Gemini classifier 
 * to ensure robust and highly-responsive offline demos.
 */

export function analyzeChatMessage(text, isAdmin = false) {
  const t = text.toLowerCase();
  
  // Base default structure
  let result = {
    intent: "General",
    category: null,
    priority: "Low",
    campusUnit: null,
    reply: "I'm the CampusOps AI Assistant. How can I help you today?",
    suggestedActions: [],
    needsHumanHelp: false
  };

  // 1. Check for Emergency / Critical conditions
  if (t.match(/\b(fire|medical|harassment|sick|accident|emergency|police|assault|unsafe|dangerous)\b/)) {
    result.intent = "Emergency";
    result.priority = "Critical";
    result.needsHumanHelp = true;
    
    if (t.includes('sick') && t.includes('canteen') || t.includes('food')) {
      result.category = "Canteen";
      result.campusUnit = "Canteen Committee / Medical Room";
      result.reply = "This sounds like a severe health issue related to the canteen food. Please notify the medical room immediately and create a high-priority ticket to pause food services.";
      result.suggestedActions = [
        { label: "Create Emergency Ticket", action: "open_report", prefillText: text }
      ];
    } else {
      result.category = "Security / Medical";
      result.campusUnit = "Campus Security Office";
      result.reply = "This sounds like an emergency. Please contact Campus Security or the Medical Room immediately! You can also log an urgent ticket for documentation.";
      result.suggestedActions = [
        { label: "Log Critical Incident", action: "open_report", prefillText: text }
      ];
    }
    return result;
  }

  // 2. Track Request Intent
  if (t.match(/\b(track|status|ticket|progress)\b/)) {
    result.intent = "Track Request";
    result.reply = "You can track the live status of all your reported campus issues and requests in the tracking portal.";
    result.suggestedActions = [
      { label: "Track My Request", action: "track_request" }
    ];
    return result;
  }

  // 3. Generate Application Intent
  if (t.match(/\b(bonafide|leave|fee|scholarship|application|certificate|letter)\b/)) {
    result.intent = "Generate Application";
    if (t.includes('scholarship')) result.category = "Scholarship Cell";
    else if (t.includes('fee')) result.category = "Accounts / Fees";
    else result.category = "Administration";
    
    result.campusUnit = result.category;
    result.reply = "I can help you generate a formal application for that instantly. Just use our AI Application Generator.";
    result.suggestedActions = [
      { label: "Generate Application", action: "open_application" }
    ];
    return result;
  }

  // 4. Campus Help / Specific Inquiry (e.g. "Where should I report...")
  if (t.includes('where should') || (t.includes('how') && t.includes('report'))) {
    result.intent = "Campus Help";
    if (t.includes('library') && t.includes('wifi')) {
      result.category = "Library";
      result.campusUnit = "Library Office / IT Support";
      result.reply = "For Library WiFi issues, you should create a ticket. It will be automatically routed to the Library Office and IT Support.";
      result.suggestedActions = [
        { label: "Report Library Issue", action: "open_report", prefillText: "Library WiFi is not working" }
      ];
    } else {
      result.reply = "You can report any campus issue directly through our AI triage system, and it will be routed to the correct department automatically.";
      result.suggestedActions = [
        { label: "Report Campus Issue", action: "open_report" }
      ];
    }
    return result;
  }

  // 5. Report Campus Issue Intent
  if (t.match(/\b(paani|water|wifi|internet|smell|break|broken|issue|fix|repair|cleaner|cleaning|dirty|not working|problem)\b/)) {
    result.intent = "Report Campus Issue";
    
    // Attempt category & location parsing
    let loc = "";
    if (t.includes('hostel')) {
      result.category = "Hostel";
      result.campusUnit = "Hostel Warden / Hostel Maintenance";
      loc = "Hostel";
      if (t.includes('hostel b')) loc = "Hostel B";
    } else if (t.includes('canteen') || t.includes('food')) {
      result.category = "Canteen";
      result.campusUnit = "Canteen Committee";
      loc = "Main Canteen";
    } else if (t.includes('library')) {
      result.category = "Library";
      result.campusUnit = "Library Office";
      loc = "Central Library";
    } else if (t.includes('lab') || t.includes('computer')) {
      result.category = "Lab / IT";
      result.campusUnit = "IT Support";
      loc = "Computer Lab";
    }

    if (t.includes('water') || t.includes('paani') || t.includes('smell') || t.includes('sick')) {
      result.priority = "High";
    } else {
      result.priority = "Medium";
    }

    result.reply = `I've detected a ${result.priority.toLowerCase()} priority issue${result.category ? ` related to ${result.category}` : ''}. Let's get this reported so the ${result.campusUnit || 'support team'} can fix it.`;
    result.suggestedActions = [
      { label: "Create Ticket", action: "open_report", prefillText: text, prefillLocation: loc }
    ];
    return result;
  }

  // 6. Admin fallback
  if (isAdmin && (t.includes('admin') || t.includes('dashboard') || t.includes('overview'))) {
    result.reply = "You can view all campus operations and pending tickets in the Command Center.";
    result.suggestedActions = [
      { label: "Open Command Center", action: "admin_dashboard" }
    ];
    return result;
  }

  // 7. General fallback
  result.suggestedActions = [
    { label: "Report an Issue", action: "open_report" },
    { label: "Generate Application", action: "open_application" }
  ];
  
  return result;
}
