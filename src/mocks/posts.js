// src/mocks/posts.js
// Real transactions from unified_transactions_20251110_1339.json
import transactionsData from '../../unified_transactions_20251110_1339.json';

/**
 * Transform a transaction into a post format
 */
function transformTransaction(tx, index) {
  // Parse the date to ISO format
  // Original format: "2025-10-15 4:28:11.0 +00:00:00"
  // Need to convert to valid ISO: "2025-10-15T04:28:11.000Z"
  let dateStr = tx.Date;
  
  // Remove the timezone offset part and the trailing ".0"
  dateStr = dateStr.replace(' +00:00:00', '');
  
  // Split date and time
  const parts = dateStr.split(' ');
  if (parts.length === 2) {
    const datePart = parts[0]; // "2025-10-15"
    let timePart = parts[1]; // "4:28:11.0"
    
    // Remove trailing .0 and split time components
    timePart = timePart.replace(/\.0$/, '');
    const timeComponents = timePart.split(':');
    
    // Pad hours, minutes, seconds with leading zeros
    const hours = timeComponents[0]?.padStart(2, '0') || '00';
    const minutes = timeComponents[1]?.padStart(2, '0') || '00';
    const seconds = timeComponents[2]?.padStart(2, '0') || '00';
    
    // Reconstruct as valid ISO format
    dateStr = `${datePart}T${hours}:${minutes}:${seconds}.000Z`;
  }
  
  // Truncate address for display
  const truncateAddress = (addr) => {
    if (!addr || addr.length < 20) return addr;
    return `${addr.slice(0, 8)}...${addr.slice(-6)}`;
  };
  
  // Extract author name from memo if possible, otherwise use truncated address
  let authorName = truncateAddress(tx["To Address"]);
  const memoLines = tx.Memo ? tx.Memo.split('\n') : [];
  
  // Try to extract a meaningful title from the memo
  let title = "Transaction";
  if (memoLines.length > 1) {
    // Use the second line if it exists and is not empty
    const secondLine = memoLines[1]?.trim();
    if (secondLine && secondLine.length > 0) {
      title = secondLine.length > 50 ? secondLine.slice(0, 50) + '...' : secondLine;
    }
  }
  
  return {
    id: tx.TxID,
    walletAddress: tx["To Address"],
    authorName: authorName,
    authorAvatar: "/blue_avatar_shield_transparent.png",
    authorJoined: dateStr,
    title: title,
    body: tx.Memo || "No memo",
    createdAt: dateStr,
    date: tx.Date, // Keep original date for display
    memo: tx.Memo, // Keep original memo for display
    verifiedCount: 0,
    featured: false,
    rankScore: 0,
    replyAddress: tx["To Address"],
    tags: [tx.Action?.toLowerCase() || "transaction"],
    // Additional transaction info
    action: tx.Action,
    volume: tx.Volume,
    fee: tx.Fee,
    pool: tx.Pool,
  };
}

// Transform all transactions into posts
export const mockPosts = transactionsData.map((tx, index) => transformTransaction(tx, index));

export function getMockPosts() {
  // Return a fresh copy to avoid accidental mutations across components
  return mockPosts.map((p) => ({ ...p }));
}