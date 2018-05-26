// Reference the packages we require so that we can use them in creating the bot
var restify = require('restify');
var builder = require('botbuilder');
// =========================================================
// Bot Setup
// =========================================================

// Setup Restify Server
// Listen for any activity on port 3978 of our local server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
 console.log('%s listening to %s', server.name, server.url);
});
// Create chat bot
var connector = new builder.ChatConnector({
 appId: process.env.MICROSOFT_APP_ID,
 appPassword: process.env.MICROSOFT_APP_PASSWORD
});
var bot = new builder.UniversalBot(connector);

// If a Post request is made to /api/messages on port 3978 of our local server, then we pass it to the bot connector to handle
server.post('/api/messages', connector.listen());
// =========================================================
// Bots Dialogs 
// =========================================================
// This is called the root dialog. It is the first point of entry for any message the bot receives
var bot = new builder.UniversalBot(connector, function (session, args) {
    session.send('You reached the default message handler. You said \'%s\'.', session.message.text);
});

// Make sure you add code to validate these fields
var luisAppId = '3aa645c1-9347-4a5a-a25f-022baf694b6f';
var luisAPIKey = '3470666eed1d471993bc88964aa0ea16';
var luisAPIHostName = 'westus.api.cognitive.microsoft.com';

const LuisModelUrl = 'https://' + luisAPIHostName + '/luis/v2.0/apps/' + luisAppId + '?subscription-key=' + luisAPIKey;

// Create a recognizer that gets intents from LUIS, and add it to the bot
var recognizer = new builder.LuisRecognizer(LuisModelUrl);
bot.recognizer(recognizer);

// Add a dialog for each intent that the LUIS app recognizes.
// See https://docs.microsoft.com/bot-framework/nodejs/bot-builder-nodejs-recognize-intent-luis 

//Paper Code
bot.dialog('PaperCodeDialog',
    (session, args) => {
		var intent = args.intent;
		var results = detectEntities(intent.entities);
		
		if(results[2] != ''){
			session.send('Detected intent as Code, Detected Entity.  Name = \'%s\'', results[0].entity);
		}
		else{
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
		var results = detectEntities(intent.entities);
		
		if(results[2] != ''){
			session.send('Detected intent as Core, Detected Entity.  Name = \'%s\', Code = \'%s\', major = \'%s\',level = \'%s\'.', results[0], results[1], results[2], results[3]);
		}
		else{
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
		var results = detectEntities(intent.entities);
		
		if(results[2] != ''){
			session.send('Detected intent as Level, Detected Entity.  Name = \'%s\', Code = \'%s\', major = \'%s\',level = \'%s\'.', results[0], results[1], results[2], results[3]);
		}
		else{
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
		var results = detectEntities(intent.entities);
		
		if(results[2] != ''){
			session.send('Detected intent as major, Detected Entity.  Name = \'%s\', Code = \'%s\', major = \'%s\',level = \'%s\'.', results[0], results[1], results[2], results[3]);
		}
		else{
			session.send('You reached the paper major intent with no major selected');
		}
        session.endDialog();
    }
).triggerAction({
    matches: 'PaperMajor'
})

//Paper Name
bot.dialog('PaperNameDialog',
    (session, args) => {
		var intent = args.intent;
		var results = detectEntities(intent.entities);
		
		if(results[2] != ''){
			session.send('Detected intent as name, Detected Entity.  Name = \'%s\', Code = \'%s\', major = \'%s\',level = \'%s\'.', results[0], results[1], results[2], results[3]);
		}
		else{
			session.send('You reached the paper name intent with no major selected');
		}
        session.endDialog();
    }
).triggerAction({
    matches: 'PaperName'
})

//Points
bot.dialog('PaperPointsDialog',
    (session, args) => {
		var intent = args.intent;
		var results = detectEntities(intent.entities);
		
		if(results[2] != ''){
			session.send('Detected intent as points, Detected Entity.  Name = \'%s\', Code = \'%s\', major = \'%s\',level = \'%s\'.', results[0], results[1], results[2], results[3]);
		}
		else{
			session.send('You reached the paper points intent with no major selected');
		}
        session.endDialog();
    }
).triggerAction({
    matches: 'Points'
})

function detectEntities(entityArray){
	var locatedEntities = ['','','','',''];
	var resultArray = [];
	
	var paperNameEntity = builder.EntityRecognizer.findEntity(entityArray, 'PaperName');
	var paperCodeEntity = builder.EntityRecognizer.findEntity(entityArray, 'PaperCode');
	var paperMajorEntity = builder.EntityRecognizer.findEntity(entityArray, 'Major');
	var paperLevelEntity = builder.EntityRecognizer.findEntity(entityArray, 'Level/Year');
	
	locatedEntities = [paperNameEntity,paperCodeEntity,paperMajorEntity,paperLevelEntity];
	
	console.log(locatedEntities);
		
	for(var i=0;i<locatedEntities.length;i++){
		if(locatedEntities[i] != null){
			resultArray[i] = locatedEntities[i].entity;
		}
		else{
			resultArray[i] = '';
		}
	}
		
	return resultArray;
}

//WIP
function QueryBuilder(intent,paperNameEntity,paperCodeEntity,paperMajorEntity,paperLevelEntity){
	return "SELECT "+intent+" FROM "+paperMajorEntity;
}