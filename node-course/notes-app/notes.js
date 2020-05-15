const chalk = require('chalk');
const fs = require('fs');

const addNote = (title, body) => {
    const notes = getNotes();
    const duplicateNotes = notes.filter(note => note.title === title);

    if(duplicateNotes.length === 0) {
        notes.push({
            title,
            body
        });
        saveNotes(notes);
        console.log(chalk.bgGreen('New note added!!'));
    } else {
        console.log(chalk.bgBlue('Note title taken!!'));
    }
    
};

const removeNote = (title) => {
    const notes = getNotes();
    const filteredNotes = notes.filter(note => note.title !== title);

    if(filteredNotes.length < notes.length) {
        saveNotes(filteredNotes);
        console.log(chalk.bgGreen('Note removed!!'));
    } else {
        console.log(chalk.bgRed('No note found!!'));
    }
};

const listNotes = () => {
    const notes = getNotes();

    for(let note of notes) {
        console.log(`${note.title} - ${note.body}`);
    }
};

const getNotes = () => {
    try {
        const dataBuffer = fs.readFileSync('notes.json');
        const dataJSON = dataBuffer.toString();
        const data = JSON.parse(dataJSON);
        return data;
    }
    catch(e) {
        return [];
    }
};

const saveNotes = (notes) => {
    const data = JSON.stringify(notes);
    fs.writeFileSync('notes.json', data);
}

module.exports = {
    addNote,
    removeNote,
    listNotes
};