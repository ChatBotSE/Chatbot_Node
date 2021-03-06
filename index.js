//Group 41
/*
Let it be know that this is a proof of concept as a chatbot for AUT paper information. This products functionality goes as far as being able to detect what users are asking and responding 
with what it believes is the subject of what the user wants. We have wished to implement fully the PSQL database that we have hooked up to this chatbot but have unfortuantely not been able to.

This does not mean the PSQL is not set up and being recorded with its outputs, its just not connected to the client-side.
*/
// Reference packages required
var restify = require('restify');
var builder = require('botbuilder');

// ----------------------------------------------------------
// Bot Setup
// ----------------------------------------------------------

// Setup Restify Server

var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function() {
    console.log('%s listening to %s', server.name, server.url);
});

// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

var bot = new builder.UniversalBot(connector);

// If a Post request is made to /api/messages on port 3978 of our local server, pass to bot to handle
server.post('/api/messages', connector.listen());

// ----------------------------------------------------------
// Bots Dialogs 
// ----------------------------------------------------------

// Root Dialogue
var bot = new builder.UniversalBot(connector, function(session, args) {
    session.send('You reached the default message handler. You said \'%s\'.', session.message.text);
});

//LUIS Validation points
var luisAppId = '3aa645c1-9347-4a5a-a25f-022baf694b6f';
var luisAPIKey = '3470666eed1d471993bc88964aa0ea16';
var luisAPIHostName = 'westus.api.cognitive.microsoft.com';

const LuisModelUrl = 'https://' + luisAPIHostName + '/luis/v2.0/apps/' + luisAppId + '?subscription-key=' + luisAPIKey;

// Create a recognizer that gets intents from LUIS
var recognizer = new builder.LuisRecognizer(LuisModelUrl);
bot.recognizer(recognizer);

// Add a dialog for each intent that the LUIS app recognizes.

//Paper Code
bot.dialog('PaperCodeDialog',
    (session, args) => {
        var intent = args.intent;
        sqlEngine(detectEntities(intent.entities));
        var results = detectEntities(intent.entities);

        if (results[2] != '') {
            session.send('Detected intent as Code, Detected Entity.  Name = \'%s\', Code = \'%s\', major = \'%s\',level = \'%s\'.', results[0], results[1], results[2], results[3]);
        } else {
            session.send('You reached the paper code intent with no major selected');
        }
        session.endDialog();
    }
).triggerAction({
    matches: 'Code'
})

//Paper Core
bot.dialog('PaperCoreDialog',
    (session, args) => {
        var intent = args.intent;
		sqlEngine(detectEntities(intent.entities));
        var results = detectEntities(intent.entities);

        if (results[2] != '') {
            session.send('Detected intent as Core, Detected Entity.  Name = \'%s\', Code = \'%s\', major = \'%s\',level = \'%s\'.', results[0], results[1], results[2], results[3]);
        } else {
            session.send('You reached the paper core intent with no major selected');
        }
        session.endDialog();
    }
).triggerAction({
    matches: 'Core'
})

//Paper Level
bot.dialog('PaperLevelDialog',
    (session, args) => {
        var intent = args.intent;
		sqlEngine(detectEntities(intent.entities));
        var results = detectEntities(intent.entities);

        if (results[2] != '') {
            session.send('Detected intent as Level, Detected Entity.  Name = \'%s\', Code = \'%s\', major = \'%s\',level = \'%s\'.', results[0], results[1], results[2], results[3]);
        } else {
            session.send('You reached the paper level intent with no major selected');
        }
        session.endDialog();
    }
).triggerAction({
    matches: 'PaperLevel'
})

//Paper Major
bot.dialog('PaperMajorDialog',
    (session, args) => {
        var intent = args.intent;
		sqlEngine(detectEntities(intent.entities));
        var results = detectEntities(intent.entities);

        session.send('Heres the results: \'%s\'.', results);

        session.endDialog();
    }
).triggerAction({
    matches: 'PaperMajor'
})

