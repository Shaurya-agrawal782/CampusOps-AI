/**
 * Generates an AI-like resolution plan based on ticket properties.
 * Designed specifically to cover the required demo scenarios while 
 * providing robust fallbacks for other issues.
 */
export function generateResolutionPlan(ticket) {
  const tLower = (ticket.title + ' ' + ticket.description).toLowerCase();
  const cat = ticket.category?.toLowerCase() || '';

  // 1. Hostel Water Issue Scenario
  if (cat.includes('hostel') && (tLower.includes('water') || tLower.includes('paani'))) {
    return {
      resolutionTitle: 'Restore Hostel Water Supply',
      recommendedSteps: [
        'Inspect the hostel water tank and main supply valve for blockages or leaks.',
        'Assign hostel maintenance staff or plumbing team for immediate repair.',
        'Arrange a temporary water tanker if repairs take longer than 4 hours.',
        'Update students about expected restoration time.',
        'Mark ticket as resolved after verifying water flow.'
      ],
      requiredCampusUnit: 'Hostel Warden / Hostel Maintenance',
      estimatedResolutionTime: 'Same day (High Priority)',
      communicationMessage: 'We have routed your issue to the hostel maintenance team. They are currently inspecting the water supply and will restore it as soon as possible. Temporary arrangements will be made if needed.'
    };
  }

  // 2. Library WiFi Issue Scenario
  if (cat.includes('library') && (tLower.includes('wifi') || tLower.includes('internet'))) {
    return {
      resolutionTitle: 'Resolve Library WiFi Outage',
      recommendedSteps: [
        'Check the main router and access points in the library.',
        'Verify with ISP if there is an upstream network outage.',
        'Deploy IT Support staff to restart and configure the access points.',
        'Provide temporary backup internet hotspots for students preparing for exams.',
        'Monitor network stability post-resolution.'
      ],
      requiredCampusUnit: 'IT Support / Library Office',
      estimatedResolutionTime: 'Within 2 hours',
      communicationMessage: 'IT Support has been notified about the WiFi outage in the library. Technicians are working to restore the connection immediately to minimize exam preparation disruption.'
    };
  }

  // 3. Canteen Food Issue Scenario
  if (cat.includes('canteen') && (tLower.includes('food') || tLower.includes('smell') || tLower.includes('sick'))) {
    return {
      resolutionTitle: 'Address Canteen Food Hygiene Emergency',
      recommendedSteps: [
        'Temporarily pause food service from the affected canteen stall.',
        'Conduct an immediate hygiene inspection of the kitchen and raw materials.',
        'Notify the campus medical room to be on standby for affected students.',
        'Dispose of the contaminated batch and issue a warning to the vendor.',
        'Resume operations only after passing a strict quality check.'
      ],
      requiredCampusUnit: 'Canteen Committee / Medical Room',
      estimatedResolutionTime: 'Immediate Action Required',
      communicationMessage: 'We take food safety very seriously. Service has been temporarily paused for a hygiene inspection. Affected students should visit the medical room immediately.'
    };
  }

  // 4. Security / Streetlight Issue Scenario
  if (cat.includes('security') || tLower.includes('light') || tLower.includes('dark')) {
    return {
      resolutionTitle: 'Fix Campus Lighting & Improve Patrol',
      recommendedSteps: [
        'Dispatch campus security to patrol the affected dark area immediately.',
        'Send electrical maintenance team to replace broken streetlights/bulbs.',
        'Conduct a safety audit of surrounding pathways.',
        'Ensure the area is well-lit before concluding the ticket.'
      ],
      requiredCampusUnit: 'Security Office / Campus Maintenance',
      estimatedResolutionTime: 'Within 12 hours',
      communicationMessage: 'Security patrols have been increased in your reported area. The maintenance team will replace the broken lights before nightfall.'
    };
  }

  // Generic Fallback based on Priority
  const unit = ticket.aiClassification?.campusUnit || ticket.department || 'Campus Support Team';
  let estimatedTime = '1-2 business days';
  if (ticket.priority === 'critical') estimatedTime = 'Immediate';
  else if (ticket.priority === 'high') estimatedTime = 'Same day';

  return {
    resolutionTitle: `Address ${ticket.category || 'General'} Issue`,
    recommendedSteps: [
      `Review the submitted issue details and any attached evidence.`,
      `Assign the ticket to the ${unit}.`,
      `Determine root cause and required resources for resolution.`,
      `Implement the fix and verify with the student.`,
      `Close the ticket and log the resolution.`
    ],
    requiredCampusUnit: unit,
    estimatedResolutionTime: estimatedTime,
    communicationMessage: `Your issue has been assigned to the ${unit}. We are reviewing it and will take appropriate action shortly.`
  };
}
