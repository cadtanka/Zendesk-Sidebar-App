# Zendesk Sidebar Ticket Manager App:

A sidebar style app that allows the user to more easily access and view tickets 


## FEATURES:
Light/Dark mode: A simple light/dark mode button toggle was implemented to allow the user to easily change to the mode of their preference. 

Collapsable Sidebar: A button that allows the user to completely minimize the view of ticket info, minimizing the space taken by the app when not needed. 

Ticket sorting: Allows the user to sort their tickets by due date, sentiment score, and overall ticket score. 

Ticket searching: Allows the user to search for a certain ticket based off of title or keywords. 

Compact view: Minimizes the tickets to hide their info, but still displays their titles to the user. 

Editable Ticekts: Allows the user to change the inormation on the tickets, such as priority and sentimate score. 

## ATTEMPTED FEATURES:
Dynamic resizing: When creating the app in zendesk, I realized that the window the sidebar was shown in was limited vertically. I tried to override this to allow the app to expand into empty space in order to allow tickets to be viewed without as much scrolling.  

## TECH STACK:
React 

Zendesk App Framework 

CSS Modules 

Webpack 

## ASSUMPTIONS: 
This code uses mock data, and assumes all data will be entered in the following format: 

    {
        id: 1,
        subject: "Login issue",
        priority: "High",
        slaDue: "2025-08-15T14:00:00Z",
        ticketNotes: "Lorem Epsum",
        tags: ["authentication", "urgent"],
        sentimentScore: -0.6,
    }
    
We assume:

- All of these fields are non-null
    
- No latency when loading data and states
    
- No input failures or misreads
    
- No forbidden characters - symbols and emojis could break our implementation

## SETUP INSTRUCTIONS:
1. Clone the repo

2. Install Dependencies:
        npm install

3. Install Zendesk CLI

4. Start the local server:
        zcli apps:server

5. Open Zendesk agent view
        https://<your-subdomain>.zendesk.com/agent/tickets/<ticket-id>?zcli_apps=true

6. Build the app: npm run build

7. Copy these files into the Assets Folder:
        cp dist/index.html assets/index.html
        cp -r dist/assets assets/assets

8. Package the app:
        zcli apps:package

## NOTE:
Thank you for taking the time to look through my code! I appreciate the time and effort your team has gone through to get to learn more about me. I hope to hear back from you guys soon, and I wish you all the best. 
