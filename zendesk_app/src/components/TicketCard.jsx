import { computePriority } from "../utils/computePriority"
import React, { useState } from "react";

export default function TicketCard({ ticket, theme, compact }) {
    const showDetails = !compact;
    const [priority, setPriority] = useState(ticket.priority);
    const [tags, setTags] = useState(ticket.tags.join(", "));
    const [sentiment, setSentiment] = useState(ticket.sentimentScore ?? 0);
    const [ticketNotes, setTicketNotes] = useState(ticket.ticketNotes)
    
    // Ticket updated from user 
    const updatedTicket = {
        ...ticket,
        priority,
        tags: tags.split(",").map(tag => tag.trim()),
        sentimentScore: parseFloat(sentiment),
    };

    // Compute the priority every time it gets updated
    const priorityScore = computePriority(updatedTicket);

    // Styles of the app
    const styles = {
        card: {
            border: theme === 'light' ? '1px solid #ccc' : '1px solid #444',
            padding: "18px",
            marginBottom: "10px",
            borderRadius: "6px",
            backgroundColor: theme === 'light' ? '#f0f0f0' : '#2a2a2a',
            color: theme === 'light' ? '#333' : '#eee',
            transition: "background-color 0.3s ease, color 0.3s ease, border 0.3s ease",
            cursor: "pointer",
            margin: "0 auto",  // Center horizontally
            width: "100%", // fills the sidebar container
            maxWidth: "280px", // optional: constrain width
            boxSizing: "border-box",
        },

        header: {
            display: "flex",
            justifyContent: "space-between",
            fontWeight: "bold",
        },

        field: {
            marginBottom: "12px",
            display: "flex",
            flexDirection: "column",
        },
        label: {
            marginBottom: "4px",
            fontWeight: "bold",
            display: "block",
        },
        input: {
            width: "100%",
            padding: "6px",
            borderRadius: "4px",
            border: theme === 'light' ? "1px solid #aaa" : "1px solid #666",            
            backgroundColor: theme === 'light' ? "#fff" : "#333",
            color: theme === 'light' ? "#000" : "#eee",
            boxSizing: "border-box",
            transition: "background-color 0.3s ease, color 0.3s ease, border 0.3s ease",
        },
    };

    return (
        <div style={styles.card}>
            <h3>{ticket.subject}</h3>
            {showDetails && (
                <>
                <div style={styles.field}>
                    <label style={styles.label}>Priority:</label>
                    <select
                        value={priority}
                        onChange={e => setPriority(e.target.value)}
                        style={styles.input}
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                    </select>
                </div>


                <div style={styles.field}>
                    <label style={styles.label}>Tags (comma separated):</label>
                    <input
                        type="text"
                        value={tags}
                        onChange={e => setTags(e.target.value)}
                        style={styles.input}
                    />
                </div>

                <div style={styles.field}>
                    <label style={styles.label}>Notes (elaborate):</label>
                    <input
                        type="text"
                        value={ticketNotes}
                        onChange={e => setTicketNotes(e.target.value)}
                        style={styles.input}
                    />
                </div>

                <div style={styles.field}>
                    <label style={styles.label}>Sentiment Score:</label>
                    <input
                        type="number"
                        step="0.1"
                        value={sentiment}
                        onChange={e => setSentiment(parseFloat(e.target.value))}
                        style={styles.input}
                    />
                </div>

                <p><strong>SLA Due:</strong> {[new Date(ticket.slaDue).toLocaleString(), " ", getTimeRemaining(ticket.slaDue)]}</p>
                <p><strong>Computed Score:</strong> {priorityScore}</p>
                </>
            )}
        </div>
    );
}

// Calculates how much time is left on the ticket

function getTimeRemaining(slaDue) {
  const now = new Date();
  const due = new Date(slaDue);
  const diffMs = due - now;

  if (diffMs <= 0) return "Past due";

  const diffMins = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMins / 60);
  const minutes = diffMins % 60;

  return `${hours}h ${minutes}m remaining`;
}