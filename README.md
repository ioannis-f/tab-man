# tab-man

This add-on was built particularly for real world use. 
This add-on implements smart practices for tab managing, bookmarking, history
and clipboard interaction.

That said, with this add-on you are able to:

- Organize your browser sessions giving a persistent name.
- Automatically synchronize with the changes you do on the respective window. 
  That means if you remove a tab from the respective window this reflects also to the underlying database.
- Keep your window session available even after closing the window.
- Drag 'n' drop functionality to organize windows order at your will.

- Copy to clipboard: 
  Copy window session to clipboard in an organized way in order to paste it whenever you want.
- Paste from clipboard: 
  Paste text from clipboard, grab links with smart routines and finally open a new window with a tab for each link found.

- Show window:
  Bring to front a specific window.

- Open in Tab:
  Open and use this add-on into a browser tab.

- CleanUp command that removes all database entries for windows that are closed and with no name attached.

- Bulk operation: Move up, Move down, Copy, Select all, Unselect all


*** This add-on is still in development and there is work to be done:
  - Help page is not implemented yet
  - Cleanup command  is not implemented yet
  - Final code clean-up and refactor is not done yet


*** In order to install, please follow these steps:
    git clone https://github.com/ioannis-f/tab-man.git
  And then:
    in chrome visit: chrome://add-ons/
    enable "Developer mode" at top-right of the page,
    click "Load Unpacked" at top-left of the page,
    and choose "tab-man/tab-man" folder (the one that contains: "manifest.json" file).

