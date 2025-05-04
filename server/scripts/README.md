# StreamX Server Scripts

This directory contains utility scripts for database management and administration tasks.

## Wallet Bootstrap Script

The wallet creation script (`createWallets.js`) helps you generate wallet records for existing users who don't have wallets yet. This is particularly useful after adding the wallet feature to an existing application with users.

### What it does

- Connects to your MongoDB database
- Scans all existing Owners, Editors, and Admins
- Creates wallet records for any user who doesn't already have one
- Sets appropriate wallet types based on user roles
- Initializes each wallet with a default balance of 1000

### How to run

1. Make sure your `.env` file contains the proper `MONGODB_URI` value
2. Run the script using npm:

```bash
npm run create-wallets
```

### Expected output

The script will output detailed information about:

- How many wallets already exist
- How many users of each type were processed
- How many new wallets were created
- A summary of created wallets by user type

Example output:

```bash
Connected to MongoDB
Starting wallet creation process...
Found 5 existing wallets
Processing 10 owners...
Processing 15 editors...
Processing 3 admins...
Successfully created 20 new wallets!

Wallet Creation Summary:
- Owner wallets created: 8
- Editor wallets created: 12
- Admin wallets created: 0
- Total wallets created: 20
- Existing wallets: 5
- Total wallets now: 25
Database connection closed
```

### Troubleshooting

If you encounter any issues:

1. Verify your MongoDB connection string
2. Check that all required models are imported correctly
3. Make sure MongoDB is running and accessible
4. Check MongoDB access permissions