//Paper Name
bot.dialog('PaperNameDialog',
    (session, args) => {
        var intent = args.intent;
		sqlEngine(detectEntities(intent.entities));
        var results = detectEntities(intent.entities);

        if (results[2] != '') {
            session.send('Detected intent as name, Detected Entity.  Name = \'%s\', Code = \'%s\', major = \'%s\',level = \'%s\'.', results[0], results[1], results[2], results[3]);
        } else {
            session.send('You reached the paper name intent with no major selected');
        }
        session.endDialog();
    }
).triggerAction({
    matches: 'PaperName'
})

//Paper Points
bot.dialog('PaperPointsDialog',
    (session, args) => {
        var intent = args.intent;
		sqlEngine(detectEntities(intent.entities));
        var results = detectEntities(intent.entities);

        if (results[2] != '') {
            session.send('Detected intent as points, Detected Entity.  Name = \'%s\', Code = \'%s\', major = \'%s\',level = \'%s\'.', results[0], results[1], results[2], results[3]);
        } else {
            session.send('You reached the paper points intent with no major selected');
        }
        session.endDialog();
    }
).triggerAction({
    matches: 'Points'
})

// ----------------------------------------------------------
// Bots SQL Service
// ----------------------------------------------------------

//Query Builder for creating the entity queries in order to locate an intent
//returns string
function whereQueryBuilder(results) {

    var entityString = " WHERE ";
    if (results[0] != "") {
        entityString = entityString + "papername LIKE '" + results[0] + "'";
        if (results[1] != "" || results[2] != "" || results[3] != "") {
            entityString = entityString + " AND ";
        }
    }
    if (results[1] != "") {
        entityString = entityString + "code LIKE '" + results[1] + "'";
        if (results[2] != "" || results[3] != "") {
            entityString = entityString + " AND ";
        }
    }
    if (results[2] != "") {
        entityString = entityString + "major LIKE '" + results[2] + "'";
        if (results[3] != "") {
            entityString = entityString + " AND ";
        }
    }
    if (results[3] != "") {
        entityString = entityString + "level LIKE '" + results[3] + "'";
    }

    return entityString;
}

//Detects entities in a user query and handles them to be passed on in the system		
function detectEntities(entityArray) {
    var locatedEntities = ['', '', '', '', ''];
    var resultArray = [];

    var paperNameEntity = builder.EntityRecognizer.findEntity(entityArray, 'PaperName');
    var paperCodeEntity = builder.EntityRecognizer.findEntity(entityArray, 'PaperCode');
    var paperMajorEntity = builder.EntityRecognizer.findEntity(entityArray, 'Major');
    var paperLevelEntity = builder.EntityRecognizer.findEntity(entityArray, 'Level/Year');

    locatedEntities = [paperNameEntity, paperCodeEntity, paperMajorEntity, paperLevelEntity];

    console.log(locatedEntities);

    for (var i = 0; i < locatedEntities.length; i++) {
        if (locatedEntities[i] != null) {
            resultArray[i] = locatedEntities[i].entity;
        } else {
            resultArray[i] = '';
        }
    }

    return resultArray;
}

//Query the database and return results in stringified rows
function database(query) {
    var result = "";
    const {
        Client
    } = require('pg');

    const client = new Client({
        connectionString: "postgres://xbmqawcfcgjhll:4296b0167991fbbcf2a98369e07b8f3db38bb0147ff6cf27143b39b2347a9c59@ec2-54-204-46-236.compute-1.amazonaws.com:5432/dd54f2u0f74q9c",
        ssl: true,
    });

    client.connect();

    console.log(query);

    client.query(query, (err, res) => {
        if (err) throw err;

        for (let row of res.rows) {
            result = JSON.stringify(row);
            console.log(JSON.stringify(row));
        }
        client.end();
    });

    return result;
}

//Engine that processes and builds the SQL queries as well as tracks results to allow for future implementation in the bot
function sqlEngine(results) {

    var foundResult = "";
    var entityString = whereQueryBuilder(results)

    if (results[2] == '') {
        var majors = ['analytics', 'computer_science', 'computer_intelligence', 'software_development', 'networks_and_security', 'it_service_science'];
        for (i = 0; i < majors.length; ++i) {
            foundResult = database("SELECT * FROM " + majors[i] + entityString);
            if (foundResult != "") {
                break;
            }
        }
    } else {
        foundResult = database("SELECT code FROM" + results[2].split(' ').join('_') + entityString);
    }

}