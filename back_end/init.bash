# For docker testing by running docker compose
# Wait for the database to be ready
while ! nc -z postgres 5432; do
    sleep 1
done

# Run prisma db push
npx prisma db push
# Start the server
npm run start