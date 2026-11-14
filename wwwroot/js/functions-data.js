/* public/js/functions-data.js
   The 42 functions from the project specification (CS251 — P2P Tool Library).
   unit: 1 = Members Unit, 2 = Library Unit, 3 = Maintenance Unit
   difficulty: Easy / Medium / Hard (from the project PDF)
*/
const FUNCTIONS = [
  { n: 1,  icon: 'fa-id-card',            unit: 1, difficulty: 'Hard',   name: 'Identity Verification (KYC)',                  idea: 'Verify user identity before high-value tools.' },
  { n: 2,  icon: 'fa-file-alt',           unit: 1, difficulty: 'Easy',   name: 'Tool Specification & Documentation',           idea: 'Upload manual + video + warranty for each tool.' },
  { n: 3,  icon: 'fa-calendar-check',     unit: 1, difficulty: 'Medium', name: 'Dynamic Availability Calendar',                 idea: 'Bookings calendar with buffer / sterilization periods between borrowers.' },
  { n: 4,  icon: 'fa-map-marker-alt',     unit: 1, difficulty: 'Hard',   name: 'Geospatial Tool Discovery',                     idea: 'Search tools by geographic proximity.' },
  { n: 5,  icon: 'fa-tags',               unit: 1, difficulty: 'Easy',   name: 'Multi-Tier Pricing Engine',                     idea: 'Hourly / daily / weekly pricing + membership discount.' },
  { n: 6,  icon: 'fa-shield-alt',         unit: 1, difficulty: 'Hard',   name: 'Trust-Score Algorithm',                         idea: 'User trust score from 0 to 100 based on activity and reviews.' },
  { n: 7,  icon: 'fa-user-clock',         unit: 1, difficulty: 'Medium', name: 'Smart Reservation Request',                     idea: 'Resolve booking conflicts and suggest alternatives.' },
  { n: 8,  icon: 'fa-wallet',             unit: 1, difficulty: 'Hard',   name: 'Deposit / Escrow Management',                   idea: 'Hold an amount in escrow during the rental period.' },
  { n: 9,  icon: 'fa-comment-dots',       unit: 1, difficulty: 'Easy',   name: 'Lender-Borrower Encrypted Messaging',           idea: 'In-app messaging that hides real contact data.' },
  { n: 10, icon: 'fa-rocket',             unit: 1, difficulty: 'Easy',   name: 'Listing "Boost" Logic',                         idea: 'Promote a tool to the top of search results.' },
  { n: 11, icon: 'fa-puzzle-piece',       unit: 1, difficulty: 'Easy',   name: 'Tool Compatibility Checker',                    idea: 'Filter tool compatibility with the task / project.' },
  { n: 12, icon: 'fa-file-medical',       unit: 1, difficulty: 'Easy',   name: 'Damage Declaration Workflow',                   idea: 'Immediate damage reporting with photos.' },
  { n: 13, icon: 'fa-gift',               unit: 1, difficulty: 'Easy',   name: 'Referral Reward Tracking',                      idea: 'Credit reward when referring a new member.' },
  { n: 14, icon: 'fa-medal',              unit: 1, difficulty: 'Easy',   name: 'Membership Tier Upgrade Logic',                 idea: 'Automatic upgrade to Pro based on activity.' },
  { n: 15, icon: 'fa-clipboard-list',     unit: 2, difficulty: 'Easy',   name: 'Inventory Audit Workflow',                      idea: 'Random inspection to confirm the tool exists.' },
  { n: 16, icon: 'fa-qrcode',             unit: 2, difficulty: 'Easy',   name: 'QR-Based Handover Verification',                idea: 'Scan QR to confirm the actual handover.' },
  { n: 17, icon: 'fa-balance-scale',      unit: 2, difficulty: 'Medium', name: 'Dispute Mediation Hub',                         idea: 'Review evidence and issue a decision on disputes.' },
  { n: 18, icon: 'fa-file-invoice',       unit: 2, difficulty: 'Medium', name: 'Insurance Claim Processing',                    idea: 'Automatic insurance claim report.' },
  { n: 19, icon: 'fa-clock',              unit: 2, difficulty: 'Easy',   name: 'Automated Late Return Escalation',              idea: 'Graduated fines for late returns.' },
  { n: 20, icon: 'fa-ban',                unit: 2, difficulty: 'Easy',   name: 'Blacklist / Suspension Manager',                idea: 'Temporary or permanent bans for violators.' },
  { n: 21, icon: 'fa-map-marked-alt',     unit: 2, difficulty: 'Easy',   name: 'Chapter / Zone Management',                     idea: 'Geographic division for local groups.' },
  { n: 22, icon: 'fa-money-bill-wave',    unit: 2, difficulty: 'Easy',   name: 'Financial Revenue Reporting',                   idea: 'Report detailing the revenues.' },
  { n: 23, icon: 'fa-bullhorn',           unit: 2, difficulty: 'Easy',   name: 'Promotional Campaign Manager',                  idea: 'Discount codes valid for a limited time.' },
  { n: 24, icon: 'fa-project-diagram',    unit: 2, difficulty: 'Easy',   name: 'Taxonomy & Category Mapping',                   idea: 'Hierarchical classification of tool types.' },
  { n: 25, icon: 'fa-people-arrows',      unit: 2, difficulty: 'Easy',   name: 'Librarian Assignment Logic',                    idea: 'Distribute tasks among available librarians.' },
  { n: 26, icon: 'fa-rss',                unit: 2, difficulty: 'Easy',   name: 'System-Wide Broadcast System',                  idea: 'Group alert for a geographic area.' },
  { n: 27, icon: 'fa-hand-holding-usd',   unit: 2, difficulty: 'Medium', name: 'Refund & Credit Reconciliation',                idea: 'Partial refund in case of unexpected damage.' },
  { n: 28, icon: 'fa-chart-line',         unit: 2, difficulty: 'Easy',   name: 'Real-time Activity Dashboard',                  idea: 'Comprehensive live monitoring for the librarian.' },
  { n: 29, icon: 'fa-hourglass-half',     unit: 3, difficulty: 'Easy',   name: 'Usage-Based Maintenance Trigger',               idea: 'Inspection alert after X hours of usage.' },
  { n: 30, icon: 'fa-certificate',        unit: 3, difficulty: 'Easy',   name: 'Safety Certification Logger',                   idea: 'Track expiry of safety certificates.' },
  { n: 31, icon: 'fa-calculator',         unit: 3, difficulty: 'Easy',   name: 'Repair Cost Estimator',                         idea: 'Estimate repair cost from a reference database.' },
  { n: 32, icon: 'fa-boxes',              unit: 3, difficulty: 'Easy',   name: 'Consumables Inventory Tracker',                 idea: 'Track consumables with renewal alerts.' },
  { n: 33, icon: 'fa-lock',               unit: 3, difficulty: 'Easy',   name: '"Unfit for Use" Lockout',                       idea: 'Cancel bookings immediately when an inspection fails.' },
  { n: 34, icon: 'fa-external-link-alt',  unit: 3, difficulty: 'Easy',   name: 'External Repair Integration',                   idea: 'Track repairs done outside the library.' },
  { n: 35, icon: 'fa-lightbulb',          unit: 3, difficulty: 'Easy',   name: 'Warranty Expiry Alert System',                  idea: 'Alert when a manufacturer warranty is about to expire.' },
  { n: 36, icon: 'fa-history',            unit: 3, difficulty: 'Easy',   name: 'Maintenance History Portfolio',                 idea: 'Public maintenance record that builds user trust.' },
  { n: 37, icon: 'fa-book',               unit: 3, difficulty: 'Easy',   name: 'Technical Diagnostic Knowledge Base',           idea: 'Wiki of repair tips for technicians.' },
  { n: 38, icon: 'fa-battery-half',       unit: 3, difficulty: 'Easy',   name: 'Battery Health Tracking',                       idea: 'Lithium battery health percentage per tool.' },
  { n: 39, icon: 'fa-recycle',            unit: 3, difficulty: 'Easy',   name: 'Disposal / Recycle Workflow',                   idea: 'End-of-life retirement and recycling of tools.' },
  { n: 40, icon: 'fa-sort-amount-up',     unit: 3, difficulty: 'Easy',   name: 'Maintenance Priority Queueing',                 idea: 'Order repair requests by priority.' },
  { n: 41, icon: 'fa-cog',                unit: 3, difficulty: 'Easy',   name: 'Replacement Part Procurement',                  idea: 'Track ordering of spare parts.' },
  { n: 42, icon: 'fa-chart-bar',          unit: 3, difficulty: 'Easy',   name: 'Technician Performance Metrics',                idea: 'Evaluate technician performance with statistics.' }
];

const UNIT_NAMES = {
  1: 'Members Unit (1–14)',
  2: 'Library Unit (15–28) — Librarian / Support',
  3: 'Maintenance Unit (29–42)'
};

function fnUrl(n) { return '/Home/function?fn=' + n; }
function getFn(n) { const num = Number(n); return Number.isInteger(num) ? (FUNCTIONS.find(f => num === f.n) || null) : null; }
