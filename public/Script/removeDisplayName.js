const mongoose = require('mongoose');
const User = require('../model/users').User; // Adjust the path to match your project structure

async function removeDisplayName() {
    try {
        await mongoose.connect('your_database_url', { 
            useNewUrlParser: true, 
            useUnifiedTopology: true 
        });

        console.log("Connected to the database.");

        // Remove displayName field from all user documents
        const result = await User.updateMany({}, { $unset: { displayName: "" } });
        console.log(`${result.modifiedCount} documents updated. DisplayName field removed.`);

        await mongoose.disconnect();
        console.log("Disconnected from the database.");
    } catch (err) {
        console.error("Error removing displayName field:", err);
        process.exit(1);
    }
}

removeDisplayName();
