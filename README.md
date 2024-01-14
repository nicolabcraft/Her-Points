# Manager Bot

## Introduction

Manager Bot is a Discord bot designed to enhance your server management experience. This project was developed by NonozgYtb & Nicolabcraft and draws inspiration from TurboGamer71.

**GitHub Repository:** [Manager Bot GitHub](https://github.com/nicolabcraft/Her-Points)

## Getting Started

Follow these steps to set up and run the Manager Bot on your Discord server:

### 1. Rename the Configuration File

- Rename the file "config.copy.js" to "config.js" located in the "config" folder (`config/config.copy.js`).

### 2. Configure Connection Options

- Open the `config.js` file in the "config" folder.
  - Configure the database connection options.
  - Set the bot status using the configuration file.
  - Configure the CMS (Content Management System) by setting the type on Line 3.

### 3. Modify Coin Rewards for Daily/Weekly/Monthly Commands

- Navigate to the `economie.js` file located in `commands/slash/general/`.
- Modify the coin rewards for daily/weekly/monthly commands on Line 25.

### 4. Update Database Connection Information in PHP File

- Update the database connection information in the `index.php` file located in the "config" folder (`config/config.js` - LINE 3).

### 5. Import PHP File to Your Website

- Import the `index.php` file to your website.
- Enter the URL in the configuration file to access it (`commands/slash/general/economie.js` - LINE 87).

### 6. Launch the Bot

- Launch the bot to start enjoying its features on your Discord server.

## Contributions

Feel free to contribute to the development of the Manager Bot by submitting pull requests. Your contributions are highly appreciated!

## License

This project is licensed under the [MIT License](LICENSE).
