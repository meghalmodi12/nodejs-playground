const chalk = require('chalk');
const yargs = require('yargs');
const notes = require('./notes');

// Create add command
yargs.command({
    command: 'add',
    describe: 'Add a new note',
    builder: {
        title: {
            describe: 'Note title',
            demandOption: true,
            type: 'string'
        },
        body: {
            describe: 'Note body',
            demandOption: true,
            type: 'string'
        }
    },
    handler: function(argv) {
        console.log(`Title : ${argv.title}`);
        console.log(`Body : ${argv.body}`);
    }
});

// Create remove command
yargs.command({
    command: 'remove',
    describe: 'Remove a note',
    handler: function() {
        console.log(chalk.red('Remove a note'));
    }
});

// Create list command
yargs.command({
    command: 'list',
    describe: 'List all notes',
    handler: function() {
        console.log(chalk.blue('List all notes'));
    }
});

yargs.parse();