import { useState } from 'react'
import TicketCard from './components/TicketCard'
import { mockTickets } from './data/mockTickets'
import './App.css'
import { useEffect } from 'react';
import { computePriority } from "./utils/computePriority"

function App() {
  const[theme, setTheme] = useState('light');
  const[compactView, setCompactView] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [grouped, setGrouped] = useState(false);
  const [sortBy, setSortBy] = useState("slaScore");
  const [searchQuery, setSearchQuery] = useState("");

  // Filters the tickets by title and tags
  const filteredTickets = mockTickets.filter(ticket => {
    const query = searchQuery.toLowerCase();
    const titleMatch = ticket.subject.toLowerCase().includes(query);
    const tagMatch = ticket.tags.some(tag => tag.toLowerCase().includes(query));
    return titleMatch || tagMatch;
  });

  // Sort the tickets by sentiment score, due date, or ticket score
  const sortedTickets = [...filteredTickets].sort((a, b) => {
    if (sortBy === "slaScore") {
      return new Date(a.slaDue) - new Date(b.slaDue);
    } else if (sortBy === "sentimentScore") {
      return (b.sentimentScore - a.sentimentScore); // descending
    } else if(sortBy === "ticketScore") {
      const priorityScore_b = computePriority(b);
      const priorityScore_a = computePriority(a);
      return priorityScore_b - priorityScore_a;
    }
    return 0;
  }); 

  // An attempt to dynamically change the vertical size of the app
  useEffect(() => {
    const client = ZAFClient.init();

    const resizeToContent = () => {
      const height = document.documentElement.scrollHeight;
      client.invoke('resize', { height: `${height}px` });
    };

    const observer = new ResizeObserver(resizeToContent);
    observer.observe(document.body);

    // Initial resize
    resizeToContent();

    return () => observer.disconnect(); // Clean up on unmount
  }, [sortedTickets, grouped, compactView, collapsed, searchQuery]);

  useEffect(() => {
  console.log("Sort by:", sortBy);
  }, [sortBy]);

  // Toggle between light and dark mode
  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const buttonStyle = {
        padding: "8px 12px",
        margin: "8px",
        borderRadius: "4px",
        border: "1px solid",
        backgroundColor: theme === "light" ? "#f0f0f0" : "#333",
        color: theme === "light" ? "#333" : "#f0f0f0",
        borderColor: theme === "light" ? "#ccc" : "#555",
        cursor: "pointer"
  };

  // Allows all buttons to be uniform
  const fullWidthButtonStyle = {
    ...buttonStyle,
    width: "100%",
    fontSize: "14px",
    padding: "6px",
    margin: "8px 0",
  };

  const styles = {
    sidebar: {
      top: 0,
      left: 0,
      height: "100vh",
      width: collapsed ? "40px" : "320px",
      padding: collapsed ? "0" : "16px",
      overflow: "hidden", // hides overflowing content
      backgroundColor: theme === "light" ? "#f9f9f9" : "#1e1e1e",
      color: theme === "light" ? "#333" : "#eee",
      borderRight: theme === "light" ? "1px solid #ddd" : "1px solid #444",
      boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
      transition: "width 0.3s ease, padding 0.3s ease",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-start",    
      overflowY: "auto",
      overflowX: "hidden",
    },
    sidebarHeader: {
      marginBottom: "12px",
      fontSize: "18px",
      fontWeight: "bold",
    },
    mainContent: {
      marginLeft: collapsed ? "40px" : "320px",
      padding: "24px",
      transition: "margin-left 0.3s ease",
    },
  };

  return (
    <div style={{ flexGrow: 1, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className={`app ${theme}`} style={{ minHeight: '100%', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>        <div style={styles.sidebar}>
          <button
            style={{
              ...buttonStyle,
              width: "100%",
              fontSize: "14px",
              padding: "6px",
              margin: "8px 0",
            }}
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? "▶" : "◀ Collapse"}
          </button>

          {!collapsed && (
            <>
              {/* Always-visible buttons */}
              <button style={fullWidthButtonStyle} onClick={toggleTheme}>
                Switch to {theme === "light" ? "Dark" : "Light"} mode
              </button>

              <button
                style={fullWidthButtonStyle}
                onClick={() => setGrouped(!grouped)}
              >
                {grouped ? "Hide Tickets" : "Show All Tickets"}
              </button>

              {/* All displayed data when tickets are shown */}
              {grouped && (
                <>
                  <button
                    style={fullWidthButtonStyle}
                    onClick={() => setCompactView(prev => !prev)}
                  >
                    {compactView ? "Expand All" : "Collapse All"}
                  </button>

                  <select
                    className={`dropdown ${theme}`}
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{ width: "100%", padding: "6px", margin: "8px 0" }}
                  >
                    <option value="slaScore">Sort by Due Date</option>
                    <option value="sentimentScore">Sort by Sentiment Score</option>
                    <option value="ticketScore">Sort by Ticket Score</option>
                  </select>

                  <input
                    type="text"
                    value={searchQuery}
                    placeholder="Search by title or tag..."
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`search-bar ${theme}`}
                    style={{
                      ...fullWidthButtonStyle,
                      boxSizing: "border-box",
                      border: "1px solid",
                      borderColor: theme === "light" ? "#ccc" : "#555",
                      backgroundColor: theme === "light" ? "#fff" : "#2c2c2c",
                      color: theme === "light" ? "#000" : "#f0f0f0",
                    }}
                  />

                  <div
                    style={{
                      border: "1px dashed #888",
                      padding: "8px",
                      borderRadius: "6px",
                      backgroundColor: theme === "light" ? "#fff" : "#2a2a2a",
                      width: "100%",
                    }}
                  >
                    <h2 style={styles.sidebarHeader}>
                      All Tickets ({sortedTickets.length})
                    </h2>

                    {sortedTickets.length === 0 ? (
                      <div className="no-results">
                        No tickets found matching "{searchQuery}"
                      </div>
                    ) : (
                      sortedTickets.map(ticket => (
                        <TicketCard
                          key={ticket.id}
                          ticket={ticket}
                          theme={theme}
                          compact={compactView}
                        />
                      ))
                    )}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}


export default App
