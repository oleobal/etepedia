# Etepedia

Etepedia is an [etesync](https://www.etesync.com/)-based web app for directories of text (note-taking, personal wikis, etc).

All data is end-to-end encrypted, with the server having no knowledge of the hosted data. Etepedia is a Svelte single-page app that can be served statically; it connects directly to the [Etebase](https://www.etebase.com/) server, which can itself be self-hosted.

## Future planning

Planned improvements:
 - separate more cleanly etebase state and app state
 - back user history and preferences into etebase if they are not device-specific 
 - local security (still back etebase credentials, but lock them behind PIN or similar)

Planned features:
 - page groups
 - history
 - multimedia items (ie host images etc, embed them in pages)

Possible features:
 - collaboration (multiple users on the same directory)
 - live editing (instead of markdown)
 - native app (via Tauri or Capacitor — would allow for better security)

## Development

For development:

1. Run the Etebase server:
   
   `docker-compose up`

   The admin page is accessible at `http://127.0.0.1:8000/admin`, with login `admin/admin`. It can be used to create users.

2. Generate protobuf files:

   `yarn proto`

3. Run the web app:
   
   `yarn dev`

   You can log in with credentials: `admin`, `admin`, `http://127.0.0.1:8000`.