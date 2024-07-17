For development:

1. Run the Etebase server:
   
   `docker-compose up`

2. Connect to `127.0.0.1:8000` and create users if needed (login: `admin/admin`)

3. Generate protobuf files:

   `yarn proto`

4. Run the web app:
   
   `yarn dev`